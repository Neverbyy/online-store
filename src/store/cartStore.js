import axios from 'axios';

const CART_STORAGE_KEY = 'cart';

const parsePrice = (priceString) => parseFloat(String(priceString).replace(/\s/g, ''));
const calcTotal = (cart) => cart.reduce((acc, item) => acc + (parsePrice(item.price) * item.quantity), 0);

const state = () => ({
  cart: JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]'),
  totalPrice: 0
});

const mutations = {
  SET_CART(state, cart) {
    state.cart = [...cart]; // создаём новый массив для реактивности
    state.totalPrice = calcTotal(cart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  },
  ADD_TO_CART(state, item) {
    const existing = state.cart.find(i => i.id === item.id);
    if (existing) {
      if (existing.quantity < 20) existing.quantity += 1;
    } else {
      state.cart.push({ ...item, quantity: 1 });
    }
    state.totalPrice = calcTotal(state.cart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
  },
  REMOVE_FROM_CART(state, id) {
    state.cart = state.cart.filter(i => i.id !== id);
    state.totalPrice = calcTotal(state.cart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
  },
  INCREMENT(state, id) {
    const item = state.cart.find(i => i.id === id);
    if (item && item.quantity < 20) item.quantity += 1;
    state.totalPrice = calcTotal(state.cart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
  },
  DECREMENT(state, id) {
    const item = state.cart.find(i => i.id === id);
    if (item && item.quantity > 1) item.quantity -= 1;
    state.totalPrice = calcTotal(state.cart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
  },
  CLEAR_CART(state) {
    state.cart = [];
    state.totalPrice = 0;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
  }
};

const actions = {
  async fetchCart({ commit, rootGetters }) {
    const user = rootGetters['auth/getUser'];
    if (user && user.id) {
      // Серверная корзина
      try {
        const { data } = await axios.get('http://localhost:5000/api/cart', { params: { userId: user.id } });
        commit('SET_CART', data.cart);
      } catch {
        commit('SET_CART', []);
      }
    } else {
      // Локальная корзина
      const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
      commit('SET_CART', cart);
    }
  },
  async addToCart({ commit, rootGetters, state }, product) {
    const user = rootGetters['auth/getUser'];
    if (user && user.id) {
      // Сервер
      const existing = state.cart.find(i => i.id === product.id);
      const quantity = existing ? Math.min(existing.quantity + 1, 20) : 1;
      try {
        const { data } = await axios.post('http://localhost:5000/api/cart', { userId: user.id, product, quantity });
        commit('SET_CART', data.cart);
      } catch {}
    } else {
      // Локально
      commit('ADD_TO_CART', product);
    }
  },
  async removeFromCart({ commit, rootGetters }, id) {
    const user = rootGetters['auth/getUser'];
    if (user && user.id) {
      try {
        const { data } = await axios.delete('http://localhost:5000/api/cart', { data: { userId: user.id, productId: id } });
        commit('SET_CART', data.cart);
      } catch {}
    } else {
      commit('REMOVE_FROM_CART', id);
    }
  },
  async incrementQuantity({ commit, rootGetters, state }, id) {
    const user = rootGetters['auth/getUser'];
    if (user && user.id) {
      const item = state.cart.find(i => i.id === id);
      if (item && item.quantity < 20) {
        try {
          const { data } = await axios.post('http://localhost:5000/api/cart', { userId: user.id, product: item, quantity: item.quantity + 1 });
          commit('SET_CART', data.cart);
        } catch {}
      }
    } else {
      commit('INCREMENT', id);
    }
  },
  async decrementQuantity({ commit, rootGetters, state }, id) {
    const user = rootGetters['auth/getUser'];
    if (user && user.id) {
      const item = state.cart.find(i => i.id === id);
      if (item && item.quantity > 1) {
        try {
          const { data } = await axios.post('http://localhost:5000/api/cart', { userId: user.id, product: item, quantity: item.quantity - 1 });
          commit('SET_CART', data.cart);
        } catch {}
      }
    } else {
      commit('DECREMENT', id);
    }
  },
  async clearCart({ commit, rootGetters }) {
    const user = rootGetters['auth/getUser'];
    if (user && user.id) {
      try {
        const { data } = await axios.post('http://localhost:5000/api/cart/clear', { userId: user.id });
        commit('SET_CART', data.cart);
      } catch {
        commit('SET_CART', []);
      }
    } else {
      commit('CLEAR_CART');
    }
    // Всегда очищаем localStorage для предотвращения утечек между пользователями
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
  },
};

const getters = {
  getCart: state => state.cart,
  getTotalPrice: state => state.totalPrice,
  formattedTotalPrice: state => state.totalPrice.toLocaleString('ru-RU'),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

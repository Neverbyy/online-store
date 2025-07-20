// store/modules/cartStore.js
const CART_STORAGE_KEY = 'cart';

const recalculateTotalPrice = (state) => {
  const parsePrice = (priceString) => parseFloat(priceString.replace(/\s/g, ''));
  state.totalPrice = state.cart.reduce((acc, item) => acc + (parsePrice(item.price) * item.quantity), 0);
};

export default {
  namespaced: true,
  state: {
    cart: JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [],
    totalPrice: 0
  },
  getters: {
    getCart: (state) => state.cart,
    getTotalPrice: (state) => state.totalPrice,
    formattedTotalPrice: (state) => {
      return state.totalPrice.toLocaleString('ru-RU');
    }
  },
  mutations: {
    addToCart(state, item) {
        const existingItem = state.cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          if (existingItem.quantity < 20) {
            existingItem.quantity += 1;
          }
        } else {
          state.cart.push({ ...item, quantity: 1 });
        }
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
        recalculateTotalPrice(state);
      },
    removeFromCart(state, id) {
      const index = state.cart.findIndex(item => item.id === id);
      if (index !== -1) {
        state.cart.splice(index, 1);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
        recalculateTotalPrice(state);
      }
    },
    setCart(state, cart) {
      state.cart = cart;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
      recalculateTotalPrice(state);
    },
    incrementQuantity(state, id) {
      const item = state.cart.find(item => item.id === id);
      if (item && item.quantity < 20) {
        item.quantity += 1;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
        recalculateTotalPrice(state);
      }
    },
    decrementQuantity(state, id) {
      const item = state.cart.find(item => item.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
        recalculateTotalPrice(state);
      }
    },
    clearCart(state) {
      state.cart = [];
      state.totalPrice = 0;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
    }
  },
  actions: {
    addToCart({ commit }, item) {
      commit('addToCart', item);
    },
    removeFromCart({ commit }, id) {
      commit('removeFromCart', id);
    },
    incrementQuantity({ commit }, id) {
      commit('incrementQuantity', id);
    },
    decrementQuantity({ commit }, id) {
      commit('decrementQuantity', id);
    },
    loadCart({ commit }) {
      const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
      if (cart) {
        commit('setCart', cart);
      }
    },
    clearCart({ commit }) {
      commit('clearCart');
    }
  }
};

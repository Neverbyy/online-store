import axios from 'axios';

const FAVORITES_KEY = 'favorites';

const state = () => ({
  favorites: JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
});

const mutations = {
  SET_FAVORITES(state, favorites) {
    state.favorites = favorites;
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  },
  ADD_TO_FAVORITES(state, product) {
    if (!state.favorites.find(item => item.id === product.id)) {
      state.favorites.push(product);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
    }
  },
  REMOVE_FROM_FAVORITES(state, productId) {
    state.favorites = state.favorites.filter(item => item.id !== productId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
  }
};

const actions = {
  async fetchFavorites({ commit, rootGetters }) {
    const user = rootGetters['auth/getUser'];
    if (!user || !user.id) {
      // Неавторизованный — localStorage
      const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
      commit('SET_FAVORITES', favorites);
      return;
    }
    // Авторизованный — сервер
    try {
      const { data } = await axios.get('http://localhost:5000/api/favorites', { params: { userId: user.id } });
      commit('SET_FAVORITES', data.favorites);
    } catch (e) {
      commit('SET_FAVORITES', []);
    }
  },
  async addToFavorites({ commit, rootGetters }, product) {
    const user = rootGetters['auth/getUser'];
    if (!user || !user.id) {
      // Неавторизованный — localStorage
      commit('ADD_TO_FAVORITES', product);
      return;
    }
    // Авторизованный — сервер
    try {
      const { data } = await axios.post('http://localhost:5000/api/favorites', { userId: user.id, product });
      commit('SET_FAVORITES', data.favorites);
    } catch (e) {}
  },
  async removeFromFavorites({ commit, rootGetters }, productId) {
    const user = rootGetters['auth/getUser'];
    if (!user || !user.id) {
      // Неавторизованный — localStorage
      commit('REMOVE_FROM_FAVORITES', productId);
      return;
    }
    // Авторизованный — сервер
    try {
      const { data } = await axios.delete('http://localhost:5000/api/favorites', { data: { userId: user.id, productId } });
      commit('SET_FAVORITES', data.favorites);
    } catch (e) {}
  },
  clearFavorites({ commit, rootGetters }) {
    const user = rootGetters['auth/getUser'];
    if (!user || !user.id) {
      // Неавторизованный — localStorage
      commit('SET_FAVORITES', []);
      return;
    }
    // Авторизованный — сервер
    commit('SET_FAVORITES', []);
  }
};

const getters = {
  getFavorites: state => state.favorites,
  isFavorite: state => id => state.favorites.some(item => item.id === id)
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}; 
import axios from 'axios';
import router from '../router/router';
import { getApiUrl, API_CONFIG } from '../config/api';

export default {
  namespaced: true,
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null, // Восстанавливаем пользователя из localStorage
    isLoggedIn: (() => {
      const user = JSON.parse(localStorage.getItem('user'));
      return !!(user && user.id);
    })(), // Проверяем авторизован ли пользователь по наличию id
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    LOGIN(state) {
      state.isLoggedIn = true;
    },
    LOGOUT(state) {
      state.user = {};
      state.isLoggedIn = false;
      localStorage.setItem('user', JSON.stringify({}));
    },
  },
  actions: {
    async register({ commit, dispatch }, payload) {
      try {
        const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.REGISTER), payload);
        commit('SET_USER', response.data.user);
        await dispatch('favorite/fetchFavorites', null, { root: true });
        await dispatch('cart/fetchCart', null, { root: true });
        alert('Регистрация успешна!');
        return true;
      } catch (error) {
        console.error(error);
        alert(error.response.data.message);
        return false;
      }
    },
    async login({ commit, dispatch }, payload) {
      try {
        const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), payload);
        commit('SET_USER', response.data.user);
        commit('LOGIN');
        await dispatch('favorite/fetchFavorites', null, { root: true });
        await dispatch('cart/fetchCart', null, { root: true });
        alert('Вход выполнен успешно!');
        return true;
      } catch (error) {
        console.error(error);
        alert(error.response.data.message);
        return false;
      }
    },
    logout({ commit, dispatch }) {
      commit('LOGOUT');
      dispatch('favorite/clearFavorites', null, { root: true });
      dispatch('cart/clearCart', null, { root: true });
    },
    async checkUserExists({ commit, state }) {
      if (!state.user || !state.user.id) return;
      try {
        await axios.get(getApiUrl(`${API_CONFIG.ENDPOINTS.PROFILE}/${state.user.id}`));
      } catch (error) {
        if (error.response && error.response.status === 404) {
          commit('LOGOUT');
          router.push('/');
        }
      }
    },
  },
  getters: {
    isAuthenticated: state => state.isLoggedIn,
    getUser: state => state.user,
  },
};
import axios from 'axios';

export default {
  namespaced: true,
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null, // Восстанавливаем пользователя из localStorage
    isLoggedIn: !!localStorage.getItem('user'), // Проверяем авторизован ли пользователь на основе данных в localStorage
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
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('user'); // Удаляем пользователя из localStorage при выходе
    },
  },
  actions: {
    async register({ commit }, payload) {
      try {
        const response = await axios.post('http://localhost:5000/api/register', payload);
        alert('Регистрация успешна!');
        return true;
      } catch (error) {
        console.error(error);
        alert(error.response.data.message);
        return false;
      }
    },
    async login({ commit }, payload) {
      try {
        const response = await axios.post('http://localhost:5000/api/login', payload);
        commit('SET_USER', response.data.user);
        commit('LOGIN');
        alert('Вход выполнен успешно!');
        return true;
      } catch (error) {
        console.error(error);
        alert(error.response.data.message);
        return false;
      }
    },
    logout({ commit }) {
      commit('LOGOUT');
    },
  },
  getters: {
    isAuthenticated: state => state.isLoggedIn,
    getUser: state => state.user,
  },
};
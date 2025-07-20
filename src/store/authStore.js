import axios from 'axios';

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
      // Получаем текущего пользователя из localStorage
      let user = JSON.parse(localStorage.getItem('user')) || { name: '', email: '', phone: '' };
      // Удаляем id, если он есть (чтобы не было признака авторизации)
      if (user && user.id) {
        delete user.id;
      }
      state.user = user;
      state.isLoggedIn = false;
      localStorage.setItem('user', JSON.stringify(user));
    },
  },
  actions: {
    async register({ commit }, payload) {
      try {
        const response = await axios.post('http://localhost:5000/api/register', payload);
        // Сохраняем пользователя сразу после регистрации
        commit('SET_USER', response.data.user);
        commit('LOGIN');
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
        // Сохраняем пользователя, пришедшего с сервера
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
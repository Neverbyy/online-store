import axios from 'axios'

export default {
  namespaced: true,
  state: {
    user: JSON.parse(localStorage.getItem('user')) || { name: '', email: '', phone: '', addresses: [] },
    activeItem: 0
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    SET_ACTIVE_ITEM(state, index) {
      state.activeItem = index;
    },
    ADD_ADDRESS(state, address) {
      if (!state.user.addresses) state.user.addresses = [];
      if (!state.user.addresses.some(a => JSON.stringify(a) === JSON.stringify(address))) {
        state.user.addresses.push(address);
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
  actions: {
    setActiveItem({ commit }, index) {
      commit('SET_ACTIVE_ITEM', index);
    },
    async fetchContact({ commit }) {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || { name: '', email: '', phone: '', addresses: [] };
        if (user && user.id) {
          const response = await axios.get(`http://localhost:5000/api/profile/${user.id}`);
          commit('SET_USER', response.data.user);
        } else {
          commit('SET_USER', user);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async updateContact({ commit }, { phone, name, email, addresses }) {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || { name: '', email: '', phone: '', addresses: [] };
        if (user && user.id) {
          const response = await axios.put('http://localhost:5000/api/profile', { id: user.id, phone, name, email, addresses: addresses || user.addresses });
          commit('SET_USER', response.data.user);
        } else {
          // Если пользователь не авторизован, просто обновляем localStorage
          const updatedUser = { ...user, phone, name, email, addresses: addresses || user.addresses };
          commit('SET_USER', updatedUser);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
        throw error;
      }
    },
    async addAddress({ commit, state }, address) {
      if (state.user && state.user.id) {
        const addresses = [...(state.user.addresses || [])];
        if (!addresses.some(a => JSON.stringify(a) === JSON.stringify(address))) {
          addresses.push(address);
          await axios.put('http://localhost:5000/api/profile', { ...state.user, addresses });
          commit('ADD_ADDRESS', address);
        }
      }
    }
  },
  getters: {
    getContact: state => state.user.phone,
    getName: state => state.user.name,
    getEmail: state => state.user.email,
    getUser: state => state.user,
    getActiveItem: state => state.activeItem
  },
};

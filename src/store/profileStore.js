import axios from 'axios'

export default {
  namespaced: true,
  state: {
    contact: JSON.parse(localStorage.getItem('contact')) || '',
    activeItem: 0
  },
  mutations: {
    SET_CONTACT(state, contact) {
      state.contact = contact;
      localStorage.setItem('contact', JSON.stringify(contact));
    },
    SET_ACTIVE_ITEM(state, index) {
      state.activeItem = index;
    }
  },
  actions: {
    setActiveItem({ commit }, index) {
      commit('SET_ACTIVE_ITEM', index);
    },
    async fetchContact({ commit }) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        commit('SET_CONTACT', user ? user.phone : '');
      } catch (error) {
        console.error(error);
      }
    },
    async updateContact({ commit }, contact) {
      commit('SET_CONTACT', contact);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
          await axios.put('http://localhost:5000/api/profile', { id: user.id, phone: contact });
    
          // Обновление локального хранилища пользователя
          user.phone = contact;
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (error) {
        console.error('Ошибка при обновлении номера телефона:', error);
      }
    }
  },
  getters: {
    getContact: state => state.contact,
    getActiveItem: state => state.activeItem
  },
};

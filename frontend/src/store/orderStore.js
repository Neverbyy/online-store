export default ({
  state: {
    deliveryMethod: 'pickup',
    contact: {
      name: '',
      phone: '',
      email: '',
      female: ''
    },
    address: {
      city: '',
      street: '',
      home: '',
      flat: '',
    },
    orderSuccess: false  // Флаг успешного заказа
  },
  mutations: {
    updateDeliveryMethod(state, payload) {
      state.deliveryMethod = payload;
    },
    updateContact(state, payload) {
      state.contact = { ...state.contact, ...payload };
    },
    updateAddress(state, payload) {
      state.address = { ...state.address, ...payload };
    },
    setOrderSuccess(state, success) {  // Мутация для установки флага
      state.orderSuccess = success;
    }
  },
  actions: {
    setDeliveryMethod({ commit }, method) {
      commit('updateDeliveryMethod', method);
    },
    setContact({ commit }, contactData) {
      commit('updateContact', contactData);
    },
    setAddress({ commit }, addressData) {
      commit('updateAddress', addressData);
    },
    markOrderAsSuccess({ commit }) {  // Действие для успешного заказа
      commit('setOrderSuccess', true);
    },
    resetOrderSuccess({ commit }) {  // Действие для сброса флага
      commit('setOrderSuccess', false);
    }
  },
  getters: {
    getDeliveryMethod: state => state.deliveryMethod,
    getContact: state => state.contact,
    getAddress: state => state.address,
    isOrderSuccess: state => state.orderSuccess  // Геттер для проверки флага
  }
});
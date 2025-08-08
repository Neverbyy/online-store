import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
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
      flat: ''
    },
    orderSuccess: false
  }),

  getters: {
    getDeliveryMethod: (state) => state.deliveryMethod,
    getContact: (state) => state.contact,
    getAddress: (state) => state.address,
    isOrderSuccess: (state) => state.orderSuccess
  },

  actions: {
    setDeliveryMethod(method) {
      this.deliveryMethod = method
    },

    setContact(contactData) {
      this.contact = { ...this.contact, ...contactData }
    },

    setAddress(addressData) {
      this.address = { ...this.address, ...addressData }
    },

    markOrderAsSuccess() {
      this.orderSuccess = true
    },

    resetOrderSuccess() {
      this.orderSuccess = false
    }
  }
})
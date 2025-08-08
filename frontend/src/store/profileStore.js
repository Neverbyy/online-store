import { defineStore } from 'pinia'
import axios from 'axios'
import { getApiUrl, API_CONFIG } from '../config/api'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || { name: '', email: '', phone: '', addresses: [] },
    activeItem: 0
  }),

  getters: {
    getContact: (state) => state.user.phone,
    getName: (state) => state.user.name,
    getEmail: (state) => state.user.email,
    getUser: (state) => state.user,
    getActiveItem: (state) => state.activeItem
  },

  actions: {
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    setActiveItem(index) {
      this.activeItem = index
    },

    addAddress(address) {
      if (!this.user.addresses) this.user.addresses = []
      if (!this.user.addresses.some(a => JSON.stringify(a) === JSON.stringify(address))) {
        this.user.addresses.push(address)
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },

    async fetchContact() {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || { name: '', email: '', phone: '', addresses: [] }
        if (user && user.id) {
          const response = await axios.get(getApiUrl(`${API_CONFIG.ENDPOINTS.PROFILE}/${user.id}`))
          this.setUser(response.data.user)
        } else {
          this.setUser(user)
        }
      } catch (error) {
        console.error(error)
      }
    },

    async updateContact({ phone, name, email, addresses }) {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || { name: '', email: '', phone: '', addresses: [] }
        if (user && user.id) {
          const response = await axios.put(getApiUrl(API_CONFIG.ENDPOINTS.PROFILE), { id: user.id, phone, name, email, addresses: addresses || user.addresses })
          this.setUser(response.data.user)
        } else {
          // Если пользователь не авторизован, просто обновляем localStorage
          const updatedUser = { ...user, phone, name, email, addresses: addresses || user.addresses }
          this.setUser(updatedUser)
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message)
        }
        throw error
      }
    },

    async addAddressAsync(address) {
      if (this.user && this.user.id) {
        const addresses = [...(this.user.addresses || [])]
        if (!addresses.some(a => JSON.stringify(a) === JSON.stringify(address))) {
          addresses.push(address)
          await axios.put(getApiUrl(API_CONFIG.ENDPOINTS.PROFILE), { ...this.user, addresses })
          this.addAddress(address)
        }
      }
    }
  }
})

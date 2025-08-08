import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router/router'
import { getApiUrl, API_CONFIG } from '../config/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoggedIn: (() => {
      const user = JSON.parse(localStorage.getItem('user'))
      return !!(user && user.id)
    })()
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
    getUser: (state) => state.user
  },

  actions: {
    setUser(user) {
      this.user = user
      this.isLoggedIn = !!(user && user.id)
      localStorage.setItem('user', JSON.stringify(user))
    },

    login() {
      this.isLoggedIn = true
    },

    logout() {
      this.user = {}
      this.isLoggedIn = false
      localStorage.setItem('user', JSON.stringify({}))
    },

    async register(payload) {
      try {
        const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.REGISTER), payload)
        this.setUser(response.data.user)
        
        // Импортируем stores для обновления данных
        const { useFavoriteStore } = await import('./favoriteStore')
        const { useCartStore } = await import('./cartStore')
        
        const favoriteStore = useFavoriteStore()
        const cartStore = useCartStore()
        
        await favoriteStore.fetchFavorites()
        await cartStore.fetchCart()
        
        alert('Регистрация успешна!')
        return true
      } catch (error) {
        console.error(error)
        alert(error.response?.data?.message || 'Ошибка регистрации')
        return false
      }
    },

    async loginUser(payload) {
      try {
        const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), payload)
        this.setUser(response.data.user)
        this.login()
        
        // Импортируем stores для обновления данных
        const { useFavoriteStore } = await import('./favoriteStore')
        const { useCartStore } = await import('./cartStore')
        
        const favoriteStore = useFavoriteStore()
        const cartStore = useCartStore()
        
        await favoriteStore.fetchFavorites()
        await cartStore.fetchCart()
        
        alert('Вход выполнен успешно!')
        return true
      } catch (error) {
        console.error(error)
        alert(error.response?.data?.message || 'Ошибка входа')
        return false
      }
    },

    async logoutUser() {
      this.logout()
      
      // Импортируем stores для очистки данных
      const { useFavoriteStore } = await import('./favoriteStore')
      const { useCartStore } = await import('./cartStore')
      
      const favoriteStore = useFavoriteStore()
      const cartStore = useCartStore()
      
      favoriteStore.clearFavorites()
      cartStore.clearCart()
    },

    async checkUserExists() {
      if (!this.user || !this.user.id) return
      try {
        await axios.get(getApiUrl(`${API_CONFIG.ENDPOINTS.PROFILE}/${this.user.id}`))
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.logout()
          router.push('/')
        }
      }
    }
  }
})
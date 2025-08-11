import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router/router'
import { getApiUrl, API_CONFIG } from '../config/api'
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoggedIn: (() => {
      const user = JSON.parse(localStorage.getItem('user'))
      return !!(user && user.id)
    })(),
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null
  }),

  getters: {
    isTokenValid: (state) => {
      if (!state.token) return false;
      try {
        const decoded = jwtDecode(state.token);
        if (!decoded.exp) return false;
        return Date.now() < decoded.exp * 1000;
      } catch {
        return false;
      }
    },
    isAuthenticated: (state) => {
      if (state.isLoggedIn && !!state.token && useAuthStore().isTokenValid) return true;
      // Если access token истёк, но есть refresh — пробуем обновить
      if (state.refreshToken) {
        useAuthStore().refreshAccessToken();
        return false;
      }
      return false;
    },
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getRefreshToken: (state) => state.refreshToken
  },

  actions: {
    setUser(user) {
      this.user = user
      this.isLoggedIn = !!(user && user.id)
      localStorage.setItem('user', JSON.stringify(user))
    },
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    setRefreshToken(refreshToken) {
      this.refreshToken = refreshToken
      localStorage.setItem('refreshToken', refreshToken)
    },
    logoutToken() {
      this.token = null
      localStorage.removeItem('token')
    },
    logoutRefreshToken() {
      this.refreshToken = null
      localStorage.removeItem('refreshToken')
    },
    login() {
      this.isLoggedIn = true
    },
    logout() {
      this.user = {}
      this.isLoggedIn = false
      localStorage.setItem('user', JSON.stringify({}))
      this.logoutToken()
      this.logoutRefreshToken()
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
        this.setToken(response.data.token)
        this.setRefreshToken(response.data.refreshToken)
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
    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.logout()
        return false
      }
      try {
        const response = await axios.post(getApiUrl('/api/refresh'), { refreshToken: this.refreshToken })
        this.setToken(response.data.token)
        return true
      } catch (error) {
        this.logout()
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
      if (!this.user || !this.user.id || !this.token || !useAuthStore().isTokenValid) {
        // Пробуем обновить access token через refresh
        const refreshed = await this.refreshAccessToken()
        if (!refreshed) {
          this.logout()
          return
        }
      }
      try {
        await axios.get(getApiUrl(`${API_CONFIG.ENDPOINTS.PROFILE}/${this.user.id}`), {
          headers: { Authorization: `Bearer ${this.token}` }
        })
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.logout()
          router.push('/')
        }
      }
    }
  }
})
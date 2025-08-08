import { defineStore } from 'pinia'
import axios from 'axios'
import { getApiUrl, API_CONFIG } from '../config/api'

const FAVORITES_KEY = 'favorites'

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favorites: JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
  }),

  getters: {
    getFavorites: (state) => state.favorites,
    isFavorite: (state) => (id) => state.favorites.some(item => item.id === id)
  },

  actions: {
    setFavorites(favorites) {
      this.favorites = favorites
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    },

    addToFavorites(product) {
      if (!this.favorites.find(item => item.id === product.id)) {
        this.favorites.push(product)
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites))
      }
    },

    removeFromFavorites(productId) {
      this.favorites = this.favorites.filter(item => item.id !== productId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites))
    },

    clearFavorites() {
      this.favorites = []
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([]))
    },

    async fetchFavorites() {
      const { useAuthStore } = await import('./authStore')
      const authStore = useAuthStore()
      const user = authStore.getUser

      if (!user || !user.id) {
        // Неавторизованный — localStorage
        const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
        this.setFavorites(favorites)
        return
      }
      // Авторизованный — сервер
      try {
        const { data } = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.FAVORITES), { params: { userId: user.id } })
        this.setFavorites(data.favorites)
      } catch (e) {
        this.setFavorites([])
      }
    },

    async addToFavoritesAsync(product) {
      const { useAuthStore } = await import('./authStore')
      const authStore = useAuthStore()
      const user = authStore.getUser

      if (!user || !user.id) {
        // Неавторизованный — localStorage
        this.addToFavorites(product)
        return
      }
      // Авторизованный — сервер
      try {
        const { data } = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.FAVORITES), { userId: user.id, product })
        this.setFavorites(data.favorites)
      } catch (e) {}
    },

    async removeFromFavoritesAsync(productId) {
      const { useAuthStore } = await import('./authStore')
      const authStore = useAuthStore()
      const user = authStore.getUser

      if (!user || !user.id) {
        // Неавторизованный — localStorage
        this.removeFromFavorites(productId)
        return
      }
      // Авторизованный — сервер
      try {
        const { data } = await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.FAVORITES), { data: { userId: user.id, productId } })
        this.setFavorites(data.favorites)
      } catch (e) {}
    }
  }
}) 
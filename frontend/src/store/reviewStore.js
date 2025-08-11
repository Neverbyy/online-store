import { defineStore } from 'pinia'
import axios from 'axios'
import { getApiUrl, API_CONFIG } from '../config/api'

export const useReviewStore = defineStore('review', {
  state: () => ({
    reviews: []
  }),

  getters: {
    getReviewsByProductId: (state) => (productId) => {
      return state.reviews.filter(review => review.productId === productId)
    }
  },

  actions: {
    setReviews(reviews) {
      this.reviews = reviews
    },

    addReview(review) {
      this.reviews.push(review)
    },

    async fetchReviews() {
      try {
        const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.REVIEWS))
        this.setReviews(response.data)
      } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error)
      }
    },

    async addReviewAsync(newReview) {
      try {
        const { useAuthStore } = await import('./authStore')
        const authStore = useAuthStore()
        const token = authStore.getToken
        let config = {}
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` }
        }
        const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.REVIEWS), newReview, config)
        this.addReview(response.data)
      } catch (error) {
        console.error('Ошибка при добавлении отзыва:', error)
        throw error
      }
    }
  }
})

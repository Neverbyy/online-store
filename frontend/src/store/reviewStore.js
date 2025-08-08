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
        const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.REVIEWS), newReview)
        this.addReview(response.data)
      } catch (error) {
        console.error('Ошибка при добавлении отзыва:', error)
        throw error
      }
    }
  }
})

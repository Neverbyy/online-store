// reviewStore.js
import axios from 'axios';
import { getApiUrl, API_CONFIG } from '../config/api';

export default {
  state: {
    reviews: []
  },
  getters: {
    getReviewsByProductId: (state) => (productId) => {
      return state.reviews.filter(review => review.productId === productId);
    }
  },
  mutations: {
    setReviews(state, reviews) {
      state.reviews = reviews;
    },
    addReview(state, review) {
      state.reviews.push(review);
    }
  },
  actions: {
    async fetchReviews({ commit }) {
      try {
        const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.REVIEWS));
        commit('setReviews', response.data);
      } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
      }
    },
    async addReview({ commit }, newReview) {
      try {
        const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.REVIEWS), newReview);
        commit('addReview', response.data); // Добавляем новый отзыв в хранилище
      } catch (error) {
        console.error('Ошибка при добавлении отзыва:', error);
        throw error; // Передача ошибки выше для обработки в компонентах или в другом месте
      }
    }
  }
};

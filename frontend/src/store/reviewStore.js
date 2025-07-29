// reviewStore.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reviews';

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
        const response = await axios.get(API_URL);
        commit('setReviews', response.data);
      } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
      }
    },
    async addReview({ commit }, newReview) {
      try {
        const response = await axios.post(API_URL, newReview);
        commit('addReview', response.data); // Добавляем новый отзыв в хранилище
      } catch (error) {
        console.error('Ошибка при добавлении отзыва:', error);
        throw error; // Передача ошибки выше для обработки в компонентах или в другом месте
      }
    }
  }
};

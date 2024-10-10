// reviewStore.js
import axios from 'axios';

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
        const response = await axios.get('https://48e8b1c201ae4e29.mokky.dev/reviews');
        commit('setReviews', response.data);
      } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
      }
    },
    async addReview({ commit }, newReview) {
      try {
        const response = await axios.post('https://48e8b1c201ae4e29.mokky.dev/reviews', newReview);
        commit('addReview', response.data); // Добавляем новый отзыв в хранилище
      } catch (error) {
        console.error('Ошибка при добавлении отзыва:', error);
        throw error; // Передача ошибки выше для обработки в компонентах или в другом месте
      }
    }
  }
};

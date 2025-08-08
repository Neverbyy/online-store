import { createPinia } from 'pinia'

// Создаем экземпляр Pinia
const pinia = createPinia()

export default pinia

// Экспортируем все stores для удобства импорта
export { useMainStore } from './mainStore'
export { useAuthStore } from './authStore'
export { useCartStore } from './cartStore'
export { useFavoriteStore } from './favoriteStore'
export { useProfileStore } from './profileStore'
export { useOrderStore } from './orderStore'
export { useReviewStore } from './reviewStore'

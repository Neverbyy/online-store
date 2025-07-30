// Конфигурация API
const isProduction = import.meta.env.PROD;
const API_URL = isProduction 
  ? (import.meta.env.VITE_API_URL_PROD || 'https://online-store-ofdm.onrender.com')
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

export const API_CONFIG = {
  BASE_URL: API_URL,
  ENDPOINTS: {
    // Auth
    REGISTER: '/api/register',
    LOGIN: '/api/login',
    
    // Profile
    PROFILE: '/api/profile',
    
    // Cart
    CART: '/api/cart',
    CART_CLEAR: '/api/cart/clear',
    
    // Favorites
    FAVORITES: '/api/favorites',
    
    // Orders
    ORDERS: '/api/orders',
    ORDERS_CHECK_STATUS: '/api/orders/check-status',
    
    // Payment
    PAYMENT: '/api/payment',
    
    // Reviews
    REVIEWS: '/api/reviews',
  }
};

// Функция для получения полного URL эндпоинта
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export default API_CONFIG; 
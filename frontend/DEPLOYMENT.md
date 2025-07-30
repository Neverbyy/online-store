# Инструкция по деплою

## Настройка API URL

Проект настроен для автоматического переключения между локальным и продакшн API в зависимости от режима сборки.

### Файлы конфигурации

- `.env` - для разработки (локальный API: http://localhost:5000)
- `.env.production` - для продакшена (деплой API: https://glancestore.onrender.com)

### Конфигурация API

Все API запросы теперь используют централизованную конфигурацию из `src/config/api.js`:

```javascript
// Автоматически выбирает правильный URL в зависимости от режима
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### Обновленные файлы

Следующие файлы были обновлены для использования новой конфигурации API:

**Store файлы:**
- `src/store/authStore.js`
- `src/store/cartStore.js`
- `src/store/favoriteStore.js`
- `src/store/profileStore.js`
- `src/store/reviewStore.js`

**Компоненты:**
- `src/pages/OrderPage.vue`
- `src/components/Orders.vue`

**Конфигурация:**
- `vite.config.js` - обновлен для поддержки переменных окружения

## Команды для деплоя

### Разработка (локальный API)
```bash
npm run dev
```

### Продакшен (деплой API)
```bash
npm run build
```

При выполнении `npm run build` Vite автоматически использует `.env.production` файл, который содержит URL вашего деплой API.

## Проверка работы

1. **Локальная разработка:**
   - Запустите `npm run dev`
   - API запросы будут идти на `http://localhost:5000`

2. **Продакшен сборка:**
   - Выполните `npm run build`
   - API запросы будут идти на `https://glancestore.onrender.com`

## Важные моменты

- Все API URL теперь централизованы в `src/config/api.js`
- Переменные окружения автоматически подставляются при сборке
- Для изменения API URL достаточно отредактировать соответствующий .env файл
- При деплое на хостинг убедитесь, что `.env.production` содержит правильный URL вашего API

## Структура API конфигурации

```javascript
export const API_CONFIG = {
  BASE_URL: API_URL,
  ENDPOINTS: {
    REGISTER: '/api/register',
    LOGIN: '/api/login',
    PROFILE: '/api/profile',
    CART: '/api/cart',
    FAVORITES: '/api/favorites',
    ORDERS: '/api/orders',
    PAYMENT: '/api/payment',
    REVIEWS: '/api/reviews',
    // ... и другие эндпоинты
  }
};
```

Используйте `getApiUrl(API_CONFIG.ENDPOINTS.ENDPOINT_NAME)` для получения полного URL. 
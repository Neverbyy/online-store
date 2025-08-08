# Online Store

Полнофункциональный интернет-магазин с разделением на фронтенд и бэкенд.

## Быстрый старт

### 1. Настройка бэкенда

```bash
cd backend
npm install
cp env.example .env

npm run dev
```

### 2. Настройка фронтенда

```bash
cd frontend
npm install
npm run dev
```

## Технологии

### Frontend
- Vue 3 (Composition API)
- Vue Router
- Vuex
- Vite
- SCSS
- Axios

### Backend
- Express.js
- bcryptjs (хеширование паролей)
- CORS
- YooKassa (платежи)
- UUID

## API

Бэкенд предоставляет REST API для:
- Аутентификации пользователей
- Управления заказами
- Корзины покупок
- Избранных товаров
- Отзывов
- Платежей через YooKassa

Подробная документация API находится в `backend/README.md`

## Разработка

Для разработки запустить оба сервера:

1. Бэкенд: `cd backend && npm run dev`
2. Фронтенд: `cd frontend && npm run dev`

## Продакшен

1. Собрать фронтенд: `cd frontend && npm run build`
2. Запустить бэкенд: `cd backend && npm start` 

# Online Store Backend

Express.js API сервер для интернет-магазина.

## Установка

```bash
npm install
```

## Настройка окружения

Скопируйте файл `env.example` в `.env` и заполните необходимые переменные:

```bash
cp env.example .env
```

## Запуск сервера

### Продакшен режим
```bash
npm start
```

### Режим разработки (с автоперезагрузкой)
```bash
npm run dev
```

Сервер будет доступен по адресу http://localhost:5000

## API Endpoints

### Аутентификация
- `POST /api/register` - Регистрация пользователя
- `POST /api/login` - Вход в систему
- `GET /api/profile/:id` - Получение профиля пользователя
- `PUT /api/profile` - Обновление профиля

### Заказы
- `POST /api/orders` - Создание заказа
- `GET /api/orders` - Получение заказов пользователя
- `PUT /api/orders/:id` - Обновление заказа
- `POST /api/orders/check-status` - Проверка статуса заказа

### Корзина
- `GET /api/cart` - Получение корзины
- `POST /api/cart` - Добавление товара в корзину
- `DELETE /api/cart` - Удаление товара из корзины
- `POST /api/cart/clear` - Очистка корзины

### Избранное
- `GET /api/favorites` - Получение избранных товаров
- `POST /api/favorites` - Добавление в избранное
- `DELETE /api/favorites` - Удаление из избранного

### Отзывы
- `GET /api/reviews` - Получение отзывов
- `POST /api/reviews` - Добавление отзыва

### Платежи
- `POST /api/payment` - Создание платежа
- `GET /api/payment/:paymentId` - Проверка статуса платежа
- `POST /api/payment/webhook` - Webhook для уведомлений 
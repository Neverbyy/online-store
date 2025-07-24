import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 5000;

// Массив пользователей (вместо базы данных)
const users = [];
// Массив заказов (вместо базы данных)
const orders = [];
// Массив отзывов (вместо базы данных)
const reviews = [];

// Настройка middlewares
app.use(bodyParser.json());
app.use(cors());

// Главная страница
app.get('/', (req, res) => {
  res.send('<h1>Добро пожаловать на наш сервер!</h1><p>Используйте API для регистрации и входа в систему.</p>');
});

// Возвращает список зарегистрированных пользователей
app.get('/api/register', (req, res) => {
  res.json(users);
});

// Регистрация пользователя
app.post('/api/register', async (req, res) => {
  const { phone, password, name = '', email = '' } = req.body;

  // Проверка, существует ли пользователь с таким же номером
  const userExists = users.some(user => user.phone === phone);
  if (userExists) {
    return res.status(400).json({ message: 'Пользователь с таким номером уже существует' });
  }

  // Хеширование пароля перед сохранением
  const hashedPassword = await bcrypt.hash(password, 10);

  // Создание нового пользователя с уникальным ID
  const newUser = {
    id: users.length + 1, // Уникальный ID (можно заменить на UUID, если нужно)
    phone,
    password: hashedPassword,
    name,
    email,
    favorites: [], // Добавляем поле избранного
    addresses: [] // Добавляем поле адресов
  };
  users.push(newUser);

  res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user: newUser });
});

// Логин пользователя
app.post('/api/login', async (req, res) => {
  const { phone, password } = req.body;

  // Поиск пользователя по номеру телефона
  const user = users.find(user => user.phone === phone);
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  // Проверка пароля
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Неверный пароль' });
  }

  res.status(200).json({ message: 'Вход выполнен успешно', user });
});

// Получение профиля пользователя по id
app.get('/api/profile/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(user => user.id === id);
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }
  // Не возвращаем пароль
  const { password, ...userData } = user;
  res.status(200).json({ user: userData });
});

// Обновление профиля пользователя
app.put('/api/profile', async (req, res) => {
  const { id, phone, name = '', email = '', addresses } = req.body;

  // Проверка наличия пользователя с таким ID
  const user = users.find(user => user.id === id);
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  // Проверка, используется ли новый номер телефона другим пользователем
  const phoneExists = users.some(user => user.phone === phone && user.id !== id);
  if (phoneExists) {
    return res.status(400).json({ message: 'Этот номер телефона уже используется' });
  }

  // Обновляем данные
  user.phone = phone;
  user.name = name;
  user.email = email;
  if (addresses) user.addresses = addresses;
  res.status(200).json({ message: 'Профиль успешно обновлен', user });
});

// ===================== ЗАКАЗЫ =====================
// Создать заказ
app.post('/api/orders', (req, res) => {
  const order = req.body;
  if (!order.userId && !order.userPhone) {
    return res.status(400).json({ message: 'userId или userPhone обязателен' });
  }
  order.id = orders.length + 1;
  order.createdAt = new Date().toISOString();
  orders.push(order);
  res.status(201).json({ message: 'Заказ успешно создан', order });
});

// Получить заказы пользователя
app.get('/api/orders', (req, res) => {
  const { userId, userPhone } = req.query;
  let userOrders = [];
  if (userId) {
    userOrders = orders.filter(order => String(order.userId) === String(userId));
  } else if (userPhone) {
    userOrders = orders.filter(order => order.userPhone === userPhone);
  }
  res.status(200).json({ orders: userOrders });
});
// ==================================================

// Получение избранных товаров пользователя
app.get('/api/favorites', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: 'userId обязателен' });
  }
  const user = users.find(u => String(u.id) === String(userId));
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }
  res.status(200).json({ favorites: user.favorites || [] });
});

// Добавление товара в избранное
app.post('/api/favorites', (req, res) => {
  const { userId, product } = req.body;
  if (!userId || !product || !product.id) {
    return res.status(400).json({ message: 'userId и product.id обязательны' });
  }
  const user = users.find(u => String(u.id) === String(userId));
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }
  if (!user.favorites) user.favorites = [];
  if (!user.favorites.find(item => item.id === product.id)) {
    user.favorites.push(product);
  }
  res.status(200).json({ favorites: user.favorites });
});

// Удаление товара из избранного
app.delete('/api/favorites', (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ message: 'userId и productId обязательны' });
  }
  const user = users.find(u => String(u.id) === String(userId));
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }
  user.favorites = (user.favorites || []).filter(item => item.id !== productId);
  res.status(200).json({ favorites: user.favorites });
});

// ===================== КОРЗИНА =====================
// Получить корзину пользователя
app.get('/api/cart', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: 'userId обязателен' });
  }
  const user = users.find(u => String(u.id) === String(userId));
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }
  res.status(200).json({ cart: user.cart || [] });
});

// Добавить/обновить товар в корзине
app.post('/api/cart', (req, res) => {
  const { userId, product, quantity = 1 } = req.body;
  if (!userId || !product || !product.id) {
    return res.status(400).json({ message: 'userId и product.id обязательны' });
  }
  const user = users.find(u => String(u.id) === String(userId));
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }
  if (!user.cart) user.cart = [];
  const existing = user.cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity = Math.min(quantity, 20);
  } else {
    user.cart.push({ ...product, quantity: Math.min(quantity, 20) });
  }
  res.status(200).json({ cart: user.cart });
});

// Удалить товар из корзины
app.delete('/api/cart', (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ message: 'userId и productId обязательны' });
  }
  const user = users.find(u => String(u.id) === String(userId));
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }
  user.cart = (user.cart || []).filter(item => item.id !== productId);
  res.status(200).json({ cart: user.cart });
});

// Очистить корзину
app.post('/api/cart/clear', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'userId обязателен' });
  }
  const user = users.find(u => String(u.id) === String(userId));
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }
  user.cart = [];
  res.status(200).json({ cart: user.cart });
});
// ===================================================

// ===================== ОТЗЫВЫ =====================
// Получить отзывы (все, по productId или userId)
app.get('/api/reviews', (req, res) => {
  const { productId, userId } = req.query;
  let filtered = reviews;
  if (productId) {
    filtered = filtered.filter(r => String(r.productId) === String(productId));
  }
  if (userId) {
    filtered = filtered.filter(r => String(r.userId) === String(userId));
  }
  res.status(200).json(filtered);
});

// Добавить отзыв
app.post('/api/reviews', (req, res) => {
  const review = req.body;
  if (!review.productId || !review.userId || !review.userName || !review.rating) {
    return res.status(400).json({ message: 'productId, userId, userName, rating обязательны' });
  }
  review.id = reviews.length + 1;
  reviews.push(review);
  res.status(201).json(review);
});
// ==================================================

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

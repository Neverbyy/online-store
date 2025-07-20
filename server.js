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
    email
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
  const { id, phone, name = '', email = '' } = req.body;

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

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

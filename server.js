import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 5000;

// Массив пользователей (вместо базы данных)
const users = [];

// Настройка middlewares
app.use(bodyParser.json());
app.use(cors());

// Главная страница
app.get('/', (req, res) => {
  res.send('<h1>Добро пожаловать на наш сервер!</h1><p>Используйте API для регистрации и входа в систему.</p>');
});

// Регистрация пользователя
app.get('/api/register', (req, res) => {
  res.send('<h1>Регистер</h1>');
});

app.post('/api/register', async (req, res) => {
  const { phone, password } = req.body;

  // Проверка, существует ли пользователь с таким же номером
  const userExists = users.some(user => user.phone === phone);
  if (userExists) {
    return res.status(400).json({ message: 'Пользователь с таким номером уже существует' });
  }

  // Хеширование пароля перед сохранением
  const hashedPassword = await bcrypt.hash(password, 10);

  // Создание нового пользователя
  const newUser = { phone, password: hashedPassword };
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

app.put('/api/profile', async (req, res) => {
  const { phone } = req.body;

  // Здесь вам нужно будет определить, как вы идентифицируете текущего пользователя
  // Например, через токен или сессию
  const user = users.find(user => user.phone === phone);
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  user.phone = phone; // Обновляем номер телефона
  res.status(200).json({ message: 'Номер телефона обновлен', user });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
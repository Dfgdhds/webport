const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');  // Подключаем cookie-parser
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const path = require('path');

// Загрузка переменных окружения из .env файла
dotenv.config();

const app = express();

// Устанавливаем cookie-parser для работы с cookies
app.use(cookieParser());

// Настройка EJS как движка шаблонов
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Главная страница (обработчик маршрута для "/")
app.get('/', (req, res) => {
  res.render('index');  // Рендерим представление "index.ejs"
});

// Роуты для аутентификации и портфолио
app.use('/auth', authRoutes);  // Роуты для аутентификации
app.use('/portfolio', portfolioRoutes);  // Роуты для портфолио

// Запуск сервера
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

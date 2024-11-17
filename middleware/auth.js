const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Путь к модели пользователя

// Проверка аутентификации с помощью токена
module.exports.isAuthenticated = (req, res, next) => {
  const token = req.cookies.auth_token; // Извлекаем токен из cookies

  if (!token) {
    return res.redirect('/auth/login');  // Если токена нет, перенаправляем на страницу входа
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log("JWT verification error:", err); // Логирование ошибок
      return res.status(403).json({ message: 'Token is not valid' }); // Токен недействителен
    }

    const user = await User.findById(decoded.id); // Находим пользователя по ID из токена
    if (!user) {
      console.log("User not found:", decoded.id); // Логирование ошибки
      return res.status(403).json({ message: 'User not found' }); // Если пользователя нет в базе
    }

    req.user = user; // Сохраняем данные пользователя в запросе
    next(); // Переходим к следующему middleware
  });
};

// Роль админа
module.exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next(); // Если пользователь - администратор, пропускаем дальше
  }
  return res.status(403).json({ message: 'Access denied' }); // Доступ запрещен
};

// Роль редактора
module.exports.isEditor = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'editor')) {
    return next(); // Если пользователь - администратор или редактор, пропускаем дальше
  }
  return res.status(403).json({ message: 'Access denied' }); // Доступ запрещен
};

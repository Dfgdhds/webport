const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Схема пользователя
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  // Уникальный username
  },
  password: {
    type: String,
    required: true,  // Обязательное поле для пароля
  },
  firstName: {
    type: String,
    required: true,  // Имя обязательно
  },
  lastName: {
    type: String,
    required: true,  // Фамилия обязательно
  },
  age: {
    type: Number,
    required: true,  // Возраст обязательно
  },
  gender: {
    type: String,
    required: true,  // Гендер обязателен
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'user'],  // Роли: admin, editor, user
    default: 'user',  // Роль по умолчанию
  },
  twoFactorSecret: {
    type: String,
    default: '',  // По умолчанию пусто
  },
  isTwoFactorEnabled: {
    type: Boolean,
    default: false,  // По умолчанию 2FA выключен
  },
});

// Хеширование пароля перед сохранением
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Если пароль не изменился, пропускаем хеширование
  this.password = await bcrypt.hash(this.password, 10);  // Хешируем пароль
  next();
});

// Метод для сравнения пароля
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);  // Сравниваем введённый пароль с хешированным в базе
};

// Генерация секрета для двухфакторной аутентификации
userSchema.methods.generateTwoFactorSecret = function () {
  const secret = crypto.randomBytes(20).toString('hex');  // Генерируем секретный ключ
  this.twoFactorSecret = secret;
  this.isTwoFactorEnabled = true;  // Включаем 2FA
  return secret;
};

const User = mongoose.model('User', userSchema);  // Создаём модель
module.exports = User;

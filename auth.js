const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Страница регистрации
router.get('/register', (req, res) => {
  res.render('register');
});

// Страница логина
router.get('/login', (req, res) => {
  res.render('login');
});

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
  const { username, password, firstName, lastName, age, gender } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
    firstName,
    lastName,
    age,
    gender,
  });

  await newUser.save();

  // Настройка почтового сервиса для отправки приветственного письма
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: newUser.username,
    subject: 'Welcome to Portfolio Platform!',
    text: 'Thank you for registering!',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.redirect('/auth/login');
});

// Логин пользователя
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send('Invalid credentials');
  }

  // Генерация JWT токена
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('auth_token', token, { httpOnly: true });  // Сохраняем токен в cookies

  res.redirect('/');
});

module.exports = router;

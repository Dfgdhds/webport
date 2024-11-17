const express = require('express');
const PortfolioItem = require('../models/PortfolioItem');
const { isAuthenticated, isAdmin, isEditor } = require('../middleware/auth'); // Подключаем middleware
const router = express.Router();

// Страница портфолио
router.get('/portfolio', isAuthenticated, async (req, res) => { // Используем middleware isAuthenticated
  const items = await PortfolioItem.find();
  res.render('portfolio', { items });  // Рендерим представление "portfolio.ejs"
});

// Добавление нового элемента в портфолио (доступно только для администраторов и редакторов)
router.post('/portfolio', isAuthenticated, isEditor, async (req, res) => { // Используем middleware isAuthenticated и isEditor
  const { title, description, images } = req.body;
  const newItem = new PortfolioItem({ title, description, images });

  await newItem.save();
  res.redirect('/portfolio');
});

// Обновление элемента портфолио (доступно только для администраторов)
router.put('/portfolio/:id', isAuthenticated, isAdmin, async (req, res) => { // Используем middleware isAuthenticated и isAdmin
  const { title, description, images } = req.body;
  const updatedItem = await PortfolioItem.findByIdAndUpdate(req.params.id, {
    title,
    description,
    images,
    updatedAt: Date.now(),
  });
  res.redirect('/portfolio');
});

// Удаление элемента портфолио (доступно только для администраторов)
router.delete('/portfolio/:id', isAuthenticated, isAdmin, async (req, res) => { // Используем middleware isAuthenticated и isAdmin
  await PortfolioItem.findByIdAndDelete(req.params.id);
  res.redirect('/portfolio');
});

module.exports = router;

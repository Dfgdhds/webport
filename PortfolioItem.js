const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: [String], // Массив URL-ов изображений
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  deletedAt: Date,
});

const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema);
module.exports = PortfolioItem;



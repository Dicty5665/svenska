const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Реєстрація
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Перевірка чи користувач вже існує
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач з такою поштою вже існує' });
    }

    // Створення нового користувача
    const user = new User({
      email,
      password,
      name
    });

    await user.save();

    // Створення токену
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Вхід
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Пошук користувача
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Користувача не знайдено' });
    }

    // Перевірка пароля
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Невірний пароль' });
    }

    // Створення токену
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router; 
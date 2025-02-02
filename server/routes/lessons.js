const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const jwt = require('jsonwebtoken');

// Middleware для перевірки автентифікації
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Необхідно увійти в систему' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Помилка автентифікації:', error);
    res.status(401).json({ message: 'Недійсний токен' });
  }
};

// Middleware для перевірки прав адміністратора
const isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Доступ заборонено' });
    }
  } catch (error) {
    console.error('Помилка перевірки прав:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

// Отримати всі уроки
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find().sort('order');
    res.json(lessons);
  } catch (error) {
    console.error('Помилка отримання уроків:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Отримати конкретний урок
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Урок не знайдено' });
    }
    res.json(lesson);
  } catch (error) {
    console.error('Помилка отримання уроку:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Створити новий урок (тільки адмін)
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Отримано дані для створення уроку:', req.body);
    
    const { title, order, content } = req.body;

    // Валідація даних
    if (!title || !content || !content.text) {
      return res.status(400).json({ 
        message: 'Необхідно вказати назву уроку та текст' 
      });
    }

    const lesson = new Lesson({
      title,
      order: order || (await Lesson.countDocuments()) + 1,
      content: {
        text: content.text,
        vocabulary: content.vocabulary || []
      }
    });

    await lesson.save();
    console.log('Урок успішно створено:', lesson);
    
    res.status(201).json(lesson);
  } catch (error) {
    console.error('Помилка створення уроку:', error);
    res.status(500).json({ 
      message: 'Помилка при створенні уроку',
      error: error.message 
    });
  }
});

// Оновити урок (тільки адмін)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!lesson) {
      return res.status(404).json({ message: 'Урок не знайдено' });
    }
    res.json(lesson);
  } catch (error) {
    console.error('Помилка оновлення уроку:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Видалити урок (тільки адмін)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Урок не знайдено' });
    }
    res.json({ message: 'Урок видалено' });
  } catch (error) {
    console.error('Помилка видалення уроку:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router; 
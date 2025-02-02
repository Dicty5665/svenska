const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Отримати прогрес користувача
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('completedLessons vocabulary')
      .populate('completedLessons.lessonId');
    
    res.json({
      completedLessons: user.completedLessons,
      vocabulary: user.vocabulary
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Додати слово до словника
router.post('/vocabulary', async (req, res) => {
  try {
    const { swedishWord, ukrainianTranslation } = req.body;
    
    const user = await User.findById(req.user.id);
    user.vocabulary.push({ swedishWord, ukrainianTranslation });
    await user.save();
    
    res.status(201).json(user.vocabulary);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Видалити слово зі словника
router.delete('/vocabulary/:wordId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.vocabulary = user.vocabulary.filter(
      word => word._id.toString() !== req.params.wordId
    );
    await user.save();
    
    res.json(user.vocabulary);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Зберегти результат проходження уроку
router.post('/lesson-complete/:lessonId', async (req, res) => {
  try {
    const { score } = req.body;
    const lessonId = req.params.lessonId;
    
    const user = await User.findById(req.user.id);
    
    // Перевірка чи урок вже був пройдений
    const existingCompletion = user.completedLessons.find(
      lesson => lesson.lessonId.toString() === lessonId
    );
    
    if (existingCompletion) {
      // Оновлюємо існуючий результат, якщо новий кращий
      if (score > existingCompletion.score) {
        existingCompletion.score = score;
        existingCompletion.completedAt = Date.now();
      }
    } else {
      // Додаємо новий результат
      user.completedLessons.push({
        lessonId,
        score,
        completedAt: Date.now()
      });
    }
    
    await user.save();
    res.json(user.completedLessons);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router; 
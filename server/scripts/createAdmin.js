const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/svenska-learning', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Перевіряємо чи адмін вже існує
    const existingAdmin = await User.findOne({ email: 'admin' });
    
    if (existingAdmin) {
      console.log('Адміністратор вже існує');
      process.exit(0);
    }

    // Створюємо нового адміністратора
    const admin = new User({
      email: 'admin',
      password: 'Dimonya5665',
      name: 'Administrator',
      role: 'admin'
    });

    await admin.save();
    console.log('Адміністратор успішно створений');
    process.exit(0);
  } catch (error) {
    console.error('Помилка при створенні адміністратора:', error);
    process.exit(1);
  }
};

createAdmin(); 
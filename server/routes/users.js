const router = require('express').Router();
const { all, get } = require('../db');

// Получение всех пользователей
router.get('/', async (_req, res) => {
  try {
    const users = await all('SELECT id, email, name, role FROM users');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение пользователя по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await get('SELECT id, email, name, role FROM users WHERE id = ?', [id]);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
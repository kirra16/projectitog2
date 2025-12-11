const router = require('express').Router();
const { all } = require('../db');

router.get('/', async (_req, res) => {
  try {
    const users = await all('SELECT id, email, name, role FROM users');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;

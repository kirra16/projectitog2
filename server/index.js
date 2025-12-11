const express = require('express');
const cors = require('cors');
const { all, get, run } = require('./db');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);

// health/root
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'API server running' });
});

// AUTH
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await get('SELECT id, email, name, role FROM users WHERE email = ? AND password = ?', [email, password]);
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Заполните все поля' });
    }
    const existing = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
    }
    const id = Date.now();
    await run('INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)', [id, email, password, name, 'user']);
    const user = await get('SELECT id, email, name, role FROM users WHERE id = ?', [id]);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// REVIEWS
app.get('/api/reviews', async (_req, res) => {
  try {
    const reviews = await all('SELECT * FROM reviews ORDER BY id DESC');
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { author, text, rating } = req.body;
    const id = Date.now();
    const date = new Date().toLocaleDateString('ru-RU');
    await run('INSERT INTO reviews (id, author, text, rating, date, status) VALUES (?, ?, ?, ?, ?, ?)', [
      id,
      author,
      text,
      rating || 5,
      date,
      'pending'
    ]);
    const review = await get('SELECT * FROM reviews WHERE id = ?', [id]);
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.put('/api/reviews/:id', async (req, res) => {
  try {
    const { status, text, rating } = req.body;
    const { id } = req.params;
    await run('UPDATE reviews SET status = COALESCE(?, status), text = COALESCE(?, text), rating = COALESCE(?, rating) WHERE id = ?', [
      status,
      text,
      rating,
      id
    ]);
    const review = await get('SELECT * FROM reviews WHERE id = ?', [id]);
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM reviews WHERE id = ?', [id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// BOOKINGS
app.get('/api/bookings', async (_req, res) => {
  try {
    const bookings = await all('SELECT * FROM bookings ORDER BY createdAt DESC');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const {
      hallId,
      hallName,
      userName,
      userEmail,
      userId,
      date,
      time,
      duration,
      guests,
      comments
    } = req.body;
    const id = Date.now();
    const createdAt = new Date().toISOString();
    await run(
      `
        INSERT INTO bookings (id, hallId, hallName, userName, userEmail, userId, date, time, duration, guests, comments, status, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [id, hallId, hallName, userName, userEmail, userId, date, time, duration, guests, comments || '', 'pending', createdAt]
    );
    const booking = await get('SELECT * FROM bookings WHERE id = ?', [id]);
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    await run('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    const booking = await get('SELECT * FROM bookings WHERE id = ?', [id]);
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});

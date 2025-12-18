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

// ============ AUTH ENDPOINTS ============
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password }); // Для отладки
    
    const user = await get('SELECT id, email, name, role FROM users WHERE email = ? AND password = ?', [email, password]);
    
    if (!user) {
      console.log('User not found or wrong password');
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    
    console.log('Login successful:', user);
    res.json(user);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log('Registration attempt:', { email, name }); // Для отладки
    
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Заполните все поля' });
    }
    
    // Проверяем существование пользователя
    const existing = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
    }
    
    // Создаем нового пользователя
    const id = Date.now();
    await run(
      'INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)', 
      [id, email, password, name, 'user']
    );
    
    const user = await get('SELECT id, email, name, role FROM users WHERE id = ?', [id]);
    console.log('Registration successful:', user);
    
    res.status(201).json(user);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ============ PROFILE ENDPOINT ============
app.get('/api/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching profile for user ID:', id);
    
    const user = await get('SELECT id, email, name, role FROM users WHERE id = ?', [id]);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    const bookings = await all(`
      SELECT * FROM bookings 
      WHERE userId = ? OR userEmail = ?
      ORDER BY createdAt DESC
    `, [id, user.email]);
    
    const reviews = await all(`
      SELECT * FROM reviews 
      WHERE author = ? 
      ORDER BY id DESC
    `, [user.name]);
    
    res.json({
      user,
      bookings,
      reviews
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ============ REVIEWS ENDPOINTS ============
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

// ============ BOOKINGS ENDPOINTS ============
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
      `INSERT INTO bookings (id, hallId, hallName, userName, userEmail, userId, date, time, duration, guests, comments, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

app.get('/api/debug/users', async (_req, res) => {
  try {
    const users = await all('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/debug/data', async (_req, res) => {
  try {
    const users = await all('SELECT * FROM users');
    const bookings = await all('SELECT * FROM bookings');
    const reviews = await all('SELECT * FROM reviews');
    
    res.json({ 
      users, 
      bookings, 
      reviews,
      counts: {
        users: users.length,
        bookings: bookings.length,
        reviews: reviews.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API сервер запущен на http://localhost:${PORT}`);
  console.log(`📊 Доступные эндпоинты:`);
  console.log(`   POST /api/login - авторизация`);
  console.log(`   POST /api/register - регистрация`);
  console.log(`   GET  /api/profile/:id - данные профиля`);
  console.log(`   GET  /api/users - все пользователи`);
  console.log(`   GET  /api/reviews - все отзывы`);
  console.log(`   POST /api/reviews - создать отзыв`);
  console.log(`   GET  /api/bookings - все бронирования`);
  console.log(`   POST /api/bookings - создать бронирование`);
  console.log(`\n👤 Тестовые пользователи:`);
  console.log(`   Админ: admin@banquet.ru / admin123`);
  console.log(`   Менеджер: manager@banquet.ru / manager123`);
  console.log(`   Пользователь: user@mail.ru / user123`);
});
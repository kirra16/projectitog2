const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'data.sqlite');

const DEMO_USERS = [
  { id: 1, email: 'admin@banquet.ru', password: 'admin123', name: 'Администратор', role: 'admin' },
  { id: 2, email: 'manager@banquet.ru', password: 'manager123', name: 'Менеджер', role: 'manager' },
  { id: 3, email: 'user@mail.ru', password: 'user123', name: 'Гость', role: 'user' }
];

const DEMO_REVIEWS = [
  { 
    id: 1, 
    author: 'Гость', 
    text: 'Отличный зал, прекрасный сервис! Всем рекомендую.', 
    rating: 5, 
    date: '15.12.2024', 
    status: 'approved' 
  },
  { 
    id: 2, 
    author: 'Анна', 
    text: 'Провели корпоратив, все остались довольны.', 
    rating: 4, 
    date: '10.12.2024', 
    status: 'approved' 
  }
];

const DEMO_BOOKINGS = [
  {
    id: 1,
    hallId: 2,
    hallName: 'Red wine',
    userName: 'Гость',
    userEmail: 'user@mail.ru',
    userId: 3,
    date: '2024-12-20',
    time: '18:00',
    duration: 3,
    guests: 25,
    comments: 'День рождения',
    status: 'confirmed',
    createdAt: '2024-12-10T10:30:00.000Z'
  },
  {
    id: 2,
    hallId: 1,
    hallName: 'Natural Vibe',
    userName: 'Гость',
    userEmail: 'user@mail.ru',
    userId: 3,
    date: '2024-12-25',
    time: '14:00',
    duration: 2,
    guests: 15,
    comments: '',
    status: 'pending',
    createdAt: '2024-12-12T14:20:00.000Z'
  }
];

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Ошибка подключения к БД:', err.message);
  } else {
    console.log('✅ Подключение к SQLite БД успешно');
  }
});

// Включаем логирование SQL запросов
db.on('trace', (sql) => {
  console.log('📝 SQL:', sql);
});

db.serialize(() => {
  // Создаем таблицу пользователей
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT
    )
  `, (err) => {
    if (err) console.error('❌ Ошибка создания таблицы users:', err);
    else console.log('✅ Таблица users готова');
  });

  // Создаем таблицу отзывов
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY,
      author TEXT,
      text TEXT,
      rating INTEGER,
      date TEXT,
      status TEXT
    )
  `, (err) => {
    if (err) console.error('❌ Ошибка создания таблицы reviews:', err);
    else console.log('✅ Таблица reviews готова');
  });

  // Создаем таблицу бронирований
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY,
      hallId INTEGER,
      hallName TEXT,
      userName TEXT,
      userEmail TEXT,
      userId INTEGER,
      date TEXT,
      time TEXT,
      duration INTEGER,
      guests INTEGER,
      comments TEXT,
      status TEXT,
      createdAt TEXT
    )
  `, (err) => {
    if (err) console.error('❌ Ошибка создания таблицы bookings:', err);
    else console.log('✅ Таблица bookings готова');
  });

  // Проверяем и заполняем демо-данными
  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (err) {
      console.error('❌ Ошибка проверки пользователей', err);
      return;
    }
    if (row.count === 0) {
      console.log('🔄 Добавляем демо-пользователей...');
      const stmt = db.prepare('INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)');
      DEMO_USERS.forEach((u) => {
        stmt.run([u.id, u.email, u.password, u.name, u.role], (err) => {
          if (err) console.error(`❌ Ошибка добавления пользователя ${u.email}:`, err);
        });
      });
      stmt.finalize();
      console.log('✅ Демо-пользователи добавлены');
    } else {
      console.log(`👤 В базе уже есть ${row.count} пользователей`);
      
      // Показываем существующих пользователей для отладки
      db.all('SELECT id, email, name, role FROM users', (err, rows) => {
        if (!err && rows) {
          console.log('📋 Существующие пользователи:');
          rows.forEach(user => {
            console.log(`   ${user.id}. ${user.name} (${user.email}) - ${user.role}`);
          });
        }
      });
    }
  });
});

// Промис-обертки для работы с БД
const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    console.log('▶️  Выполняем SQL:', sql.substring(0, 100) + '...');
    db.run(sql, params, function (err) {
      if (err) {
        console.error('❌ Ошибка SQL:', err.message);
        reject(err);
      } else {
        console.log(`✅ SQL выполнен, affected rows: ${this.changes}`);
        resolve(this);
      }
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    console.log('🔍 Выполняем SQL (get):', sql.substring(0, 100) + '...');
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('❌ Ошибка SQL:', err.message);
        reject(err);
      } else {
        console.log(`✅ Найдено: ${row ? 'да' : 'нет'}`);
        resolve(row);
      }
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    console.log('📋 Выполняем SQL (all):', sql.substring(0, 100) + '...');
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('❌ Ошибка SQL:', err.message);
        reject(err);
      } else {
        console.log(`✅ Найдено записей: ${rows.length}`);
        resolve(rows);
      }
    });
  });

module.exports = { db, run, get, all };
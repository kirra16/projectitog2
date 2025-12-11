const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'data.sqlite');

const DEMO_USERS = [
  { id: 1, email: 'admin@banquet.ru', password: 'admin123', name: 'Администратор', role: 'admin' },
  { id: 2, email: 'manager@banquet.ru', password: 'manager123', name: 'Менеджер', role: 'manager' },
  { id: 3, email: 'user@mail.ru', password: 'user123', name: 'Гость', role: 'user' }
];

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY,
      author TEXT,
      text TEXT,
      rating INTEGER,
      date TEXT,
      status TEXT
    )
  `);

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
  `);

  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (err) {
      console.error('Ошибка проверки пользователей', err);
      return;
    }
    if (row.count === 0) {
      const stmt = db.prepare('INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)');
      DEMO_USERS.forEach((u) => stmt.run([u.id, u.email, u.password, u.name, u.role]));
      stmt.finalize();
      console.log('Созданы демо-пользователи');
    }
  });
});

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

module.exports = { db, run, get, all };

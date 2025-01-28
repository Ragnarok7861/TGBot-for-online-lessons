require('dotenv').config();
const { Pool } = require('pg');

// Подключение к базе данных
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Функция для создания таблиц
async function initDatabase() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS schedule (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          surname VARCHAR(100) NOT NULL,
          day_of_week VARCHAR(20) NOT NULL,
          time TIME NOT NULL,
          subject VARCHAR(100) NOT NULL
        );
      `);
      console.log('Таблицы успешно созданы!');
    } catch (err) {
      console.error('Ошибка при создании таблиц:', err);
    }
  }
  


initDatabase();

module.exports = pool;

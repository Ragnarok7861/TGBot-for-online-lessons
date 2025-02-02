const pool = require('./pool');


function getDayOfWeek(date) {
  const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const dateObj = new Date(date);
  return daysOfWeek[dateObj.getDay()];
}


// Получение расписания по имени и фамилии
async function getSchedule(name, surname) {
    const query = `
      SELECT date, time, subject
      FROM schedule
      WHERE name = $1 AND surname = $2
      ORDER BY date, time;
    `;
    console.log('SQL запрос:', query);
    console.log('Параметры:', [name, surname]);
  
    const result = await pool.query(query, [name, surname]);
  
    console.log('Результат запроса к базе данных:', result.rows);
  
    return result.rows.map(row => {

      const formattedDate = new Date(row.date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).split('.').reverse().join('-');
  
      const formattedTime = row.time.slice(0, 5); // Убираем секунды
  
      // Определяем день недели из даты
      const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
      const dateObj = new Date(row.date);
      const dayOfWeek = daysOfWeek[dateObj.getDay()]; // Используем getDay() для локального времени
  
      return {
        date: formattedDate,
        time: formattedTime,
        subject: row.subject,
        day_of_week: dayOfWeek,
      };
    });
}

// Добавление урока
async function addSchedule(name, surname, date, time, subject, dayOfWeek) {
    const correctDayOfWeek = getDayOfWeek(date);
    if (dayOfWeek !== correctDayOfWeek) {
      throw new Error(`Указанный день недели (${dayOfWeek}) не соответствует дате (${date}). Должно быть: ${correctDayOfWeek}`);
    }
  
    const query = `
      INSERT INTO schedule (name, surname, date, time, subject, day_of_week)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
    console.log('SQL запрос:', query);
    console.log('Параметры:', [name, surname, date, time, subject, dayOfWeek]);
  
    await pool.query(query, [name, surname, date, time, subject, dayOfWeek]);
}

module.exports = {
  getSchedule,
  addSchedule,
};

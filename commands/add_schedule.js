
const { addSchedule } = require('../db/queries');
const stepData = {}; // Временное хранилище данных для пользователей

async function handleAddScheduleCommand(ctx) {
  const adminId = process.env.ADMIN_ID; // ID администратора
  const userId = ctx.message.from.id;

  // Проверяем права доступа
  if (String(userId) !== String(adminId)) {
    return ctx.reply('У вас нет прав для добавления уроков. Обратитесь к администратору.');
  }

  // Инициализация процесса добавления
  stepData[userId] = { step: 1 };
  ctx.reply('Введите имя ученика:');
}

async function handleMessage(ctx) {
  const userId = ctx.message.from.id;


  if (!stepData[userId]) return;

  const userStep = stepData[userId];
  const input = ctx.message.text.trim();

  switch (userStep.step) {
    case 1: // Ввод имени ученика
      userStep.name = input;
      userStep.step++;
      ctx.reply('Введите фамилию ученика:');
      break;

    case 2: // Ввод фамилии ученика
      userStep.surname = input;
      userStep.step++;
      ctx.reply('Введите день недели (например: Понедельник, Вторник, Среда):');
      break;

    case 3: // Ввод дня недели
      const validDays = [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье',
      ];
      if (!validDays.includes(input)) {
        return ctx.reply('Введите корректный день недели (например: Понедельник, Вторник, Среда):');
      }
      userStep.dayOfWeek = input;
      userStep.step++;
      ctx.reply('Введите дату урока (в формате DD-MM-YYYY):');
      break;

    case 4: // Ввод полной даты
      const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
      if (!dateRegex.test(input)) {
        return ctx.reply('Введите корректную дату (в формате DD-MM-YYYY):');
      }

      // Разделяем дату и преобразуем в формат для базы данных
      const [day, month, year] = input.split('-');
      userStep.date = `${year}-${month}-${day}`; // Преобразуем в формат YYYY-MM-DD
      userStep.step++;
      ctx.reply('Введите время урока (в формате HH:MM):');
      break;

    case 5: // Ввод времени
      if (!/^\d{2}:\d{2}$/.test(input)) {
        return ctx.reply('Введите корректное время (в формате HH:MM):');
      }
      userStep.time = input;
      userStep.step++;
      ctx.reply('Введите предмет:');
      break;

    case 6: // Ввод предмета
      userStep.subject = input;

      try {
        console.log('Добавляем в базу:', {
          name: userStep.name,
          surname: userStep.surname,
          date: userStep.date,
          time: userStep.time,
          subject: userStep.subject,
          dayOfWeek: userStep.dayOfWeek,
        });

        // Добавление урока в базу
        await addSchedule(
          userStep.name,
          userStep.surname,
          userStep.date,
          userStep.time,
          userStep.subject,
          userStep.dayOfWeek
        );

        // Разделяем дату для удобного отображения
        const [year, month, day] = userStep.date.split('-');

        ctx.reply(
          `Урок добавлен: 📅 ${day}-${month}-${year} ⏰ ${userStep.time} — ${userStep.subject}`
        );
      } catch (err) {
        console.error('Ошибка при добавлении урока:', err);
        ctx.reply('Произошла ошибка при добавлении урока. Попробуйте снова.');
      }

      // Очистка временных данных
      delete stepData[userId];
      break;

    default:
      ctx.reply('Произошла ошибка. Попробуйте снова.');
      delete stepData[userId];
      break;
  }
}

module.exports = {
  handleAddScheduleCommand,
  handleMessage,
};


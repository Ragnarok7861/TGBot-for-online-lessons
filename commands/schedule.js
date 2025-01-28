const { getSchedule } = require('../db/queries');

async function handleScheduleCommand(ctx) {
  const message = ctx.message.text.split(' ').slice(1);

  if (message.length < 2) {
    return ctx.reply('Используй формат: /schedule Имя Фамилия');
  }

  const name = message[0]?.trim();
  const surname = message[1]?.trim();

  if (!name || !surname) {
    return ctx.reply('Имя и фамилия должны быть указаны. Используйте формат: /schedule Имя Фамилия');
  }

  console.log('Полученные данные для расписания:', { name, surname });

  try {
    const schedule = await getSchedule(name, surname);
    if (schedule.length === 0) {
      return ctx.reply(`Для ${name} ${surname} уроков не найдено.`);
    }

    const response = schedule
      .map(
        (item) =>
          `📅 ${item.date} (${item.day_of_week})\n⏰ ${item.time} — ${item.subject}`
      )
      .join('\n\n');

    ctx.reply(`Расписание для ${name} ${surname}:\n${response}`);
  } catch (err) {
    console.error('Ошибка при запросе расписания:', err);
    ctx.reply('Произошла ошибка при получении расписания. Попробуйте позже.');
  }
}

module.exports = handleScheduleCommand;

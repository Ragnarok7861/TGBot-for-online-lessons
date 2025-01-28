const handleScheduleCommand = require('./schedule');
const { handleAddScheduleCommand, handleMessage } = require('./add_schedule');
require('dotenv').config();

function registerCommands(bot) {
    bot.command('schedule', handleScheduleCommand); // Получение расписания
    bot.command('add_schedule', handleAddScheduleCommand); // Добавление урока
  
    // Обработчик сообщений для диалога
    bot.on('message', handleMessage);
  
  // Обработчик для получения ID пользователя
  bot.on('message', (ctx) => {
    const userId = ctx.message.from.id; // Получаем ID пользователя
    const username = ctx.message.from.username || 'без имени'; // Получаем username
    ctx.reply(`Ваш ID: ${userId}\nВаш username: ${username}`);
    console.log(`Сообщение от пользователя: ${userId} (${username})`);
  });
}

module.exports = {
  registerCommands,
};

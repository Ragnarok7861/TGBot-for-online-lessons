require('dotenv').config();
const { Telegraf } = require('telegraf');
const commands = require('./commands');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Подключение команд
commands.registerCommands(bot);

// Запуск бота
bot.launch();
console.log('Бот запущен!');

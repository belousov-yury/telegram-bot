const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '5394440350:AAFCDEO61GZjZkbBmXuUDNmt_AY3foRnjXk'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
  await  bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`)
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, `Отгадай`, gameOptions)
}


const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Начальное приветсвие'},
    {command: '/info', description: 'Получить информацию о пользователе'},
    {command: '/game', description: 'Начать игру'},
  ])

  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id
    if(text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/80a/5c9/80a5c9f6-a40e-47c6-acc1-44f43acc0862/9.webp')
      return  bot.sendMessage(chatId, `Добро пожаловать в телеграм бот Юрца`)
    }
    if(text === '/info') {
      return  bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
    }
    if(text === '/game') {
      return startGame(chatId)
    }
    return await bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз')
  })

  bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if(data === '/again') {
      return startGame(chatId)
    }
    if(+data === chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляю, ты угадал! Это цифра ${chats[chatId]}`, againOptions)
    } else {
      return bot.sendMessage(chatId, `К сожалению ты не угадал. Я загадывал цифру ${chats[chatId]}`, againOptions)
    }
  })
}

start()
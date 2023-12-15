const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// После этого env-переменные из файла добавятся в process.env
require('dotenv').config();

const { PORT = 3000, DB_ADDRESS } = process.env;
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralErrorHandler = require('./middlewares/centralErrorHandler');
const routes = require('./routes/index');

// подключаемся к серверу mongo
mongoose.connect(DB_ADDRESS);

const app = express();
// Добавляет заголовки CORS ко всем ответам сервера
app.use(cors({
  credentials: true,
  maxAge: 30, // Кэширование preFlight запросов
  origin: [
    'http://localhost:3000',
    'http://movies.petrosyan.nomoredomainsmonster.ru',
    'https://movies.petrosyan.nomoredomainsmonster.ru'],
}));

// Устанавливает опции для предварительных запросов (pre-flight requests),
// которые отправляются браузером перед основным запросом.
app.options('*', cors()); // Обрабатывает предварительные запросы для всех маршрутов

app.use(express.json()); // для собирания JSON-формата
app.use(cookieParser()); // парсер куки

// логгер запросов
app.use(requestLogger);

app.use(routes);

// логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// централизованный обработчик ошибок
app.use(centralErrorHandler);

app.listen(PORT);

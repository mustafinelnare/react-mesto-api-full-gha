const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { errors, celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const app = express();

const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
app.use(express.json());

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => {
    console.log('success');
  })
  .catch(() => {
    console.log('fail');
  });

app.use(cors({ origin: 'https://project-mesto.nomoredomains.xyz' }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:)?(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/),
  }),
}), createUser);

app.use('/users', auth, require('./routes/usersRoutes'));
app.use('/cards', auth, require('./routes/cardsRoutes'));

app.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

app.use(errorLogger);

app.use(errors());

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

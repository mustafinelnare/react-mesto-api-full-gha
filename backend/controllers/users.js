const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((newUser) => res.status(201).send(newUser))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (error.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует!'));
      } else {
        next(error);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', { expiresIn: '7d' });
      return res
        .status(200)
        .send({ token });
    })
    .catch(next);
};

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((error) => next(error));

const getUserId = (req, res, next) => User.findById(req.params.id).then((item) => {
  if (!item) {
    throw new NotFoundError('Пользователь по указанному _id не найден.');
  }
  return res.status(200).send(item);
})
  .catch((error) => {
    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
    } else {
      next(error);
    }
  });

const getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .then((user) => res.status(200).send(user))
  .catch((error) => next(error));

const updateProfile = (req, res, next) => User
  .findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
  .then((item) => {
    if (!item) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }
    return res.status(200).send(item);
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
    } else {
      next(error);
    }
  });

const updateAvatar = (req, res, next) => User
  .findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
  .then((item) => {
    if (!item) {
      throw new NotFoundError('Пользователь с указанным _id не найден.');
    }
    return res.status(200).send(item);
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
    } else {
      next(error);
    }
  });

module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateProfile,
  updateAvatar,
  login,
  getCurrentUser,
};

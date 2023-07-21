const Card = require('../models/cardSchema');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const getCards = (req, res, next) => Card.find({}).populate('owner')
  .then((card) => res.status(200).send(card))
  .catch((error) => next(error));

const createCards = (req, res, next) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.status(201).send(newCard))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
      next(error);
    });
};

const deleteCards = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId).then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    } else if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Невозможно удалить карточку!');
    }
    return Card.findByIdAndRemove(cardId);
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Некорректные данные _id'));
      }
      next(error);
    });
};

const putLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then((card) => {
  if (!card) {
    throw new NotFoundError('Передан несуществующий _id карточки.');
  }
  return res.status(200).send(card);
})
  .catch((error) => {
    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
    }
    next(error);
  });

const deleteLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).then((card) => {
  if (!card) {
    throw new NotFoundError('Передан несуществующий _id карточки.');
  }
  return res.status(200).send(card);
})
  .catch((error) => {
    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
    }
    next(error);
  });

module.exports = {
  getCards,
  createCards,
  deleteCards,
  putLike,
  deleteLike,
};

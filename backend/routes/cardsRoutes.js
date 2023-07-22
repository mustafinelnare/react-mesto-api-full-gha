const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCards, deleteCards, putLike, deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(/^(https?:)?(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/).required(),
  }),
}), createCards);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), deleteCards);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), putLike);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), deleteLike);

module.exports = router;

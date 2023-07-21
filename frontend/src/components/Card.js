import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card(card) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.ownerId === currentUser._id;
  const isLiked =
    card.likes && card.likes.some((i) => i === currentUser._id);
  const cardElementButtonClassName = `element__button ${
    isLiked && "element__button_active"
  }`;

  function handleClick() {
    card.onCardClick({ name: card.name, link: card.link });
  }

  function handleLikeClick() {
    card.onCardLike(card.cardId, card.likes);
  }

  function handleDeleteCard() {
    card.onCardDelete(card.cardId);
  }

  return (
    <article className="element__item">
      <img
        className="element__image"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />
      {isOwn && (
        <button
          className="element__trash"
          type="button"
          onClick={handleDeleteCard}
        ></button>
      )}
      <div className="element__description">
        <h2 className="element__title">{card.name}</h2>
        <div className="element__place">
          <button
            className={cardElementButtonClassName}
            onClick={handleLikeClick}
            type="button"
          ></button>
          <p className="element__likes">{card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

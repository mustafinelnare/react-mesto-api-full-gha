export default function ImagePopup(props) {
  return (
    <div
      className={`popup popup_open-image ${
        props.card.name ? "popup_opened" : ""
      }`}
    >
      <div className="popup__container popup__container_image">
        <button
          className="popup__close-button"
          type="button"
          onClick={props.onClose}
        ></button>
        <div className="popup__place-image">
          <img
            className="popup__image"
            src={props.card.link}
            alt={props.card.name}
          />
          <p className="popup__subtitle">{props.card.name}</p>
        </div>
      </div>
    </div>
  );
}

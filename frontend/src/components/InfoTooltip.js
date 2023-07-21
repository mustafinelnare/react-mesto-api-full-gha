export default function InfoTooltip({ name, tooltip, isOpen, onClose }) {
  return (
    <div className={`popup popup_${name} ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button
          className="popup__close-button"
          type="button"
          onClick={onClose}
        />
        <img
          className="popup__image-tooltip"
          src={tooltip.image}
          alt={tooltip.message}
        />
        <p className="popup__subtitle-tooltip">{tooltip.message}</p>
      </div>
    </div>
  );
}

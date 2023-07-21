import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props, isOpen) {
  const [title, setTitle] = React.useState("");
  const [link, setLink] = React.useState("");

  React.useEffect(() => {
    setTitle("");
    setLink("");
  }, [isOpen]);

  function handleSetTitle(evt) {
    setTitle(evt.target.value);
  }

  function handleSetLink(evt) {
    setLink(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onAddPlace({
      name: title,
      link: link,
    });
  }

  return (
    <PopupWithForm
      name="add"
      title="Новое место"
      button="Создать"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        className="popup__input popup__input_type_title"
        type="text"
        value={title}
        onChange={handleSetTitle}
        id="titleInput"
        name="title"
        minLength="2"
        maxLength="30"
        placeholder="Название"
        required
      />
      <span className="popup__error_type_title popup__error"></span>
      <input
        className="popup__input popup__input_type_link"
        type="url"
        value={link}
        onChange={handleSetLink}
        id="linkInput"
        name="link"
        placeholder="Ссылка на картинку"
        required
      />
      <span className="popup__error_type_link popup__error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;

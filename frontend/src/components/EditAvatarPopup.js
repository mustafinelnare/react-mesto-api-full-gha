import React, { useRef } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const ref = useRef();

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onUpdateAvatar({
      avatar: ref.current.value,
    });
  }

  return (
    <PopupWithForm
      name="update"
      title="Обновить аватар"
      button="Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        className="popup__input popup__input_type_link"
        ref={ref}
        type="url"
        id="linkAvatar"
        name="linkAvatar"
        placeholder="Ссылка на картинку"
        required
      />
      <span className="popup__error_type_link popup__error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;

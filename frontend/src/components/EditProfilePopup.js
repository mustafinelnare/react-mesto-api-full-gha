import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup(props, isOpen) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleSetName(evt) {
    setName(evt.target.value);
  }

  function handleSetDescription(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name="edit"
      title="Редактировать профиль"
      button="Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        className="popup__input popup__input_type_name"
        type="text"
        id="nameInput"
        name="name"
        minLength="2"
        maxLength="40"
        placeholder="Имя пользователя"
        value={name}
        onChange={handleSetName}
        required
      />
      <span className="popup__error_type_name popup__error"></span>
      <input
        className="popup__input popup__input_type_job"
        type="text"
        id="jobInput"
        name="job"
        minLength="2"
        maxLength="200"
        placeholder="Название профессии"
        value={description}
        onChange={handleSetDescription}
        required
      />
      <span className="popup__error_type_job popup__error popup__error_active"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;

import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "../index.css";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import api from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth";
import successImg from "../images/success.svg";
import wrongImg from "../images/wrong.svg";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({ name: "", about: "" });
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const navigate = useNavigate();
  const [emailUser, setEmailUser] = React.useState("");
  const [tooltip, setTooltip] = React.useState({ image: "", message: "" });
  const [isInfoTooltip, setIsInfoTooltip] = React.useState(false);

  React.useEffect(() => {
    if (loggedIn) {
      api
      .getDataUser()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, [loggedIn]);

  React.useEffect(() => {
    if (loggedIn) {
      api
      .getInitialCards()
      .then((initialCards) => {
        setCards(initialCards);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, [loggedIn]);

  React.useEffect(() => {
    const jwtToken = localStorage.getItem("jwt");
    if (jwtToken) {
      auth
        .checkToken(jwtToken)
        .then((res) => {
          if (res) {
            setEmailUser(res.email);
            setLoggedIn(true);
            navigate("/main", { replace: true });
          }
        })
        .catch(console.error);
    }
  }, []);

  function handleCardLike(cardId, likes) {
    const isLiked = likes.some((i) => i === currentUser._id);
    api
      .changeLikeCardStatus(cardId, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === cardId ? newCard : c)));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(cardData) {
    api
      .addCard(cardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(userData) {
    api
      .saveDataInfo(userData)
      .then((updateUser) => {
        setCurrentUser(updateUser);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleUpdateAvatar(userData) {
    api
      .saveDataProfile(userData)
      .then((userAvatar) => {
        setCurrentUser(userAvatar);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleCardDelete(cardId) {
    api
      .deleteCard(cardId)
      .then(() => {
        setCards((state) => state.filter((card) => card._id !== cardId));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoTooltip(false);
    setSelectedCard({});
  }

  function handleRegister(email, password) {
    auth
      .register(email, password)
      .then(() => {
        setIsInfoTooltip(true);
        setTooltip({
          image: successImg,
          message: "Вы успешно зарегистрировались!",
        });
        navigate("/signin", { replace: true });
      })
      .catch((error) => {
        console.log(error);
        setIsInfoTooltip(true);
        setTooltip({
          image: wrongImg,
          message: "Что-то пошло не так! Попробуйте ещё раз.",
        });
      });
  }

  function handleLogin(email, password) {
    auth
      .login(email, password)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setLoggedIn(true);
        navigate("/main", { replace: true });
      })
      .catch(() => {
        setTooltip({
          image: wrongImg,
          message: "Что-то пошло не так! Попробуйте ещё раз.",
        });
      });
  }

  return (
    <div className="page root">
      <CurrentUserContext.Provider value={currentUser}>
        <Header loggedIn={loggedIn} emailUser={emailUser} />
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? (
                <Navigate to="/main" replace />
              ) : (
                <Navigate to="/signup" replace />
              )
            }
          />
          <Route
            path="/main"
            element={
              <ProtectedRoute
                element={Main}
                onEditAvatar={setIsEditAvatarPopupOpen}
                onEditProfile={setIsEditProfilePopupOpen}
                onAddPlace={setIsAddPlacePopupOpen}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                cards={cards}
                loggedIn={loggedIn}
              />
            }
          />
          <Route
            path="/signup"
            element={<Register onRegister={handleRegister} />}
          />
          <Route path="/signin" element={<Login onLogin={handleLogin} />} />
        </Routes>
        <Footer />

        <InfoTooltip
          name="tips"
          tooltip={tooltip}
          isOpen={isInfoTooltip}
          onClose={closeAllPopups}
        />
        <EditProfilePopup
          onUpdateUser={handleUpdateUser}
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
        />
        <AddPlacePopup
          onAddPlace={handleAddPlaceSubmit}
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
        />
        <EditAvatarPopup
          onUpdateAvatar={handleUpdateAvatar}
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
        />
        <PopupWithForm
          name="delete"
          title="Вы уверены?"
          button="Да"
        ></PopupWithForm>
        <ImagePopup card={selectedCard} onClose={closeAllPopups}></ImagePopup>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;

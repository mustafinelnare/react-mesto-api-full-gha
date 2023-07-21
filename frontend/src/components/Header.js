import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo.svg";

function Header({ emailUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  function signOut() {
    localStorage.removeItem("jwt");
    navigate("/signin", { replace: true });
  }

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип" />
      {location.pathname === "/signin" && (
        <Link to="/signup" className="header__link">
          Регистрация
        </Link>
      )}
      {location.pathname === "/signup" && (
        <Link to="/signin" className="header__link">
          Войти
        </Link>
      )}
      {location.pathname === "/main" && (
        <div className="header__place">
          <p className="header__email">{emailUser}</p>
          <button type="button" onClick={signOut} className="header__button">
            Выйти
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;

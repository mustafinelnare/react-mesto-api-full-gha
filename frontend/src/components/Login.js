import React, { useState } from "react";

function Login({ onLogin }) {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onLogin(formValue.email, formValue.password);
  };

  return (
    <section className="register">
      <h2 className="register__title">Вход</h2>
      <form className="register__form" onSubmit={handleSubmit}>
        <input
          className="register__input"
          type="email"
          placeholder="Email"
          name="email"
          value={formValue.email}
          onChange={handleChange}
          required
        />
        <input
          className="register__input"
          type="password"
          placeholder="Пароль"
          name="password"
          value={formValue.password}
          onChange={handleChange}
          required
        />
        <button className="register__button">Войти</button>
      </form>
    </section>
  );
}

export default Login;

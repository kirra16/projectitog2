import React, { useState } from 'react';
import api from '../../api/client';
import '../../styles/form.css';
import './Login.css';

const Login = ({ setUser, onRegister }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      try {
        const { data } = await api.post('/api/login', {
          email: credentials.email,
          password: credentials.password
        });
        const token = `mock-jwt-token-${Date.now()}`;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      } catch {
        alert('Неверный email или пароль');
      }
    } else {
      if (!credentials.name || !credentials.email || !credentials.password) {
        alert('Заполните все поля');
        return;
      }

      if (credentials.password.length < 3) {
        alert('Пароль должен быть не короче 3 символов');
        return;
      }

      try {
        const newUserPayload = {
          email: credentials.email,
          password: credentials.password,
          name: credentials.name
        };
        await onRegister(newUserPayload);
        alert('Регистрация прошла успешно! Добро пожаловать!');
      } catch (error) {
        if (error?.response?.status === 409) {
          alert('Пользователь с таким email уже существует');
        } else {
          alert('Ошибка регистрации, попробуйте ещё раз');
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSwitch = () => {
    setIsLogin(!isLogin);
    setCredentials({ email: '', password: '', name: '' });
  };

  return (
    <div className="login-section">
      <div className="content-section">
        <div className="form">
          <h3>{isLogin ? 'Войти' : 'Регистрация'}</h3>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <label htmlFor="name">Имя:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={credentials.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  placeholder="Ваше имя"
                  minLength="2"
                />
              </>
            )}

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={credentials.email} onChange={handleInputChange} required placeholder="Ваш email" />

            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              placeholder="Минимум 3 символа"
              minLength="3"
            />

            <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
          </form>

          <p>
            {isLogin ? 'Нет аккаунта?' : 'Уже зарегистрированы?'}{' '}
            <button type="button" className="link-btn" onClick={handleFormSwitch}>
              {isLogin ? 'Создать аккаунт' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

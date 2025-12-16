// src/components/AuthForm/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/client';
import '../../styles/form.css';
import './Login.css';

const Login = ({ onLogin, onRegister, users }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();

  // Проверяем, есть ли в URL параметр register
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('register') === 'true') {
      setIsLogin(false);
    }
  }, [location]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Неверный формат email';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (credentials.password.length < 3) {
      newErrors.password = 'Пароль должен быть не короче 3 символов';
    }
    
    if (!isLogin) {
      if (!credentials.name) {
        newErrors.name = 'Имя обязательно';
      } else if (credentials.name.length < 2) {
        newErrors.name = 'Имя должно быть не короче 2 символов';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Вход
        const result = await onLogin({
          email: credentials.email,
          password: credentials.password
        });
        
        if (result.success) {
          navigate('/');
        } else {
          alert('Неверный email или пароль');
        }
      } else {
        // Регистрация
        const result = await onRegister({
          email: credentials.email,
          password: credentials.password,
          name: credentials.name
        });
        
        if (result.success) {
          alert('Регистрация прошла успешно! Добро пожаловать!');
          navigate('/');
        } else {
          if (result.error?.response?.status === 409) {
            alert('Пользователь с таким email уже существует');
          } else {
            alert('Ошибка регистрации, попробуйте ещё раз');
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFormSwitch = () => {
    setIsLogin(!isLogin);
    setCredentials({ email: '', password: '', name: '' });
    setErrors({});
  };

  return (
    <div className="login-section">
      <div className="content-section">
        <div className="form auth-form">
          <h3>{isLogin ? 'Вход в личный кабинет' : 'Регистрация'}</h3>
          
          <p className="auth-subtitle">
            {isLogin 
              ? 'Введите email и пароль для входа в систему' 
              : 'Заполните все поля для создания нового аккаунта'
            }
          </p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Имя:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={credentials.name}
                  onChange={handleInputChange}
                  placeholder="Ваше имя"
                  className={errors.name ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder="Ваш email"
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Минимум 3 символа"
                className={errors.password ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {isLogin && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" name="remember" />
                  <span>Запомнить меня</span>
                </label>
                <a href="#" className="forgot-password">
                  Забыли пароль?
                </a>
              </div>
            )}

            {!isLogin && (
              <div className="form-terms">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>Я согласен с <a href="/terms">условиями использования</a></span>
                </label>
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner">Загрузка...</span>
              ) : (
                isLogin ? 'Войти' : 'Зарегистрироваться'
              )}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              {isLogin ? 'Нет аккаунта?' : 'Уже зарегистрированы?'}{' '}
              <button 
                type="button" 
                className="link-btn" 
                onClick={handleFormSwitch}
                disabled={isLoading}
              >
                {isLogin ? 'Создать аккаунт' : 'Войти'}
              </button>
            </p>
          </div>

          {isLogin && (
            <div className="demo-credentials">
              <h4>Тестовые аккаунты:</h4>
              <div className="demo-list">
                <div className="demo-item">
                  <strong>Администратор:</strong>
                  <span>admin@banquet.ru / admin123</span>
                </div>
                <div className="demo-item">
                  <strong>Пользователь:</strong>
                  <span>user@mail.ru / user123</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
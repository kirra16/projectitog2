import React, { useState } from 'react';

const Login = ({ setUser, users, onRegister }) => {
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '',
    name: ''
  });
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const user = users.find(u => 
        u.email === credentials.email && u.password === credentials.password
      );

      if (user) {
        const token = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      } else {
        alert('Неверный email или пароль');
      }
    } else {
      if (!credentials.name || !credentials.email || !credentials.password) {
        alert('Пожалуйста, заполните все поля');
        return;
      }

      if (credentials.password.length < 3) {
        alert('Пароль должен содержать минимум 3 символа');
        return;
      }
      const existingUser = users.find(u => u.email === credentials.email);
      if (existingUser) {
        alert('Пользователь с таким email уже существует');
        return;
      }
      const newUser = {
        id: Date.now(),
        email: credentials.email,
        password: credentials.password,
        name: credentials.name,
        role: 'user'
      };
      onRegister(newUser);

      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);

      alert('Регистрация прошла успешно! Добро пожаловать!');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
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
          <h3>{isLogin ? 'Вход в аккаунт' : 'Регистрация'}</h3>

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
                  placeholder="Введите ваше имя"
                  minLength="2"
                />
              </>
            )}

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              placeholder="Введите ваш email"
            />
            
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              placeholder="Введите ваш пароль"
              minLength="3"
            />
            
            <button type="submit">
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
          
          <p>
            {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button 
              type="button" 
              className="link-btn"
              onClick={handleFormSwitch}
            >
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
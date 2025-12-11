import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ user, setUser }) => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <header className="main-header">
      <div className="logo">
        <img src="https://img.freepik.com/free-vector/abstract-company-logo_53876-120501.jpg" alt="Логотип" width="50" height="50" />
      </div>
      
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Главная
            </Link>
          </li>
          <li>
            <a href="/#table">Наши залы</a>
          </li>
          <li>
            <a href="/#reviews">Отзывы</a>
          </li>
          {(user && (user.role === 'admin' || user.role === 'manager')) && (
            <li>
              <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                Админ-панель
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="header-right">
        <div className="contact-info">
          <img src="https://img.icons8.com/ios-filled/50/000000/whatsapp.png" alt="Телефон" />
          <a href="https://wa.me/79281988835">+7 (928) 198-88-35</a>
        </div>

        <div className="user-menu">
          {user ? (
            <>
              <span>Добро пожаловать, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Выйти
              </button>
            </>
          ) : (
            <Link to="/login" className="login-btn">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
// src/components/Header/Header.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Функция для скролла к секциям на главной
  const scrollToSection = (sectionId, e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Если не на главной, переходим на главную и затем скроллим
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    closeMobileMenu();
  };

  return (
    <header className="main-header">
      {/* Логотип */}
      <div className="logo">
        <Link to="/" onClick={closeMobileMenu}>
          <img 
            src="https://img.freepik.com/free-vector/abstract-company-logo_53876-120501.jpg" 
            alt="Логотип" 
            width="50" 
            height="50" 
          />
          <span className="logo-text">Banquet Halls</span>
        </Link>
      </div>

      {/* Кнопка мобильного меню */}
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleMobileMenu}
        aria-label="Меню"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Основная навигация */}
      <nav className={`main-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="nav-list">
          <li>
            <Link 
              to="/" 
              className={isActive('/')}
              onClick={closeMobileMenu}
            >
              Главная
            </Link>
          </li>
          <li>
            <a 
              href="#halls" 
              className={location.pathname === '/#halls' ? 'active' : ''}
              onClick={(e) => scrollToSection('halls', e)}
            >
              Залы
            </a>
          </li>
          <li>
            <a 
              href="#reviews" 
              className={location.pathname === '/#reviews' ? 'active' : ''}
              onClick={(e) => scrollToSection('reviews', e)}
            >
              Отзывы
            </a>
          </li>
          <li>
            <a 
              href="#booking" 
              className={location.pathname === '/#booking' ? 'active' : ''}
              onClick={(e) => scrollToSection('booking', e)}
            >
              Бронирование
            </a>
          </li>
          {(user && (user.role === 'admin' || user.role === 'manager')) && (
            <li>
              <Link 
                to="/admin" 
                className={isActive('/admin')}
                onClick={closeMobileMenu}
              >
                Админ-панель
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="header-right">
        <div className="contact-info">
          <a 
            href="https://wa.me/79281988835" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-link"
          >
            <img 
              src="https://img.icons8.com/ios-filled/50/000000/whatsapp.png" 
              alt="WhatsApp" 
              className="whatsapp-icon"
            />
            <span className="phone-number">+7 (928) 198-88-35</span>
          </a>
        </div>

        <div className="user-menu">
          {user ? (
            <div className="user-menu-logged">
              <Link 
                to="/profile" 
                className={`profile-link ${isActive('/profile')}`}
                onClick={closeMobileMenu}
              >
                <span className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="user-name">{user.name}</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="logout-btn"
                aria-label="Выйти"
              >
                Выйти
              </button>
            </div>
          ) : (
            <div className="user-menu-guest">
              <Link 
                to="/login" 
                className="login-btn"
                onClick={closeMobileMenu}
              >
                Войти
              </Link>
              <Link 
                to="/login?register=true" 
                className="register-btn"
                onClick={closeMobileMenu}
              >
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Оверлей для мобильного меню */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
    </header>
  );
};

export default Header;
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId, e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToHome = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#f5e8dc',
      boxShadow: '0 2px 10px rgba(139, 69, 19, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      gap: '15px'
    }}>
      <div style={{ flexShrink: 0 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img 
            src="https://img.freepik.com/free-vector/abstract-company-logo_53876-120501.jpg" 
            alt="Логотип" 
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#5d4037' }}>
            Banquet Halls
          </span>
        </Link>
      </div>
      <nav style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: 'white',
          borderRadius: '25px',
          padding: '3px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Link 
            to="/" 
            onClick={goToHome}
            style={{
              textDecoration: 'none',
              color: '#5d4037', 
              padding: '8px 20px',
              borderRadius: '20px',
              backgroundColor: 'transparent', 
              fontWeight: '500',
              fontSize: '14px',
              display: 'block',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5e8dc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Главная
          </Link>

          <a 
            href="#halls" 
            onClick={(e) => scrollToSection('halls', e)}
            style={{
              textDecoration: 'none',
              color: '#5d4037',
              padding: '8px 20px',
              borderRadius: '20px',
              backgroundColor: 'transparent',
              fontWeight: '500',
              fontSize: '14px',
              display: 'block',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5e8dc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Залы
          </a>

          <a 
            href="#reviews" 
            onClick={(e) => scrollToSection('reviews', e)}
            style={{
              textDecoration: 'none',
              color: '#5d4037',
              padding: '8px 20px',
              borderRadius: '20px',
              backgroundColor: 'transparent',
              fontWeight: '500',
              fontSize: '14px',
              display: 'block',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5e8dc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Отзывы
          </a>

          <a 
            href="#booking" 
            onClick={(e) => scrollToSection('booking', e)}
            style={{
              textDecoration: 'none',
              color: '#5d4037',
              padding: '8px 20px',
              borderRadius: '20px',
              backgroundColor: 'transparent',
              fontWeight: '500',
              fontSize: '14px',
              display: 'block',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5e8dc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Бронирование
          </a>

          <a 
            href="#map" 
            onClick={(e) => scrollToSection('map', e)}
            style={{
              textDecoration: 'none',
              color: '#5d4037',
              padding: '8px 20px',
              borderRadius: '20px',
              backgroundColor: 'transparent',
              fontWeight: '500',
              fontSize: '14px',
              display: 'block',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5e8dc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Карта залов
          </a>

          {user && (user.role === 'admin' || user.role === 'manager') && (
            <Link 
              to="/admin" 
              style={{
                textDecoration: 'none',
                color: isActive('/admin') ? 'white' : '#5d4037',
                padding: '8px 20px',
                borderRadius: '20px',
                backgroundColor: isActive('/admin') ? '#8d6e63' : 'transparent',
                fontWeight: '500',
                fontSize: '14px',
                display: 'block',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!isActive('/admin')) {
                  e.currentTarget.style.backgroundColor = '#f5e8dc';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/admin')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              Админ
            </Link>
          )}
        </div>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0 }}>
        <a 
          href="https://wa.me/79281988835" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(141, 110, 99, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <img 
            src="https://img.icons8.com/ios-filled/50/000000/whatsapp.png" 
            alt="WhatsApp" 
            style={{ width: '20px', height: '20px' }}
          />
          <span style={{ color: '#5d4037', fontWeight: '500', fontSize: '14px' }}>
            +7 (928) 198-88-35
          </span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            <>
              <Link 
                to="/profile" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#5d4037',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Профиль
              </Link>
              <button 
                onClick={onLogout}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#8d6e63',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5d4037';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#8d6e63';
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#8d6e63',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5d4037';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#8d6e63';
                }}
              >
                Войти
              </Link>
              <Link 
                to="/login?register=true" 
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f5e8dc',
                  color: '#5d4037',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  border: '1px solid #8d6e63',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#8d6e63';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5e8dc';
                  e.currentTarget.style.color = '#5d4037';
                }}
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
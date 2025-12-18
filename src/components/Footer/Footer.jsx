import React from 'react';
import Map from '../Map/Map';
import './Footer.css';

const Footer = () => {
  return (
    <>
      <Map />
      <footer className="main-footer">
        <div className="footer-content">
          <div className="video-container">
            <video 
              controls 
              poster="/images/preview.jpg" 
              width="600" 
              height="350"
              className="footer-video"
            >
              <source src="/audiovideo/wedding.mp4" type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
          </div>
          
          <div className="footer-info">
            <div className="contact-info-footer">
              <h3>Контакты</h3>
              <p>г. Ростов-на-Дону</p>
              <p>Телефон: +7 (928) 198-88-35</p>
              <p>Email: info@banquethalls.ru</p>
              <p>Работаем: ежедневно 9:00-22:00</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2024 Banquet Halls. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
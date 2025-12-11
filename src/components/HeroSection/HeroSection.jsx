import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section id="hero" className="hero-section">
      <img
        src="https://img.freepik.com/free-photo/wonderful-wedding-table-amazing-restaurant_8353-9875.jpg"
        alt="Банкетный зал"
        className="hero-image"
      />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Забронируйте идеальный банкетный зал</h1>
        <h3>Свадьбы, корпоративы и дни рождения — сделаем событие незабываемым</h3>
        <em>
          Мы знаем, как сделать праздник <strong>безупречным</strong>. Забронируйте зал за 3 минуты и получите{' '}
          <strong>скидку на первый час аренды</strong>!
        </em>
        <p>Оставьте заявку — мы свяжемся и подберём зал под ваш формат.</p>
        <audio controls>
          <source src="/audiovideo/zvuk-smeha1.mp3" type="audio/mpeg" />
          Ваш браузер не поддерживает аудио.
        </audio>
      </div>
    </section>
  );
};

export default HeroSection;

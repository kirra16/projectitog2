import React from 'react';

const HeroSection = () => {
  return (
    <section id="hero" className="hero-section">
      <img 
        src="https://img.freepik.com/free-photo/wonderful-wedding-table-amazing-restaurant_8353-9875.jpg" 
        alt="Главная картинка" 
        className="hero-image"
      />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Банкетные залы для ваших мероприятий</h1>
        <h3>Праздник у нас - это про атмосферу!</h3>
        <em>
          Сервис по предоставлению <strong>банкетных залов и настроения</strong>. 
          При брони любого из залов более чем на 3 часа <strong>торт в подарок</strong>!
        </em>
        <p>Как звучит любое мероприятие с нами?</p>
        <audio controls>
          <source src="/audiovideo/zvuk-smeha1.mp3" type="audio/mpeg" />
          <source src="/audiovideo/zvuk-smeha1.ogg" type="audio/ogg" />
          Ваш браузер не поддерживает аудио элемент.
        </audio>
      </div>
    </section>
  );
};

export default HeroSection;
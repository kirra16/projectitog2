import React, { useState } from 'react';
import './LandingPage.css';

const LandingPage = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClick = () => {
    setIsExiting(true);
    window.location.hash = '';
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  return (
    <div className={`landing-page ${isExiting ? 'exiting' : ''}`} onClick={handleClick}>
      <div className="landing-background">
        <img
          src="https://img.freepik.com/premium-photo/tables-chairs-blurred_926199-3188848.jpg"
          alt="Банкетный зал"
          className="landing-image"
        />
        <div className="landing-overlay"></div>
      </div>
      
      <div className="landing-content">
        <div className="landing-text-frame">
          <h1 className="landing-title">
            <span className="title-main">Banquet Halls</span>
            <span className="title-subtitle">— выбери свой идеальный зал</span>
          </h1>
          <div className="landing-instruction">
            <p className="instruction-text">Кликните в любом месте для входа</p>
            <div className="pulse-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
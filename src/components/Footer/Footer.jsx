import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="video">
        <video controls poster="/images/preview.jpg" width="600" height="350">
          <source src="/audiovideo/wedding.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
    </footer>
  );
};

export default Footer;

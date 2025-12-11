import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="video">
        <video controls poster="/images/preview.jpg" width="600" height="350">
          <source src="/audiovideo/4783595_Couple_Wedding_3840x2160 (1).mp4" type="video/mp4" />
          <source src="/audiovideo/4783595_Couple_Wedding_3840x2160 (1).mp4" type="video/webm" />
          Ваш браузер не поддерживает видео элемент.
        </video>
      </div>
    </footer>
  );
};

export default Footer;
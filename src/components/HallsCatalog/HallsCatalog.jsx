// src/components/HallsCatalog/HallsCatalog.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './HallsCatalog.css';

const hallsData = [
  { 
    id: 1, 
    name: 'Natural Vibe', 
    capacity: 'до 25 человек', 
    price: '15 990 р.', 
    description: 'Уютный зал в природных тонах, идеальный для небольших мероприятий',
    image: "https://img.freepik.com/free-photo/cozy-cafeteria-event-hall-with-white-furniture-imaeg_114579-2231.jpg",
    features: ['Wi-Fi', 'Проектор', 'Фоновая музыка', 'Кондиционер']
  },
  { 
    id: 2, 
    name: 'Red wine', 
    capacity: 'до 50 человек', 
    price: '25 990 р.', 
    description: 'Элегантный зал в бордовых тонах с винными акцентами',
    image: 'https://img.freepik.com/free-photo/photorealistic-wedding-venue-with-intricate-decor-ornaments_23-2151481527.jpg',
    features: ['Барная стойка', 'Джакузи', 'Караоке', 'Парковка']
  },
  { 
    id: 3, 
    name: 'White room', 
    capacity: 'до 100 человек', 
    price: '45 990 р.', 
    description: 'Просторный светлый зал для крупных торжеств',
    image: 'https://img.freepik.com/free-photo/decorated-hall-wedding-is-ready-celebration_8353-10236.jpg',
    features: ['Сцена', 'Танцпол', '2 бара', 'Гардероб']
  },
  { 
    id: 4, 
    name: 'Golden river', 
    capacity: 'до 200 человек', 
    price: '95 990 р.', 
    description: 'Роскошный зал с золотыми акцентами для VIP-мероприятий',
    image: 'https://img.freepik.com/free-photo/gorgeous-italian-hall-with-paintings-wall_8353-656.jpg',
    features: ['VIP зона', 'Лифт', '3 бара', 'Охраняемая парковка']
  }
];

const HallsCatalog = () => {
  return (
    <section id="halls" className="halls-section content-section">
      <div className="halls-header">
        <h2>Наши банкетные залы</h2>
        <p className="section-subtitle">Выберите идеальное пространство для вашего мероприятия</p>
      </div>

      <div className="halls-grid-container">
        <div className="halls-grid">
          {hallsData.map((hall) => (
            <div key={hall.id} className="hall-card">
              <div className="hall-image">
                <img src={hall.image} alt={hall.name} />
                <div className="hall-overlay">
                  <Link to={`/hall/${hall.id}`} className="view-details-btn">
                    Подробнее
                  </Link>
                </div>
              </div>
              
              <div className="hall-content">
                <h3>{hall.name}</h3>
                <p className="hall-description">{hall.description}</p>
                
                <div className="hall-specs">
                  <div className="spec-item">
                    <div className="spec-text">{hall.capacity}</div>
                  </div>
                  <div className="spec-item">
                    <div className="spec-text">{hall.price} / час</div>
                  </div>
                </div>
                
                <div className="hall-features">
                  <h4>Особенности:</h4>
                  <div className="features-list">
                    {hall.features.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                </div>
                
                <div className="hall-actions">
                  <Link to={`/hall/${hall.id}`} className="details-btn">
                    Подробнее о зале
                  </Link>
                  <Link to={`/hall/${hall.id}`} className="book-btn">
                    Забронировать
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="halls-footer">
        <p className="halls-total">
          Всего залов: <strong>{hallsData.length}</strong>
        </p>
        <p className="halls-note">
          *Все залы оборудованы современной техникой и мебелью. 
          Возможна индивидуальная планировка по вашему запросу.
        </p>
      </div>
    </section>
  );
};

export default HallsCatalog;
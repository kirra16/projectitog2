// src/components/HallCard/HallCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './HallCard.css';

const HallCard = ({ hall, showDetails = true }) => {
  const {
    id,
    name,
    capacity,
    price,
    description,
    image,
    features = []
  } = hall;

  return (
    <div className="hall-card">
      <div className="hall-card-image">
        <img src={image} alt={name} />
        <div className="hall-card-overlay">
          <Link to={`/hall/${id}`} className="hall-card-view-btn">
            Подробнее
          </Link>
        </div>
      </div>
      
      <div className="hall-card-content">
        <h3 className="hall-card-title">{name}</h3>
        
        {showDetails && (
          <p className="hall-card-description">{description}</p>
        )}
        
        <div className="hall-card-info">
          <div className="hall-card-info-item">
            <span className="hall-card-info-icon">👥</span>
            <span className="hall-card-info-text">{capacity}</span>
          </div>
          <div className="hall-card-info-item">
            <span className="hall-card-info-icon">💰</span>
            <span className="hall-card-info-text">{price} / час</span>
          </div>
        </div>
        
        {features.length > 0 && (
          <div className="hall-card-features">
            <div className="hall-card-features-list">
              {features.slice(0, 3).map((feature, index) => (
                <span key={index} className="hall-card-feature-tag">
                  {feature}
                </span>
              ))}
              {features.length > 3 && (
                <span className="hall-card-feature-more">
                  +{features.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="hall-card-actions">
          <Link to={`/hall/${id}`} className="hall-card-details-btn">
            Подробнее
          </Link>
          <a href="#booking" className="hall-card-book-btn">
            Забронировать
          </a>
        </div>
      </div>
    </div>
  );
};

export default HallCard;
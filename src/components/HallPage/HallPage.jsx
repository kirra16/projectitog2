import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './HallPage.css';

const HallPage = ({ getHallById, user, addBooking }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hall = getHallById ? getHallById(id) : null;
  
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: 3,
    guests: '',
    comments: ''
  });

  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Чтобы оставить заявку на бронь, авторизуйтесь.');
      navigate('/login');
      return;
    }

    const booking = {
      ...bookingData,
      hallId: hall.id,
      hallName: hall.name,
      userName: user.name,
      userEmail: user.email,
      userId: user.id
    };

    try {
      await addBooking(booking);
      alert('Заявка отправлена! Менеджер свяжется с вами для подтверждения.');

      setBookingData({
        date: '',
        time: '',
        duration: 3,
        guests: '',
        comments: ''
      });
    } catch (error) {
      console.error('Booking error:', error);
      alert('Ошибка при отправке заявки. Попробуйте снова.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  if (!hall) {
    return (
      <div className="hall-not-found content-section">
        <h2>Зал не найден</h2>
        <Link to="/" className="back-home-btn">
          Вернуться к выбору залов
        </Link>
      </div>
    );
  }

  return (
    <div className="hall-page content-section">
      <div className="breadcrumbs">
        <Link to="/">Главная</Link> &gt; 
        <Link to="/#halls">Залы</Link> &gt; 
        <span>{hall.name}</span>
      </div>

      <div className="hall-header">
        <h1>{hall.name}</h1>
        <p className="hall-subtitle">{hall.description}</p>
      </div>

      <div className="hall-gallery">
        <div className="main-image">
          <img src={hall.images ? hall.images[0] : hall.image} alt={hall.name} />
        </div>
        {hall.images && hall.images.length > 1 && (
          <div className="thumbnail-grid">
            {hall.images.slice(1).map((img, index) => (
              <img key={index} src={img} alt={`${hall.name} ${index + 2}`} />
            ))}
          </div>
        )}
      </div>

      <div className="hall-info-grid">
        <div className="hall-details">
          <h2>Описание зала</h2>
          <p>{hall.fullDescription || hall.description}</p>
          
          <h3>Особенности</h3>
          <ul className="features-list">
            {hall.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          
          <h3>Что входит в стоимость</h3>
          <ul className="amenities-list">
            {(hall.amenities || ['Столы и стулья', 'Посуда', 'Барная стойка']).map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </div>
        
        <div className="booking-section">
          <div className="booking-card">
            <div className="booking-info">
              <h3>Информация о бронировании</h3>
              <div className="price-info">
                <span className="price-label">Цена за час:</span>
                <span className="price-value">{hall.price}</span>
              </div>
              <div className="capacity-info">
                <span className="capacity-label">Вместимость:</span>
                <span className="capacity-value">{hall.capacity}</span>
              </div>
            </div>
          </div>

          <div className="booking-form-full">
            <h3>Бронирование зала</h3>
            
            {!user ? (
              <div className="login-required">
                <p>Чтобы забронировать зал, необходимо авторизоваться.</p>
                <Link to="/login" className="login-btn">
                  Войти в систему
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label htmlFor="date">Дата:</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Время:</label>
                  <select
                    id="time"
                    name="time"
                    value={bookingData.time}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Укажите время</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="duration">Длительность (часы):</label>
                    <select
                      id="duration"
                      name="duration"
                      value={bookingData.duration}
                      onChange={handleChange}
                      required
                    >
                      <option value="1">1 час</option>
                      <option value="2">2 часа</option>
                      <option value="3">3 часа</option>
                      <option value="4">4 часа</option>
                      <option value="5">5+ часов</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="guests">Количество гостей:</label>
                    <input
                      type="number"
                      id="guests"
                      name="guests"
                      value={bookingData.guests}
                      onChange={handleChange}
                      required
                      min="1"
                      max="200"
                      placeholder="1-200"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="comments">Комментарий:</label>
                  <textarea
                    id="comments"
                    name="comments"
                    value={bookingData.comments}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Уточните формат мероприятия, пожелания по меню и т.д."
                  />
                </div>

                <button type="submit" className="book-now-btn">
                  Забронировать {hall.name}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="hall-actions">
        <Link to="/#halls" className="back-btn">
          ← К другим залам
        </Link>
      </div>
    </div>
  );
};

export default HallPage;
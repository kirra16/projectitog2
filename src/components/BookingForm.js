import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const BookingForm = ({ halls, addBooking, user }) => {
  const [selectedHall, setSelectedHall] = useState('');
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: 3,
    guests: '',
    comments: ''
  });

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Пожалуйста, войдите в систему для бронирования зала');
      return;
    }

    const selectedHallData = halls.find(hall => hall.id === parseInt(selectedHall));
    
    const booking = {
      ...bookingData,
      hallId: selectedHall,
      hallName: selectedHallData.name,
      userName: user.name,
      userEmail: user.email,
      userId: user.id
    };

    addBooking(booking);
    alert('Заявка на бронирование отправлена! Мы свяжемся с вами для подтверждения.');
    
    setSelectedHall('');
    setBookingData({
      date: '',
      time: '',
      duration: 3,
      guests: '',
      comments: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return (
      <section id="booking" className="booking-section">
        <div className="content-section">
          <div className="form">
            <h3>Бронирование зала</h3>
            <p>Для бронирования зала необходимо <a href="/login">войти в систему</a></p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="booking-section">
      <div className="content-section">
        <div className="form">
          <h3>Забронировать зал</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="hall">Выберите зал:</label>
            <select
              id="hall"
              value={selectedHall}
              onChange={(e) => setSelectedHall(e.target.value)}
              required
            >
              <option value="">Выберите зал</option>
              {halls.map(hall => (
                <option key={hall.id} value={hall.id}>
                  {hall.name} ({hall.capacity}) - {hall.price}/час
                </option>
              ))}
            </select>

            <div className="form-row">
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
                  <option value="">Выберите время</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="duration">Продолжительность (часы):</label>
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
                />
              </div>
            </div>

            <label htmlFor="comments">Дополнительные пожелания:</label>
            <textarea
              id="comments"
              name="comments"
              value={bookingData.comments}
              onChange={handleChange}
              rows="3"
              placeholder="Особые пожелания к мероприятию..."
            />

            <button type="submit">Забронировать</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
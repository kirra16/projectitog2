import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import './Profile.css';

const Profile = ({ user }) => {
  const [userBookings, setUserBookings] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const [bookingsRes, reviewsRes] = await Promise.all([
          api.get('/api/bookings'),
          api.get('/api/reviews')
        ]);

        const myBookings = bookingsRes.data.filter(booking => 
          booking.userId === user.id || booking.userEmail === user.email
        );

        const myReviews = reviewsRes.data.filter(review => 
          review.author === user.name
        );
        
        setUserBookings(myBookings);
        setUserReviews(myReviews);
      } catch (error) {
        console.error('Ошибка загрузки данных профиля', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'На рассмотрении';
      case 'confirmed': return 'Подтверждено';
      case 'cancelled': return 'Отменено';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getReviewStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'На модерации';
      case 'approved': return 'Опубликован';
      case 'rejected': return 'Отклонён';
      default: return status;
    }
  };

  if (!user) {
    return (
      <section className="profile-section content-section">
        <div className="profile-container">
          <div className="profile-card">
            <h2>Личный кабинет</h2>
            <p>Для просмотра профиля необходимо <Link to="/login">войти в систему</Link>.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-section content-section">
      <div className="profile-container">
        <div className="profile-header">
          <h2>Личный кабинет</h2>
          <div className="user-info-card">
            <div className="user-avatar">
              <span>{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="user-details">
              <h3>{user.name}</h3>
              <p className="user-email">✉️ {user.email}</p>
              <p className="user-role">Роль: {user.role === 'admin' ? 'Администратор' : user.role === 'manager' ? 'Менеджер' : 'Пользователь'}</p>
            </div>
          </div>
        </div>

        <div className="profile-sections">
          <div className="profile-section-card">
            <h3>Мои бронирования</h3>
            {isLoading ? (
              <p>Загрузка бронирований...</p>
            ) : userBookings.length === 0 ? (
              <div className="empty-state">
                <p>У вас нет активных бронирований</p>
                <Link to="/#booking" className="action-link">Забронировать зал</Link>
              </div>
            ) : (
              <div className="bookings-list">
                {userBookings.map(booking => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-header">
                      <h4>{booking.hallName}</h4>
                      <span className={`status-badge ${getStatusClass(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p><strong>Дата:</strong> {booking.date} в {booking.time}</p>
                      <p><strong>Длительность:</strong> {booking.duration} часа(ов)</p>
                      <p><strong>Гостей:</strong> {booking.guests} человек</p>
                      <p><strong>Создано:</strong> {formatDate(booking.createdAt)}</p>
                      {booking.comments && (
                        <p><strong>Комментарий:</strong> {booking.comments}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-section-card">
            <h3>Мои отзывы</h3>
            {isLoading ? (
              <p>Загрузка отзывов...</p>
            ) : userReviews.length === 0 ? (
              <div className="empty-state">
                <p>Вы еще не оставляли отзывы</p>
                <Link to="/#reviews" className="action-link">Оставить отзыв</Link>
              </div>
            ) : (
              <div className="reviews-list">
                {userReviews.map(review => (
                  <div key={review.id} className="review-item-profile">
                    <div className="review-header-profile">
                      <div className="review-rating">
                        {'★'.repeat(review.rating)}
                        <span className="rating-number">({review.rating}/5)</span>
                      </div>
                      <div className="review-meta">
                        <span className="review-date">{review.date}</span>
                        <span className={`review-status ${review.status}`}>
                          {getReviewStatusLabel(review.status)}
                        </span>
                      </div>
                    </div>
                    <p className="review-text">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/" className="back-btn">← На главную</Link>
          {user.role === 'admin' || user.role === 'manager' ? (
            <Link to="/admin" className="admin-btn">Перейти в админ-панель</Link>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Profile;
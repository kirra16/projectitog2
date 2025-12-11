import React, { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = ({ user, reviews, bookings, updateReview, updateBooking }) => {
  const [activeTab, setActiveTab] = useState(user && user.role === 'manager' ? 'bookings' : 'reviews');

  const mockUsers = [
    { id: 1, name: 'Администратор', email: 'admin@banquet.ru', role: 'admin', registrationDate: '2024-01-15' },
    { id: 2, name: 'Менеджер', email: 'manager@banquet.ru', role: 'manager', registrationDate: '2024-02-20' },
    { id: 3, name: 'Гость', email: 'user@mail.ru', role: 'user', registrationDate: '2024-03-10' }
  ];

  const [users, setUsers] = useState(mockUsers);

  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter((r) => r.status === 'approved').length;
    const pendingReviews = reviews.filter((r) => r.status === 'pending').length;

    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
    const pendingBookings = bookings.filter((b) => b.status === 'pending').length;

    return {
      totalReviews,
      approvedReviews,
      pendingReviews,
      totalBookings,
      confirmedBookings,
      pendingBookings
    };
  }, [bookings, reviews]);

  const pendingReviewsList = reviews.filter((review) => review.status === 'pending');
  const approvedReviewsList = reviews.filter((review) => review.status === 'approved');

  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return <Navigate to="/login" replace />;
  }

  const handleReviewAction = (reviewId, action) => {
    if (action === 'approve') {
      updateReview(reviewId, { status: 'approved' });
    } else if (action === 'reject') {
      updateReview(reviewId, { status: 'rejected' });
    } else if (action === 'delete') {
      if (window.confirm('Удалить опубликованный отзыв?')) {
        updateReview(reviewId, { status: 'deleted' });
      }
    }
  };

  const handleBookingAction = (bookingId, action) => {
    if (action === 'confirm') {
      updateBooking(bookingId, { status: 'confirmed' });
    } else if (action === 'cancel') {
      updateBooking(bookingId, { status: 'cancelled' });
    }
  };

  const handleUserRoleChange = (userId, newRole) => {
    setUsers(users.map((userItem) => (userItem.id === userId ? { ...userItem, role: newRole } : userItem)));
  };

  return (
    <div className="admin-panel">
      <div className="content-section">
        <div className="admin-header">
          <h2>Панель администратора</h2>
          <div className="user-role-badge">
            Роль: {user.role === 'admin' ? 'Администратор' : 'Менеджер'}
          </div>
        </div>

        {user.role === 'admin' && (
          <div className="admin-stats">
            <div className="stat-card">
              <h4>Всего отзывов</h4>
              <span className="stat-number">{stats.totalReviews}</span>
            </div>
            <div className="stat-card">
              <h4>Одобрено</h4>
              <span className="stat-number approved">{stats.approvedReviews}</span>
            </div>
            <div className="stat-card">
              <h4>На модерации</h4>
              <span className="stat-number pending">{stats.pendingReviews}</span>
            </div>
            <div className="stat-card">
              <h4>Всего броней</h4>
              <span className="stat-number">{stats.totalBookings}</span>
            </div>
          </div>
        )}

        <div className="admin-tabs">
          {user.role === 'admin' && (
            <>
              <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>
                Модерация отзывов
              </button>
              <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                Управление пользователями
              </button>
              <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
                Аналитика
              </button>
            </>
          )}
          {(user.role === 'admin' || user.role === 'manager') && (
            <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>
              Управление бронями
            </button>
          )}
        </div>

        <div className="admin-content">
          {activeTab === 'reviews' && user.role === 'admin' && (
            <div className="reviews-moderation">
              <h3>Модерация отзывов</h3>

              <div className="moderation-section">
                <h4>Ожидают модерации ({pendingReviewsList.length})</h4>
                {pendingReviewsList.length === 0 ? (
                  <p className="no-items">Нет отзывов, ожидающих проверки</p>
                ) : (
                  pendingReviewsList.map((review) => (
                    <div key={review.id} className="moderation-item">
                      <div className="review-content">
                        <div className="review-header">
                          <strong>{review.author}</strong>
                          <span className="rating">{'★'.repeat(review.rating)}</span>
                          <span className="date">{review.date}</span>
                        </div>
                        <p>{review.text}</p>
                      </div>
                      <div className="moderation-actions">
                        <button onClick={() => handleReviewAction(review.id, 'approve')} className="approve-btn">
                          Одобрить
                        </button>
                        <button onClick={() => handleReviewAction(review.id, 'reject')} className="reject-btn">
                          Отклонить
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="moderation-section">
                <h4>Опубликовано ({approvedReviewsList.length})</h4>
                {approvedReviewsList.length === 0 ? (
                  <p className="no-items">Пока нет опубликованных отзывов</p>
                ) : (
                  approvedReviewsList.map((review) => (
                    <div key={review.id} className="moderation-item approved">
                      <div className="review-content">
                        <div className="review-header">
                          <strong>{review.author}</strong>
                          <span className="rating">{'★'.repeat(review.rating)}</span>
                          <span className="date">{review.date}</span>
                        </div>
                        <p>{review.text}</p>
                      </div>
                      <button onClick={() => handleReviewAction(review.id, 'delete')} className="delete-btn">
                        Удалить
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-management">
              <h3>Управление бронями</h3>

              <div className="bookings-stats">
                <div className="booking-stat">
                  <span className="stat-label">Всего:</span>
                  <span className="stat-value">{stats.totalBookings}</span>
                </div>
                <div className="booking-stat confirmed">
                  <span className="stat-label">Подтверждено:</span>
                  <span className="stat-value">{stats.confirmedBookings}</span>
                </div>
                <div className="booking-stat pending">
                  <span className="stat-label">Ожидают:</span>
                  <span className="stat-value">{stats.pendingBookings}</span>
                </div>
              </div>

              {bookings.length === 0 ? (
                <p className="no-items">Заявок на бронирование пока нет</p>
              ) : (
                <div className="bookings-list">
                  {bookings.map((booking) => (
                    <div key={booking.id} className={`booking-item ${booking.status}`}>
                      <div className="booking-info">
                        <h4>{booking.hallName}</h4>
                        <div className="booking-details">
                          <p>
                            <strong>Клиент:</strong> {booking.userName} ({booking.userEmail})
                          </p>
                          <p>
                            <strong>Дата:</strong> {booking.date} в {booking.time}
                          </p>
                          <p>
                            <strong>Длительность:</strong> {booking.duration} часа
                          </p>
                          <p>
                            <strong>Гостей:</strong> {booking.guests}
                          </p>
                          <p>
                            <strong>Статус:</strong>
                            <span className={`status-badge ${booking.status}`}>
                              {booking.status === 'pending' && 'Ожидает'}
                              {booking.status === 'confirmed' && 'Подтверждена'}
                              {booking.status === 'cancelled' && 'Отменена'}
                            </span>
                          </p>
                          <p>
                            <strong>Создана:</strong> {new Date(booking.createdAt).toLocaleDateString('ru-RU')}
                          </p>
                          {booking.comments && (
                            <p>
                              <strong>Комментарий:</strong> {booking.comments}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="booking-actions">
                        {booking.status === 'pending' && (
                          <>
                            <button onClick={() => handleBookingAction(booking.id, 'confirm')} className="confirm-btn">
                              Подтвердить
                            </button>
                            <button onClick={() => handleBookingAction(booking.id, 'cancel')} className="cancel-btn">
                              Отменить
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button onClick={() => handleBookingAction(booking.id, 'cancel')} className="cancel-btn">
                            Отменить
                          </button>
                        )}
                        {booking.status === 'cancelled' && (
                          <button onClick={() => handleBookingAction(booking.id, 'confirm')} className="confirm-btn">
                            Восстановить
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && user.role === 'admin' && (
            <div className="users-management">
              <h3>Управление пользователями</h3>
              <div className="users-stats">
                <div className="user-stat">
                  <span className="stat-label">Всего пользователей:</span>
                  <span className="stat-value">{users.length}</span>
                </div>
                <div className="user-stat">
                  <span className="stat-label">Администраторов:</span>
                  <span className="stat-value">{users.filter((u) => u.role === 'admin').length}</span>
                </div>
                <div className="user-stat">
                  <span className="stat-label">Менеджеров:</span>
                  <span className="stat-value">{users.filter((u) => u.role === 'manager').length}</span>
                </div>
                <div className="user-stat">
                  <span className="stat-label">Клиентов:</span>
                  <span className="stat-value">{users.filter((u) => u.role === 'user').length}</span>
                </div>
              </div>

              <div className="users-list">
                {users.map((userItem) => (
                  <div key={userItem.id} className="user-item">
                    <div className="user-info">
                      <h4>{userItem.name}</h4>
                      <p>
                        <strong>Email:</strong> {userItem.email}
                      </p>
                      <p>
                        <strong>Дата регистрации:</strong> {userItem.registrationDate}
                      </p>
                      <p>
                        <strong>Текущая роль:</strong>
                        <span className={`role-badge ${userItem.role}`}>
                          {userItem.role === 'admin' && 'Администратор'}
                          {userItem.role === 'manager' && 'Менеджер'}
                          {userItem.role === 'user' && 'Пользователь'}
                        </span>
                      </p>
                    </div>
                    <div className="user-actions">
                      <select value={userItem.role} onChange={(e) => handleUserRoleChange(userItem.id, e.target.value)} className="role-select">
                        <option value="user">Пользователь</option>
                        <option value="manager">Менеджер</option>
                        <option value="admin">Администратор</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && user.role === 'admin' && (
            <div className="analytics">
              <h3>Аналитика и статистика</h3>

              <div className="analytics-cards">
                <div className="analytics-card">
                  <h4>Статистика отзывов</h4>
                  <div className="analytics-stats">
                    <div className="analytics-stat">
                      <span className="label">Всего отзывов:</span>
                      <span className="value">{stats.totalReviews}</span>
                    </div>
                    <div className="analytics-stat">
                      <span className="label">Одобрено:</span>
                      <span className="value approved">{stats.approvedReviews}</span>
                    </div>
                    <div className="analytics-stat">
                      <span className="label">На модерации:</span>
                      <span className="value pending">{stats.pendingReviews}</span>
                    </div>
                    <div className="analytics-stat">
                      <span className="label">Доля одобрений:</span>
                      <span className="value">
                        {stats.totalReviews > 0 ? Math.round((stats.approvedReviews / stats.totalReviews) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>Статистика броней</h4>
                  <div className="analytics-stats">
                    <div className="analytics-stat">
                      <span className="label">Всего заявок:</span>
                      <span className="value">{stats.totalBookings}</span>
                    </div>
                    <div className="analytics-stat">
                      <span className="label">Подтверждено:</span>
                      <span className="value confirmed">{stats.confirmedBookings}</span>
                    </div>
                    <div className="analytics-stat">
                      <span className="label">Ожидают:</span>
                      <span className="value pending">{stats.pendingBookings}</span>
                    </div>
                    <div className="analytics-stat">
                      <span className="label">Доля подтверждений:</span>
                      <span className="value">
                        {stats.totalBookings > 0 ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>Популярность залов</h4>
                  <div className="analytics-stats">
                    <div className="analytics-stat">
                      <span className="label">Natural Vibe:</span>
                      <span className="value">{bookings.filter((b) => b.hallName === 'Natural Vibe').length}</span>
                    </div>
                    <div className="analytics-stat">
                      <span className="label">Red wine:</span>
                      <span className="value">{bookings.filter((b) => b.hallName === 'Red wine').length}</span>
                    </div>
                    <div className="analytics-stat">
                      <span className="label">White room:</span>
                      <span className="value">{bookings.filter((b) => b.hallName === 'White room').length}</span>
                    </div>
                    <div className="analytics-stat">
                      <span className="label">Golden river:</span>
                      <span className="value">{bookings.filter((b) => b.hallName === 'Golden river').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

import React, { useState } from 'react';
import './Reviews.css';

const Reviews = ({ reviews, addReview, updateReview, deleteReview, user }) => {
  const [newReview, setNewReview] = useState({ text: '', rating: 5 });
  const [editingReview, setEditingReview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Чтобы оставить отзыв, авторизуйтесь.');
      return;
    }

    if (editingReview) {
      await updateReview(editingReview.id, {
        text: newReview.text,
        rating: newReview.rating
      });
      setEditingReview(null);
    } else {
      await addReview({
        ...newReview,
        author: user.name
      });
    }

    setNewReview({ text: '', rating: 5 });
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setNewReview({
      text: review.text,
      rating: review.rating
    });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setNewReview({ text: '', rating: 5 });
  };

  const handleDelete = (reviewId) => {
    if (window.confirm('Удалить отзыв?')) {
      deleteReview(reviewId);
    }
  };

  const userReviews = reviews.filter((review) => user && review.author === user.name);
  const approvedReviews = reviews.filter((review) => review.status === 'approved');

  return (
    <section id="reviews" className="reviews-section content-section">
      <div>
        <h3>Отзывы гостей</h3>

        {user && (
          <div className="add-review-form">
            <h4>{editingReview ? 'Редактировать отзыв' : 'Оставить отзыв'}</h4>
            <form onSubmit={handleSubmit}>
              <div className="rating">
                <label>Оценка:</label>
                <select value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value, 10) })}>
                  {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} ★
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                placeholder="Поделитесь впечатлениями, сервисом и атмосферой..."
                required
                rows="4"
              />
              <div className="form-actions">
                <button type="submit">{editingReview ? 'Сохранить' : 'Отправить'}</button>
                {editingReview && (
                  <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                    Отмена
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {user && userReviews.length > 0 && (
          <div className="my-reviews">
            <h4>Мои отзывы</h4>
            {userReviews.map((review) => (
              <div key={review.id} className="review-item my-review">
                <div className="review-header">
                  <strong>{review.author}</strong>
                  <span className="rating">{'★'.repeat(review.rating)}</span>
                  <span className="date">{review.date}</span>
                  <span className={`status-badge ${review.status}`}>
                    {review.status === 'pending' && 'На модерации'}
                    {review.status === 'approved' && 'Опубликован'}
                    {review.status === 'rejected' && 'Отклонён'}
                  </span>
                </div>
                <p>{review.text}</p>
                <div className="review-actions">
                  <button onClick={() => handleEdit(review)} className="edit-btn" disabled={review.status === 'approved'}>
                    Редактировать
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="delete-btn">
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="reviews-list">
          <h4>Опубликованные отзывы</h4>
          {approvedReviews.length === 0 ? (
            <p>Пока нет отзывов. Будьте первым!</p>
          ) : (
            approvedReviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <strong>{review.author}</strong>
                  <span className="rating">{'★'.repeat(review.rating)}</span>
                  <span className="date">{review.date}</span>
                </div>
                <p>{review.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;

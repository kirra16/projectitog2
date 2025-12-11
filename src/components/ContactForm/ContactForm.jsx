import React, { useState } from 'react';
import '../../styles/form.css';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: '25',
    agreement: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Заявка отправлена! Мы свяжемся с вами и уточним детали.');
    setFormData({ name: '', phone: '', guests: '25', agreement: false });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="form-section">
      <div className="form">
        <h3>Оставьте контакты и мы подберём зал под вашу дату и формат</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Имя:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ваше имя"
          />

          <label htmlFor="phone">Телефон:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+7 (___) ___-__-__"
          />

          <label htmlFor="guests">Количество гостей:</label>
          <select id="guests" name="guests" value={formData.guests} onChange={handleChange}>
            <option value="25">До 25</option>
            <option value="50">До 50</option>
            <option value="100">До 100</option>
            <option value="200">До 200</option>
          </select>

          <label className="checkbox">
            <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} required />
            Я согласен(-на) с условиями обработки данных
          </label>

          <button type="submit">Отправить заявку</button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;

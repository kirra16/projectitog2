import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import api from './api/client';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import AboutUs from './components/AboutUs/AboutUs';
import HallsCatalog from './components/HallsCatalog/HallsCatalog';
import BookingForm from './components/BookingForm/BookingForm';
import ContactForm from './components/ContactForm/ContactForm';
import Reviews from './components/Reviews/Reviews';
import Login from './components/AuthForm/Login';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import Footer from './components/Footer/Footer';
import Profile from './components/Profile/Profile';
import HallPage from './components/HallPage/HallPage';
import './styles/layout.css';

const ScrollToAnchor = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return null;
};

function App() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Данные залов
  const [halls] = useState([
    { 
      id: 1, 
      name: 'Natural Vibe', 
      capacity: 'до 25 человек', 
      price: '15 990 р.',
      description: 'Уютный зал в природных тонах, идеальный для небольших мероприятий',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop',
      features: ['Wi-Fi', 'Проектор', 'Фоновая музыка', 'Кондиционер'],
      images: [
        'https://img.freepik.com/free-photo/cozy-cafeteria-event-hall-with-white-furniture-imaeg_114579-2231.jpg',
        'https://img.freepik.com/free-photo/wedding-hall-with-white-wooden-furniture-interior_114579-2232.jpg',
        'https://img.freepik.com/premium-photo/decorated-with-flowers-served-various-dishware-dinner-table-ceramic-plates-wineglass-cup-fork-knife_179135-1723.jpg',
        'https://img.freepik.com/free-photo/view-table-arrangement-by-wedding-planner_23-2150167206.jpg'
      ],
      fullDescription: 'Зал "Natural Vibe" создан для уютных и камерных мероприятий. Природные тона, натуральные материалы и мягкое освещение создают атмосферу гармонии и спокойствия. Идеально подходит для семейных праздников, деловых встреч и небольших торжеств.',
      amenities: ['Столы и стулья', 'Посуда', 'Барная стойка', 'Кухонная зона']
    },
    { 
      id: 2, 
      name: 'Red wine', 
      capacity: 'до 50 человек', 
      price: '25 990 р.',
      description: 'Элегантный зал в бордовых тонах с винными акцентами',
      image: 'https://images.unsplash.com/photo-1519895609939-d2a64981c119?w=800&auto=format&fit=crop',
      features: ['Барная стойка', 'Джакузи', 'Караоке', 'Парковка'],
      images: [
        'https://img.freepik.com/free-photo/photorealistic-wedding-venue-with-intricate-decor-ornaments_23-2151481527.jpg',
        'https://img.freepik.com/free-photo/valentine-s-day-celebration-with-flowers_23-2151917786.jpg',
        'https://img.freepik.com/free-photo/valentine-s-day-arrangement-with-roses_23-2151914740.jpg',
        'https://img.freepik.com/premium-photo/wine-bottles-cellar_392895-456182.jpg'
      ],
      fullDescription: '"Red Wine" - это элегантный зал с богатой винтажной атмосферой. Бордовые стены, деревянная отделка и мягкое освещение создают идеальную атмосферу для вечерних мероприятий, дегустаций и романтических торжеств.',
      amenities: ['Винный шкаф', 'Курительная комната', 'Терраса', 'Бильярд']
    },
    { 
      id: 3, 
      name: 'White room', 
      capacity: 'до 100 человек', 
      price: '45 990 р.',
      description: 'Просторный светлый зал для крупных торжеств',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop',
      features: ['Сцена', 'Танцпол', '2 бара', 'Гардероб'],
      images: [
        'https://img.freepik.com/free-photo/decorated-hall-wedding-is-ready-celebration_8353-10236.jpg',
        'https://img.freepik.com/free-photo/decorated-hall-event_8353-10238.jpg',
        'https://img.freepik.com/premium-psd/green-event-table-arrangement-mockup_23-2151855697.jpg',
        'https://img.freepik.com/free-photo/served-white-round-table-with-floral-centerpiece-restaurant_8353-10237.jpg'
      ],
      fullDescription: 'Просторный и светлый зал "White Room" идеально подходит для крупных мероприятий. Минималистичный дизайн, высокие потолки и панорамные окна создают ощущение простора и свободы. Отличный выбор для свадеб, корпоративов и конференций.',
      amenities: ['Сцена', 'Звуковая система', 'Световое оборудование', 'Кейтеринг']
    },
    { 
      id: 4, 
      name: 'Golden river', 
      capacity: 'до 200 человек', 
      price: '95 990 р.',
      description: 'Роскошный зал с золотыми акцентами для VIP-мероприятий',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
      features: ['VIP зона', 'Лифт', '3 бара', 'Охраняемая парковка'],
      images: [
        'https://img.freepik.com/free-photo/gorgeous-italian-hall-with-paintings-wall_8353-656.jpg',
        'https://img.freepik.com/premium-photo/interior-catherine-palace-tsarskoye-selo_777542-1016.jpg',
        'https://img.freepik.com/premium-photo/drinks-cloth-ceremony-inside-arrangement_1304-2209.jpg',
        'https://img.freepik.com/free-photo/wide-view-dining-hall-classic-design_114579-2224.jpg'
      ],
      fullDescription: '"Golden River" - это роскошный VIP-зал для самых важных событий. Золотые акценты, мраморные полы, хрустальные люстры и индивидуальный сервис создают неповторимую атмосферу роскоши и престижа. Идеален для свадеб класса люкс, гала-ужинов и международных конференций.',
      amenities: ['Звуковая система', 'Световое оборудование', 'Кейтеринг', 'VIP конференц-зал']
    }
  ]);

  // Загрузка пользователя из localStorage при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Загрузка данных с сервера
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [reviewsRes, bookingsRes, usersRes] = await Promise.all([
          api.get('/api/reviews'),
          api.get('/api/bookings'),
          api.get('/api/users').catch(() => ({ data: [] }))
        ]);
        setReviews(reviewsRes.data || []);
        setBookings(bookingsRes.data || []);
        setUsers(usersRes.data || []);
      } catch (error) {
        console.error('Ошибка загрузки данных', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitial();
  }, []);

  // Функции для работы с отзывами
  const addReview = async (newReview) => {
    try {
      const { data } = await api.post('/api/reviews', newReview);
      setReviews((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (error) {
      console.error('Ошибка добавления отзыва:', error);
      return { success: false, error };
    }
  };

  const updateReview = async (reviewId, updatedData) => {
    try {
      const { data } = await api.put(`/api/reviews/${reviewId}`, updatedData);
      setReviews((prev) => prev.map((review) => (review.id === reviewId ? data : review)));
      return { success: true, data };
    } catch (error) {
      console.error('Ошибка обновления отзыва:', error);
      return { success: false, error };
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await api.delete(`/api/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      return { success: true };
    } catch (error) {
      console.error('Ошибка удаления отзыва:', error);
      return { success: false, error };
    }
  };

  // Функции для работы с бронированиями
  const addBooking = async (newBooking) => {
    try {
      const { data } = await api.post('/api/bookings', newBooking);
      setBookings((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (error) {
      console.error('Ошибка добавления бронирования:', error);
      return { success: false, error };
    }
  };

  const updateBooking = async (bookingId, updatedData) => {
    try {
      const { data } = await api.patch(`/api/bookings/${bookingId}/status`, { status: updatedData.status });
      setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? data : booking)));
      return { success: true, data };
    } catch (error) {
      console.error('Ошибка обновления бронирования:', error);
      return { success: false, error };
    }
  };

  // Функции для работы с пользователями
  const handleRegister = async (newUser) => {
    try {
      const { data } = await api.post('/api/register', newUser);
      setUsers((prevUsers) => [...prevUsers, data]);
      const token = `mock-jwt-token-${Date.now()}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return { success: true, data };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error };
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const { data } = await api.post('/api/login', credentials);
      const token = `mock-jwt-token-${Date.now()}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Функция для получения данных зала по ID
  const getHallById = (id) => {
    return halls.find(hall => hall.id === parseInt(id));
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header user={user} onLogout={handleLogout} />
        <ScrollToAnchor />

        <Routes>
          {/* Главная страница */}
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <AboutUs />
                <HallsCatalog halls={halls} />
                <BookingForm halls={halls} addBooking={addBooking} user={user} />
                <ContactForm />
                <Reviews 
                  reviews={reviews} 
                  addReview={addReview} 
                  updateReview={updateReview} 
                  deleteReview={deleteReview} 
                  user={user} 
                />
              </>
            }
          />

          {/* Страница входа/регистрации */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Login
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                  users={users}
                />
              )
            }
          />

          {/* Страница профиля */}
          <Route
            path="/profile"
            element={
              user ? (
                <Profile user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Страница детального просмотра зала */}
          <Route
            path="/hall/:id"
            element={
              <HallPage 
                getHallById={getHallById} 
                user={user} 
                addBooking={addBooking} 
                halls={halls}
              />
            }
          />

          {/* Админ-панель */}
          <Route
            path="/admin"
            element={
              user && (user.role === 'admin' || user.role === 'manager') ? (
                <AdminPanel 
                  user={user} 
                  reviews={reviews} 
                  bookings={bookings} 
                  updateReview={updateReview} 
                  updateBooking={updateBooking} 
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Резервный маршрут для несуществующих страниц */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
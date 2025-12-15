import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import api from './api/client';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import AboutUs from './components/AboutUs/AboutUs';
import HallsTable from './components/HallsTable/HallsTable';
import BookingForm from './components/BookingForm/BookingForm';
import ContactForm from './components/ContactForm/ContactForm';
import Reviews from './components/Reviews/Reviews';
import Login from './components/AuthForm/Login';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import Footer from './components/Footer/Footer';
import './styles/layout.css';
import Profile from './components/Profile/Profile';

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

  const [halls] = useState([
    { id: 1, name: 'Natural Vibe', capacity: 'до 25 человек', price: '15 990 р.' },
    { id: 2, name: 'Red wine', capacity: 'до 50 человек', price: '25 990 р.' },
    { id: 3, name: 'White room', capacity: 'до 100 человек', price: '45 990 р.' },
    { id: 4, name: 'Golden river', capacity: 'до 200 человек', price: '95 990 р.' }
  ]);

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

  const addReview = async (newReview) => {
    const { data } = await api.post('/api/reviews', newReview);
    setReviews((prev) => [data, ...prev]);
  };

  const updateReview = async (reviewId, updatedData) => {
    const { data } = await api.put(`/api/reviews/${reviewId}`, updatedData);
    setReviews((prev) => prev.map((review) => (review.id === reviewId ? data : review)));
  };

  const deleteReview = async (reviewId) => {
    await api.delete(`/api/reviews/${reviewId}`);
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
  };

  const addBooking = async (newBooking) => {
    const { data } = await api.post('/api/bookings', newBooking);
    setBookings((prev) => [data, ...prev]);
  };

  const updateBooking = async (bookingId, updatedData) => {
    const { data } = await api.patch(`/api/bookings/${bookingId}/status`, { status: updatedData.status });
    setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? data : booking)));
  };

  const handleRegister = async (newUser) => {
    const { data } = await api.post('/api/register', newUser);
    setUsers((prevUsers) => [...prevUsers, data]);
    const token = `mock-jwt-token-${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Header user={user} setUser={setUser} />
        <ScrollToAnchor />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <AboutUs />
                <HallsTable halls={halls} />
                <BookingForm halls={halls} addBooking={addBooking} user={user} />
                <ContactForm />
                <Reviews reviews={reviews} addReview={addReview} updateReview={updateReview} deleteReview={deleteReview} user={user} />
              </>
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Login
                  setUser={setUser}
                  users={users}
                  onRegister={handleRegister}
                />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user && (user.role === 'admin' || user.role === 'manager') ? (
                <AdminPanel user={user} reviews={reviews} bookings={bookings} updateReview={updateReview} updateBooking={updateBooking} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
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
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

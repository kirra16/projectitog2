import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutUs from './components/AboutUs';
import HallsTable from './components/HallsTable';
import BookingForm from './components/BookingForm';
import ContactForm from './components/ContactForm';
import Reviews from './components/Reviews';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import './App.css';

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

const DEMO_USERS = [
  { id: 1, email: 'admin@banquet.ru', password: 'admin123', name: 'Администратор', role: 'admin' },
  { id: 2, email: 'manager@banquet.ru', password: 'manager123', name: 'Менеджер', role: 'manager' },
  { id: 3, email: 'user@mail.ru', password: 'user123', name: 'Иван Иванов', role: 'user' }
];

function App() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [users, setUsers] = useState(() => {
    try {
      const savedUsers = localStorage.getItem('banquetUsers');
      if (savedUsers) {
        return JSON.parse(savedUsers);
      }
    } catch (error) {
      console.error('Error loading users from localStorage:', error);
    }
    return DEMO_USERS;
  });
  
  const [halls, setHalls] = useState([
    { id: 1, name: 'Natural Vibe', capacity: 'до 25 человек', price: '15 990 р.' },
    { id: 2, name: 'Red wine', capacity: 'до 50 человек', price: '25 990 р.' },
    { id: 3, name: 'White room', capacity: 'до 100 человек', price: '45 990 р.' },
    { id: 4, name: 'Golden river', capacity: 'до 200 человек', price: '95 990 р.' }
  ]);

  useEffect(() => {
    try {
      localStorage.setItem('banquetUsers', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  }, [users]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const addReview = (newReview) => {
    const reviewWithId = { 
      ...newReview, 
      id: Date.now(),
      status: 'pending'
    };
    setReviews([...reviews, reviewWithId]);
  };

  const updateReview = (reviewId, updatedData) => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, ...updatedData } : review
    ));
  };

  const deleteReview = (reviewId) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
  };

  const addBooking = (newBooking) => {
    const bookingWithId = {
      ...newBooking,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setBookings([...bookings, bookingWithId]);
  };

  const updateBooking = (bookingId, updatedData) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, ...updatedData } : booking
    ));
  };

  const handleRegister = (newUser) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
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
          <Route path="/" element={
            <>
              <HeroSection />
              <AboutUs />
              <HallsTable halls={halls} />
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
          } />
          <Route path="/login" element={
            user ? <Navigate to="/" /> : 
            <Login 
              setUser={setUser} 
              users={users} 
              onRegister={handleRegister}
            />
          } />
          <Route path="/admin" element={
            user && (user.role === 'admin' || user.role === 'manager') ? 
            <AdminPanel 
              user={user}
              reviews={reviews}
              bookings={bookings}
              updateReview={updateReview}
              updateBooking={updateBooking}
            /> : 
            <Navigate to="/login" />
          } />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
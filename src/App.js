import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

import BookingPage from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectRouter';
import { AuthProvider } from './components/Authentication';
import MyBookingsPage from './pages/MyBooking';
import UserProfile from './components/profile';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<BookingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
             <UserProfile/>
            </ProtectedRoute>
          } 
        />
        <Route
          path="/bookings/:userId"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}



export default App;

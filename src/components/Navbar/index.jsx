import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Navbar.css';
import { useParams } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Check if user is logged in using cookies
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Remove cookies
    Cookies.remove('token');
    Cookies.remove('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Bus Ticket Booking
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search">
                Search Buses
              </Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/bookings/:userId">
                  My Bookings
                </Link>
              </li>
            )}
            <div className="nav-auth">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="nav-link login-btn">
                    Login
                  </Link>
                  <Link to="/register" className="nav-link register-btn">
                    Register
                  </Link>
                </>
              ) : (
                <div className="user-menu">
                  <div className="user-info">
                    <span>Welcome, {user?.fullName}</span>
                    <div className="dropdown-menu">
                      <Link to="/profile" className="dropdown-item">
                        My Profile
                      </Link>
                      <button onClick={handleLogout} className="dropdown-item logout-btn">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

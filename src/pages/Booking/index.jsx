import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingPage.css';

const BookingPage = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: ''
  });
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Fetch available buses based on search criteria
  const searchBuses = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:5000/api/buses/search', {
        params: searchData
      });
      setBuses(response.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  // Handle seat selection
  const handleSeatSelect = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      if (selectedSeats.length < 4) { // Maximum 4 seats per booking
        setSelectedSeats([...selectedSeats, seatNumber]);
      }
    }
  };

  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/bookings', {
        busId: selectedBus.id,
        seats: selectedSeats,
        totalAmount: selectedBus.price * selectedSeats.length,
        ...userDetails
      });
      
      alert('Booking successful! Booking ID: ' + response.data.bookingId);
      // Reset form
      setSelectedBus(null);
      setSelectedSeats([]);
      setUserDetails({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    }
  };

  return (
    <div className="booking-container">
      {/* Search Form */}
      <div className="search-section">
        <h2>Search Buses</h2>
        <form onSubmit={searchBuses}>
          <div className="form-group">
            <input
              type="text"
              placeholder="From"
              value={searchData.from}
              onChange={(e) => setSearchData({...searchData, from: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="To"
              value={searchData.to}
              onChange={(e) => setSearchData({...searchData, to: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="date"
              value={searchData.date}
              onChange={(e) => setSearchData({...searchData, date: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      {/* Bus List */}
      {buses.length > 0 && (
        <div className="bus-list">
          <h3>Available Buses</h3>
          {buses.map(bus => (
            <div 
              key={bus.id} 
              className={`bus-card ${selectedBus?.id === bus.id ? 'selected' : ''}`}
              onClick={() => setSelectedBus(bus)}
            >
              <h4>{bus.name}</h4>
              <p>From: {bus.from_location} - To: {bus.to_location}</p>
              <p>Departure: {new Date(bus.departure_time).toLocaleString()}</p>
              <p>Price: ${bus.price}</p>
              <p>Available Seats: {bus.available_seats}</p>
            </div>
          ))}
        </div>
      )}

      {/* Seat Selection */}
      {selectedBus && (
        <div className="seat-selection">
          <h3>Select Seats</h3>
          <div className="seat-grid">
            {[...Array(selectedBus.total_seats)].map((_, index) => (
              <div
                key={index}
                className={`seat ${selectedSeats.includes(index + 1) ? 'selected' : ''}`}
                onClick={() => handleSeatSelect(index + 1)}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Form */}
      {selectedSeats.length > 0 && (
        <div className="booking-form">
          <h3>Passenger Details</h3>
          <form onSubmit={handleBookingSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={userDetails.name}
                onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={userDetails.email}
                onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                placeholder="Phone Number"
                value={userDetails.phone}
                onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
                required
              />
            </div>
            <div className="booking-summary">
              <p>Selected Seats: {selectedSeats.join(', ')}</p>
              <p>Total Amount: ${selectedBus.price * selectedSeats.length}</p>
            </div>
            <button type="submit" className="book-btn">Confirm Booking</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookingPage;

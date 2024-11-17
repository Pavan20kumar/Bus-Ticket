import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyBookings.css';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/my-bookings');
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.post(`http://localhost:5000/api/cancel-booking/${bookingId}`);
        alert('Booking cancelled successfully');
        fetchMyBookings(); // Refresh the bookings list
      } catch (error) {
        alert('Failed to cancel booking');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="my-bookings">
      <h2>My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>No bookings found</p>
        </div>
      ) : (
        <div className="bookings-container">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <span className="booking-id">Booking #{booking.id}</span>
                <span className={`booking-status ${booking.status.toLowerCase()}`}></span>
                  {booking.status}
                
              </div>
              
              <div className="booking-info">
                <div className="journey-details">
                  <p><strong>From:</strong> {booking.from_location}</p>
                  <p><strong>To:</strong> {booking.to_location}</p>
                  <p><strong>Date:</strong> {new Date(booking.departure_time).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {new Date(booking.departure_time).toLocaleTimeString()}</p>
                </div>
                
                <div className="booking-details">
                  <p><strong>Seats:</strong> {booking.seats}</p>
                  <p><strong>Amount:</strong> ₹{booking.total_amount}</p>
                  <p><strong>Booked On:</strong> {new Date(booking.booking_date).toLocaleDateString()}</p>
                </div>
              </div>

              {booking.status === 'CONFIRMED' && (
                <div className="booking-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </button>
                  <button className="download-btn" onClick={handlePrint}>
                    Download Ticket
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;

import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="video-background">
      <video autoPlay loop muted className="video-element">
        <source 
          src="https://res.cloudinary.com/dz8j1ucem/video/upload/v1731512356/fuaimqoefwnuhqhldnzn.mp4" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay">
        <div className="content">
          <h1>Welcome to Bus Ticket Booking</h1>
          <p>Travel with comfort and safety</p>
          <Link to='/search'>
          <button className="cta-button">Book Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

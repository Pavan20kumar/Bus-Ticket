import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';
import cookies from 'js-cookie';

const UserProfile = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    profileImage: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = cookies.get('token');
      const response = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user profile');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prevUser => ({
          ...prevUser,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = cookies.get('token');
      await axios.put(
        'http://localhost:5000/api/user/profile/update',
        user,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image-container">
           
           
          </div>
          <h2>{user.full_name}</h2>
          <p className="user-email">{user.email}</p>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={user.full_name}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={user.address}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="button-group">
            {!isEditing ? (
              <button
                type="button"
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;

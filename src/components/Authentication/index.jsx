import React, { createContext, useState, useContext, useEffect } from 'react';
import cookies from 'js-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status on mount
    const token = cookies.get('tokens');
    const userData = cookies.get('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (userData, token) => {
    cookies.set('tokens', token, { expires: 7 });
    cookies.set('user', JSON.stringify(userData), { expires: 7 });
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    cookies.remove('tokens');
    cookies.remove('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('urban-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('urban-token');
    if (token && token !== 'mock-token') {
      API.get('/auth/me')
        .then(({ data }) => {
          setUser(data.user);
          localStorage.setItem('urban-user', JSON.stringify(data.user));
        })
        .catch(() => {
          localStorage.removeItem('urban-token');
          localStorage.removeItem('urban-user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else if (token === 'mock-token') {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('urban-token', data.token);
      localStorage.setItem('urban-user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      if (!err.response) {
        return {
          success: false,
          error: 'Backend server not running. Start it: cd backend && npm start',
        };
      }
      return {
        success: false,
        error: err.response?.data?.message || 'Login failed',
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await API.post('/auth/signup', { name, email, password });
      localStorage.setItem('urban-token', data.token);
      localStorage.setItem('urban-user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      if (!err.response) {
        return {
          success: false,
          error: 'Backend server not running. Start it: cd backend && npm start',
        };
      }
      return {
        success: false,
        error: err.response?.data?.message || 'Signup failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('urban-token');
    localStorage.removeItem('urban-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

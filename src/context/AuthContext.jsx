import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [username, setUsername] = useState(() => localStorage.getItem('admin_username'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_username', username || '');
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_username');
      setIsAuthenticated(false);
    }
  }, [token, username]);

  const login = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

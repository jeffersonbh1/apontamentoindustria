import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem('currentUser');
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    if (storedUser && sessionExpiry) {
      const now = new Date().getTime();
      const expiry = parseInt(sessionExpiry);
      
      if (now < expiry) {
        setUser(JSON.parse(storedUser));
      } else {
        // Session expired
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionExpiry');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check credentials against mock data
    const foundUser = mockUsers.find(u => 
      (u.username === username || u.email === username) && password === 'password123'
    );
    
    if (foundUser) {
      const updatedUser = { ...foundUser, lastLogin: new Date() };
      setUser(updatedUser);
      
      // Set session expiry (24 hours)
      const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      localStorage.setItem('sessionExpiry', expiryTime.toString());
      
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionExpiry');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if email exists
    const userExists = mockUsers.some(u => u.email === email);
    return userExists;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    resetPassword,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
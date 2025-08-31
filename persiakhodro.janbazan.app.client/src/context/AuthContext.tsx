import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (nationalCode: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('AuthProvider is rendering...');
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = authService.isAuthenticated() && user !== null;

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/profile/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      authService.logout();
      setUser(null);
    }
  };

  const login = async (nationalCode: string, password: string) => {
    try {
      const response = await authService.login({ nationalCode, password });
      
      if (response.isSuccess) {
        await fetchUserProfile();
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'خطا در ورود به سیستم' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    if (authService.isAuthenticated()) {
      await fetchUserProfile();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing auth...');
      setIsLoading(true);
      if (authService.isAuthenticated()) {
        try {
          await fetchUserProfile();
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          authService.logout();
          setUser(null);
        }
      }
      setIsLoading(false);
      console.log('Auth initialization complete');
    };

    initAuth();
  }, []);

  console.log('AuthProvider state:', { user, isAuthenticated, isLoading });
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from './api';

export const useAuth = (redirectTo = '/auth/phone-verification') => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { accessToken } = api.getTokens();
    
    if (!accessToken) {
      setIsLoading(false);
      router.replace(redirectTo);
      return;
    }

    try {
      const response = await api.get('/api/auth/users/me');
      
      if (response.status === 401) {
        api.clearTokens();
        router.replace(redirectTo);
        return;
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setUser(data.data);
        setIsAuthenticated(true);
      } else {
        api.clearTokens();
        router.replace(redirectTo);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      api.clearTokens();
      router.replace(redirectTo);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/users/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      api.clearTokens();
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('currentPhone');
      localStorage.removeItem('currentOTP');
      localStorage.removeItem('otpAttempts');
      localStorage.removeItem('users');
      localStorage.removeItem('registerHasPin');
      router.push('/');
    }
  };

  return { isAuthenticated, isLoading, user, logout, checkAuth };
};

export const checkTokenValidity = async () => {
  const { accessToken } = api.getTokens();
  
  if (!accessToken) {
    return { valid: false, reason: 'no_token' };
  }

  try {
    const response = await api.get('/api/auth/users/me');
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return { valid: true, user: data.data };
      }
    }
    
    return { valid: false, reason: 'invalid_token' };
  } catch (error) {
    return { valid: false, reason: 'error', error };
  }
};

'use client';

import { create } from 'zustand';
import apiClient from '@/lib/apiClient.js';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,

  
  init: async () => {
    try {
      const res = await apiClient.get("/user/profile", {}, {withCredentials:true});
      
      if (res?.user) {
        set({ user: res.user, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (err) {
      set({ user: null, isAuthenticated: false });
    }
  },


  
  register: async ({ user }) => {
    set({ user, isAuthenticated: true });
  },

  
  login: async ({ user }) => {
    set({ user, isAuthenticated: true });
  },

  
  logout: async () => {
    try {
      await apiClient.post('/api/auth/logout', {}, {withCredentials:true});
    } catch (err) {
      console.log('Logout error:', err);
    }

    // Remove token from axios header (if used)
    delete apiClient.defaults.headers.common['Authorization'];

    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;

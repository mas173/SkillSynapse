import { create } from "zustand";
import axiosInstance from "../services/axios/axios";

const useAuthStore = create((set) => ({
  user: null,
  isOnboarded: false,
  isAuthenticated: false,
  loading: true,

  // Called on app mount to restore session from httpOnly cookie
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get("/auth/me");

      if (res.data.success && res.data.user) {
        set({
          user: res.data.user,
          isOnboarded: res.data.user.isOnboarded || false,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isOnboarded: false,
          loading: false,
        });
      }
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isOnboarded: false,
        loading: false,
      });
    }
  },

  // Called after successful login/signup
  setUser: (user) => {
    set({
      user,
      isOnboarded: user?.isOnboarded || false,
      isAuthenticated: true,
      loading: false,
    });
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Ignore errors — still clear local state
    }
    set({
      user: null,
      isAuthenticated: false,
      isOnboarded: false,
      loading: false,
    });
  },
}));

export default useAuthStore;


import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: (email, password) => {
    if (!email.trim() || !password.trim()) {
      return false;
    }

    set({
      user: {
        email: email.trim(),
        name: email.trim().split("@")[0],
      },
      isAuthenticated: true,
    });

    return true;
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));

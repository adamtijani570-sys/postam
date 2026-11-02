
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,

  login: async (phoneNumber, password) => {
    try {
      set({ loading: true });

      const response = await fetch(
        "https://api.getpostam.com/api/v1/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber.trim(),
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        set({ loading: false });

        return {
          success: false,
          message: result.message || "Invalid login credentials.",
        };
      }

      const user = result.data;

      if (user.role !== "admin") {
        set({ loading: false });

        return {
          success: false,
          message: "You are not authorized to access this dashboard.",
        };
      }

      if (!user.token) {
        set({ loading: false });

        return {
          success: false,
          message: "Authentication token was not returned.",
        };
      }

      set({
        user,
        token: user.token,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true };

    } catch (error) {
      set({ loading: false });

      return {
        success: false,
        message: "Unable to connect to the server. Please try again.",
      };
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  },
}));

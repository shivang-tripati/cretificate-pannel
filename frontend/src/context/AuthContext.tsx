import React, { createContext, useState, useEffect } from "react";
import { login, logout, register } from "../services/api";
import { User } from "user";
import axios from "axios";

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: (device: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const loginHandler = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      console.log(response.data);
      const userData = response.data.user;
      const user = {
        id: userData._id,
        email: userData.email,
        role: userData.role,
      };
      setUser(user);
      setIsAuthenticated(true);
      // localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Login failed:", error.response.data);
        // Handle error (e.g., show error message to user)
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const registerHandler = async (email: string, password: string) => {
    try {
      const response = await register(email, password);
      if (response) {
        const userData = response.data.user;
        setUser({
          id: userData._id,
          email: userData.email,
          role: userData.role,
        });
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Registration failed:", error.response.data);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const logoutHandler = async (device: string) => {
    try {
      await logout(device);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user || isAuthenticated,
        loading: !user,
        login: loginHandler,
        logout: logoutHandler,
        register: registerHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

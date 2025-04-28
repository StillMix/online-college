// src/api/authApi.ts
import axios from "axios";
import apiClient from "./config";
import { UserData } from "@/types";

const API_URL = "/api/auth";

/**
 * Авторизация пользователя
 */
export const login = async (
  login: string,
  password: string
): Promise<{ access_token: string; token_type: string }> => {
  try {
    // Используем URLSearchParams для формата form-data, который ожидает FastAPI
    const formData = new URLSearchParams();
    formData.append("username", login); // FastAPI ожидает username
    formData.append("password", password);

    const response = await axios.post(
      `${apiClient.defaults.baseURL}${API_URL}/token`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Сохраняем токен в localStorage
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }

    return response.data;
  } catch (error) {
    console.error("Ошибка при авторизации:", error);
    throw error;
  }
};

/**
 * Получение информации о текущем пользователе
 */
export const getCurrentUser = async (): Promise<UserData> => {
  try {
    localStorage.removeItem("user");
    const response = await apiClient.get(`${API_URL}/me`);
    localStorage.setItem("user", JSON.stringify(response.data));
    if (response.data.role === "admin") {
      localStorage.setItem("isAdmin", "true");
    } else {
      localStorage.removeItem("isAdmin");
    }
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
    throw error;
  }
};

/**
 * Регистрация нового пользователя
 */
export const register = async (userData: {
  login: string;
  email: string;
  password: string;
}): Promise<UserData> => {
  try {
    const response = await apiClient.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    throw error;
  }
};

/**
 * Выход пользователя (удаление токена)
 */
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("isAdmin");
};

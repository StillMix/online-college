// src/api/config.ts
import axios from "axios";

// Конфигурация базового URL
export const API_BASE_URL =
  process.env.VUE_APP_API_URL ||
  "https://stillmix-online-college-fastapi-e9c2.twc1.net/";

// Настройка глобального экземпляра axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Интерцептор для добавления токена авторизации
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка ошибок аутентификации
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      window.location.href = "/signin";
    }

    // Логирование ошибок
    console.error("API Error:", error);

    return Promise.reject(error);
  }
);

export default apiClient;

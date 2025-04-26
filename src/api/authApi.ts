// src/api/authApi.ts
import axios from "axios";
import { API_BASE_URL } from "./index";

interface LoginCredentials {
  login: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  login: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    login: string;
    email: string;
    avatar: string | null;
    isAdmin: boolean;
  };
}

const API_URL = `${API_BASE_URL}/api/auth`;

/**
 * Вход пользователя
 * Примечание: в текущей реализации без реального бэкенда используется имитация
 */
export const login = async (credentials: LoginCredentials): Promise<void> => {
  try {
    // В реальном приложении здесь был бы запрос к API
    // const response = await axios.post(`${API_URL}/login`, credentials);

    // Имитация успешного входа
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Сохраняем токен в localStorage
    localStorage.setItem("token", "вошли");

    return Promise.resolve();
  } catch (error) {
    console.error("Ошибка при входе:", error);
    throw error;
  }
};

/**
 * Регистрация пользователя
 * Примечание: в текущей реализации без реального бэкенда используется имитация
 */
export const register = async (
  credentials: RegisterCredentials
): Promise<void> => {
  try {
    // Проверяем совпадение паролей
    if (credentials.password !== credentials.passwordConfirm) {
      throw new Error("Пароли не совпадают");
    }

    // В реальном приложении здесь был бы запрос к API
    // const response = await axios.post(`${API_URL}/register`, credentials);

    // Имитация успешной регистрации
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // На данном этапе не сохраняем токен, ожидаем подтверждения email

    return Promise.resolve();
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    throw error;
  }
};

/**
 * Подтверждение почты при регистрации
 */
export const confirmEmail = async (code: string): Promise<void> => {
  try {
    // В реальном приложении здесь был бы запрос к API
    // const response = await axios.post(`${API_URL}/confirm-email`, { code });

    // Имитация подтверждения почты
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return Promise.resolve();
  } catch (error) {
    console.error("Ошибка при подтверждении почты:", error);
    throw error;
  }
};

/**
 * Завершение регистрации и создание аккаунта
 */
export const completeRegistration = async (userData: {
  name: string;
  code: string;
  avatar?: File;
}): Promise<void> => {
  try {
    // В реальном приложении здесь был бы запрос к API
    // const formData = new FormData();
    // formData.append('name', userData.name);
    // formData.append('code', userData.code);
    // if (userData.avatar) {
    //   formData.append('avatar', userData.avatar);
    // }

    // const response = await axios.post(`${API_URL}/complete-registration`, formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });

    // Имитация успешного завершения регистрации
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Сохраняем токен в localStorage
    localStorage.setItem("token", "вошли");

    return Promise.resolve();
  } catch (error) {
    console.error("Ошибка при завершении регистрации:", error);
    throw error;
  }
};

/**
 * Выход из аккаунта
 */
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("isAdmin");
};

/**
 * Проверка статуса аутентификации
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

/**
 * Проверка, является ли пользователь администратором
 */
export const isAdmin = (): boolean => {
  return localStorage.getItem("isAdmin") === "true";
};

/**
 * Назначить администратора (для тестирования)
 */
export const setAdmin = (value: boolean): void => {
  localStorage.setItem("isAdmin", value ? "true" : "false");
};

// src/api/userApi.ts
import axios from "axios";
import { API_BASE_URL } from "./index";
import { User, UserData } from "@/types";

const API_URL = `${API_BASE_URL}/api/users`;

/**
 * Получить список всех пользователей
 * Примечание: в текущей реализации без реального бэкенда используется localStorage
 */
export const getAllUsers = (): User[] => {
  try {
    // Проверяем, есть ли пользователи в localStorage
    const usersData = localStorage.getItem("userData");

    if (usersData) {
      return JSON.parse(usersData);
    }

    // Если пользователей нет, возвращаем тестовые данные
    const testUsers = createTestUsers();
    localStorage.setItem("userData", JSON.stringify(testUsers));

    return testUsers;
  } catch (error) {
    console.error("Ошибка при получении списка пользователей:", error);
    return [];
  }
};

/**
 * Создать нового пользователя
 */
export const createUser = (userData: Partial<User>): User => {
  try {
    const users = getAllUsers();

    // Генерируем новый ID
    const newId = (
      Math.max(0, ...users.map((u) => parseInt(u.id))) + 1
    ).toString();

    // Создаем нового пользователя
    const newUser: User = {
      id: newId,
      name: userData.name || "",
      login: userData.login || "",
      email: userData.email || "",
      password: userData.password || "",
      avatar: userData.avatar || null,
      isAdmin: userData.isAdmin || false,
      createdAt: new Date().toISOString(),
    };

    // Добавляем пользователя в список
    users.push(newUser);

    // Сохраняем в localStorage
    localStorage.setItem("userData", JSON.stringify(users));

    return newUser;
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    throw error;
  }
};

/**
 * Обновить пользователя
 */
export const updateUser = (
  userId: string,
  userData: Partial<User>
): User | null => {
  try {
    const users = getAllUsers();

    // Ищем пользователя для обновления
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      console.error(`Пользователь с ID ${userId} не найден`);
      return null;
    }

    // Обновляем данные пользователя
    const updatedUser = {
      ...users[index],
      ...userData,
    };

    users[index] = updatedUser;

    // Сохраняем в localStorage
    localStorage.setItem("userData", JSON.stringify(users));

    return updatedUser;
  } catch (error) {
    console.error(`Ошибка при обновлении пользователя с ID ${userId}:`, error);
    return null;
  }
};

/**
 * Удалить пользователя
 */
export const deleteUser = (userId: string): boolean => {
  try {
    const users = getAllUsers();

    // Ищем пользователя для удаления
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      console.error(`Пользователь с ID ${userId} не найден`);
      return false;
    }

    // Удаляем пользователя
    users.splice(index, 1);

    // Сохраняем в localStorage
    localStorage.setItem("userData", JSON.stringify(users));

    return true;
  } catch (error) {
    console.error(`Ошибка при удалении пользователя с ID ${userId}:`, error);
    return false;
  }
};

/**
 * Назначить пользователя администратором
 */
export const makeAdmin = (userId: string): User | null => {
  return updateUser(userId, { isAdmin: true });
};

/**
 * Снять права администратора
 */
export const removeAdmin = (userId: string): User | null => {
  return updateUser(userId, { isAdmin: false });
};

/**
 * Обновить настройки пользователя
 */
export const updateUserSettings = (userData: UserData): Promise<UserData> => {
  return new Promise((resolve, reject) => {
    try {
      // Имитация задержки при сохранении
      setTimeout(() => {
        resolve({
          ...userData,
          currentPassword: "", // Сбрасываем поля паролей
          newPassword: "",
          confirmPassword: "",
        });
      }, 1500);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Поиск пользователей
 */
export const searchUsers = (query: string, userType = "all"): User[] => {
  try {
    let users = getAllUsers();

    // Фильтрация по типу пользователя
    if (userType === "admin") {
      users = users.filter((user) => user.isAdmin);
    } else if (userType === "user") {
      users = users.filter((user) => !user.isAdmin);
    }

    // Фильтрация по запросу поиска
    if (query.trim()) {
      const lowerQuery = query.toLowerCase().trim();
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerQuery) ||
          user.login.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery)
      );
    }

    return users;
  } catch (error) {
    console.error("Ошибка при поиске пользователей:", error);
    return [];
  }
};

/**
 * Создание тестовых пользователей
 */
const createTestUsers = (): User[] => {
  return [
    {
      id: "1",
      name: "Администратор Системы",
      login: "admin",
      email: "admin@example.com",
      password: "admin123",
      avatar: null,
      isAdmin: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Иван Петров",
      login: "ivanpetrov",
      email: "ivan@example.com",
      password: "password123",
      avatar: null,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Мария Иванова",
      login: "mariaivanova",
      email: "maria@example.com",
      password: "password123",
      avatar: null,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    },
  ];
};

/**
 * Получить инициалы пользователя
 */
export const getUserInitials = (user: User | UserData): string => {
  if (!user || !user.name) return "";

  const parts = user.name.split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return parts[0].slice(0, 2).toUpperCase();
};

import axios from "axios";
import { UserData } from "@/types";

/**
 * Создание нового пользователя
 */
export const createUser = async (
  userData: Partial<UserData>
): Promise<UserData> => {
  try {
    const response = await axios.post(
      "https://stillmix-online-college-fastapi-e9c2.twc1.net/api/users/",
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    throw error;
  }
};

/**
 * Подтверждение email пользователя
 */
export const sendVerificationCode = async (email: string): Promise<any> => {
  try {
    const response = await axios.post(
      `https://stillmix-online-college-fastapi-e9c2.twc1.net/api/users/send_verification_code/`,
      {
        email: email,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке кода подтверждения:", error);
    throw error;
  }
};

export const confirmEmail = async (userData: {
  email: string;
  verification_code: string;
  login: string;
  password: string;
}): Promise<any> => {
  try {
    const response = await axios.post(
      `https://stillmix-online-college-fastapi-e9c2.twc1.net/api/users/confirm_email/`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при подтверждении email:", error);
    throw error;
  }
};

/**
 * Обновление данных пользователя
 */
export const updateUser = async (
  userId: number,
  userData: Partial<UserData>
): Promise<UserData> => {
  try {
    const response = await axios.put(
      `https://stillmix-online-college-fastapi-e9c2.twc1.net/api/users/${userId}`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
    throw error;
  }
};

/**
 * Получение списка всех пользователей
 */
export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const response = await axios.get(
      "https://stillmix-online-college-fastapi-e9c2.twc1.net/api/users/"
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении списка пользователей:", error);
    throw error;
  }
};

/**
 * Удаление пользователя
 */
export const deleteUser = async (
  userId: number
): Promise<{ message: string }> => {
  try {
    const response = await axios.delete(
      `https://stillmix-online-college-fastapi-e9c2.twc1.net/api/users/${userId}/`
    );
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении пользователя с ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Добавление курса пользователю
 */
export const addUserCourse = async (
  userId: number,
  courseId: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.post(
      `https://stillmix-online-college-fastapi-e9c2.twc1.net/api/users/course`,
      {
        user_id: userId,
        course_id: courseId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при добавлении курса пользователю:", error);
    throw error;
  }
};

/**
 * Отметка урока как пройденного
 */
export const completeLesson = async (
  userId: number,
  lessonId: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.post(
      `https://stillmix-online-college-fastapi-e9c2.twc1.net/api/users/lesson/complete/`,
      {
        user_id: userId,
        lesson_id: lessonId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при отметке урока как пройденного:", error);
    throw error;
  }
};

/**
 * Загрузка аватара пользователя
 */
export const uploadAvatar = async (
  userId: string | number | undefined,
  file: File
): Promise<{ message: string; img_path: string }> => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios.post(
      `https://stillmix-online-college-fastapi-e9c2.twc1.net/api/users/${userId}/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Ошибка при загрузке аватара для пользователя ${userId}:`,
      error
    );
    throw error;
  }
};

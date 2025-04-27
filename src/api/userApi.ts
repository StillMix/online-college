import axios from "axios";
import { UserData } from "@/types";
const API_BASE_URL = "http://localhost:8000";
const API_URL = `${API_BASE_URL}/api/courses`;

export const createUser = async (
  courseData: Partial<UserData>
): Promise<UserData> => {
  try {
    const response = await axios.post(API_URL, courseData);

    const createUser = response.data;
    return createUser;
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    throw error;
  }
};

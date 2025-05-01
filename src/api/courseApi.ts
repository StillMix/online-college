// src/api/courseApi.ts
import axios from "axios";
import {
  CourseItem,
  CourseInfoItem,
  CourseItemCourse,
  CourseItemCourseContent,
} from "@/types";
const API_BASE_URL =
  window.location.protocol === "https:"
    ? "https://stillmix-online-college-fastapi-e9c2.twc1.net"
    : "https://stillmix-online-college-fastapi-e9c2.twc1.net";

const API_URL = `${API_BASE_URL}/api/courses`;

/**
 * КУРСЫ
 */

/**
 * Получить список всех курсов
 */
export const getAllCourses = async (
  StopLoader?: () => void
): Promise<CourseItem[]> => {
  try {
    localStorage.removeItem("courseData");
    console.log("Куда отправляется запрос:", API_URL);
    const response = await axios.get(API_URL);
    localStorage.setItem("courseData", JSON.stringify(response.data));
    StopLoader?.();
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении списка курсов:", error);
    localStorage.removeItem("courseData");

    const courseDataStr = localStorage.getItem("courseData");
    if (courseDataStr) {
      return JSON.parse(courseDataStr);
    }

    throw error;
  }
};

/**
 * Получить курс по ID
 */
export const getCourseById = async (courseId: string): Promise<CourseItem> => {
  try {
    const response = await axios.get(`${API_URL}/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении курса с ID ${courseId}:`, error);

    // Пытаемся найти курс в localStorage, если API недоступен
    const courseDataStr = localStorage.getItem("courseData");
    if (courseDataStr) {
      const courses = JSON.parse(courseDataStr);
      const course = courses.find((c: CourseItem) => c.id === courseId);
      if (course) return course;
    }

    throw error;
  }
};

/**
 * Создать новый курс
 */
export const createCourse = async (
  courseData: Partial<CourseItem>
): Promise<CourseItem> => {
  try {
    const response = await axios.post(API_URL, courseData);

    // Обновляем список курсов в localStorage
    const updatedCourse = response.data;
    updateCoursesInLocalStorage(updatedCourse);
    getAllCourses();
    return updatedCourse;
  } catch (error) {
    console.error("Ошибка при создании курса:", error);
    throw error;
  }
};

/**
 * Обновить существующий курс
 */
export const updateCourse = async (
  courseId: string,
  courseData: Partial<CourseItem>
): Promise<CourseItem> => {
  try {
    const response = await axios.put(`${API_URL}/${courseId}`, courseData);

    // Обновляем список курсов в localStorage
    const updatedCourse = response.data;
    updateCoursesInLocalStorage(updatedCourse);
    getAllCourses();
    return updatedCourse;
  } catch (error) {
    console.error(`Ошибка при обновлении курса с ID ${courseId}:`, error);
    throw error;
  }
};

/**
 * Удалить курс
 */
export const deleteCourse = async (courseId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${courseId}`);
    // Удаляем курс из localStorage
    removeCoursesFromLocalStorage(courseId);
    getAllCourses();
  } catch (error) {
    console.error(`Ошибка при удалении курса с ID ${courseId}:`, error);
    throw error;
  }
};

/**
 * ИНФОРМАЦИЯ О КУРСЕ
 */

/**
 * Создать блок информации о курсе
 */
export const createCourseInfo = async (
  courseId: string,
  infoData: CourseInfoItem
): Promise<CourseInfoItem> => {
  try {
    const response = await axios.post(`${API_URL}/${courseId}/info/`, infoData);
    getAllCourses();
    return response.data;
  } catch (error) {
    console.error(
      `Ошибка при создании информации для курса ${courseId}:`,
      error
    );
    throw error;
  }
};

/**
 * Обновить блок информации о курсе
 */
export const updateCourseInfo = async (
  courseId: string,
  infoId: string,
  infoData: Partial<CourseInfoItem>
): Promise<CourseInfoItem> => {
  try {
    const response = await axios.put(
      `${API_URL}/${courseId}/info/${infoId}`,
      infoData
    );
    getAllCourses();
    return response.data;
  } catch (error) {
    console.error(
      `Ошибка при обновлении информации ${infoId} для курса ${courseId}:`,
      error
    );
    throw error;
  }
};

/**
 * Удалить блок информации о курсе
 */
export const deleteCourseInfo = async (
  courseId: string,
  infoId: string
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${courseId}/info/${infoId}`);
    getAllCourses();
  } catch (error) {
    console.error(
      `Ошибка при удалении информации ${infoId} для курса ${courseId}:`,
      error
    );
    throw error;
  }
};

/**
 * РАЗДЕЛЫ КУРСА
 */

/**
 * Создать раздел курса
 */
export const createCourseSection = async (
  courseId: string,
  sectionData: CourseItemCourse
): Promise<CourseItemCourse> => {
  try {
    const response = await axios.post(
      `${API_URL}/${courseId}/sections/`,
      sectionData
    );
    getAllCourses();
    return response.data;
  } catch (error) {
    console.error(`Ошибка при создании раздела для курса ${courseId}:`, error);
    throw error;
  }
};

/**
 * Обновить раздел курса
 */
export const updateCourseSection = async (
  courseId: string,
  sectionId: string,
  sectionData: Partial<CourseItemCourse>
): Promise<CourseItemCourse> => {
  try {
    const response = await axios.put(
      `${API_URL}/${courseId}/sections/${sectionId}`,
      sectionData
    );
    getAllCourses();
    return response.data;
  } catch (error) {
    console.error(
      `Ошибка при обновлении раздела ${sectionId} для курса ${courseId}:`,
      error
    );
    throw error;
  }
};

/**
 * Удалить раздел курса
 */
export const deleteCourseSection = async (
  courseId: string,
  sectionId: string
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${courseId}/sections/${sectionId}`);
  } catch (error) {
    console.error(
      `Ошибка при удалении раздела ${sectionId} для курса ${courseId}:`,
      error
    );
    throw error;
  }
};

/**
 * УРОКИ КУРСА
 */

/**
 * Создать урок в разделе курса
 */
export const createCourseLesson = async (
  courseId: string,
  sectionId: string,
  lessonData: CourseItemCourseContent
): Promise<CourseItemCourseContent> => {
  try {
    const response = await axios.post(
      `${API_URL}/${courseId}/sections/${sectionId}/content`,
      lessonData
    );

    // После успешного создания урока, обновляем список всех курсов
    // чтобы данные были актуальны
    getAllCourses();

    return response.data;
  } catch (error) {
    console.error(
      `Ошибка при создании урока для раздела ${sectionId} курса ${courseId}:`,
      error
    );
    throw error;
  }
};

/**
 * Обновить урок в разделе курса
 */
export const updateCourseLesson = async (
  courseId: string,
  sectionId: string,
  lessonId: string,
  lessonData: Partial<CourseItemCourseContent>
): Promise<CourseItemCourseContent> => {
  try {
    const response = await axios.put(
      `${API_URL}/${courseId}/sections/${sectionId}/content/${lessonId}`,
      lessonData
    );
    getAllCourses();
    return response.data;
  } catch (error) {
    console.error(
      `Ошибка при обновлении урока ${lessonId} в разделе ${sectionId} курса ${courseId}:`,
      error
    );
    throw error;
  }
};

/**
 * Удалить урок из раздела курса
 */
export const deleteCourseLesson = async (
  courseId: string,
  sectionId: string,
  lessonId: string
): Promise<void> => {
  try {
    await axios.delete(
      `${API_URL}/${courseId}/sections/${sectionId}/content/${lessonId}`
    );
  } catch (error) {
    console.error(
      `Ошибка при удалении урока ${lessonId} из раздела ${sectionId} курса ${courseId}:`,
      error
    );
    throw error;
  }
};

/**
 * ОПИСАНИЕ УРОКА
 */

/**
 * Обновить описание урока
 */
export const updateLessonDescription = async (
  courseId: string,
  sectionId: string,
  lessonId: string,
  description: string
): Promise<void> => {
  try {
    await axios.put(
      `${API_URL}/${courseId}/sections/${sectionId}/content/${lessonId}`,
      { description }
    );
  } catch (error) {
    console.error(
      `Ошибка при обновлении описания урока ${lessonId} в разделе ${sectionId} курса ${courseId}:`,
      error
    );
    throw error;
  }
};

/**
 * ЗАГРУЗКА ИЗОБРАЖЕНИЙ
 */

/**
 * Загрузить изображение для курса
 */
export const uploadCourseImage = async (
  courseId: string,
  file: File
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${API_URL}/${courseId}/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    getAllCourses();
    return response.data.path;
  } catch (error) {
    console.error(
      `Ошибка при загрузке изображения для курса ${courseId}:`,
      error
    );
    throw error;
  }
};

/**
 * ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
 */

/**
 * Обновить список курсов в localStorage
 */
const updateCoursesInLocalStorage = (updatedCourse: CourseItem): void => {
  const courseDataStr = localStorage.getItem("courseData");
  if (courseDataStr) {
    const courses = JSON.parse(courseDataStr);

    // Ищем индекс курса для обновления
    const index = courses.findIndex(
      (c: CourseItem) => c.id === updatedCourse.id
    );

    if (index !== -1) {
      // Обновляем существующий курс
      courses[index] = updatedCourse;
    } else {
      // Добавляем новый курс
      courses.push(updatedCourse);
    }

    localStorage.setItem("courseData", JSON.stringify(courses));
  } else {
    // Если списка нет, создаем новый
    localStorage.setItem("courseData", JSON.stringify([updatedCourse]));
  }
};

/**
 * Удалить курс из localStorage
 */
const removeCoursesFromLocalStorage = (courseId: string): void => {
  const courseDataStr = localStorage.getItem("courseData");
  if (courseDataStr) {
    let courses = JSON.parse(courseDataStr);
    courses = courses.filter((c: CourseItem) => c.id !== courseId);
    localStorage.setItem("courseData", JSON.stringify(courses));
  }
};

/**
 * Получить курсы пользователя
 */
export const getUserCourses = (): CourseItem[] => {
  try {
    // Получаем идентификаторы курсов пользователя
    const userCoursesIds = localStorage.getItem("userCourses");
    if (!userCoursesIds) return [];

    // Парсим идентификаторы
    const courseIds: string[] = JSON.parse(userCoursesIds);

    // Получаем все курсы из localStorage
    const allCoursesStr = localStorage.getItem("courseData");
    if (!allCoursesStr) return [];

    const allCourses: CourseItem[] = JSON.parse(allCoursesStr);

    // Фильтруем только те курсы, ID которых есть в списке пользователя
    return allCourses.filter((course) => courseIds.includes(course.id));
  } catch (error) {
    console.error("Ошибка при загрузке данных курсов пользователя:", error);
    return [];
  }
};

/**
 * Добавить курс в список курсов пользователя
 */
export const addUserCourse = (courseId: string): void => {
  try {
    let userCourses: string[] = []; // Массив курсов
    const userCoursesStr = localStorage.getItem("userCourses");

    if (userCoursesStr) {
      userCourses = JSON.parse(userCoursesStr);
    }

    // Проверяем, нет ли уже такого id
    if (!userCourses.includes(courseId)) {
      userCourses.push(courseId);
      localStorage.setItem("userCourses", JSON.stringify(userCourses));
    }
  } catch (error) {
    console.error("Ошибка при добавлении курса в список пользователя:", error);
  }
};

/**
 * Поиск курсов по запросу
 */
export const searchCourses = (query: string): CourseItem[] => {
  try {
    const courseDataStr = localStorage.getItem("courseData");
    if (!courseDataStr) return [];

    const courses: CourseItem[] = JSON.parse(courseDataStr);

    if (!query.trim()) {
      return courses;
    }

    const lowerQuery = query.toLowerCase().trim();
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(lowerQuery) ||
        course.subtitle.toLowerCase().includes(lowerQuery) ||
        course.type.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error("Ошибка при поиске курсов:", error);
    return [];
  }
};

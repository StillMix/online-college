// Общие интерфейсы для всего приложения
export interface UserData {
  name: string;
  login: string;
  email: string;
  avatar: string | null;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ImageItem {
  group: number;
  number: number;
}

export interface CourseItemInfo {
  id: string;
  title: string;
  subtitle: string;
}

export interface CourseItemCourseContent {
  id: string;
  name: string;
  passing: string;
  description?: string;
}

export interface CourseItemCourse {
  id: string;
  name: string;
  content: CourseItemCourseContent[];
}

export interface CourseItem {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  timetoendL: string;
  color: string;
  icon: string;
  icontype: string;
  titleForCourse: string;
  info: CourseItemInfo[];
  sections: CourseItemCourse[];
}

// Интерфейс для пользователей
export interface User {
  id: string;
  name: string;
  login: string;
  email: string;
  password: string;
  avatar: string | null;
  isAdmin: boolean;
  createdAt: string;
}

// Состояние уведомления
export interface NotificationState {
  show: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

export interface CourseInfoItem {
  id: string;
  title: string;
  subtitle: string;
}

export interface CourseBasicData {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  timetoendL: string;
  color: string;
  icon: string;
  icontype: string;
  titleForCourse: string;
}

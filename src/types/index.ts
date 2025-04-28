export interface UserData {
  id?: string | number;
  name?: string;
  login: string;
  email: string;
  password?: string;
  img?: string;
  avatar?: string | null;
  role?: string;
  courses?: CourseItem[];
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  isAdmin?: boolean;
  createdAt?: string;
}

// Интерфейс для верификации email
export interface EmailVerification {
  email: string;
  verification_code?: string;
}

// Интерфейс для связи пользователя с курсом
export interface UserCourse {
  user_id: number;
  course_id: string;
}

// Интерфейс для завершения урока
export interface LessonCompletion {
  user_id: number;
  lesson_id: string;
}

// Интерфейс для входа пользователя
export interface UserLogin {
  login: string;
  password: string;
}

// Интерфейс для обновления пользователя
export interface UserUpdate {
  login?: string;
  email?: string;
  password?: string;
  name?: string;
  img?: string;
  role?: string;
}

// Интерфейс для ответа от API
export interface ApiResponse {
  message: string;
  [key: string]: any;
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

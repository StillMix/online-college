// Экспорт всех компонентов для управления курсами
import CourseBasicInfo from "./CourseBasicInfo.vue";
import CourseInfoSection from "./CourseInfoSection.vue";
import CourseSections from "./CourseSections.vue";
import CourseLessons from "./CourseLessons.vue";
import CourseReview from "./CourseReview.vue";
import CourseItem from "./CourseItem.vue";
import CourseSearchBar from "./CourseSearchBar.vue";
import DeleteConfirmModal from "./DeleteConfirmModal.vue";
import LessonEditModal from "./LessonEditModal.vue";

export {
  CourseBasicInfo,
  CourseInfoSection,
  CourseSections,
  CourseLessons,
  CourseReview,
  CourseItem,
  CourseSearchBar,
  DeleteConfirmModal,
  LessonEditModal,
};

// src/components/CourseControlComponents/
// ├── CourseBasicInfo.vue         # Базовая информация о курсе (шаг 1)
// ├── CourseInfoSection.vue       # Информация о курсе (шаг 2)
// ├── CourseSections.vue          # Разделы курса (шаг 3)
// ├── CourseLessons.vue           # Уроки курса (шаг 4)
// ├── CourseReview.vue            # Финальный обзор курса (шаг 5)
// ├── CourseItem.vue              # Карточка курса в списке
// ├── CourseSearchBar.vue         # Строка поиска курсов
// ├── DeleteConfirmModal.vue      # Модальное окно подтверждения удаления
// ├── LessonEditModal.vue         # Модальное окно редактирования урока
// ├── NotificationToast.vue       # Компонент уведомлений
// └── index.ts                    # Файл для экспорта всех компонентов

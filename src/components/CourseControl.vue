<template>
  <div class="course-control">
    <div class="course-control__actions">
      <button
        class="course-control__actions__button course-control__actions__button--create"
        @click="openCreateModal"
      >
        <span class="course-control__actions__button__icon">+</span>
        Создать новый курс
      </button>

      <CourseSearchBar
        v-model="searchQuery"
        @clear="clearSearch"
      />
    </div>

    <div v-if="loading" class="course-control__loader">
      <AppLoader :is-visible="true" loading-text="Загрузка курсов..." />
    </div>

    <div v-else-if="filteredCourses.length > 0" class="course-control__courses">
      <CourseItem
        v-for="course in filteredCourses"
        :key="course.id"
        :course="course"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />
    </div>

    <div v-else class="course-control__empty">
      <div class="course-control__empty__con">
        <img
          class="course-control__empty__con-icon"
          src="../assets/courseNone.svg"
          alt="Нет курсов"
        />
        <p class="course-control__empty__con-text">Курсы не найдены</p>
      </div>
      <button
        v-if="searchQuery"
        class="course-control__empty__button"
        @click="clearSearch"
      >
        Сбросить поиск
      </button>
    </div>

    <!-- Модальное окно создания/редактирования курса -->
    <div
      class="course-control__modal"
      v-if="showEditModal"
      @click.self="closeModals"
    >
      <div class="course-control__modal__content">
        <h2 class="course-control__modal__title">
          {{ editMode ? "Редактирование курса" : "Создание нового курса" }}
        </h2>

        <div class="course-control__modal__tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="course-control__modal__tabs__item"
            :class="{
              'course-control__modal__tabs__item--active': activeTab === tab.id,
            }"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
            <span
              v-if="tabCompleted[tab.id]"
              class="course-control__modal__tabs__item__completed"
              >✓</span
            >
          </button>
        </div>

        <form class="course-control__modal__form">
          <!-- Шаг 1: Основная информация о курсе -->
          <CourseBasicInfo
            v-if="activeTab === 'basic'"
            :course="editingCourse"
            :course-types="courseTypes"
            :course-levels="courseLevels"
            :is-edit-mode="editMode"
            @update:course="updateCourseBasicInfo"
            @save="saveBasicInfo"
            @cancel="closeModals"
            @icon-upload="handleIconUpload"
          />

          <!-- Шаг 2: Информация о курсе -->
          <CourseInfoSection
            v-if="activeTab === 'info'"
            :info="editingCourse.info"
            @update:info="updateCourseInfo"
            @save="saveInfoItems"
            @back="activeTab = 'basic'"
          />

          <!-- Шаг 3: Разделы курса -->
          <CourseSections
            v-if="activeTab === 'sections'"
            :sections="editingCourse.sections"
            @update:sections="updateCourseSections"
            @save="saveSections"
            @back="activeTab = 'info'"
          />

          <!-- Шаг 4: Уроки курса -->
          <CourseLessons
            v-if="activeTab === 'lessons'"
            :sections="editingCourse.sections"
            @update:sections="updateCourseSections"
            @save="saveLessons"
            @back="activeTab = 'sections'"
            @edit-lesson="openLessonEditModal"
          />

          <!-- Шаг 5: Обзор и финальное сохранение -->
          <CourseReview
            v-if="activeTab === 'review'"
            :course="editingCourse"
            @save="finalizeCourse"
            @back="activeTab = 'lessons'"
          />
        </form>
      </div>
    </div>

    <!-- Модальное окно подтверждения удаления -->
    <DeleteConfirmModal
      v-if="showDeleteModal"
      :course="deletingCourse"
      @close="closeModals"
      @confirm="deleteCourse"
    />

    <!-- Модальное окно редактирования урока -->
    <LessonEditModal
      v-if="showLessonEditModal"
      :lesson="currentEditingLesson"
      :description="lessonDescription"
      @close="closeModals"
      @save="saveLessonDescription"
    />

    <!-- Уведомление о выполнении действия -->
    <NotificationToast
      :show="notification.show"
      :message="notification.message"
      :type="notification.type"
      @close="notification.show = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import AppLoader from "@/components/Loader.vue";
import { 
  CourseBasicInfo,
  CourseInfoSection, 
  CourseSections,
  CourseLessons,
  CourseReview,
  CourseItem,
  CourseSearchBar,
  DeleteConfirmModal,
  LessonEditModal,
  NotificationToast
} from "@/components/CourseControlComponents";

interface CourseItemInfo {
  id: string;
  title: string;
  subtitle: string;
}

interface CourseItemCourseContent {
  id: string;
  name: string;
  passing: string;
  description?: string;
}

interface CourseItemCourse {
  id: string;
  name: string;
  content: CourseItemCourseContent[];
}

interface CourseItem {
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

export default defineComponent({
  name: "CourseControl",
  components: {
    AppLoader,
    CourseBasicInfo,
    CourseInfoSection,
    CourseSections,
    CourseLessons,
    CourseReview,
    CourseItem,
    CourseSearchBar,
    DeleteConfirmModal,
    LessonEditModal,
    NotificationToast
  },
  props: {
    initialLoading: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["course-updated", "course-created", "course-deleted"],
  setup(props, { emit }) {
    const courses = ref<CourseItem[]>([]);
    const loading = ref(props.initialLoading);
    const searchQuery = ref("");

    // Модальные окна
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const editMode = ref(false);

    // Состояние для модального окна редактирования урока
    const showLessonEditModal = ref(false);
    const currentEditingLesson = ref<CourseItemCourseContent | null>(null);
    const currentLessonIndex = ref<number | null>(null);
    const lessonDescription = ref("");

    // Доступные типы курсов
    const courseTypes = ref([
      "ПРОГРАММИРОВАНИЕ",
      "ДИЗАЙН",
      "МАРКЕТИНГ",
      "МЕНЕДЖМЕНТ",
      "АНАЛИТИКА",
    ]);

    // Доступные уровни курсов
    const courseLevels = ref(["С НУЛЯ", "НАЧАЛЬНЫЙ", "СРЕДНИЙ", "ПРОДВИНУТЫЙ"]);

    // Для загрузки иконок
    const courseIconFile = ref<File | null>(null);
    const courseIconPreview = ref<string | null>(null);

    const activeTab = ref("basic");
    const tabs = ref([
      { id: "basic", name: "Основная информация" },
      { id: "info", name: "Информация о курсе" },
      { id: "sections", name: "Разделы курса" },
      { id: "lessons", name: "Уроки" },
      { id: "review", name: "Обзор" },
    ]);
    const tabCompleted = ref<Record<string, boolean>>({
      basic: false,
      info: false,
      sections: false,
      lessons: false,
      review: false,
    });
    const courseData = ref<Record<string, unknown>>({});
    const currentSectionIndex = ref<number | null>(null);
    
    // Курс для редактирования/создания/удаления
    const editingCourse = ref<CourseItem>({
      id: "",
      title: "",
      subtitle: "",
      type: "ПРОГРАММИРОВАНИЕ",
      timetoendL: "С НУЛЯ",
      color: "#a63cf9",
      icon: "coursevoprIcon",
      icontype: "programIcon",
      titleForCourse: "",
      info: [
        {
          id: "1",
          title: "",
          subtitle: "",
        },
      ],
      sections: [
        {
          id: "1",
          name: "ВВЕДЕНИЕ",
          content: [
            {
              id: "1",
              name: "Что будет в курсе?",
              passing: "no",
              description: "",
            },
          ],
        },
      ],
    });

    const deletingCourse = ref<CourseItem | null>(null);

    // Уведомление
    const notification = ref({
      show: false,
      message: "",
      type: "success",
    });

    // Отфильтрованные курсы
    const filteredCourses = computed(() => {
      if (!searchQuery.value.trim()) {
        return courses.value;
      }

      const query = searchQuery.value.toLowerCase().trim();
      return courses.value.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.subtitle.toLowerCase().includes(query) ||
          course.type.toLowerCase().includes(query)
      );
    });

    // Обновление основной информации курса
    const updateCourseBasicInfo = (updatedBasicInfo: Partial<CourseItem>) => {
      editingCourse.value = { ...editingCourse.value, ...updatedBasicInfo };
    };

    // Обновление информации о курсе
    const updateCourseInfo = (updatedInfo: CourseItemInfo[]) => {
      editingCourse.value.info = updatedInfo;
    };

    // Обновление разделов курса
    const updateCourseSections = (updatedSections: CourseItemCourse[]) => {
      editingCourse.value.sections = updatedSections;
    };

    // Обработчик загрузки иконки курса
    const handleIconUpload = (file: File) => {
      courseIconFile.value = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          courseIconPreview.value = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    };

    const saveBasicInfo = (success: boolean, errorMessage?: string) => {
      if (!success) {
        showNotification(errorMessage || "Произошла ошибка", "error");
        return;
      }

      // Сохраняем базовую информацию
      courseData.value = {
        title: editingCourse.value.title,
        subtitle: editingCourse.value.subtitle,
        type: editingCourse.value.type,
        timetoendL: editingCourse.value.timetoendL,
        color: editingCourse.value.color,
        icon: editingCourse.value.icon,
        icontype: editingCourse.value.icontype,
        titleForCourse: editingCourse.value.titleForCourse,
      };

      // Отмечаем этап как завершенный и переходим к следующему
      tabCompleted.value.basic = true;
      activeTab.value = "info";

      showNotification("Основная информация сохранена!");
    };

    const saveInfoItems = (success: boolean, errorMessage?: string) => {
      if (!success) {
        showNotification(errorMessage || "Произошла ошибка", "error");
        return;
      }

      // Сохраняем информацию о курсе
      courseData.value.info = JSON.parse(
        JSON.stringify(editingCourse.value.info)
      );

      // Отмечаем этап как завершенный и переходим к следующему
      tabCompleted.value.info = true;
      activeTab.value = "sections";

      showNotification("Информация о курсе сохранена!");
    };

    const saveSections = (success: boolean, errorMessage?: string) => {
      if (!success) {
        showNotification(errorMessage || "Произошла ошибка", "error");
        return;
      }

      // Сохраняем разделы
      courseData.value.sections = JSON.parse(
        JSON.stringify(editingCourse.value.sections)
      );

      // Отмечаем этап как завершенный и переходим к следующему
      tabCompleted.value.sections = true;
      activeTab.value = "lessons";

      // Устанавливаем первый раздел как активный для добавления уроков
      if (editingCourse.value.sections.length > 0) {
        currentSectionIndex.value = 0;
      }

      showNotification("Разделы курса сохранены!");
    };

    const saveLessons = (success: boolean, errorMessage?: string) => {
      if (!success) {
        showNotification(errorMessage || "Произошла ошибка", "error");
        return;
      }

      // Копируем данные в courseData
      courseData.value.sections = JSON.parse(
        JSON.stringify(editingCourse.value.sections)
      );

      // Переименовываем поле для API
      courseData.value.course = courseData.value.sections;
      delete courseData.value.sections;

      // Отмечаем этап как завершенный и переходим к следующему
      tabCompleted.value.lessons = true;
      activeTab.value = "review";

      showNotification("Уроки сохранены!");
    };

    // Финализация и сохранение курса
    const finalizeCourse = async () => {
      try {
        // Создаем финальный объект курса для отправки на API
        const finalCourseData = {
          ...courseData.value,
        };

        // Проверяем, что мы собрали все необходимые данные
        if (
          !finalCourseData.title ||
          !finalCourseData.info ||
          !finalCourseData.course
        ) {
          showNotification("Не все данные курса заполнены", "error");
          return;
        }

        if (editMode.value) {
          // Если редактируем - отправляем на API обновление
          const response = await fetch(
            `http://localhost:8000/api/courses/${editingCourse.value.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...finalCourseData,
                id: editingCourse.value.id,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`Ошибка при обновлении курса: ${response.status}`);
          }

          const result = await response.json();

          // Если есть новое изображение, загружаем его
          if (courseIconFile.value) {
            const imagePath = await uploadCourseImage(
              result.id,
              courseIconFile.value
            );
            if (imagePath) {
              result.icon = imagePath;
            }
          }

          // Обновляем курс в списке
          const index = courses.value.findIndex((c) => c.id === result.id);
          if (index !== -1) {
            courses.value[index] = result;
          }

          showNotification("Курс успешно обновлен!");
        } else {
          // Если создаем новый - отправляем на API создание
          const response = await fetch("http://localhost:8000/api/courses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(finalCourseData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Ошибка API:", errorData);
            throw new Error(`Ошибка при создании курса: ${response.status}`);
          }

          const result = await response.json();

          // Если у нас есть загруженный файл иконки, загружаем его
          if (courseIconFile.value) {
            const imagePath = await uploadCourseImage(
              result.id,
              courseIconFile.value
            );
            if (imagePath) {
              result.icon = imagePath;
            }
          }

          // Добавляем созданный курс в список
          courses.value.push(result);

          showNotification("Курс успешно создан!");
        }

        // Обновляем localStorage
        localStorage.setItem("courseData", JSON.stringify(courses.value));

        // Закрываем модальное окно
        closeModals();
      } catch (error) {
        console.error("Ошибка при сохранении курса:", error);
        showNotification(`Ошибка при сохранении курса: ${error}`, "error");
      }
    };

    // Загрузка данных
    const loadCourses = async () => {
      loading.value = true;
      try {
        const response = await fetch("http://localhost:8000/api/courses/");
        if (response.ok) {
          const data = await response.json();
          courses.value = data;
          // Обновляем localStorage
          localStorage.setItem("courseData", JSON.stringify(data));
        } else {
          // Если API недоступен, пробуем загрузить из localStorage
          const courseDataStr = localStorage.getItem("courseData");
          if (courseDataStr) {
            courses.value = JSON.parse(courseDataStr);
          }
        }
      } catch (error) {
        console.error("Ошибка при загрузке курсов:", error);
        // Пробуем загрузить из localStorage в случае ошибки
        const courseDataStr = localStorage.getItem("courseData");
        if (courseDataStr) {
          try {
            courses.value = JSON.parse(courseDataStr);
          } catch (e) {
            console.error("Ошибка при парсинге данных курсов:", e);
            courses.value = [];
          }
        }
      } finally {
        loading.value = false;
      }
    };

    // Очистка поискового запроса
    const clearSearch = () => {
      searchQuery.value = "";
    };

    // Открытие модального окна создания
    const openCreateModal = () => {
      editMode.value = false;

      // Генерируем новый ID
      const newId = (
        Math.max(0, ...courses.value.map((c) => parseInt(c.id))) + 1
      ).toString();

      // Сбрасываем форму с начальными значениями
      editingCourse.value = {
        id: newId,
        title: "",
        subtitle: "",
        type: "ПРОГРАММИРОВАНИЕ",
        timetoendL: "С НУЛЯ",
        color: "#a63cf9",
        icon: "coursevoprIcon",
        icontype: "programIcon",
        titleForCourse: "",
        info: [
          {
            id: "1",
            title: "",
            subtitle: "",
          },
        ],
        sections: [
          {
            id: "1",
            name: "ВВЕДЕНИЕ",
            content: [
              {
                id: "1",
                name: "Что будет в курсе?",
                passing: "no",
                description: "",
              },
            ],
          },
        ],
      };

      // Сбрасываем табы
      activeTab.value = "basic";
      Object.keys(tabCompleted.value).forEach(key => {
        tabCompleted.value[key] = false;
      });

      // Сбрасываем предпросмотр
      courseIconPreview.value = null;
      courseIconFile.value = null;

      showEditModal.value = true;
    };

    // Открытие модального окна редактирования курса
    const openEditModal = (course: CourseItem) => {
      editMode.value = true;

      // Создаем глубокую копию курса для редактирования
      editingCourse.value = JSON.parse(JSON.stringify(course));

      // Сбрасываем табы
      activeTab.value = "basic";
      Object.keys(tabCompleted.value).forEach(key => {
        tabCompleted.value[key] = true;
      });

      // Сбрасываем предпросмотр иконки
      courseIconPreview.value = null;
      courseIconFile.value = null;

      // Если у курса есть иконка, пытаемся получить ее для предпросмотра
      if (course.icon) {
        try {
          courseIconPreview.value = `http://127.0.0.1:8000/${course.icon}`;
        } catch (error) {
          console.error("Не удалось загрузить превью иконки курса:", error);
        }
      }

      showEditModal.value = true;
    };

    // Открытие модального окна удаления курса
    const openDeleteModal = (course: CourseItem) => {
      deletingCourse.value = course;
      showDeleteModal.value = true;
    };

    // Открытие модального окна редактирования описания урока
    const openLessonEditModal = (sectionIndex: number, lessonIndex: number) =>
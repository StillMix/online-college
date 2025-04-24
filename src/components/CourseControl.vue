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

      <div class="course-control__actions__search">
        <img
          alt="icon"
          src="../assets/search.svg"
          class="course-control__actions__search__img"
        />
        <input
          class="course-control__actions__search__input"
          placeholder="Поиск курсов"
          v-model="searchQuery"
        />
        <button
          v-if="searchQuery"
          class="course-control__actions__search__clear"
          @click="clearSearch"
        >
          ×
        </button>
      </div>
    </div>

    <div v-if="loading" class="course-control__loader">
      <AppLoader :is-visible="true" loading-text="Загрузка курсов..." />
    </div>

    <div v-else-if="filteredCourses.length > 0" class="course-control__courses">
      <div
        v-for="course in filteredCourses"
        :key="course.id"
        class="course-control__course"
        :style="{ borderLeftColor: course.color }"
      >
        <div class="course-control__course__content">
          <div
            class="course-control__course__icon"
            :style="{ backgroundColor: course.color }"
          >
            <img
              :src="getIconSrc(course.icon)"
              alt="Иконка курса"
              class="course-control__course__icon__img"
            />
          </div>

          <div class="course-control__course__info">
            <h3 class="course-control__course__info__title">
              {{ course.title }}
            </h3>
            <p class="course-control__course__info__subtitle">
              {{ course.subtitle }}
            </p>
            <div class="course-control__course__info__meta">
              <span class="course-control__course__info__meta__type">
                <img
                  :src="getIconSrc(course.icontype)"
                  alt="Тип курса"
                  class="course-control__course__info__meta__type__icon"
                />
                {{ course.type }}
              </span>
              <span class="course-control__course__info__meta__level">
                <img
                  src="../assets/courseTime.svg"
                  alt="Уровень курса"
                  class="course-control__course__info__meta__level__icon"
                />
                {{ course.timetoendL }}
              </span>
            </div>
          </div>
        </div>

        <div class="course-control__course__actions">
          <button
            class="course-control__course__actions__button course-control__course__actions__button--edit"
            @click="openEditModal(course)"
          >
            Редактировать
          </button>
          <button
            class="course-control__course__actions__button course-control__course__actions__button--delete"
            @click="openDeleteModal(course)"
          >
            Удалить
          </button>
        </div>
      </div>
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

        <form class="course-control__modal__form" @submit.prevent="saveCourse">
          <div class="course-control__modal__form__row">
            <div class="course-control__modal__form__col">
              <label class="course-control__modal__form__label">
                Название курса
                <input
                  type="text"
                  class="course-control__modal__form__input"
                  v-model="editingCourse.title"
                  required
                />
              </label>

              <label class="course-control__modal__form__label">
                Подзаголовок
                <input
                  type="text"
                  class="course-control__modal__form__input"
                  v-model="editingCourse.subtitle"
                  required
                />
              </label>

              <label class="course-control__modal__form__label">
                Тип курса
                <select
                  class="course-control__modal__form__input course-control__modal__form__select"
                  v-model="editingCourse.type"
                  @change="updateIconType(editingCourse.type)"
                  required
                >
                  <option v-for="type in courseTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </label>

              <label class="course-control__modal__form__label">
                Уровень курса
                <select
                  class="course-control__modal__form__input course-control__modal__form__select"
                  v-model="editingCourse.timetoendL"
                  required
                >
                  <option
                    v-for="level in courseLevels"
                    :key="level"
                    :value="level"
                  >
                    {{ level }}
                  </option>
                </select>
              </label>
            </div>

            <div class="course-control__modal__form__col">
              <label class="course-control__modal__form__label">
                Название для страницы курса
                <input
                  type="text"
                  class="course-control__modal__form__input"
                  v-model="editingCourse.titleForCourse"
                  required
                />
              </label>

              <label class="course-control__modal__form__label">
                Иконка курса
                <div class="course-control__modal__form__file">
                  <input
                    type="file"
                    class="course-control__modal__form__file__input"
                    @change="handleCourseIconUpload"
                    accept="image/svg+xml"
                  />
                  <span class="course-control__modal__form__file__label">
                    {{
                      courseIconFile
                        ? courseIconFile.name
                        : "Выберите SVG файл..."
                    }}
                  </span>
                  <button
                    type="button"
                    class="course-control__modal__form__file__button"
                  >
                    Обзор
                  </button>
                </div>

                <div
                  v-if="courseIconPreview"
                  class="course-control__modal__form__file__preview"
                >
                  <img :src="courseIconPreview" alt="Предпросмотр иконки" />
                </div>
              </label>
            </div>
          </div>

          <div class="course-control__modal__form__section">
            <h3 class="course-control__modal__form__section__title">
              Информация о курсе
            </h3>

            <div
              v-for="(item, index) in editingCourse.info"
              :key="index"
              class="course-control__modal__form__info"
            >
              <div class="course-control__modal__form__info__header">
                <span class="course-control__modal__form__info__number">{{
                  index + 1
                }}</span>
                <button
                  type="button"
                  class="course-control__modal__form__info__remove"
                  @click="removeInfoItem(index)"
                >
                  Удалить
                </button>
              </div>

              <div class="course-control__modal__form__row">
                <div class="course-control__modal__form__col">
                  <label class="course-control__modal__form__label">
                    Заголовок
                    <input
                      type="text"
                      class="course-control__modal__form__input"
                      v-model="item.title"
                      required
                    />
                  </label>
                </div>
                <div class="course-control__modal__form__col">
                  <label class="course-control__modal__form__label">
                    Описание
                    <input
                      type="text"
                      class="course-control__modal__form__input"
                      v-model="item.subtitle"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="course-control__modal__form__add"
              @click="addInfoItem"
            >
              Добавить информацию о курсе
            </button>
          </div>

          <div class="course-control__modal__form__section">
            <h3 class="course-control__modal__form__section__title">
              Разделы курса
            </h3>

            <div
              v-for="(section, sectionIndex) in editingCourse.course"
              :key="sectionIndex"
              class="course-control__modal__form__section__item"
            >
              <div class="course-control__modal__form__section__header">
                <span class="course-control__modal__form__section__number">
                  Раздел {{ sectionIndex + 1 }}
                </span>
                <button
                  type="button"
                  class="course-control__modal__form__section__remove"
                  @click="removeSection(sectionIndex)"
                >
                  Удалить раздел
                </button>
              </div>

              <div class="course-control__modal__form__row">
                <div class="course-control__modal__form__col">
                  <label class="course-control__modal__form__label">
                    ID раздела
                    <input
                      type="text"
                      class="course-control__modal__form__input"
                      v-model="section.id"
                      required
                    />
                  </label>
                </div>
                <div class="course-control__modal__form__col">
                  <label class="course-control__modal__form__label">
                    Название раздела
                    <input
                      type="text"
                      class="course-control__modal__form__input"
                      v-model="section.name"
                      required
                    />
                  </label>
                </div>
              </div>

              <div class="course-control__modal__form__lessons">
                <h4 class="course-control__modal__form__lessons__title">
                  Уроки раздела
                </h4>

                <div
                  v-for="(lesson, lessonIndex) in section.content"
                  :key="lessonIndex"
                  class="course-control__modal__form__lesson"
                >
                  <div class="course-control__modal__form__lesson__header">
                    <span class="course-control__modal__form__lesson__number">
                      Урок {{ lessonIndex + 1 }}
                    </span>
                    <button
                      type="button"
                      class="course-control__modal__form__lesson__remove"
                      @click="removeLesson(sectionIndex, lessonIndex)"
                    >
                      Удалить
                    </button>
                  </div>

                  <div class="course-control__modal__form__row">
                    <div class="course-control__modal__form__col">
                      <label class="course-control__modal__form__label">
                        ID урока
                        <input
                          type="text"
                          class="course-control__modal__form__input"
                          v-model="lesson.id"
                          required
                        />
                      </label>
                    </div>
                    <div class="course-control__modal__form__col">
                      <label class="course-control__modal__form__label">
                        Название урока
                        <input
                          type="text"
                          class="course-control__modal__form__input"
                          v-model="lesson.name"
                          required
                        />
                      </label>
                    </div>
                    <div class="course-control__modal__form__lesson__actions">
                      <button
                        type="button"
                        class="course-control__modal__form__lesson__edit"
                        @click="openLessonEditModal(sectionIndex, lessonIndex)"
                      >
                        Редактировать описание
                      </button>
                    </div>
                    <div
                      class="course-control__modal__form__col course-control__modal__form__col--passing"
                    ></div>
                  </div>
                </div>

                <button
                  type="button"
                  class="course-control__modal__form__add course-control__modal__form__add--lesson"
                  @click="addLesson(sectionIndex)"
                >
                  Добавить урок
                </button>
              </div>
            </div>

            <button
              type="button"
              class="course-control__modal__form__add"
              @click="addSection"
            >
              Добавить раздел курса
            </button>
          </div>

          <div class="course-control__modal__actions">
            <button
              type="button"
              class="course-control__modal__actions__button course-control__modal__actions__button--cancel"
              @click="closeModals"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="course-control__modal__actions__button course-control__modal__actions__button--save"
            >
              {{ editMode ? "Сохранить изменения" : "Создать курс" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно подтверждения удаления -->
    <div
      class="course-control__confirm"
      v-if="showDeleteModal"
      @click.self="closeModals"
    >
      <div class="course-control__confirm__content">
        <h2 class="course-control__confirm__title">Подтверждение удаления</h2>

        <p class="course-control__confirm__text">
          Вы действительно хотите удалить курс "{{ deletingCourse?.title }}"?
          <br />
          Это действие нельзя будет отменить.
        </p>

        <div class="course-control__confirm__actions">
          <button
            class="course-control__confirm__actions__button course-control__confirm__actions__button--cancel"
            @click="closeModals"
          >
            Отмена
          </button>
          <button
            class="course-control__confirm__actions__button course-control__confirm__actions__button--confirm"
            @click="deleteCourse"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>

    <!-- Уведомление о выполнении действия -->
    <transition name="notification">
      <div
        v-if="notification.show"
        class="course-control__notification"
        :class="notification.type"
      >
        <p class="course-control__notification__text">
          {{ notification.message }}
        </p>
        <button
          class="course-control__notification__close"
          @click="notification.show = false"
        >
          ×
        </button>
      </div>
    </transition>

    <!-- Модальное окно редактирования урока -->
    <div
      class="course-control__lesson-modal"
      v-if="showLessonEditModal"
      @click.self="closeModals"
    >
      <div class="course-control__lesson-modal__content">
        <h2 class="course-control__lesson-modal__title">
          {{
            currentEditingLesson
              ? `Редактирование урока "${currentEditingLesson.name}"`
              : "Редактирование урока"
          }}
        </h2>

        <div class="course-control__lesson-modal__editor">
          <RichTextEditor
            v-model="lessonDescription"
            placeholder="Введите описание урока..."
          />
        </div>

        <div class="course-control__lesson-modal__actions">
          <button
            type="button"
            class="course-control__lesson-modal__actions__button course-control__lesson-modal__actions__button--cancel"
            @click="closeModals"
          >
            Отмена
          </button>
          <button
            type="button"
            class="course-control__lesson-modal__actions__button course-control__lesson-modal__actions__button--save"
            @click="saveLessonDescription"
          >
            Сохранить описание
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, PropType } from "vue";
import AppLoader from "@/components/Loader.vue";
import RichTextEditor from "@/components/RichTextEditor.vue";

interface CourseItemInfo {
  id: string;
  title: string;
  subtitle: string;
}

interface CourseItemCourseContent {
  id: string;
  name: string;
  passing: string;
  description?: string; // Добавляем поле для хранения описания в формате Rich Text
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
  course: CourseItemCourse[];
}

export default defineComponent({
  name: "CourseControl",
  components: {
    AppLoader,
    RichTextEditor,
  },
  props: {
    // Используем Props для большей гибкости и переиспользуемости компонента
    initialLoading: {
      type: Boolean,
      default: true,
    },
    // Можно добавить и другие пропсы, если нужно
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
    const currentSectionIndex = ref<number | null>(null);
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
      course: [
        {
          id: "1",
          name: "ВВЕДЕНИЕ",
          content: [
            {
              id: "1",
              name: "Что будет в курсе?",
              passing: "no",
              description: "", // Добавляем пустое описание по умолчанию
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

    // Загрузка данных
    const loadCourses = () => {
      loading.value = true;
      const courseDataStr = localStorage.getItem("courseData");

      if (courseDataStr) {
        try {
          courses.value = JSON.parse(courseDataStr);
        } catch (e) {
          console.error("Ошибка при парсинге данных курсов:", e);
          courses.value = [];
        }
      } else {
        console.warn("Данные курсов не найдены в localStorage");
        courses.value = [];
      }

      loading.value = false;
    };

    // Обработчик загрузки иконки курса
    const handleCourseIconUpload = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        courseIconFile.value = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            courseIconPreview.value = e.target.result as string;
            // Сохраняем в имя файла (без расширения) в поле icon
            if (courseIconFile.value) {
              const fileName = courseIconFile.value.name.split(".")[0];
              editingCourse.value.icon = fileName;
            }
          }
        };
        reader.readAsDataURL(courseIconFile.value);
      }
    };

    // Очистка поискового запроса
    const clearSearch = () => {
      searchQuery.value = "";
    };

    // Получение пути к иконке
    const getIconSrc = (iconName: string) => {
      try {
        return require(`@/assets/${iconName}.svg`);
      } catch (error) {
        // Если иконка не найдена, возвращаем стандартную иконку
        console.error(`Иконка ${iconName} не найдена:`, error);
        return require("@/assets/courseNone.svg");
      }
    };

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
        course: [
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

      // Сбрасываем предпросмотр
      courseIconPreview.value = null;
      courseIconFile.value = null;

      // Загружаем иконку для предпросмотра
      try {
        getIconSrc(editingCourse.value.icon);
        getIconSrc(editingCourse.value.icontype);
      } catch (error) {
        console.error("Не удалось загрузить превью иконки:", error);
      }

      showEditModal.value = true;
    };

    // Открытие модального окна редактирования курса
    const openEditModal = (course: CourseItem) => {
      editMode.value = true;

      // Создаем глубокую копию курса для редактирования
      editingCourse.value = JSON.parse(JSON.stringify(course));

      // Сбрасываем предпросмотр иконки
      courseIconPreview.value = null;
      courseIconFile.value = null;

      // Если у курса есть иконка, пытаемся получить ее для предпросмотра
      if (course.icon) {
        try {
          courseIconPreview.value = getIconSrc(course.icon);
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
    const openLessonEditModal = (sectionIndex: number, lessonIndex: number) => {
      currentSectionIndex.value = sectionIndex;
      currentLessonIndex.value = lessonIndex;

      const lesson =
        editingCourse.value.course[sectionIndex].content[lessonIndex];
      currentEditingLesson.value = lesson;
      lessonDescription.value = lesson.description || "";

      showLessonEditModal.value = true;
    };

    // Сохранение описания урока
    const saveLessonDescription = () => {
      if (
        currentSectionIndex.value !== null &&
        currentLessonIndex.value !== null &&
        currentEditingLesson.value
      ) {
        // Обновляем описание урока
        editingCourse.value.course[currentSectionIndex.value].content[
          currentLessonIndex.value
        ].description = lessonDescription.value;

        showNotification("Описание урока сохранено!");
        showLessonEditModal.value = false;
      }
    };

    // Закрытие всех модальных окон
    const closeModals = () => {
      showEditModal.value = false;
      showDeleteModal.value = false;
      showLessonEditModal.value = false;
      currentEditingLesson.value = null;
      currentSectionIndex.value = null;
      currentLessonIndex.value = null;
    };

    // Обновление описания урока из редактора
    const updateLessonDescription = (html: string) => {
      lessonDescription.value = html;
    };

    // Добавление элемента info
    const addInfoItem = () => {
      const newId = (editingCourse.value.info.length + 1).toString();

      editingCourse.value.info.push({
        id: newId,
        title: "",
        subtitle: "",
      });
    };

    // Удаление элемента info
    const removeInfoItem = (index: number) => {
      if (editingCourse.value.info.length > 1) {
        editingCourse.value.info.splice(index, 1);
      } else {
        showNotification(
          "Должен быть хотя бы один элемент информации о курсе",
          "error"
        );
      }
    };

    // Добавление раздела курса
    const addSection = () => {
      const newId = (editingCourse.value.course.length + 1).toString();

      editingCourse.value.course.push({
        id: newId,
        name: "Новый раздел",
        content: [
          {
            id: "1",
            name: "Урок 1",
            passing: "no",
            description: "",
          },
        ],
      });
    };

    // Удаление раздела курса
    const removeSection = (index: number) => {
      if (editingCourse.value.course.length > 1) {
        editingCourse.value.course.splice(index, 1);
      } else {
        showNotification("Должен быть хотя бы один раздел курса", "error");
      }
    };
    // Добавление урока в раздел
    const addLesson = (sectionIndex: number) => {
      const section = editingCourse.value.course[sectionIndex];
      const newId = (section.content.length + 1).toString();

      section.content.push({
        id: newId,
        name: `Урок ${newId}`,
        passing: "no",
        description: "", // Добавляем пустое описание для редактора
      });
    };

    // Удаление урока из раздела
    const removeLesson = (sectionIndex: number, lessonIndex: number) => {
      const section = editingCourse.value.course[sectionIndex];

      if (section.content.length > 1) {
        section.content.splice(lessonIndex, 1);
      } else {
        showNotification("Должен быть хотя бы один урок в разделе", "error");
      }
    };

    // Изменение статуса прохождения урока
    const toggleLessonPassing = (lesson: CourseItemCourseContent) => {
      lesson.passing = lesson.passing === "yes" ? "no" : "yes";
    };

    // Изменение типа курса обновляет иконку типа
    const updateIconType = (type: string) => {
      // Получаем название иконки на основе типа курса
      switch (type) {
        case "ПРОГРАММИРОВАНИЕ":
          editingCourse.value.icontype = "programIcon";
          break;
        case "ДИЗАЙН":
          editingCourse.value.icontype = "designIcon";
          break;
        case "МАРКЕТИНГ":
          editingCourse.value.icontype = "marketingIcon";
          break;
        case "МЕНЕДЖМЕНТ":
          editingCourse.value.icontype = "managementIcon";
          break;
        case "АНАЛИТИКА":
          editingCourse.value.icontype = "analyticsIcon";
          break;
        default:
          editingCourse.value.icontype = "programIcon";
          break;
      }
    };

    // Сохранение курса (создание или редактирование)
    const saveCourse = () => {
      // В реальном приложении здесь была бы загрузка файла на сервер
      // Но для учебного проекта просто сохраняем имя файла

      if (editMode.value) {
        // Редактирование существующего курса
        const index = courses.value.findIndex(
          (c) => c.id === editingCourse.value.id
        );

        if (index !== -1) {
          courses.value[index] = JSON.parse(
            JSON.stringify(editingCourse.value)
          );
          showNotification("Курс успешно обновлен!");
        } else {
          showNotification("Ошибка при обновлении курса", "error");
        }
      } else {
        // Создание нового курса
        courses.value.push(JSON.parse(JSON.stringify(editingCourse.value)));
        showNotification("Новый курс успешно создан!");
      }

      // Сохраняем обновленные данные в localStorage
      localStorage.setItem("courseData", JSON.stringify(courses.value));

      // Закрываем модальное окно
      closeModals();
    };

    // Удаление курса
    const deleteCourse = () => {
      if (deletingCourse.value) {
        const index = courses.value.findIndex(
          (c) => c.id === deletingCourse.value?.id
        );

        if (index !== -1) {
          courses.value.splice(index, 1);

          // Обновляем localStorage
          localStorage.setItem("courseData", JSON.stringify(courses.value));

          showNotification("Курс успешно удален!");
        } else {
          showNotification("Ошибка при удалении курса", "error");
        }
      }

      // Закрываем модальное окно
      closeModals();
    };

    // Показ уведомления
    const showNotification = (message: string, type = "success") => {
      notification.value = {
        show: true,
        message,
        type,
      };

      // Автоматически скрываем уведомление через 5 секунд
      setTimeout(() => {
        notification.value.show = false;
      }, 5000);
    };

    // При монтировании компонента
    onMounted(() => {
      // Проверяем авторизацию
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/signin";
        return;
      }

      // Загружаем данные курсов
      loadCourses();
    });

    return {
      courses,
      loading,
      searchQuery,
      filteredCourses,
      showEditModal,
      showDeleteModal,
      showLessonEditModal,
      editMode,
      editingCourse,
      deletingCourse,
      notification,
      courseTypes,
      courseLevels,
      courseIconFile,
      courseIconPreview,
      currentEditingLesson,
      lessonDescription,
      clearSearch,
      getIconSrc,
      handleCourseIconUpload,
      updateIconType,
      openCreateModal,
      openEditModal,
      openDeleteModal,
      openLessonEditModal,
      saveLessonDescription,
      updateLessonDescription,
      closeModals,
      addInfoItem,
      removeInfoItem,
      addSection,
      removeSection,
      addLesson,
      removeLesson,
      toggleLessonPassing,
      saveCourse,
      deleteCourse,
    };
  },
});
</script>

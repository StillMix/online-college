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
              :src="`http://127.0.0.1:8000/${course.icon}`"
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

              <label v-if="editMode" class="course-control__modal__form__label">
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
              v-for="(section, sectionIndex) in editingCourse.sections"
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
import { defineComponent, ref, computed, onMounted } from "vue";
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
    RichTextEditor,
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

    // Обработчик загрузки иконки курса
    const handleCourseIconUpload = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        courseIconFile.value = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            courseIconPreview.value = e.target.result as string;
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
    const openLessonEditModal = (sectionIndex: number, lessonIndex: number) => {
      currentSectionIndex.value = sectionIndex;
      currentLessonIndex.value = lessonIndex;

      const lesson =
        editingCourse.value.sections[sectionIndex].content[lessonIndex];
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
        editingCourse.value.sections[currentSectionIndex.value].content[
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
      const newId = (editingCourse.value.sections.length + 1).toString();

      editingCourse.value.sections.push({
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
      if (editingCourse.value.sections.length > 1) {
        editingCourse.value.sections.splice(index, 1);
      } else {
        showNotification("Должен быть хотя бы один раздел курса", "error");
      }
    };
    // Добавление урока в раздел
    const addLesson = (sectionIndex: number) => {
      const section = editingCourse.value.sections[sectionIndex];
      const newId = (section.content.length + 1).toString();

      section.content.push({
        id: newId,
        name: `Урок ${newId}`,
        passing: "no",
        description: "",
      });
    };

    // Удаление урока из раздела
    const removeLesson = (sectionIndex: number, lessonIndex: number) => {
      const section = editingCourse.value.sections[sectionIndex];

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

    // Функция для загрузки изображения курса
    const uploadCourseImage = async (courseId: string, file: File | null) => {
      if (!file) {
        return null;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `http://localhost:8000/api/courses/${courseId}/upload-image`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Ошибка при загрузке изображения: ${response.status}`
          );
        }

        const result = await response.json();
        return result.path;
      } catch (error) {
        console.error("Ошибка при загрузке изображения:", error);
        showNotification(`Ошибка при загрузке изображения: ${error}`, "error");
        return null;
      }
    };

    // Функция для обновления курса
    const updateCourse = async () => {
      try {
        // Создаем копию объекта для отправки на сервер
        const courseData = {
          ...JSON.parse(JSON.stringify(editingCourse.value)),
        };

        // Переименовываем поле sections в course для API
        courseData.course = courseData.sections;
        delete courseData.sections;

        // Отправляем запрос на обновление курса
        const response = await fetch(
          `http://localhost:8000/api/courses/${courseData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(courseData),
          }
        );

        if (!response.ok) {
          throw new Error(`Ошибка при обновлении курса: ${response.status}`);
        }

        let updatedCourse = await response.json();

        // Если есть новое изображение, загружаем его
        if (courseIconFile.value) {
          const imagePath = await uploadCourseImage(
            courseData.id,
            courseIconFile.value
          );
          if (imagePath) {
            // Обновляем путь к иконке в объекте курса
            updatedCourse.icon = imagePath;
            editingCourse.value.icon = imagePath;

            // Обновляем курс на сервере с новой иконкой
            await fetch(`http://localhost:8000/api/courses/${courseData.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...courseData,
                icon: imagePath,
              }),
            });
          }
        }

        // Обновляем курс в списке
        const index = courses.value.findIndex((c) => c.id === courseData.id);
        if (index !== -1) {
          // Преобразуем sections обратно для локального использования
          updatedCourse.sections = updatedCourse.course;
          delete updatedCourse.course;

          courses.value[index] = updatedCourse;
        }

        // Обновляем localStorage
        localStorage.setItem("courseData", JSON.stringify(courses.value));

        showNotification("Курс успешно обновлен!");
        emit("course-updated", updatedCourse);
        closeModals();
      } catch (error) {
        console.error("Ошибка при обновлении курса:", error);
        showNotification(`Ошибка при обновлении курса: ${error}`, "error");
      }
    };

    // Функция для удаления курса
    const deleteCourse = async () => {
      if (!deletingCourse.value) {
        showNotification("Не выбран курс для удаления", "error");
        return;
      }

      try {
        // Отправляем запрос на удаление курса
        const response = await fetch(
          `http://localhost:8000/api/courses/${deletingCourse.value.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`Ошибка при удалении курса: ${response.status}`);
        }

        // Удаляем курс из списка
        const index = courses.value.findIndex(
          (c) => c.id === deletingCourse.value?.id
        );
        if (index !== -1) {
          courses.value.splice(index, 1);
        }

        // Обновляем localStorage
        localStorage.setItem("courseData", JSON.stringify(courses.value));

        showNotification("Курс успешно удален!");
        emit("course-deleted", deletingCourse.value.id);
        closeModals();
      } catch (error) {
        console.error("Ошибка при удалении курса:", error);
        showNotification(`Ошибка при удалении курса: ${error}`, "error");
      }
    };

    // Создание нового курса
    const createCourse = async () => {
      try {
        // Создаем копию объекта для отправки на сервер
        const courseData = {
          ...JSON.parse(JSON.stringify(editingCourse.value)),
        };

        // Переименовываем поле sections в course для API
        courseData.course = courseData.sections;
        delete courseData.sections;

        // Отправляем запрос на создание курса
        const response = await fetch("http://localhost:8000/api/courses/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Ошибка API:", errorData);
          throw new Error(`Ошибка при создании курса: ${response.status}`);
        }

        let newCourse = await response.json();

        // Если у нас есть загруженный файл иконки, загружаем его
        if (courseIconFile.value) {
          const imagePath = await uploadCourseImage(
            newCourse.id,
            courseIconFile.value
          );
          if (imagePath) {
            newCourse.icon = imagePath;

            // Обновляем курс на сервере с новой иконкой
            await fetch(`http://localhost:8000/api/courses/${newCourse.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...courseData,
                id: newCourse.id,
                icon: imagePath,
              }),
            });
          }
        }

        // Преобразуем course обратно в sections для локального хранения
        newCourse.sections = newCourse.course || [];
        delete newCourse.course;

        // Добавляем созданный курс в список
        courses.value.push(newCourse);

        // Обновляем localStorage
        localStorage.setItem("courseData", JSON.stringify(courses.value));

        showNotification("Курс успешно создан!");
        emit("course-created", newCourse);
        closeModals();
      } catch (error) {
        console.error("Ошибка при создании курса:", error);
        showNotification(`Ошибка при создании курса: ${error}`, "error");
      }
    };

    // Функция для сохранения курса (создание или обновление)
    const saveCourse = async () => {
      if (editMode.value) {
        await updateCourse();
      } else {
        await createCourse();
      }
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

<style lang="scss">
.course-control {
  width: 100%;

  &__actions {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.563vw;

    &__button {
      display: flex;
      align-items: center;
      padding: 0.521vw 1.042vw;
      border-radius: 0.625vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-0.104vw);
      }

      &:active {
        transform: translateY(0.052vw);
      }

      &--create {
        background: #39b874;

        &:hover {
          background: #45cc83;
          box-shadow: 0 0.26vw 0.781vw rgba(57, 184, 116, 0.4);
        }

        &__icon {
          font-size: 1.25vw;
          margin-right: 0.521vw;
        }
      }
    }

    &__search {
      position: relative;
      width: 31.25vw;
      height: 2.604vw;
      display: flex;
      align-items: center;

      &__img {
        width: 1.25vw;
        height: 1.25vw;
        position: absolute;
        left: 1.042vw;
      }

      &__input {
        width: 100%;
        height: 100%;
        border-radius: 0.625vw;
        background: #363636;
        padding-left: 2.813vw;
        padding-right: 2.5vw;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.938vw;
        color: #fff;
        transition: all 0.3s ease;

        &:focus {
          background: #404040;
          box-shadow: 0 0 0.521vw rgba(8, 220, 207, 0.5);
        }
      }

      &__input::placeholder {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.938vw;
        color: #fff;
        opacity: 0.3;
      }

      &__clear {
        position: absolute;
        right: 1.042vw;
        width: 1.25vw;
        height: 1.25vw;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1vw;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }

  &__loader {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 20.833vw;
  }

  &__courses {
    display: flex;
    flex-direction: column;
    gap: 1.042vw;
  }

  &__course {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #2a2a2a;
    border-radius: 0.625vw;
    padding: 1.042vw;
    border-left: 0.313vw solid;
    transition: all 0.3s ease;

    &:hover {
      transform: translateX(0.208vw);
      box-shadow: 0 0.26vw 0.781vw rgba(0, 0, 0, 0.2);
    }

    &__content {
      display: flex;
      align-items: center;
      gap: 1.042vw;
    }

    &__icon {
      width: 3.646vw;
      height: 3.646vw;
      border-radius: 0.417vw;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &__img {
        width: 2.5vw;
        height: 2.5vw;
        opacity: 0.5;
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: 0.313vw;

      &__title {
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 1.042vw;
        color: #fff;
        margin: 0;
      }

      &__subtitle {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
      }

      &__meta {
        display: flex;
        gap: 1.042vw;
        margin-top: 0.521vw;

        &__type,
        &__level {
          display: flex;
          align-items: center;
          gap: 0.313vw;
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.729vw;
          color: rgba(255, 255, 255, 0.5);

          &__icon {
            width: 0.938vw;
            height: 0.938vw;
            opacity: 0.5;
          }
        }
      }
    }

    &__actions {
      display: flex;
      gap: 0.521vw;

      &__button {
        padding: 0.521vw 1.042vw;
        border-radius: 0.417vw;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-0.104vw);
        }

        &:active {
          transform: translateY(0.052vw);
        }

        &--edit {
          background: #363636;

          &:hover {
            background: #08dccf;
          }
        }

        &--delete {
          background: #363636;

          &:hover {
            background: #ff5b5b;
          }
        }
      }
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 20vw;

    &__con {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 2.604vw;

      &-icon {
        width: 2.604vw;
        height: 2.604vw;
        opacity: 0.3;
      }

      &-text {
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 1.042vw;
        color: #fff;
        opacity: 0.3;
      }
    }

    &__button {
      margin-top: 0.521vw;
      border-radius: 0.625vw;
      width: 10vw;
      height: 2.604vw;
      background: rgba(8, 220, 207, 0.8);
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      text-align: center;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        background: rgba(7, 201, 188, 0.8);
        transform: translateY(-0.104vw);
        box-shadow: 0 0.26vw 0.781vw rgba(8, 220, 207, 0.4);
      }

      &:active {
        transform: translateY(0.052vw);
      }
    }
  }

  &__modal,
  &__confirm {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;

    &__content {
      background: #2a2a2a;
      border-radius: 0.625vw;
      padding: 1.563vw;
      width: 60vw;
      max-width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 0.521vw 1.563vw rgba(0, 0, 0, 0.3);
      animation: scaleIn 0.3s ease;

      /* Стилизация скроллбара */
      &::-webkit-scrollbar {
        width: 0.417vw;
      }

      &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 0.521vw;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(8, 220, 207, 0.3);
        border-radius: 0.521vw;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: rgba(8, 220, 207, 0.5);
      }
    }

    &__title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 1.25vw;
      color: #fff;
      margin: 0 0 1.563vw 0;
      border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);
      padding-bottom: 0.781vw;
    }
  }

  &__confirm {
    &__content {
      width: 31.25vw;
    }

    &__text {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      color: #fff;
      line-height: 1.4;
      margin-bottom: 1.563vw;
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.781vw;

      &__button {
        padding: 0.521vw 1.042vw;
        border-radius: 0.417vw;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-0.104vw);
        }

        &:active {
          transform: translateY(0.052vw);
        }

        &--cancel {
          background: #363636;

          &:hover {
            background: #404040;
          }
        }

        &--confirm {
          background: #ff5b5b;

          &:hover {
            background: #ff7272;
            box-shadow: 0 0.26vw 0.781vw rgba(255, 91, 91, 0.4);
          }
        }
      }
    }
  }

  &__notification {
    position: fixed;
    bottom: 1.563vw;
    right: 1.563vw;
    min-width: 20.833vw;
    padding: 1.042vw 1.563vw;
    border-radius: 0.625vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1000;
    box-shadow: 0 0.521vw 1.042vw rgba(0, 0, 0, 0.25);
    animation: slideInRight 0.3s ease;

    &.success {
      background: rgba(57, 184, 116, 0.95);
    }

    &.error {
      background: rgba(255, 91, 91, 0.95);
    }

    &__text {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      color: #fff;
    }

    &__close {
      font-size: 1.25vw;
      color: #fff;
      opacity: 0.7;
      width: 1.563vw;
      height: 1.563vw;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        opacity: 1;
        transform: scale(1.1);
      }
    }
  }

  &__lesson-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100; /* Выше, чем у основного модального окна */
    animation: fadeIn 0.3s ease;

    &__content {
      background: #2a2a2a;
      border-radius: 0.625vw;
      padding: 1.563vw;
      width: 70vw;
      max-width: 95vw;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 0.521vw 1.563vw rgba(0, 0, 0, 0.3);
      animation: scaleIn 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    &__title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 1.25vw;
      color: #fff;
      margin: 0 0 1.563vw 0;
      border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);
      padding-bottom: 0.781vw;
    }

    &__editor {
      flex: 1;
      min-height: 25vw;
      margin-bottom: 1.563vw;
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.781vw;

      &__button {
        padding: 0.521vw 1.563vw;
        border-radius: 0.417vw;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.938vw;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-0.104vw);
        }

        &:active {
          transform: translateY(0.052vw);
        }

        &--cancel {
          background: #363636;

          &:hover {
            background: #404040;
          }
        }

        &--save {
          background: #39b874;

          &:hover {
            background: #45cc83;
            box-shadow: 0 0.26vw 0.781vw rgba(57, 184, 116, 0.4);
          }
        }
      }
    }
  }

  &__modal {
    &__form {
      display: flex;
      flex-direction: column;
      gap: 1.563vw;

      &__row {
        display: flex;
        gap: 1.042vw;
      }

      &__col {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.781vw;

        &--passing {
          flex: 0.5;
        }
      }

      &__label {
        display: flex;
        flex-direction: column;
        gap: 0.313vw;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        color: rgba(255, 255, 255, 0.7);

        &--checkbox {
          flex-direction: row;
          align-items: center;
          gap: 0.521vw;
        }
      }

      &__input {
        border-radius: 0.417vw;
        background: #363636;
        height: 2.083vw;
        padding: 0 0.781vw;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        color: #fff;
        transition: all 0.3s ease;

        &:focus {
          background: #404040;
          box-shadow: 0 0 0.417vw rgba(8, 220, 207, 0.5);
        }
      }

      &__select {
        appearance: none;
        background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
        background-repeat: no-repeat;
        background-position: right 0.781vw center;
        padding-right: 2.604vw;
      }

      &__checkbox {
        width: 0.938vw;
        height: 0.938vw;
        accent-color: #08dccf;
        cursor: pointer;
      }

      &__file {
        position: relative;
        display: flex;
        height: 2.083vw;

        &__input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          z-index: 1;
        }

        &__label {
          display: flex;
          align-items: center;
          padding: 0 0.781vw;
          background: #363636;
          border-radius: 0.417vw 0 0 0.417vw;
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.833vw;
          color: rgba(255, 255, 255, 0.7);
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &__button {
          padding: 0 0.781vw;
          height: 100%;
          background: #08dccf;
          border-radius: 0 0.417vw 0.417vw 0;
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.833vw;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: #09e9db;
          }
        }

        &__preview {
          margin-top: 0.521vw;
          width: 3.646vw;
          height: 3.646vw;
          border-radius: 0.417vw;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;

          img {
            max-width: 80%;
            max-height: 80%;
            object-fit: contain;
          }
        }
      }

      &__section {
        background: #363636;
        border-radius: 0.625vw;
        padding: 1.042vw;

        &__title {
          font-family: var(--font-family);
          font-weight: 500;
          font-size: 1.042vw;
          color: #fff;
          margin: 0 0 1.042vw 0;
        }

        &__item {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 0.521vw;
          padding: 1.042vw;
          margin-bottom: 1.042vw;
        }

        &__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.781vw;
        }

        &__number {
          font-family: var(--font-family);
          font-weight: 500;
          font-size: 0.938vw;
          color: #08dccf;
        }

        &__remove {
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.729vw;
          color: #ff5b5b;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            text-decoration: underline;
            opacity: 0.8;
          }
        }
      }

      &__info {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 0.521vw;
        padding: 1.042vw;
        margin-bottom: 1.042vw;

        &__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.781vw;
        }

        &__number {
          font-family: var(--font-family);
          font-weight: 500;
          font-size: 0.938vw;
          color: #08dccf;
        }

        &__remove {
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.729vw;
          color: #ff5b5b;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            text-decoration: underline;
            opacity: 0.8;
          }
        }
      }

      &__lessons {
        margin-top: 1.042vw;

        &__title {
          font-family: var(--font-family);
          font-weight: 500;
          font-size: 0.938vw;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 0.781vw 0;
        }
      }

      &__lesson {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 0.417vw;
        padding: 0.781vw;
        margin-bottom: 0.781vw;

        &__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.521vw;
        }

        &__number {
          font-family: var(--font-family);
          font-weight: 500;
          font-size: 0.833vw;
          color: rgba(255, 255, 255, 0.7);
        }

        &__remove {
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.729vw;
          color: #ff5b5b;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            text-decoration: underline;
            opacity: 0.8;
          }
        }
        &__actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.5vw;
        }

        &__edit {
          padding: 0.313vw 0.625vw;
          border-radius: 0.313vw;
          background: #08dccf;
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.729vw;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: #09e9db;
            transform: translateY(-0.052vw);
          }

          &:active {
            transform: translateY(0.052vw);
          }
        }
      }

      &__add {
        padding: 0.521vw 1.042vw;
        border-radius: 0.417vw;
        background: #08dccf;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: fit-content;

        &:hover {
          background: #09e9db;
          transform: translateY(-0.104vw);
          box-shadow: 0 0.26vw 0.781vw rgba(8, 220, 207, 0.4);
        }

        &:active {
          transform: translateY(0.052vw);
        }

        &--lesson {
          background: rgba(8, 220, 207, 0.2);
          margin-top: 0.521vw;

          &:hover {
            background: rgba(8, 220, 207, 0.4);
          }
        }
      }
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.781vw;
      margin-top: 1.563vw;

      &__button {
        padding: 0.521vw 1.563vw;
        border-radius: 0.417vw;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.938vw;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-0.104vw);
        }

        &:active {
          transform: translateY(0.052vw);
        }

        &--cancel {
          background: #363636;

          &:hover {
            background: #404040;
          }
        }

        &--save {
          background: #39b874;

          &:hover {
            background: #45cc83;
            box-shadow: 0 0.26vw 0.781vw rgba(57, 184, 116, 0.4);
          }
        }
      }
    }
  }
}

/* Анимации */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(2.083vw);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification-enter-active {
  animation: slideInRight 0.3s ease;
}

.notification-leave-active {
  animation: slideInRight 0.3s ease reverse;
}
</style>

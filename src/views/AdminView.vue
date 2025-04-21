<template>
  <div class="adminView">
    <Header />
    <div class="adminView__container">
      <h1 class="adminView__title">Администрирование курсов</h1>

      <div class="adminView__actions">
        <button
          class="adminView__actions__button adminView__actions__button--create"
          @click="openCreateModal"
        >
          <span class="adminView__actions__button__icon">+</span>
          Создать новый курс
        </button>

        <div class="adminView__actions__search">
          <img
            alt="icon"
            src="../assets/search.svg"
            class="adminView__actions__search__img"
          />
          <input
            class="adminView__actions__search__input"
            placeholder="Поиск курсов"
            v-model="searchQuery"
          />
          <button
            v-if="searchQuery"
            class="adminView__actions__search__clear"
            @click="clearSearch"
          >
            ×
          </button>
        </div>
      </div>

      <div v-if="loading" class="adminView__loader">
        <AppLoader :is-visible="true" loading-text="Загрузка курсов..." />
      </div>

      <div v-else-if="filteredCourses.length > 0" class="adminView__courses">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="adminView__course"
          :style="{ borderLeftColor: course.color }"
        >
          <div class="adminView__course__content">
            <div
              class="adminView__course__icon"
              :style="{ backgroundColor: course.color }"
            >
              <img
                :src="getIconSrc(course.icon)"
                alt="Иконка курса"
                class="adminView__course__icon__img"
              />
            </div>

            <div class="adminView__course__info">
              <h3 class="adminView__course__info__title">{{ course.title }}</h3>
              <p class="adminView__course__info__subtitle">
                {{ course.subtitle }}
              </p>
              <div class="adminView__course__info__meta">
                <span class="adminView__course__info__meta__type">
                  <img
                    :src="getIconSrc(course.icontype)"
                    alt="Тип курса"
                    class="adminView__course__info__meta__type__icon"
                  />
                  {{ course.type }}
                </span>
                <span class="adminView__course__info__meta__level">
                  <img
                    src="../assets/courseTime.svg"
                    alt="Уровень курса"
                    class="adminView__course__info__meta__level__icon"
                  />
                  {{ course.timetoendL }}
                </span>
              </div>
            </div>
          </div>

          <div class="adminView__course__actions">
            <button
              class="adminView__course__actions__button adminView__course__actions__button--edit"
              @click="openEditModal(course)"
            >
              Редактировать
            </button>
            <button
              class="adminView__course__actions__button adminView__course__actions__button--delete"
              @click="openDeleteModal(course)"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>

      <div v-else class="adminView__empty">
        <div class="adminView__empty__con">
          <img
            class="adminView__empty__con-icon"
            src="../assets/courseNone.svg"
            alt="Нет курсов"
          />
          <p class="adminView__empty__con-text">Курсы не найдены</p>
        </div>
        <button
          v-if="searchQuery"
          class="adminView__empty__button"
          @click="clearSearch"
        >
          Сбросить поиск
        </button>
      </div>
    </div>

    <!-- Модальное окно создания/редактирования курса -->
    <div
      class="adminView__modal"
      v-if="showEditModal"
      @click.self="closeModals"
    >
      <div class="adminView__modal__content">
        <h2 class="adminView__modal__title">
          {{ editMode ? "Редактирование курса" : "Создание нового курса" }}
        </h2>

        <form class="adminView__modal__form" @submit.prevent="saveCourse">
          <div class="adminView__modal__form__row">
            <div class="adminView__modal__form__col">
              <label class="adminView__modal__form__label">
                Название курса
                <input
                  type="text"
                  class="adminView__modal__form__input"
                  v-model="editingCourse.title"
                  required
                />
              </label>

              <label class="adminView__modal__form__label">
                Подзаголовок
                <input
                  type="text"
                  class="adminView__modal__form__input"
                  v-model="editingCourse.subtitle"
                  required
                />
              </label>

              <label class="adminView__modal__form__label">
                Тип курса
                <input
                  type="text"
                  class="adminView__modal__form__input"
                  v-model="editingCourse.type"
                  required
                />
              </label>

              <label class="adminView__modal__form__label">
                Уровень курса
                <input
                  type="text"
                  class="adminView__modal__form__input"
                  v-model="editingCourse.timetoendL"
                  required
                />
              </label>
            </div>

            <div class="adminView__modal__form__col">
              <label class="adminView__modal__form__label">
                Название для страницы курса
                <input
                  type="text"
                  class="adminView__modal__form__input"
                  v-model="editingCourse.titleForCourse"
                  required
                />
              </label>

              <label class="adminView__modal__form__label">
                Цвет курса
                <div class="adminView__modal__form__color">
                  <input
                    type="color"
                    class="adminView__modal__form__color__picker"
                    v-model="editingCourse.color"
                  />
                  <input
                    type="text"
                    class="adminView__modal__form__input adminView__modal__form__color__input"
                    v-model="editingCourse.color"
                    required
                  />
                </div>
              </label>

              <label class="adminView__modal__form__label">
                Название иконки курса
                <input
                  type="text"
                  class="adminView__modal__form__input"
                  v-model="editingCourse.icon"
                  required
                />
              </label>

              <label class="adminView__modal__form__label">
                Название иконки типа
                <input
                  type="text"
                  class="adminView__modal__form__input"
                  v-model="editingCourse.icontype"
                  required
                />
              </label>
            </div>
          </div>

          <div class="adminView__modal__form__section">
            <h3 class="adminView__modal__form__section__title">
              Информация о курсе
            </h3>

            <div
              v-for="(item, index) in editingCourse.info"
              :key="index"
              class="adminView__modal__form__info"
            >
              <div class="adminView__modal__form__info__header">
                <span class="adminView__modal__form__info__number">{{
                  index + 1
                }}</span>
                <button
                  type="button"
                  class="adminView__modal__form__info__remove"
                  @click="removeInfoItem(index)"
                >
                  Удалить
                </button>
              </div>

              <div class="adminView__modal__form__row">
                <div class="adminView__modal__form__col">
                  <label class="adminView__modal__form__label">
                    Заголовок
                    <input
                      type="text"
                      class="adminView__modal__form__input"
                      v-model="item.title"
                      required
                    />
                  </label>
                </div>
                <div class="adminView__modal__form__col">
                  <label class="adminView__modal__form__label">
                    Описание
                    <input
                      type="text"
                      class="adminView__modal__form__input"
                      v-model="item.subtitle"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="adminView__modal__form__add"
              @click="addInfoItem"
            >
              Добавить информацию о курсе
            </button>
          </div>

          <div class="adminView__modal__form__section">
            <h3 class="adminView__modal__form__section__title">
              Разделы курса
            </h3>

            <div
              v-for="(section, sectionIndex) in editingCourse.course"
              :key="sectionIndex"
              class="adminView__modal__form__section__item"
            >
              <div class="adminView__modal__form__section__header">
                <span class="adminView__modal__form__section__number">
                  Раздел {{ sectionIndex + 1 }}
                </span>
                <button
                  type="button"
                  class="adminView__modal__form__section__remove"
                  @click="removeSection(sectionIndex)"
                >
                  Удалить раздел
                </button>
              </div>

              <div class="adminView__modal__form__row">
                <div class="adminView__modal__form__col">
                  <label class="adminView__modal__form__label">
                    ID раздела
                    <input
                      type="text"
                      class="adminView__modal__form__input"
                      v-model="section.id"
                      required
                    />
                  </label>
                </div>
                <div class="adminView__modal__form__col">
                  <label class="adminView__modal__form__label">
                    Название раздела
                    <input
                      type="text"
                      class="adminView__modal__form__input"
                      v-model="section.name"
                      required
                    />
                  </label>
                </div>
              </div>

              <div class="adminView__modal__form__lessons">
                <h4 class="adminView__modal__form__lessons__title">
                  Уроки раздела
                </h4>

                <div
                  v-for="(lesson, lessonIndex) in section.content"
                  :key="lessonIndex"
                  class="adminView__modal__form__lesson"
                >
                  <div class="adminView__modal__form__lesson__header">
                    <span class="adminView__modal__form__lesson__number">
                      Урок {{ lessonIndex + 1 }}
                    </span>
                    <button
                      type="button"
                      class="adminView__modal__form__lesson__remove"
                      @click="removeLesson(sectionIndex, lessonIndex)"
                    >
                      Удалить
                    </button>
                  </div>

                  <div class="adminView__modal__form__row">
                    <div class="adminView__modal__form__col">
                      <label class="adminView__modal__form__label">
                        ID урока
                        <input
                          type="text"
                          class="adminView__modal__form__input"
                          v-model="lesson.id"
                          required
                        />
                      </label>
                    </div>
                    <div class="adminView__modal__form__col">
                      <label class="adminView__modal__form__label">
                        Название урока
                        <input
                          type="text"
                          class="adminView__modal__form__input"
                          v-model="lesson.name"
                          required
                        />
                      </label>
                    </div>
                    <div
                      class="adminView__modal__form__col adminView__modal__form__col--passing"
                    >
                      <label
                        class="adminView__modal__form__label adminView__modal__form__label--checkbox"
                      >
                        <input
                          type="checkbox"
                          class="adminView__modal__form__checkbox"
                          :checked="lesson.passing === 'yes'"
                          @change="toggleLessonPassing(lesson)"
                        />
                        Пройден
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  class="adminView__modal__form__add adminView__modal__form__add--lesson"
                  @click="addLesson(sectionIndex)"
                >
                  Добавить урок
                </button>
              </div>
            </div>

            <button
              type="button"
              class="adminView__modal__form__add"
              @click="addSection"
            >
              Добавить раздел курса
            </button>
          </div>

          <div class="adminView__modal__actions">
            <button
              type="button"
              class="adminView__modal__actions__button adminView__modal__actions__button--cancel"
              @click="closeModals"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="adminView__modal__actions__button adminView__modal__actions__button--save"
            >
              {{ editMode ? "Сохранить изменения" : "Создать курс" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно подтверждения удаления -->
    <div
      class="adminView__confirm"
      v-if="showDeleteModal"
      @click.self="closeModals"
    >
      <div class="adminView__confirm__content">
        <h2 class="adminView__confirm__title">Подтверждение удаления</h2>

        <p class="adminView__confirm__text">
          Вы действительно хотите удалить курс "{{ deletingCourse?.title }}"?
          <br />
          Это действие нельзя будет отменить.
        </p>

        <div class="adminView__confirm__actions">
          <button
            class="adminView__confirm__actions__button adminView__confirm__actions__button--cancel"
            @click="closeModals"
          >
            Отмена
          </button>
          <button
            class="adminView__confirm__actions__button adminView__confirm__actions__button--confirm"
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
        class="adminView__notification"
        :class="notification.type"
      >
        <p class="adminView__notification__text">{{ notification.message }}</p>
        <button
          class="adminView__notification__close"
          @click="notification.show = false"
        >
          ×
        </button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import Header from "@/components/Header.vue";
import AppLoader from "@/components/Loader.vue";

interface CourseItemInfo {
  id: string;
  title: string;
  subtitle: string;
}

interface CourseItemCourseContent {
  id: string;
  name: string;
  passing: string;
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
  name: "AdminView",
  components: {
    Header,
    AppLoader,
  },
  setup() {
    const courses = ref<CourseItem[]>([]);
    const loading = ref(true);
    const searchQuery = ref("");

    // Модальные окна
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const editMode = ref(false);

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
        return "";
      }
    };

    // Открытие модального окна создания курса
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
              },
            ],
          },
        ],
      };

      showEditModal.value = true;
    };

    // Открытие модального окна редактирования курса
    const openEditModal = (course: CourseItem) => {
      editMode.value = true;

      // Создаем глубокую копию курса для редактирования
      editingCourse.value = JSON.parse(JSON.stringify(course));

      showEditModal.value = true;
    };

    // Открытие модального окна удаления курса
    const openDeleteModal = (course: CourseItem) => {
      deletingCourse.value = course;
      showDeleteModal.value = true;
    };

    // Закрытие всех модальных окон
    const closeModals = () => {
      showEditModal.value = false;
      showDeleteModal.value = false;
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

    // Сохранение курса (создание или редактирование)
    const saveCourse = () => {
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
      editMode,
      editingCourse,
      deletingCourse,
      notification,
      clearSearch,
      getIconSrc,
      openCreateModal,
      openEditModal,
      openDeleteModal,
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

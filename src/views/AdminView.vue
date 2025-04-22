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
                <select
                  class="adminView__modal__form__input adminView__modal__form__select"
                  v-model="editingCourse.type"
                  @change="updateIconType(editingCourse.type)"
                  required
                >
                  <option v-for="type in courseTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </label>

              <label class="adminView__modal__form__label">
                Уровень курса
                <select
                  class="adminView__modal__form__input adminView__modal__form__select"
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
                Иконка курса
                <div class="adminView__modal__form__file">
                  <input
                    type="file"
                    class="adminView__modal__form__file__input"
                    @change="handleCourseIconUpload"
                    accept="image/svg+xml"
                  />
                  <span class="adminView__modal__form__file__label">
                    {{
                      courseIconFile
                        ? courseIconFile.name
                        : "Выберите SVG файл..."
                    }}
                  </span>
                  <button
                    type="button"
                    class="adminView__modal__form__file__button"
                  >
                    Обзор
                  </button>
                </div>

                <div
                  v-if="courseIconPreview"
                  class="adminView__modal__form__file__preview"
                >
                  <img :src="courseIconPreview" alt="Предпросмотр иконки" />
                </div>
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
      editMode,
      editingCourse,
      deletingCourse,
      notification,
      courseTypes,
      courseLevels,
      courseIconFile,
      courseIconPreview,
      clearSearch,
      getIconSrc,
      handleCourseIconUpload,
      updateIconType,
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

<style scoped lang="scss">
.adminView {
  width: 100%;
  min-height: 100vh;

  &__container {
    width: 71.615vw;
    max-width: 71.615vw;
    margin: 0 auto;
    padding: 1.563vw 0;
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 1.5vw;
    color: #fff;
    margin-bottom: 1.5vw;
  }

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

<!-- CourseLessons.vue -->
<template>
  <div class="course-lessons">
    <h3 class="course-lessons__title">Уроки курса</h3>

    <div class="course-lessons__section-select">
      <label class="course-lessons__label">
        Выберите раздел для добавления уроков:
        <select
          class="course-lessons__input course-lessons__select"
          v-model="currentSectionIndex"
        >
          <option
            v-for="(section, index) in sections"
            :key="section.id"
            :value="index"
          >
            Раздел {{ index + 1 }}: {{ section.name }}
          </option>
        </select>
      </label>
    </div>

    <div v-if="currentSectionIndex !== null" class="course-lessons__container">
      <h4 class="course-lessons__section-title">
        Уроки раздела "{{ sections[currentSectionIndex].name }}"
      </h4>

      <div
        v-for="(lesson, lessonIndex) in sections[currentSectionIndex].content"
        :key="lessonIndex"
        class="course-lessons__lesson"
      >
        <div class="course-lessons__lesson__header">
          <span class="course-lessons__lesson__number">
            Урок {{ lessonIndex + 1 }}
          </span>
          <button
            type="button"
            class="course-lessons__lesson__remove"
            @click="removeLesson(currentSectionIndex, lessonIndex)"
          >
            Удалить
          </button>
        </div>

        <div class="course-lessons__row">
          <div class="course-lessons__col">
            <label class="course-lessons__label">
              ID урока
              <input
                type="text"
                class="course-lessons__input"
                v-model="lesson.id"
                required
              />
            </label>
          </div>
          <div class="course-lessons__col">
            <label class="course-lessons__label">
              Название урока
              <input
                type="text"
                class="course-lessons__input"
                v-model="lesson.name"
                required
              />
            </label>
          </div>
          <div class="course-lessons__col">
            <label
              class="course-lessons__label course-lessons__label--checkbox"
            >
              <input
                type="checkbox"
                class="course-lessons__checkbox"
                :checked="lesson.passing === 'yes'"
                @change="toggleLessonPassing(lesson)"
              />
              Пройден
            </label>
          </div>
        </div>

        <div class="course-lessons__lesson__actions">
          <button
            type="button"
            class="course-lessons__lesson__edit"
            @click="$emit('edit-lesson', currentSectionIndex, lessonIndex)"
          >
            Редактировать описание
          </button>
        </div>
      </div>

      <button
        type="button"
        class="course-lessons__add"
        @click="addLesson(currentSectionIndex)"
      >
        Добавить урок
      </button>
    </div>

    <div class="course-lessons__buttons">
      <button
        type="button"
        class="course-lessons__button course-lessons__button--secondary"
        @click="$emit('back')"
      >
        Назад
      </button>
      <button
        type="button"
        class="course-lessons__button course-lessons__button--primary"
        @click="saveLessons"
      >
        Сохранить и продолжить
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { CourseItemCourseContent, CourseItemCourse } from "@/types";

export default defineComponent({
  name: "CourseLessons",
  props: {
    sections: {
      type: Array as PropType<CourseItemCourse[]>,
      required: true,
    },
  },
  emits: ["update:sections", "save", "back", "edit-lesson"],
  setup(props, { emit }) {
    const currentSectionIndex = ref<number | null>(
      props.sections.length > 0 ? 0 : null
    );

    // Следим за изменениями разделов
    watch(
      () => props.sections,
      (newSections) => {
        if (newSections.length > 0 && currentSectionIndex.value === null) {
          currentSectionIndex.value = 0;
        } else if (newSections.length === 0) {
          currentSectionIndex.value = null;
        }
      }
    );

    // Добавление урока в раздел
    const addLesson = (sectionIndex: number) => {
      if (sectionIndex === null) return;

      const section = props.sections[sectionIndex];
      const newId = (section.content.length + 1).toString();

      const updatedSections = [...props.sections];
      updatedSections[sectionIndex].content.push({
        id: newId,
        name: `Урок ${newId}`,
        passing: "no",
        description: "",
      });

      emit("update:sections", updatedSections);
    };

    // Удаление урока из раздела
    const removeLesson = (sectionIndex: number, lessonIndex: number) => {
      if (sectionIndex === null) return;

      const section = props.sections[sectionIndex];

      if (section.content.length > 1) {
        const updatedSections = [...props.sections];
        updatedSections[sectionIndex].content.splice(lessonIndex, 1);

        emit("update:sections", updatedSections);
      } else {
        emit("save", false, "Должен быть хотя бы один урок в разделе");
      }
    };

    // Переключение статуса прохождения урока
    const toggleLessonPassing = (lesson: CourseItemCourseContent) => {
      lesson.passing = lesson.passing === "yes" ? "no" : "yes";

      emit("update:sections", [...props.sections]);
    };

    // Сохранение уроков
    const saveLessons = () => {
      // Проверка наличия уроков во всех разделах
      const hasEmptySections = props.sections.some(
        (section) => !section.content || section.content.length === 0
      );

      if (hasEmptySections) {
        emit("save", false, "У каждого раздела должен быть хотя бы один урок");
        return;
      }

      // Проверка валидности уроков
      const hasInvalidLessons = props.sections.some((section) =>
        section.content.some((lesson) => !lesson.id || !lesson.name)
      );

      if (hasInvalidLessons) {
        emit("save", false, "Заполните все обязательные поля уроков");
        return;
      }

      emit("save", true);
    };

    return {
      currentSectionIndex,
      addLesson,
      removeLesson,
      toggleLessonPassing,
      saveLessons,
    };
  },
});
</script>

<style scoped lang="scss">
.course-lessons {
  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 1.042vw;
    color: #fff;
    margin: 0 0 1.042vw 0;
  }

  &__section-select {
    margin-bottom: 1.042vw;
  }

  &__section-title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 0.938vw;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 0.781vw 0;
  }

  &__container {
    margin-top: 1.042vw;
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

  &__row {
    display: flex;
    gap: 1.042vw;
  }

  &__col {
    flex: 1;

    &:last-child {
      flex: 0.5;
      display: flex;
      align-items: center;
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
      height: 100%;
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

  &__add {
    padding: 0.521vw 1.042vw;
    border-radius: 0.417vw;
    background: rgba(8, 220, 207, 0.2);
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
    margin-top: 0.521vw;

    &:hover {
      background: rgba(8, 220, 207, 0.4);
      transform: translateY(-0.104vw);
    }

    &:active {
      transform: translateY(0.052vw);
    }
  }

  &__buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.781vw;
    margin-top: 1.563vw;
  }

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

    &--secondary {
      background: #363636;

      &:hover {
        background: #404040;
      }
    }

    &--primary {
      background: #39b874;

      &:hover {
        background: #45cc83;
        box-shadow: 0 0.26vw 0.781vw rgba(57, 184, 116, 0.4);
      }
    }
  }
}
</style>

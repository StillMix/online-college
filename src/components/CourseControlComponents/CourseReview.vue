<!-- CourseReview.vue -->
<template>
  <div class="course-review">
    <h3 class="course-review__title">Обзор курса перед сохранением</h3>

    <div class="course-review__content">
      <div class="course-review__section">
        <h4 class="course-review__section-title">Основная информация</h4>
        <div class="course-review__item">
          <span class="course-review__label">Название:</span>
          <span class="course-review__value">{{ course.title }}</span>
        </div>
        <div class="course-review__item">
          <span class="course-review__label">Подзаголовок:</span>
          <span class="course-review__value">{{ course.subtitle }}</span>
        </div>
        <div class="course-review__item">
          <span class="course-review__label">Тип:</span>
          <span class="course-review__value">{{ course.type }}</span>
        </div>
        <div class="course-review__item">
          <span class="course-review__label">Уровень:</span>
          <span class="course-review__value">{{ course.timetoendL }}</span>
        </div>
      </div>

      <div class="course-review__section">
        <h4 class="course-review__section-title">Разделы и уроки</h4>
        <div
          v-for="(section, sIndex) in course.sections"
          :key="section.id"
          class="course-review__section"
        >
          <h5 class="course-review__subtitle">
            Раздел {{ sIndex + 1 }}: {{ section.name }}
          </h5>
          <div
            v-for="(lesson, lIndex) in section.content"
            :key="lesson.id"
            class="course-review__item course-review__item--indented"
          >
            <span class="course-review__label">Урок {{ lIndex + 1 }}:</span>
            <span class="course-review__value">{{ lesson.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="course-review__buttons">
      <button
        type="button"
        class="course-review__button course-review__button--secondary"
        @click="$emit('back')"
      >
        Назад
      </button>
      <button
        type="button"
        class="course-review__button course-review__button--primary"
        @click="$emit('save')"
      >
        Сохранить курс
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

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
  name: "CourseReview",
  props: {
    course: {
      type: Object as PropType<CourseItem>,
      required: true,
    },
  },
  emits: ["save", "back"],
});
</script>

<style scoped lang="scss">
.course-review {
  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 1.042vw;
    color: #fff;
    margin: 0 0 1.563vw 0;
  }

  &__content {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0.625vw;
    padding: 1.042vw;
  }

  &__section {
    margin-bottom: 1.563vw;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__section-title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 0.938vw;
    color: #08dccf;
    margin: 0 0 0.781vw 0;
    padding-bottom: 0.313vw;
    border-bottom: 0.052vw solid rgba(8, 220, 207, 0.2);
  }

  &__subtitle {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 0.833vw;
    color: rgba(255, 255, 255, 0.8);
    margin: 0.781vw 0 0.521vw 0;
  }

  &__item {
    display: flex;
    margin-bottom: 0.313vw;

    &--indented {
      margin-left: 1.042vw;
    }
  }

  &__label {
    width: 10vw;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.833vw;
    color: rgba(255, 255, 255, 0.6);
  }

  &__value {
    flex: 1;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.833vw;
    color: #fff;
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

<template>
  <div class="course-item" :style="{ borderLeftColor: course.color }">
    <div class="course-item__content">
      <div class="course-item__icon" :style="{ backgroundColor: course.color }">
        <img
          :src="`http://127.0.0.1:8000/${course.icon}`"
          alt="Иконка курса"
          class="course-item__icon__img"
        />
      </div>

      <div class="course-item__info">
        <h3 class="course-item__info__title">
          {{ course.title }}
        </h3>
        <p class="course-item__info__subtitle">
          {{ course.subtitle }}
        </p>
        <div class="course-item__info__meta">
          <span class="course-item__info__meta__type">
            <img
              :src="getIconSrc(course.icontype)"
              alt="Тип курса"
              class="course-item__info__meta__type__icon"
            />
            {{ course.type }}
          </span>
          <span class="course-item__info__meta__level">
            <img
              src="@/assets/courseTime.svg"
              alt="Уровень курса"
              class="course-item__info__meta__level__icon"
            />
            {{ course.timetoendL }}
          </span>
        </div>
      </div>
    </div>

    <div class="course-item__actions">
      <button
        class="course-item__actions__button course-item__actions__button--edit"
        @click="$emit('edit', course)"
      >
        Редактировать
      </button>
      <button
        class="course-item__actions__button course-item__actions__button--delete"
        @click="$emit('delete', course)"
      >
        Удалить
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
  name: "CourseItem",
  props: {
    course: {
      type: Object as PropType<CourseItem>,
      required: true,
    },
  },
  emits: ["edit", "delete"],
  setup() {
    // Получение пути к иконке
    const getIconSrc = (iconName: string) => {
      try {
        return require(`@/assets/${iconName}.svg`);
      } catch (error) {
        console.error(`Иконка ${iconName} не найдена:`, error);
        return require("@/assets/courseNone.svg");
      }
    };

    return {
      getIconSrc,
    };
  },
});
</script>

<style scoped lang="scss">
.course-item {
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
</style>

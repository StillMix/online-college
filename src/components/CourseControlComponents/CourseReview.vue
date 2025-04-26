<!-- CourseReview.vue -->
<template>
    <div class="course-review">
      <h3 class="course-review__title">
        Обзор курса перед сохранением
      </h3>
  
      <div class="course-review__content">
        <div class="course-review__section">
          <h4 class="course-review__section-title">
            Основная информация
          </h4>
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
          <h4 class="course-review__section-title">
            Информация о курсе
          </h4>
          <div 
            v-for="(info, index) in course.info" 
            :key="'info-' + index" 
            class="course-review__item course-review__item--info"
          >
            <span class="course-review__label">{{ info.title }}:</span>
            <span class="course-review__value">{{ info.subtitle }}</span>
          </div>
        </div>
  
        <div class="course-review__section">
          <h4 class="course-review__section-title">
            Разделы и уроки
          </h4>
          <div
            v-for="(section, sIndex) in course.sections"
            :key="'section-' + sIndex"
            class="course-review__section course-review__subsection"
          >
            <h5 class="course-review__subtitle">
              Раздел {{ sIndex + 1 }}: {{ section.name }}
            </h5>
            <div
              v-for="(lesson, lIndex) in section.content"
              :key="'lesson-' + sIndex + '-' + lIndex"
              class="course-review__item course-review__item--indented"
            >
              <span class="course-review__label">Урок {{ lIndex + 1 }}:</span>
              <span class="course-review__value">
                {{ lesson.name }}
                <span 
                  v-if="lesson.passing === 'yes'" 
                  class="course-review__passed"
                >(Пройден)</span>
              </span>
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
          @click="$emit('finalize')"
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
    emits: ["back", "finalize"],
  });
  </script>
  
  <style scoped lang="scss">
  .course-review {
    &__title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 1.042vw;
      color: #fff;
      margin: 0 0 1.042vw 0;
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
  
    &__subsection {
      margin-left: 1.042vw;
      margin-bottom: 1.042vw;
      padding-left: 1.042vw;
      border-left: 0.104vw solid rgba(8, 220, 207, 0.3);
    }
  
    &__section-title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 0.938vw;
      color: #08dccf;
      margin: 0 0 0.781vw 0;
      padding-bottom: 0.313vw;
      border-bottom: 0.052vw solid rgba(8, 220, 207, 0.3);
    }
  
    &__subtitle {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 0.833vw;
      color: #fff;
      margin: 0 0 0.521vw 0;
    }
  
    &__item {
      display: flex;
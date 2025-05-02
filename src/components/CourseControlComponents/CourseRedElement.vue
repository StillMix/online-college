<template>
  <div class="course-RedEl">
    <img
      v-if="course.icon"
      class="course-RedEl__img"
      :src="`http://195.133.50.207/${course.icon}`"
      alt="Course icon"
    />
    <div class="course-RedEl__con">
      <p class="course-RedEl__con__title">{{ course.title }}</p>
      <p class="course-RedEl__con__subtitle">{{ course.subtitle }}</p>
    </div>
    <div class="course-RedEl__conbtn">
      <AppButton
        :styleOverrides="{
          width: '9.177vw',
          backgroundColor: 'white',
          color: 'black',
        }"
        @click="$emit('click')"
      >
        Редактировать
      </AppButton>
      <AppButton
        :styleOverrides="{
          width: '7.177vw',
          backgroundColor: 'red',
          color: 'white',
        }"
        @click="deleteCard()"
      >
        Удалить
      </AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { AppButton } from "../UI";
import { CourseItem } from "@/types";
import { courseApi } from "@/api";

export default defineComponent({
  name: "CourseRedElement",
  props: {
    course: {
      type: Object as PropType<CourseItem>,
      required: true,
    },
  },
  components: { AppButton },
  emits: ["click"],
  setup() {
    return {};
  },
  methods: {
    async deleteCard() {
      try {
        await courseApi.deleteCourse(this.course.id);
        console.log("Курс удалён:", this.course.id);
        await courseApi.getAllCourses();
      } catch (error) {
        console.error("Ошибка при загрузке курсов:", error);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.course-RedEl {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #2a2a2a;
  border-radius: 0.625vw;
  padding: 1.042vw;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0.104vw 0.417vw rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-0.104vw);
    background-color: #333333;
    box-shadow: 0 0.26vw 0.781vw rgba(0, 0, 0, 0.2);

    &::after {
      opacity: 1;
    }
  }

  // Эффект градиентной подсветки при наведении
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.156vw;
    background: linear-gradient(90deg, #08dccf, #0099ff);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &__img {
    flex-shrink: 0;
    width: 3.125vw;
    height: 3.125vw;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 1.042vw;
    border: 0.104vw solid rgba(255, 255, 255, 0.1);
    background-color: #363636;
    transition: all 0.3s ease;
    box-shadow: 0 0.208vw 0.417vw rgba(0, 0, 0, 0.15);

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 0.313vw 0.625vw rgba(8, 220, 207, 0.3);
    }
  }

  &__con {
    flex: 1;
    padding-right: 1.042vw;

    &__title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 1.042vw;
      color: #fff;
      margin-bottom: 0.313vw;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__subtitle {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__conbtn {
    display: flex;
    gap: 0.781vw;
    flex-shrink: 0;
    transition: opacity 0.3s ease;
    align-items: center;

    // Анимация появления кнопок при наведении
    opacity: 0.8;

    .course-RedEl:hover & {
      opacity: 1;
    }
  }
}
</style>

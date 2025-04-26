<template>
  <div class="course-RedEl">
    <img
      v-if="course.icon"
      class="course-RedEl__img"
      :src="`http://127.0.0.1:8000/${course.icon}`"
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
  flex-wrap: nowrap;
  gap: 10px;
  width: 100%;
  background-color: #3b3b3b;
  border-radius: 10px;
  align-items: center;
  padding: 5px;
  &__img {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 100%;
  }
  &__con {
    width: 100%;
  }
  &__conbtn {
    flex-shrink: 0;
    display: flex;
    gap: 10px;
  }
}
</style>

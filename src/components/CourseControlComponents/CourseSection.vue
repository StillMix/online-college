<template>
  <div class="course-sectioninfo">
    <AppInput
      :styleLabel="{
        margin: '0',
      }"
      :styleInput="{
        width: '20vw',
      }"
      type="text"
      placeholder="Название"
      required
    />
    <div class="course-sectioninfo__lessons">
      <CourseLessons />
    </div>
    <AppButton
      :styleOverrides="{
        width: '11.177vw',
        backgroundColor: 'white',
        color: 'black',
      }"
    >
      Добавить урок
    </AppButton>
    <AppButton
      :styleOverrides="{
        width: '11.177vw',
        backgroundColor: 'white',
        color: 'black',
      }"
    >
      Сохранить
    </AppButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AppInput, AppButton } from "../UI";
import CourseLessons from "./CourseLessons.vue";

export default defineComponent({
  name: "CourseSection",
  components: { AppInput, AppButton, CourseLessons },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.course-sectioninfo {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  background-color: #212121;
  border-radius: 10px;
  padding: 5px;
  &__selImg {
    width: 150px;
    height: 150px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #363636;
    border-radius: 20px;
    overflow: hidden;
    &__input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    &__prew {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      &__img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
</style>

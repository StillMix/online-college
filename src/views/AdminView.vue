<template>
  <div class="adminView">
    <Header />
    <div class="adminView__container">
      <h1 class="adminView__title">Панель администрирования</h1>

      <CourseControl />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";
import CourseControl from "@/components/CourseControl.vue";

export default defineComponent({
  name: "AdminView",
  components: {
    Header,
    CourseControl,
  },
  setup() {
    // Здесь могут быть методы и данные, специфичные для AdminView
    // Теперь вся логика работы с курсами перенесена в CourseControl

    return {};
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
}
</style>

<template>
  <div class="course-popup">
    <p class="course-popup__card">
      <CourseMainInfo />
      <CourseInfo />
      <CourseSection />
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CourseMainInfo from "./CourseMainInfo.vue";
import CourseInfo from "./CourseInfo.vue";
import CourseSection from "./CourseSection.vue";

export default defineComponent({
  name: "CoursePopupRed",
  components: { CourseMainInfo, CourseInfo, CourseSection },
});
</script>

<style lang="scss" scoped>
.course-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.397);
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;
  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    max-height: 98%;
    padding: 20px;
    width: 72.552vw;
    background-color: #404640;
    border-radius: 20px;
  }
}
</style>

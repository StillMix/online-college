<template>
  <div class="CourseLessonDescriptionEdit">
    <CourseDesHeader />
    <CourseDesAddImg />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CourseDesHeader from "./CourseDesHeader.vue";
import CourseDesAddImg from "./CourseDesAddImg.vue";

export default defineComponent({
  name: "CourseLessonDescriptionEdit",
  components: { CourseDesHeader, CourseDesAddImg },
});
</script>

<style lang="scss">
.CourseLessonDescriptionEdit {
  width: 100%;
  height: 300px;
  background-color: #292929;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}
</style>

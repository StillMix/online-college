<template>
  <div class="course-control">
    <div class="course-control__actions">
      <AppButton
        :styleOverrides="{
          width: '11.177vw',
          backgroundColor: 'white',
          color: 'black',
        }"
      >
        Создать новый курс
      </AppButton>
      <CoursePopupRed />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AppButton } from "./UI";
import CoursePopupRed from "./CourseControlComponents/CoursePopupRed.vue";

export default defineComponent({
  name: "CourseControl",
  components: {
    AppButton,
    CoursePopupRed,
  },
});
</script>

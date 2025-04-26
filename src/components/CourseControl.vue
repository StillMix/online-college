<template>
  <div class="course-control">
    <div class="course-control__actions">
      <AppButton
        :styleOverrides="{
          width: '11.177vw',
          backgroundColor: 'white',
          color: 'black',
        }"
        @click="toggleCourse(true)"
      >
        Создать новый курс
      </AppButton>
      <div class="course-control__actions__cards">
        <CourseRedElement
          @click="toggleCourse(false, item)"
          v-for="item in parsedCourseData"
          :key="item.id"
          :course="item"
        />
      </div>
      <CoursePopupRed
        v-if="redCourseOpen"
        :elemRed="itemRed"
        :edit="edit"
        @click="toggleCourse"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { AppButton } from "./UI";
import { CourseItem } from "@/types";
import CoursePopupRed from "./CourseControlComponents/CoursePopupRed.vue";
import CourseRedElement from "./CourseControlComponents/CourseRedElement.vue";

export default defineComponent({
  name: "CourseControl",
  components: {
    AppButton,
    CoursePopupRed,
    CourseRedElement,
  },
  setup() {
    const redCourseOpen = ref(false);
    const edit = ref(false);
    const itemRed = ref<CourseItem | undefined>(undefined); // Изменен тип на CourseItem | undefined
    const parsedCourseData = ref<CourseItem[]>([]);
    const toggleCourse = (isEdit = false, item?: CourseItem) => {
      redCourseOpen.value = !redCourseOpen.value;
      edit.value = isEdit;

      if (!isEdit) {
        itemRed.value = item; // Если item нет, оставляем undefined
      }
    };

    onMounted(() => {
      const courseDataStr = localStorage.getItem("courseData");
      if (courseDataStr) {
        try {
          parsedCourseData.value = JSON.parse(courseDataStr);
        } catch (e) {
          console.error("Ошибка при парсинге данных:", e);
          parsedCourseData.value = [];
        }
      } else {
        console.warn("Данные курсов не найдены в localStorage");
        // Можно добавить тестовые данные, если нужно
      }
    });
    return {
      redCourseOpen,
      edit,
      itemRed,
      toggleCourse,
      parsedCourseData,
    };
  },
});
</script>

<style lang="scss" scoped>
.course-control__actions__cards {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  gap: 10px;
}
</style>

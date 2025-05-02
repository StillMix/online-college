<!-- Обновленная часть в src/components/CourseControl.vue -->
<template>
  <div class="course-control">
    <div class="course-control__actions">
      <div class="course-control__buttons">
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

        <AppButton
          :styleOverrides="{
            width: '11.177vw',
            backgroundColor: '#08dccf',
            color: 'black',
            marginLeft: '10px',
          }"
          @click="toggleImportPdf"
        >
          Импорт из PDF
        </AppButton>
      </div>

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
        :edit="edit"
        :elemRed="itemRed"
        @click="toggleCourse"
      />

      <CourseImportPdf
        v-if="showImportPdf"
        @close="showImportPdf = false"
        @import-complete="handleImportComplete"
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
import CourseImportPdf from "./CourseControlComponents/CourseImportPdf.vue";

export default defineComponent({
  name: "CourseControl",
  components: {
    AppButton,
    CoursePopupRed,
    CourseRedElement,
    CourseImportPdf,
  },
  setup() {
    const redCourseOpen = ref(false);
    const edit = ref(false);
    const itemRed = ref<CourseItem | undefined>(undefined);
    const parsedCourseData = ref<CourseItem[]>([]);
    const showImportPdf = ref(false);

    const toggleCourse = (isEdit = false, item?: CourseItem) => {
      redCourseOpen.value = !redCourseOpen.value;
      edit.value = isEdit;

      if (!isEdit) {
        itemRed.value = item;
      }
    };

    const toggleImportPdf = () => {
      showImportPdf.value = !showImportPdf.value;
      redCourseOpen.value = false;
    };

    const handleImportComplete = async (courseId: string) => {
      // Обновляем список курсов при успешном импорте
      await loadCourses();
      showImportPdf.value = false;
    };

    const loadCourses = async () => {
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
      }
    };

    onMounted(() => {
      loadCourses();
    });

    return {
      redCourseOpen,
      edit,
      itemRed,
      toggleCourse,
      parsedCourseData,
      showImportPdf,
      toggleImportPdf,
      handleImportComplete,
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

.course-control__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.521vw;
}
</style>

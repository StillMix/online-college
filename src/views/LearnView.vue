<template>
  <div class="HomeView">
    <Header />
    <div v-if="selectedLearn" v-html="selectedLearn.description"></div>
    <div v-else>Описание недоступно</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Header from "@/components/Header.vue";

interface CourseItemCourse {
  id: string;
  name: string;
  description: string;
  passing: string;
}

export default defineComponent({
  name: "LearnView",
  components: {
    Header,
  },

  setup() {
    const selectedLearn = ref<CourseItemCourse | null>(null);

    // Загрузка данных при монтировании
    onMounted(() => {
      const courseDataStr = localStorage.getItem("courseSelect");
      if (courseDataStr) {
        try {
          selectedLearn.value = JSON.parse(courseDataStr);
          console.log(selectedLearn.value);
        } catch (e) {
          console.error("Ошибка при парсинге данных:", e);
          selectedLearn.value = null;
        }
      } else {
        console.warn("Данные курсов не найдены в localStorage");
        // Можно добавить тестовые данные, если нужно
      }
    });

    return { selectedLearn };
  },
});
</script>

<style lang="scss"></style>

<!-- HomeView.vue -->
<template>
  <div class="HomeView">
    <Header />
    <label class="HomeView__label">
      <img alt="icon" src="../assets/search.svg" class="HomeView__label__img" />
      <input class="HomeView__label__input" placeholder="Найти курсы" />
    </label>
    <div class="HomeView__cards">
      <CourseCard
        v-for="item in parsedCourseData"
        :key="item.id"
        :course="item"
        @click="openCourse(item)"
      />
    </div>
    <CoursePopup
      :courseVib="selectedCourse"
      :open="isPopupOpen"
      @close="closePopup"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Header from "@/components/Header.vue";
import CourseCard from "@/components/CourseCard.vue";
import CoursePopup from "@/components/CoursePopup.vue";

interface CourseItemInfo {
  id: string;
  title: string;
  subtitle: string;
}

interface CourseItem {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  timetoendL: string;
  color: string;
  icon: string;
  icontype: string;
  titleForCourse: string;
  info: CourseItemInfo[];
}

export default defineComponent({
  name: "HomeView",
  components: {
    Header,
    CourseCard,
    CoursePopup,
  },
  setup() {
    const parsedCourseData = ref<CourseItem[]>([]);
    const selectedCourse = ref<CourseItem | null>(null);
    const isPopupOpen = ref(false);

    // Открытие курса
    const openCourse = (course: CourseItem) => {
      selectedCourse.value = course;
      // Задаем небольшую задержку, чтобы Vue успел обновить selectedCourse
      setTimeout(() => {
        isPopupOpen.value = true;
      }, 50);
    };

    // Закрытие попапа
    const closePopup = () => {
      isPopupOpen.value = false;

      // Очищаем выбранный курс только после завершения анимации закрытия
      setTimeout(() => {
        selectedCourse.value = null;
      }, 200);
    };

    // Загрузка данных при монтировании
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
      parsedCourseData,
      selectedCourse,
      isPopupOpen,
      openCourse,
      closePopup,
    };
  },
});
</script>

<style lang="scss">
.HomeView {
  &__label {
    width: 100%;
    height: 2.604vw;
    display: flex;
    align-items: center;
    position: relative;
    &__img {
      width: 1.25vw;
      height: 1.25vw;
      position: absolute;
      left: 1.042vw;
    }
    &__input {
      width: 100%;
      height: 100%;
      border-radius: 7.292vw;
      background: #363636;
      padding-left: 2.813vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      color: #fff;
    }
    &__input::placeholder {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      color: #fff;
      opacity: 0.3;
    }
  }
  &__cards {
    width: 71.615vw;
    display: flex;
    flex-wrap: wrap;
    gap: 0.677vw;
    margin-top: 1.042vw;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>

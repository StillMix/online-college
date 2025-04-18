<!-- HomeView.vue -->
<template>
  <div class="HomeView">
    <Header />
    <label class="HomeView__label">
      <img alt="icon" src="../assets/search.svg" class="HomeView__label__img" />
      <input
        class="HomeView__label__input"
        placeholder="Найти курсы"
        v-model="searchQuery"
      />
      <button
        v-if="searchQuery"
        class="HomeView__label__clear"
        @click="clearSearch"
      >
        ×
      </button>
    </label>
    <div v-if="filteredCourses.length > 0" class="HomeView__cards">
      <CourseCard
        v-for="item in filteredCourses"
        :key="item.id"
        :course="item"
        @click="openCourse(item)"
      />
    </div>
    <div v-else class="HomeView__empty">
      <div class="HomeView__empty__con">
        <img
          class="HomeView__empty__con-icon"
          src="../assets/courseNone.svg"
          alt="Нет курсов"
        />
        <p class="HomeView__empty__con-text">Курсы не найдены</p>
      </div>
      <button
        v-if="searchQuery"
        class="HomeView__find-button"
        @click="clearSearch"
      >
        Сбросить поиск
      </button>
    </div>
    <CoursePopup
      :courseVib="selectedCourse"
      :open="isPopupOpen"
      @close="closePopup"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
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
    const searchQuery = ref("");

    // Отфильтрованные курсы на основе поискового запроса
    const filteredCourses = computed(() => {
      if (!searchQuery.value.trim()) {
        return parsedCourseData.value;
      }
      const query = searchQuery.value.toLowerCase().trim();
      return parsedCourseData.value.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.subtitle.toLowerCase().includes(query) ||
          course.type.toLowerCase().includes(query)
      );
    });

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

    // Очистка поиска
    const clearSearch = () => {
      searchQuery.value = "";
    };

    return {
      parsedCourseData,
      selectedCourse,
      isPopupOpen,
      openCourse,
      closePopup,
      searchQuery,
      filteredCourses,
      clearSearch,
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
      padding-right: 2.5vw;
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
    &__clear {
      position: absolute;
      right: 1.042vw;
      width: 1.25vw;
      height: 1.25vw;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1vw;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
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

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 20vw;
    margin-top: 1.042vw;
    &__con {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 2.604vw;
      &-icon {
        width: 2.604vw;
        height: 2.604vw;
        opacity: 0.3;
      }

      &-text {
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 1.042vw;
        color: #fff;
        opacity: 0.3;
      }
    }
  }

  &__find-button {
    margin-top: 0.521vw;
    border-radius: 7.292vw;
    width: 10vw;
    height: 2.604vw;
    background: rgba(8, 220, 207, 0.8);
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.938vw;
    text-align: center;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: rgba(7, 201, 188, 0.8);
      transform: translateY(-0.104vw);
      box-shadow: 0 0.26vw 0.781vw rgba(8, 220, 207, 0.4);
    }

    &:active {
      transform: translateY(0.052vw);
    }
  }
}
</style>

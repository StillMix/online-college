<template>
  <div class="CourseView">
    <Header />
    <div class="CourseView__content">
      <h1 class="CourseView__title">Мои курсы</h1>
      <div v-if="userCourses.length > 0" class="CourseView__courses">
        <CourseCard
          v-for="course in userCourses"
          :key="course.id"
          :course="course"
          @click="openCourse(course)"
        />
      </div>
      <div v-else class="CourseView__empty">
        <div class="CourseView__empty__con">
          <img
            class="CourseView__empty__con-icon"
            src="../assets/courseNone.svg"
            alt="Нет курсов"
          />
          <p class="CourseView__empty__con-text">Курсы не найдены</p>
        </div>
        <router-link to="/" class="CourseView__find-button"
          >Найти курсы</router-link
        >
      </div>
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

interface CourseItemCourseContent {
  id: string;
  name: string;
  passing: string;
}

interface CourseItemCourse {
  id: string;
  name: string;
  content: CourseItemCourseContent[];
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
  course: CourseItemCourse[];
}

export default defineComponent({
  name: "CourseView",
  components: {
    Header,
    CourseCard,
    CoursePopup,
  },
  setup() {
    const userCourses = ref<CourseItem[]>([]);
    const selectedCourse = ref<CourseItem | null>(null);
    const isPopupOpen = ref(false);

    // Загрузка данных курсов пользователя
    const loadUserCourses = () => {
      // Получаем идентификаторы курсов пользователя
      const userCoursesIds = localStorage.getItem("userCourses");

      if (!userCoursesIds) return;

      try {
        // Парсим идентификаторы
        const courseIds: string[] = JSON.parse(userCoursesIds);

        // Получаем все курсы из localStorage
        const allCoursesStr = localStorage.getItem("courseData");
        if (!allCoursesStr) return;

        const allCourses: CourseItem[] = JSON.parse(allCoursesStr);

        // Фильтруем только те курсы, ID которых есть в списке пользователя
        userCourses.value = allCourses.filter((course) =>
          courseIds.includes(course.id)
        );
      } catch (error) {
        console.error("Ошибка при загрузке данных курсов:", error);
      }
    };

    // Открытие информации о курсе
    const openCourse = (course: CourseItem) => {
      selectedCourse.value = course;
      setTimeout(() => {
        isPopupOpen.value = true;
      }, 50);
    };

    // Закрытие попапа
    const closePopup = () => {
      isPopupOpen.value = false;
      setTimeout(() => {
        selectedCourse.value = null;
      }, 200);

      // После закрытия попапа обновляем список курсов,
      // так как пользователь мог отказаться от курса
      loadUserCourses();
    };

    onMounted(() => {
      loadUserCourses();

      // Добавляем слушатель события storage для случая,
      // если пользователь изменит список курсов в другой вкладке
      window.addEventListener("storage", (event) => {
        if (event.key === "userCourses") {
          loadUserCourses();
        }
      });
    });

    return {
      userCourses,
      selectedCourse,
      isPopupOpen,
      openCourse,
      closePopup,
    };
  },
});
</script>

<style scoped lang="scss">
.CourseView {
  width: 100%;

  &__content {
    padding: 1.042vw 0;
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 1.5vw;
    color: #fff;
    margin-bottom: 1.5vw;
  }

  &__courses {
    display: flex;
    flex-wrap: wrap;
    gap: 0.677vw;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 20vw;

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

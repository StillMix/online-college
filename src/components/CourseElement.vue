<template>
  <div
    class="courseElement"
    @click="toggleExpand"
    :style="{
      height: isExpanded ? '362px' : '87px',
    }"
  >
    <div class="courseElement__header">
      <div class="courseElement__header__info">
        <p class="courseElement__header__info__title">
          {{ CourseVib.id }}. {{ CourseVib.name }}
        </p>
        <p class="courseElement__header__info__subtitle">
          {{ CourseVib.content.length }}
          {{ getLessonWord(CourseVib.content.length) }}
        </p>
      </div>
      <p class="courseElement__header__progress">
        ({{ getCompletedLessonsCount() }} / {{ CourseVib.content.length }})
      </p>
    </div>
    <div class="courseElement__coursesscroll">
      <div class="courseElement__courses-container" v-if="isExpanded">
        <router-link
          class="courseElement__courses"
          v-for="item in CourseVib.content"
          :key="item.id"
          :to="`/course/${CourseVib.id}/${item.id}`"
        >
          <p class="courseElement__courses__title">
            {{ item.id }}. {{ item.name }}
          </p>
          <img
            v-if="item.passing === 'yes'"
            alt="passing"
            class="courseElement__courses__img"
            src="../assets/coursePar.svg"
          />
        </router-link>
      </div>
    </div>

    <div
      class="courseElement__progress"
      :style="{
        width: `${getProgressPercentage()}%`,
        backgroundColor:
          getProgressPercentage() === 100 ? '#00ad45' : '#bdc014',
      }"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

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

export default defineComponent({
  name: "CourseElement",
  props: {
    CourseVib: {
      type: Object as PropType<CourseItemCourse>,
      required: true,
    },
  },
  setup() {
    const isExpanded = ref(false);

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value;
    };

    return {
      isExpanded,
      toggleExpand,
    };
  },
  methods: {
    handleClick() {
      this.$emit("courseSelected", this.CourseVib);
    },
    getLessonWord(count: number) {
      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;

      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return "уроков";
      }

      if (lastDigit === 1) {
        return "урок";
      }

      if (lastDigit >= 2 && lastDigit <= 4) {
        return "урока";
      }

      return "уроков";
    },
    getCompletedLessonsCount() {
      // Подсчитываем количество пройденных уроков (где passing === "yes")
      return this.CourseVib.content.filter((lesson) => lesson.passing === "yes")
        .length;
    },
    getProgressPercentage() {
      if (this.CourseVib.content.length === 0) return 0;
      const completedCount = this.getCompletedLessonsCount();
      return Math.round((completedCount / this.CourseVib.content.length) * 100);
    },
  },
});
</script>

<style scoped lang="scss">
.courseElement {
  display: block;
  width: 100%;
  border-radius: 10px;
  background: #363636;
  text-decoration: none;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  padding: 0 30px;
  margin-bottom: 15px;
  cursor: pointer;

  &:hover {
    transform: translateX(0.2vw);
    box-shadow: 0 0.26vw 0.52vw rgba(0, 0, 0, 0.1);
  }
  &__coursesscroll {
    overflow-y: auto;
    overflow-x: none;
    height: 245px;
  }
  &__courses-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;
    padding-bottom: 15px;
  }

  &__courses {
    border-radius: 140px;
    width: 100%;
    height: 41px;
    background: #404040;
    display: flex;
    padding: 0 30px;
    align-items: center;
    justify-content: space-between;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      background: #4c4c4c;
      transform: translateX(5px);
    }

    &__title {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 18px;
      color: #fff;
    }
    &__img {
      width: 24px;
      height: 24px;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 87px;
    &__info {
      &__title {
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 24px;
        color: #fff;
      }

      &__subtitle {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 18px;
        line-height: 111%;
        color: #fff;
        opacity: 0.5;
      }
    }

    &__progress {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 24px;
      text-align: right;
      color: rgba(255, 255, 255, 0.3);
    }
  }

  &__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    transition: width 0.5s ease, background-color 0.5s ease;
  }
}
</style>

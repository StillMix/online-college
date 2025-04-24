<template>
  <div
    ref="elementRef"
    class="courseElement"
    @click="toggleExpand"
    :style="{
      height: isExpanded ? '18.854vw' : '4.531vw',
    }"
  >
    <div class="courseElement__header">
      <div class="courseElement__header__info">
        <p class="courseElement__header__info__title">
          {{ index + 1 }}. {{ CourseVib.name }}
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
          v-for="(item, index) in CourseVib.content"
          :key="item.id"
          :to="`/course/learn`"
          @click="courseClick(item)"
        >
          <p class="courseElement__courses__title">
            {{ index + 1 }}. {{ item.name }}
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
import { defineComponent, PropType, ref, onMounted } from "vue";

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

// Создаем глобальную переменную для хранения ID открытого элемента
let openedElementId: string | null = null;

export default defineComponent({
  name: "CourseElement",
  props: {
    CourseVib: {
      type: Object as PropType<CourseItemCourse>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const isExpanded = ref(false);
    const elementRef = ref<HTMLElement | null>(null);

    const toggleExpand = (event: Event) => {
      // Останавливаем всплытие события
      event.stopPropagation();

      // Если текущий элемент уже открыт, просто закрываем его
      if (isExpanded.value) {
        isExpanded.value = false;
        openedElementId = null;
        return;
      }

      // Если открываем новый элемент
      // Проверяем, был ли уже открыт какой-то элемент
      const previouslyOpened = openedElementId;

      // Устанавливаем текущий элемент как открытый
      openedElementId = props.CourseVib.id;
      isExpanded.value = true;

      // Ищем и закрываем все другие элементы
      if (previouslyOpened && previouslyOpened !== props.CourseVib.id) {
        const allElements = document.querySelectorAll(".courseElement");
        allElements.forEach((element) => {
          const courseId = element.getAttribute("data-course-id");
          if (courseId !== props.CourseVib.id) {
            const vm = (element as any).__vue__;
            if (vm && typeof vm.closeElement === "function") {
              vm.closeElement();
            }
          }
        });
      }
    };

    // Метод для принудительного закрытия элемента (вызывается извне)
    const closeElement = () => {
      isExpanded.value = false;
    };

    // После монтирования добавляем атрибут с ID для идентификации элемента
    onMounted(() => {
      if (elementRef.value) {
        elementRef.value.setAttribute("data-course-id", props.CourseVib.id);
        // Сохраняем ссылку на методы компонента в DOM-элементе
        (elementRef.value as any).__vue__ = { closeElement };
      }
    });

    return {
      isExpanded,
      toggleExpand,
      elementRef,
      closeElement,
    };
  },
  methods: {
    courseClick(items: any) {
      localStorage.setItem("courseSelect", JSON.stringify(items));
    },
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
  border-radius: 0.521vw;
  background: #363636;
  text-decoration: none;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  padding: 0 1.563vw;
  margin-bottom: 0.781vw;
  cursor: pointer;

  &:hover {
    transform: translateX(0.2vw);
    box-shadow: 0 0.26vw 0.52vw rgba(0, 0, 0, 0.1);
  }
  &__coursesscroll {
    overflow-y: auto;
    overflow-x: hidden;
    height: 12.76vw;

    /* Явное определение стилей скроллбара для этого элемента */
    &::-webkit-scrollbar {
      width: 0.417vw !important;
      height: 0.417vw !important;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05) !important;
      border-radius: 0.521vw !important;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2) !important;
      border-radius: 0.521vw !important;
      transition: background 0.2s !important;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.4) !important;
    }

    scrollbar-width: thin !important;
    scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05) !important;
  }
  &__courses-container {
    display: flex;
    flex-direction: column;
    gap: 0.521vw;
    margin-top: 0.781vw;
    padding-bottom: 0.781vw;
  }

  &__courses {
    border-radius: 7.292vw;
    width: 100%;
    height: 2.135vw;
    background: #404040;
    display: flex;
    padding: 0 1.563vw;
    align-items: center;
    justify-content: space-between;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      background: #4c4c4c;
      transform: translateX(0.26vw);
    }

    &__title {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      color: #fff;
    }
    &__img {
      width: 1.25vw;
      height: 1.25vw;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 4.531vw;
    &__info {
      &__title {
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 1.25vw;
        color: #fff;
      }

      &__subtitle {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.938vw;
        line-height: 111%;
        color: #fff;
        opacity: 0.5;
      }
    }

    &__progress {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 1.25vw;
      text-align: right;
      color: rgba(255, 255, 255, 0.3);
    }
  }

  &__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0.156vw;
    transition: width 0.5s ease, background-color 0.5s ease;
  }
}
</style>

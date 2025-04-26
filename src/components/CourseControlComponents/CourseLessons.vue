<template>
  <div class="course-Lessonsinfo">
    <div class="course-Lessonsinfo__header">
      <div class="course-Lessonsinfo__header__title">
        <span class="course-Lessonsinfo__header__title__number">{{
          index + 1
        }}</span>
        <AppInput
          v-model="lessonName"
          :styleLabel="{
            margin: '0',
          }"
          :styleInput="{
            width: '100%',
            paddingLeft: '10px',
          }"
          type="text"
          placeholder="Название урока"
          required
        />
      </div>
    </div>

    <div class="course-Lessonsinfo__content">
      <div class="course-Lessonsinfo__controls">
        <AppButton
          v-if="!showDescription"
          :styleOverrides="{
            width: 'auto',
            padding: '0.417vw 0.833vw',
            backgroundColor: '#363636',
            color: 'white',
          }"
          @click="toggleDescription"
        >
          Добавить описание
        </AppButton>

        <AppButton
          :styleOverrides="{
            width: 'auto',
            padding: '0.417vw 0.833vw',
            backgroundColor: '#FF5B5B',
            color: 'white',
          }"
          @click="removeLesson"
        >
          Удалить
        </AppButton>
      </div>
    </div>

    <div class="course-Lessonsinfo__actions">
      <AppButton
        :styleOverrides="{
          width: 'auto',
          padding: '0.417vw 0.833vw',
          backgroundColor: 'white',
          color: 'black',
        }"
        @click="saveLesson"
      >
        Сохранить
      </AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  PropType,
  computed,
  watch,
  onMounted,
} from "vue";
import { AppInput, AppButton } from "../UI";
import { CourseItemCourseContent } from "@/types";

export default defineComponent({
  name: "CourseLessons",
  components: { AppInput, AppButton },
  props: {
    lesson: {
      type: Object as PropType<CourseItemCourseContent>,
      required: false,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  emits: ["update", "remove"],
  setup(props, { emit }) {
    const lessonName = ref(props.lesson?.name || `Урок ${props.index + 1}`);
    const lessonPassing = ref(props.lesson?.passing || "no");
    const lessonDescription = ref(props.lesson?.description || "");
    const showDescription = ref(!!props.lesson?.description);

    // Вычисляемое свойство для определения класса статуса
    const statusClass = computed(() => {
      return lessonPassing.value === "yes"
        ? "course-Lessonsinfo__header__status--active"
        : "course-Lessonsinfo__header__status--pending";
    });

    // Отслеживаем изменения props.lesson
    watch(
      () => props.lesson,
      (newLesson) => {
        if (newLesson) {
          lessonName.value = newLesson.name;
          lessonPassing.value = newLesson.passing;
          lessonDescription.value = newLesson.description || "";
          showDescription.value = !!newLesson.description;
        }
      },
      { deep: true }
    );

    // Инициализация при монтировании
    onMounted(() => {
      if (props.lesson) {
        lessonName.value = props.lesson.name;
        lessonPassing.value = props.lesson.passing;
        lessonDescription.value = props.lesson.description || "";
        showDescription.value = !!props.lesson.description;
      }
    });

    // Переключение отображения поля описания
    const toggleDescription = () => {
      showDescription.value = !showDescription.value;
    };

    // Удаление урока
    const removeLesson = () => {
      if (props.lesson) {
        emit("remove", props.lesson.id);
      }
    };

    // Сохранение урока
    const saveLesson = () => {
      const updatedLesson: CourseItemCourseContent = {
        id: props.lesson?.id || `lesson_${Date.now()}`,
        name: lessonName.value,
        passing: lessonPassing.value,
        description: showDescription.value ? lessonDescription.value : "",
      };

      emit("update", updatedLesson.id, updatedLesson);
    };

    return {
      lessonName,
      lessonPassing,
      lessonDescription,
      showDescription,
      statusClass,
      toggleDescription,
      removeLesson,
      saveLesson,
    };
  },
});
</script>

<style lang="scss" scoped>
.course-Lessonsinfo {
  display: flex;
  flex-direction: column;
  gap: 0.781vw;
  width: 100%;
  background-color: #363636;
  border-radius: 0.521vw;
  padding: 1.042vw;
  box-shadow: 0 0.104vw 0.417vw rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  // Декоративная линия слева
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0.156vw;
    height: 100%;
    background: linear-gradient(to bottom, #08dccf, #39b874);
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background-color: #404040;
    box-shadow: 0 0.208vw 0.625vw rgba(0, 0, 0, 0.2);
    transform: translateY(-0.052vw);

    &::before {
      opacity: 1;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 0.521vw;

    &__title {
      display: flex;
      align-items: center;
      gap: 0.521vw;
      flex: 1;

      &__number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.563vw;
        height: 1.563vw;
        background: rgba(8, 220, 207, 0.2);
        border-radius: 50%;
        font-size: 0.729vw;
        color: #08dccf;
        font-weight: 600;
      }
    }

    &__status {
      padding: 0.208vw 0.521vw;
      border-radius: 1.042vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.625vw;
      white-space: nowrap;

      &--active {
        background: rgba(57, 184, 116, 0.2);
        color: #39b874;
      }

      &--pending {
        background: rgba(255, 193, 7, 0.2);
        color: #ffc107;
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.781vw;
    width: 100%;
  }

  &__controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.521vw;
    align-items: center;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-top: 0.313vw;
  }

  // Анимация появления компонента
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-0.521vw);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-0.313vw);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>

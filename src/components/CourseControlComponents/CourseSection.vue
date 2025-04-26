<template>
  <div class="course-sectioninfo">
    <AppInput
      v-model="sectionName"
      :styleLabel="{
        margin: '0',
      }"
      :styleInput="{
        width: '20vw',
        paddingLeft: '10px',
      }"
      type="text"
      placeholder="Название раздела"
      required
    />
    <div class="course-sectioninfo__lessons">
      <CourseLessons
        v-for="(lesson, index) in lessons"
        :key="lesson.id"
        :lesson="lesson"
        :index="index"
        @remove="removeLesson"
        @update="updateLesson"
      />
      <p v-if="lessons.length === 0" class="course-sectioninfo__lessons__empty">
        Уроки еще не добавлены. Нажмите "Добавить урок", чтобы создать первый
        урок.
      </p>
    </div>
    <div class="course-sectioninfo__actions">
      <AppButton
        :styleOverrides="{
          width: '11.177vw',
          backgroundColor: 'white',
          color: 'black',
        }"
        @click="addLesson"
      >
        Добавить урок
      </AppButton>
      <AppButton
        :styleOverrides="{
          width: '11.177vw',
          backgroundColor: 'white',
          color: 'black',
        }"
        @click="saveSection"
      >
        Сохранить
      </AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, onMounted } from "vue";
import { AppInput, AppButton } from "../UI";
import CourseLessons from "./CourseLessons.vue";
import { CourseItemCourse, CourseItemCourseContent } from "@/types";
import { courseApi } from "@/api";
export default defineComponent({
  name: "CourseSection",
  components: { AppInput, AppButton, CourseLessons },
  props: {
    section: {
      type: Object as PropType<CourseItemCourse>,
      required: false,
    },
    elemID: {
      type: String,
      required: false,
    },
  },
  emits: ["save", "delete"],
  setup(props, { emit }) {
    const sectionName = ref(props.section?.name || "Новый раздел");
    const lessons = ref<CourseItemCourseContent[]>([]);

    // Инициализация данных при монтировании компонента
    onMounted(() => {
      if (props.section) {
        sectionName.value = props.section.name;
        if (props.section.content && props.section.content.length > 0) {
          lessons.value = [...props.section.content];
        }
      }
    });

    // Добавление нового урока
    const addLesson = () => {
      const newLessonId = `lesson_${Date.now()}`;
      lessons.value.push({
        id: newLessonId,
        name: `Урок ${lessons.value.length + 1}`,
        passing: "no",
        description: "",
      });
      await courseApi.createCourseLesson(
        props.elemRed.id,
        props.section.id,
        lessons.value
      );
    };

    // Обновление урока
    const updateLesson = (
      lessonId: string,
      updatedLesson: CourseItemCourseContent
    ) => {
      const index = lessons.value.findIndex((lesson) => lesson.id === lessonId);
      if (index !== -1) {
        lessons.value[index] = { ...updatedLesson };
      }
    };

    // Удаление урока
    const removeLesson = (lessonId: string) => {
      lessons.value = lessons.value.filter((lesson) => lesson.id !== lessonId);
    };

    // Сохранение раздела
    const saveSection = () => {
      const updatedSection: CourseItemCourse = {
        id: props.section?.id || `section_${Date.now()}`,
        name: sectionName.value,
        content: lessons.value,
      };

      emit("save", updatedSection, sectionName.value); // Убираем доступ к .id
    };

    return {
      sectionName,
      lessons,
      addLesson,
      updateLesson,
      removeLesson,
      saveSection,
    };
  },
});
</script>

<style lang="scss" scoped>
.course-sectioninfo {
  display: flex;
  flex-wrap: wrap;
  gap: 1.042vw;
  width: 100%;
  background-color: #2a2a2a;
  border-radius: 0.625vw;
  padding: 1.563vw;
  box-shadow: 0 0.156vw 0.625vw rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  margin-bottom: 1.042vw;

  // Декоративная линия сверху
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 1.563vw;
    right: 1.563vw;
    height: 0.104vw;
    background: linear-gradient(
      90deg,
      #08dccf,
      rgba(8, 220, 207, 0.1),
      #08dccf
    );
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background-color: #333333;
    box-shadow: 0 0.313vw 1.042vw rgba(0, 0, 0, 0.3);
    transform: translateY(-0.104vw);

    &::before {
      opacity: 1;
    }
  }

  &__lessons {
    width: 100%;
    margin: 1.042vw 0;
    padding: 0.833vw;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0.417vw;
    transition: background-color 0.3s ease;
    min-height: 10vw;
    display: flex;
    flex-direction: column;
    gap: 0.781vw;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }

    &__empty {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
      padding: 3vw 0;
      font-style: italic;
    }
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 0.781vw;
    gap: 0.781vw;
  }

  // Анимация появления компонента
  animation: zoomIn 0.3s ease-out;

  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>

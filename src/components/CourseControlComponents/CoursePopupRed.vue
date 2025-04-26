<template>
  <div class="course-popup">
    <div class="course-popup__card">
      <CourseMainInfo :elemRed="elemRed" :edit="edit" @click="$emit('click')" />
      <div class="course-popup__card__info">
        <template v-if="!edit">
          <CourseInfo
            v-for="info in courseInfoList"
            :key="info.id"
            :id="info.id"
            :title="info.title"
            :subtitle="info.subtitle"
            @save="updateCourseInfo"
            @delete="deleteCourseInfo"
          />
        </template>

        <AppButton
          :styleOverrides="{
            width: '11.177vw',
            backgroundColor: 'white',
            color: 'black',
            marginTop: '0.521vw',
          }"
          @click="addInfo"
        >
          Добавить информацию
        </AppButton>
      </div>

      <div class="course-popup__card__section">
        <template v-if="!edit">
          <CourseSection
            v-for="section in courseSections"
            :key="section.id"
            :section="section"
            @save="updateCourseSection"
            @delete="deleteCourseSection"
          />
        </template>
        <AppButton
          :styleOverrides="{
            width: '11.177vw',
            backgroundColor: 'white',
            color: 'black',
            marginTop: '0.521vw',
          }"
          @click="addSection"
        >
          Добавить раздел
        </AppButton>
      </div>

      <div class="course-popup__card__actions">
        <AppButton
          :styleOverrides="{
            width: '11.177vw',
            backgroundColor: 'white',
            color: 'black',
          }"
          @click="$emit('click')"
        >
          Отменить
        </AppButton>

        <AppButton
          v-if="!edit"
          :styleOverrides="{
            width: '15.177vw',
            backgroundColor: '#39B874',
            color: 'white',
          }"
          @click="saveCourseChanges"
        >
          Сохранить все изменения
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { CourseItem, CourseItemInfo, CourseItemCourse } from "@/types";
import { courseApi } from "@/api";
import CourseMainInfo from "./CourseMainInfo.vue";
import CourseInfo from "./CourseInfo.vue";
import CourseSection from "./CourseSection.vue";
import { AppButton } from "../UI";

export default defineComponent({
  name: "CoursePopupRed",
  props: {
    edit: {
      type: Boolean,
      required: true,
    },
    elemRed: {
      type: Object as PropType<CourseItem>,
      required: false,
    },
  },
  emits: ["click", "update"],
  components: { CourseMainInfo, CourseInfo, CourseSection, AppButton },
  setup(props, { emit }) {
    const courseInfoList = ref<CourseItemInfo[]>([]);
    const courseSections = ref<CourseItemCourse[]>([]);
    const isLoading = ref(false);

    // Добавление новой информации о курсе
    // Добавление новой информации о курсе
    const addInfo = async () => {
      const newInfoId = `info_${Date.now()}`;
      const newInfo: CourseItemInfo = {
        id: newInfoId,
        title: "Новый блок информации",
        subtitle: "Описание информационного блока",
      };

      courseInfoList.value.push(newInfo);

      if (props.elemRed) {
        try {
          await courseApi.createCourseInfo(props.elemRed.id, newInfo);
        } catch (error) {
          console.error("Ошибка при создании информации о курсе:", error);
        }
      }
    };
    // Обновление информации о курсе
    const updateCourseInfo = (
      id: string,
      title: string,
      subtitle: string,
      idcourseinfo: string
    ) => {
      const index = courseInfoList.value.findIndex((info) => info.id === id);
      if (index !== -1) {
        courseInfoList.value[index] = { id, title, subtitle };
      }
      await courseApi.updateCourseInfo(props.elemRed.id, idcourseinfo, newInfo);
    };

    // Удаление информации о курсе
    const deleteCourseInfo = (id: string) => {
      courseInfoList.value = courseInfoList.value.filter(
        (info) => info.id !== id
      );
    };

    // Добавление нового раздела
    const addSection = async () => {
      const newSectionId = `section_${Date.now()}`;
      const newSection: CourseItemCourse = {
        id: newSectionId,
        name: "Новый раздел",
        content: [],
      };

      courseSections.value.push(newSection);

      if (props.elemRed) {
        try {
          await courseApi.createCourseSection(props.elemRed.id, newSection);
        } catch (error) {
          console.error("Ошибка при создании раздела курса:", error);
        }
      }
    };

    // Обновление раздела
    const updateCourseSection = (section: CourseItemCourse, idcourseinfo) => {
      const index = courseSections.value.findIndex((s) => s.id === section.id);
      if (index !== -1) {
        courseSections.value[index] = section;
      }
      await courseApi.updateCourseSection(
        props.elemRed.id,
        idcourseinfo,
        newInfo
      );
    };

    // Удаление раздела
    const deleteCourseSection = (id: string) => {
      courseSections.value = courseSections.value.filter(
        (section) => section.id !== id
      );
    };

    // Сохранение всех изменений курса
    const saveCourseChanges = async () => {
      if (!props.elemRed) return;

      isLoading.value = true;
      try {
        const updatedCourse = {
          ...props.elemRed,
          info: courseInfoList.value,
          sections: courseSections.value,
        };

        await courseApi.updateCourse(props.elemRed.id, updatedCourse);
        await courseApi.getAllCourses();
        emit("click"); // Закрываем попап
        emit("update"); // Оповещаем родителя об обновлении
      } catch (error) {
        console.error("Ошибка при сохранении изменений курса:", error);
      } finally {
        isLoading.value = false;
      }
    };

    // Загрузка данных при монтировании
    onMounted(() => {
      if (props.elemRed) {
        // Загружаем информацию о курсе
        if (props.elemRed.info && props.elemRed.info.length > 0) {
          courseInfoList.value = [...props.elemRed.info];
        }

        // Загружаем разделы курса
        if (props.elemRed.sections && props.elemRed.sections.length > 0) {
          courseSections.value = [...props.elemRed.sections];
        }
      }
    });

    // Отслеживаем изменения props.elemRed
    watch(
      () => props.elemRed,
      (newValue) => {
        if (newValue) {
          if (newValue.info && newValue.info.length > 0) {
            courseInfoList.value = [...newValue.info];
          } else {
            courseInfoList.value = [];
          }

          if (newValue.sections && newValue.sections.length > 0) {
            courseSections.value = [...newValue.sections];
          } else {
            courseSections.value = [];
          }
        }
      }
    );

    return {
      courseInfoList,
      courseSections,
      addInfo,
      updateCourseInfo,
      deleteCourseInfo,
      addSection,
      updateCourseSection,
      deleteCourseSection,
      saveCourseChanges,
      isLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.course-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(0.208vw);
  animation: fadeIn 0.3s ease;

  &__card {
    display: flex;
    flex-direction: column;
    gap: 1.042vw;
    max-height: 85vh;
    width: 60vw;
    background-color: #2a2a2a;
    border-radius: 0.833vw;
    padding: 1.563vw;
    overflow-y: auto;
    overflow-x: hidden;
    box-shadow: 0 0.521vw 2.083vw rgba(0, 0, 0, 0.5);
    animation: slideDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 0.052vw solid rgba(255, 255, 255, 0.05);
    position: relative;

    // Стилизация скроллбара
    &::-webkit-scrollbar {
      width: 0.417vw;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 0.521vw;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(8, 220, 207, 0.3);
      border-radius: 0.521vw;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(8, 220, 207, 0.5);
    }

    // Декоративный элемент в верхней части карточки
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0.208vw;
      background: linear-gradient(90deg, #08dccf, #0099ff, #39b874);
      background-size: 200% 100%;
      animation: gradientMove 3s linear infinite;
    }

    &__info,
    &__section {
      display: flex;
      flex-direction: column;
      gap: 1.042vw;
      width: 100%;
      padding: 0.833vw;
      border-radius: 0.521vw;
      background-color: rgba(0, 0, 0, 0.1);
      position: relative;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 0.156vw;
        background: linear-gradient(to bottom, #08dccf, #39b874);
        border-radius: 0.521vw 0 0 0.521vw;
      }
    }

    &__actions {
      display: flex;
      justify-content: space-between;
      margin-top: 1.042vw;
    }
  }
}

// Кнопки внутри попапа редактирования
.course-popup__button {
  padding: 0.625vw 1.25vw;
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 0.833vw;
  border-radius: 0.417vw;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.521vw;

  &--primary {
    background: #39b874;
    color: #fff;

    &:hover {
      background: #45cc83;
      transform: translateY(-0.104vw);
      box-shadow: 0 0.26vw 0.521vw rgba(57, 184, 116, 0.4);
    }
  }

  &--secondary {
    background: #363636;
    color: #fff;

    &:hover {
      background: #424242;
      transform: translateY(-0.104vw);
    }
  }

  &--danger {
    background: #363636;
    color: #ff5b5b;

    &:hover {
      background: #ff5b5b;
      color: #fff;
      transform: translateY(-0.104vw);
      box-shadow: 0 0.26vw 0.521vw rgba(255, 91, 91, 0.4);
    }
  }

  &:active {
    transform: translateY(0.052vw);
  }
}

// Анимации для попапа
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-1.042vw) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
</style>

<!-- CourseSections.vue -->
<template>
  <div class="course-sections">
    <h3 class="course-sections__title">Разделы курса</h3>

    <div
      v-for="(section, sectionIndex) in localSections"
      :key="sectionIndex"
      class="course-sections__item"
    >
      <div class="course-sections__header">
        <span class="course-sections__number">
          Раздел {{ sectionIndex + 1 }}
        </span>
        <button
          type="button"
          class="course-sections__remove"
          @click="removeSection(sectionIndex)"
        >
          Удалить раздел
        </button>
      </div>

      <div class="course-sections__row">
        <div class="course-sections__col">
          <label class="course-sections__label">
            ID раздела
            <input
              type="text"
              class="course-sections__input"
              v-model="section.id"
              required
            />
          </label>
        </div>
        <div class="course-sections__col">
          <label class="course-sections__label">
            Название раздела
            <input
              type="text"
              class="course-sections__input"
              v-model="section.name"
              required
            />
          </label>
        </div>
      </div>
    </div>

    <button type="button" class="course-sections__add" @click="addSection">
      Добавить раздел курса
    </button>

    <div class="course-sections__buttons">
      <button
        type="button"
        class="course-sections__button course-sections__button--secondary"
        @click="$emit('back')"
      >
        Назад
      </button>
      <button
        type="button"
        class="course-sections__button course-sections__button--primary"
        @click="saveSections"
      >
        Сохранить и продолжить
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { CourseItemCourse } from "@/types";

export default defineComponent({
  name: "CourseSections",
  props: {
    sections: {
      type: Array as PropType<CourseItemCourse[]>,
      required: true,
    },
  },
  emits: ["update:sections", "save", "back"],
  setup(props, { emit }) {
    const localSections = ref<CourseItemCourse[]>([...props.sections]);

    // Наблюдаем за изменениями входящих разделов
    watch(
      () => props.sections,
      (newSections) => {
        localSections.value = [...newSections];
      }
    );

    // Добавление нового раздела
    const addSection = () => {
      const newId = (localSections.value.length + 1).toString();

      localSections.value.push({
        id: newId,
        name: "Новый раздел",
        content: [
          {
            id: "1",
            name: "Урок 1",
            passing: "no",
            description: "",
          },
        ],
      });

      emit("update:sections", [...localSections.value]);
    };

    // Удаление раздела
    const removeSection = (index: number) => {
      if (localSections.value.length > 1) {
        localSections.value.splice(index, 1);
        emit("update:sections", [...localSections.value]);
      } else {
        emit("save", false, "Должен быть хотя бы один раздел курса");
      }
    };

    // Сохранение разделов
    const saveSections = () => {
      // Валидация разделов
      if (localSections.value.some((section) => !section.id || !section.name)) {
        emit("save", false, "Заполните все обязательные поля разделов");
        return;
      }

      emit("update:sections", [...localSections.value]);
      emit("save", true);
    };

    return {
      localSections,
      addSection,
      removeSection,
      saveSections,
    };
  },
});
</script>

<style scoped lang="scss">
.course-sections {
  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 1.042vw;
    color: #fff;
    margin: 0 0 1.042vw 0;
  }

  &__item {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0.521vw;
    padding: 1.042vw;
    margin-bottom: 1.042vw;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.781vw;
  }

  &__number {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 0.938vw;
    color: #08dccf;
  }

  &__remove {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.729vw;
    color: #ff5b5b;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      text-decoration: underline;
      opacity: 0.8;
    }
  }

  &__row {
    display: flex;
    gap: 1.042vw;
  }

  &__col {
    flex: 1;
  }

  &__label {
    display: flex;
    flex-direction: column;
    gap: 0.313vw;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.833vw;
    color: rgba(255, 255, 255, 0.7);
  }

  &__input {
    border-radius: 0.417vw;
    background: #363636;
    height: 2.083vw;
    padding: 0 0.781vw;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.833vw;
    color: #fff;
    transition: all 0.3s ease;

    &:focus {
      background: #404040;
      box-shadow: 0 0 0.417vw rgba(8, 220, 207, 0.5);
    }
  }

  &__add {
    padding: 0.521vw 1.042vw;
    border-radius: 0.417vw;
    background: #08dccf;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.833vw;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;

    &:hover {
      background: #09e9db;
      transform: translateY(-0.104vw);
      box-shadow: 0 0.26vw 0.781vw rgba(8, 220, 207, 0.4);
    }

    &:active {
      transform: translateY(0.052vw);
    }
  }

  &__buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.781vw;
    margin-top: 1.563vw;
  }

  &__button {
    padding: 0.521vw 1.563vw;
    border-radius: 0.417vw;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.938vw;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-0.104vw);
    }

    &:active {
      transform: translateY(0.052vw);
    }

    &--secondary {
      background: #363636;

      &:hover {
        background: #404040;
      }
    }

    &--primary {
      background: #39b874;

      &:hover {
        background: #45cc83;
        box-shadow: 0 0.26vw 0.781vw rgba(57, 184, 116, 0.4);
      }
    }
  }
}
</style>

<template>
  <div class="lesson-edit-modal" @click.self="$emit('close')">
    <div class="lesson-edit-modal__content">
      <h2 class="lesson-edit-modal__title">
        {{
          lesson
            ? `Редактирование урока "${lesson.name}"`
            : "Редактирование урока"
        }}
      </h2>

      <div class="lesson-edit-modal__editor">
        <RichTextEditor
          v-model="localDescription"
          placeholder="Введите описание урока..."
        />
      </div>

      <div class="lesson-edit-modal__actions">
        <button
          type="button"
          class="lesson-edit-modal__actions__button lesson-edit-modal__actions__button--cancel"
          @click="$emit('close')"
        >
          Отмена
        </button>
        <button
          type="button"
          class="lesson-edit-modal__actions__button lesson-edit-modal__actions__button--save"
          @click="saveAndClose"
        >
          Сохранить описание
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import RichTextEditor from "@/components/RichTextEditor.vue";

interface CourseItemCourseContent {
  id: string;
  name: string;
  passing: string;
  description?: string;
}

export default defineComponent({
  name: "LessonEditModal",
  components: {
    RichTextEditor,
  },
  props: {
    lesson: {
      type: Object as PropType<CourseItemCourseContent | null>,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
  },
  emits: ["close", "save"],
  setup(props, { emit }) {
    const localDescription = ref(props.description || "");

    // Следим за изменениями входящего описания
    watch(
      () => props.description,
      (newVal) => {
        localDescription.value = newVal || "";
      }
    );

    // Сохраняем и закрываем модальное окно
    const saveAndClose = () => {
      emit("save", localDescription.value);
      emit("close");
    };

    return {
      localDescription,
      saveAndClose,
    };
  },
});
</script>

<style scoped lang="scss">
.lesson-edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100; /* Выше, чем у основного модального окна */
  animation: fadeIn 0.3s ease;

  &__content {
    background: #2a2a2a;
    border-radius: 0.625vw;
    padding: 1.563vw;
    width: 70vw;
    max-width: 95vw;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 0.521vw 1.563vw rgba(0, 0, 0, 0.3);
    animation: scaleIn 0.3s ease;
    display: flex;
    flex-direction: column;

    /* Стилизация скроллбара */
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
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 1.25vw;
    color: #fff;
    margin: 0 0 1.563vw 0;
    border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.781vw;
  }

  &__editor {
    flex: 1;
    min-height: 25vw;
    margin-bottom: 1.563vw;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.781vw;

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

      &--cancel {
        background: #363636;

        &:hover {
          background: #404040;
        }
      }

      &--save {
        background: #39b874;

        &:hover {
          background: #45cc83;
          box-shadow: 0 0.26vw 0.781vw rgba(57, 184, 116, 0.4);
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

<template>
  <div
    class="course-lesson-editor__content"
    ref="editorContent"
    contenteditable="true"
    @input="updateContent"
    @keydown="handleKeyDown"
    @mouseup="$emit('checkFormat')"
  ></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";

export default defineComponent({
  name: "CourseDesEditor",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    initialContent: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "checkFormat"],
  setup(props, { emit }) {
    const editorContent = ref<HTMLDivElement | null>(null);

    // Обработка ввода в редакторе
    const updateContent = () => {
      if (editorContent.value) {
        const content = editorContent.value.innerHTML;
        emit("update:modelValue", content);
      }
    };

    // Обработка нажатий клавиш
    const handleKeyDown = (event: KeyboardEvent) => {
      // Обработка Tab для добавления отступа
      if (event.key === "Tab") {
        event.preventDefault();
        document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
        updateContent();
      }
    };

    // Инициализация содержимого редактора
    onMounted(() => {
      if (editorContent.value) {
        editorContent.value.innerHTML =
          props.initialContent || props.modelValue || "";
      }
    });

    // Отслеживание изменений в свойстве modelValue
    watch(
      () => props.modelValue,
      (newValue) => {
        if (editorContent.value && newValue !== editorContent.value.innerHTML) {
          editorContent.value.innerHTML = newValue;
        }
      }
    );

    // Отслеживание изменений в свойстве initialContent
    watch(
      () => props.initialContent,
      (newValue) => {
        if (editorContent.value && newValue && !editorContent.value.innerHTML) {
          editorContent.value.innerHTML = newValue;
          updateContent();
        }
      }
    );

    return {
      editorContent,
      updateContent,
      handleKeyDown,
    };
  },
});
</script>

<style scoped lang="scss">
.course-lesson-editor__content {
  padding: 0.833vw;
  min-height: 15.625vw;
  max-height: 31.25vw;
  overflow-y: auto;
  background-color: #2a2a2a;
  font-family: var(--font-family);
  font-size: 0.833vw;
  line-height: 1.5;
  color: #fff;

  &:focus {
    outline: none;
  }

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
</style>

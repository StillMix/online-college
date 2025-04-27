<template>
  <div class="course-lesson-editor__toolbar">
    <div class="course-lesson-editor__toolbar__group">
      <button
        class="course-lesson-editor__toolbar__button"
        :class="{ active: currentTextAlign === 'left' }"
        @click="$emit('align', 'left')"
        title="По левому краю"
      >
        <i class="fas fa-align-left"></i>
      </button>
      <button
        class="course-lesson-editor__toolbar__button"
        :class="{ active: currentTextAlign === 'center' }"
        @click="$emit('align', 'center')"
        title="По центру"
      >
        <i class="fas fa-align-center"></i>
      </button>
      <button
        class="course-lesson-editor__toolbar__button"
        :class="{ active: currentTextAlign === 'right' }"
        @click="$emit('align', 'right')"
        title="По правому краю"
      >
        <i class="fas fa-align-right"></i>
      </button>
    </div>

    <div class="course-lesson-editor__toolbar__group">
      <button
        class="course-lesson-editor__toolbar__button"
        :class="{ active: isBold }"
        @click="$emit('format', 'bold')"
        title="Жирный"
      >
        <i class="fas fa-bold"></i>
      </button>
      <button
        class="course-lesson-editor__toolbar__button"
        :class="{ active: isItalic }"
        @click="$emit('format', 'italic')"
        title="Курсив"
      >
        <i class="fas fa-italic"></i>
      </button>
      <button
        class="course-lesson-editor__toolbar__button"
        :class="{ active: isUnderline }"
        @click="$emit('format', 'underline')"
        title="Подчеркнутый"
      >
        <i class="fas fa-underline"></i>
      </button>
    </div>

    <div class="course-lesson-editor__toolbar__group">
      <select
        class="course-lesson-editor__toolbar__select"
        @change="$emit('heading', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Обычный текст</option>
        <option value="h1">Заголовок 1</option>
        <option value="h2">Заголовок 2</option>
        <option value="h3">Заголовок 3</option>
      </select>
    </div>

    <div class="course-lesson-editor__toolbar__group">
      <button
        class="course-lesson-editor__toolbar__button course-lesson-editor__toolbar__button--image"
        @click="$emit('openImageModal')"
        title="Вставить изображение"
      >
        <i class="fas fa-image"></i> Изображение
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CourseDesHeader",
  props: {
    isBold: {
      type: Boolean,
      default: false,
    },
    isItalic: {
      type: Boolean,
      default: false,
    },
    isUnderline: {
      type: Boolean,
      default: false,
    },
    currentTextAlign: {
      type: String,
      default: "left",
    },
  },
  emits: ["align", "format", "heading", "openImageModal"],
});
</script>

<style scoped lang="scss">
.course-lesson-editor__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.417vw;
  padding: 0.521vw;
  background-color: #363636;
  border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);

  &__group {
    display: flex;
    border-radius: 0.313vw;
    overflow: hidden;
    background-color: #404040;
    margin-right: 0.417vw;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.979vw;
    height: 1.979vw;
    font-size: 0.729vw;
    background-color: transparent;
    color: rgba(255, 255, 255, 0.7);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    &.active {
      background-color: #08dccf;
      color: #fff;
    }

    &--image {
      width: auto;
      padding: 0 0.833vw;
      display: flex;
      gap: 0.313vw;
    }
  }

  &__select {
    height: 1.979vw;
    background-color: #404040;
    color: rgba(255, 255, 255, 0.7);
    border: none;
    font-size: 0.729vw;
    font-family: var(--font-family);
    padding: 0 0.417vw;
    cursor: pointer;

    &:focus {
      outline: none;
    }

    option {
      background-color: #363636;
      color: #fff;
    }
  }
}
</style>

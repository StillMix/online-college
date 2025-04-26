<template>
  <div class="course-search-bar">
    <img alt="icon" src="@/assets/search.svg" class="course-search-bar__img" />
    <input
      class="course-search-bar__input"
      placeholder="Поиск курсов"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
      v-if="modelValue"
      class="course-search-bar__clear"
      @click="$emit('clear')"
    >
      ×
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CourseSearchBar",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue", "clear"],
});
</script>

<style scoped lang="scss">
.course-search-bar {
  position: relative;
  width: 31.25vw;
  height: 2.604vw;
  display: flex;
  align-items: center;

  &__img {
    width: 1.25vw;
    height: 1.25vw;
    position: absolute;
    left: 1.042vw;
  }

  &__input {
    width: 100%;
    height: 100%;
    border-radius: 0.625vw;
    background: #363636;
    padding-left: 2.813vw;
    padding-right: 2.5vw;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.938vw;
    color: #fff;
    transition: all 0.3s ease;

    &:focus {
      background: #404040;
      box-shadow: 0 0 0.521vw rgba(8, 220, 207, 0.5);
    }
  }

  &__input::placeholder {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.938vw;
    color: #fff;
    opacity: 0.3;
  }

  &__clear {
    position: absolute;
    right: 1.042vw;
    width: 1.25vw;
    height: 1.25vw;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1vw;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}
</style>

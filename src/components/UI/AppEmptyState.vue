<!-- src/components/UI/AppEmptyState.vue -->
<template>
  <div class="app-empty-state">
    <div class="app-empty-state__content">
      <slot name="icon">
        <img
          class="app-empty-state__icon"
          :src="icon || require('@/assets/courseNone.svg')"
          :alt="title"
        />
      </slot>
      <p class="app-empty-state__text">{{ title }}</p>
      <slot name="action">
        <button
          v-if="actionText"
          class="app-empty-state__button"
          @click="$emit('action')"
        >
          {{ actionText }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppEmptyState",
  props: {
    title: {
      type: String,
      default: "Нет данных",
    },
    icon: {
      type: String,
      default: "",
    },
    actionText: {
      type: String,
      default: "",
    },
  },
  emits: ["action"],
});
</script>

<style scoped lang="scss">
.app-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 20vw;

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.521vw;
  }

  &__icon {
    width: 2.604vw;
    height: 2.604vw;
    opacity: 0.3;
  }

  &__text {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 1.042vw;
    color: #fff;
    opacity: 0.3;
  }

  &__button {
    margin-top: 0.521vw;
    border-radius: 7.292vw;
    padding: 0 1.563vw;
    height: 2.604vw;
    background: rgba(8, 220, 207, 0.8);
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.938vw;
    text-align: center;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: rgba(7, 201, 188, 0.8);
      transform: translateY(-0.104vw);
      box-shadow: 0 0.26vw 0.781vw rgba(8, 220, 207, 0.4);
    }

    &:active {
      transform: translateY(0.052vw);
    }
  }
}
</style>

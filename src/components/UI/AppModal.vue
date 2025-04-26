<!-- src/components/UI/AppModal.vue -->
<template>
  <transition name="modal-fade">
    <div v-if="show" class="app-modal" @click.self="$emit('close')">
      <div class="app-modal__content" :style="contentStyle">
        <div class="app-modal__header">
          <slot name="header">
            <h2 class="app-modal__title">{{ title }}</h2>
          </slot>
          <button
            v-if="showClose"
            class="app-modal__close"
            @click="$emit('close')"
          >
            ×
          </button>
        </div>

        <div class="app-modal__body">
          <slot></slot>
        </div>

        <div v-if="$slots.footer" class="app-modal__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "AppModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "50vw",
    },
    showClose: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["close"],
  setup(props) {
    const contentStyle = computed(() => ({
      width: props.width,
    }));

    return {
      contentStyle,
    };
  },
});
</script>

<style scoped lang="scss">
.app-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  &__content {
    background: #2a2a2a;
    border-radius: 0.625vw;
    max-width: 95vw;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 0.521vw 1.563vw rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;

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

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.563vw 1.563vw 0.781vw;
    border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 1.25vw;
    color: #fff;
    margin: 0;
  }

  &__close {
    font-size: 1.563vw;
    color: rgba(255, 255, 255, 0.7);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: #fff;
      transform: scale(1.1);
    }
  }

  &__body {
    padding: 1.563vw;
    flex: 1;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    padding: 0.781vw 1.563vw 1.563vw;
    gap: 0.781vw;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .app-modal__content,
.modal-fade-leave-to .app-modal__content {
  transform: scale(0.95);
  transition: transform 0.3s ease;
}

.modal-fade-enter-to .app-modal__content,
.modal-fade-leave-from .app-modal__content {
  transform: scale(1);
}
</style>

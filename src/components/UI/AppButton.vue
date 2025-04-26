<template>
  <button
    :class="[
      'app-button',
      `app-button--${type}`,
      { 'app-button--full-width': fullWidth },
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppButton",
  props: {
    type: {
      type: String,
      default: "primary",
      validator: (val: string) =>
        ["primary", "secondary", "success", "error", "warning"].includes(val),
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
});
</script>

<style scoped lang="scss">
.app-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.521vw 1.042vw;
  border-radius: var(--border-radius-lg);
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 0.833vw;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-0.104vw);
  }

  &:active:not(:disabled) {
    transform: translateY(0.052vw);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--full-width {
    width: 100%;
  }

  &--primary {
    background: var(--primary-color);

    &:hover:not(:disabled) {
      background: var(--primary-hover);
      box-shadow: 0 0.26vw 0.781vw var(--primary-shadow);
    }
  }

  &--success {
    background: var(--success-color);

    &:hover:not(:disabled) {
      background: var(--success-hover);
      box-shadow: 0 0.26vw 0.781vw var(--success-shadow);
    }
  }

  &--error {
    background: var(--error-color);

    &:hover:not(:disabled) {
      background: var(--error-hover);
      box-shadow: 0 0.26vw 0.781vw var(--error-shadow);
    }
  }

  &--secondary {
    background: var(--bg-input);

    &:hover:not(:disabled) {
      background: var(--bg-input-focus);
    }
  }

  &--warning {
    background: var(--warning-color);

    &:hover:not(:disabled) {
      background: var(--warning-hover);
      box-shadow: 0 0.26vw 0.781vw var(--warning-shadow);
    }
  }
}
</style>

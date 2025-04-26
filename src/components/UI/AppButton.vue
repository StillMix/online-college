<template>
  <button
    :class="[
      'app-button',
      `app-button--${type}`,
      { 'pulse-animation': pulse },
      { 'app-button--full-width': fullWidth },
    ]"
    :style="styleOverrides"
    :type="type"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType, StyleValue } from "vue";

export default defineComponent({
  name: "AppButton",
  props: {
    type: {
      type: String as PropType<"button" | "submit" | "reset">,
      default: "button",
    },
    styleOverrides: {
      type: [Object, String, Array] as PropType<StyleValue>,
      default: () => ({}),
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    pulse: {
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
  border-radius: 7.292vw;
  width: 100%;
  height: 2.604vw;
  background: #39b874;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 0.938vw;
  text-align: center;
  color: var(--colors-default-static-static-100);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &.pulse-animation {
    animation: buttonPulse 2s infinite;
  }

  @keyframes buttonPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(57, 184, 116, 0.7);
    }
    70% {
      box-shadow: 0 0 0 0.521vw rgba(57, 184, 116, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(57, 184, 116, 0);
    }
  }

  /* Эффект волны при нажатии */
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.521vw;
    height: 0.521vw;
    background: rgba(255, 255, 255, 0.7);
    opacity: 0;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(1);
    transition: all 0.5s ease;
  }

  &:active::after {
    opacity: 1;
    transform: translate(-50%, -50%) scale(20);
    transition: all 0s;
  }

  &:hover {
    background: #45cc83;
    transform: translateY(-0.104vw);
  }

  &:active {
    transform: translateY(0.052vw);
  }
}
</style>

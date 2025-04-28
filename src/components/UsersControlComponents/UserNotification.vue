<template>
  <transition name="notification">
    <div v-if="show" class="user-notification" :class="type">
      <p class="user-notification__text">{{ message }}</p>
      <button class="user-notification__close" @click="$emit('close')">
        ×
      </button>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserNotification",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "success",
      validator: (value: string) =>
        ["success", "error", "warning", "info"].includes(value),
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 5000,
    },
  },
  emits: ["close"],
  watch: {
    show(newVal) {
      if (newVal && this.autoClose) {
        setTimeout(() => {
          this.$emit("close");
        }, this.duration);
      }
    },
  },
});
</script>

<style scoped lang="scss">
.user-notification {
  position: fixed;
  bottom: 1.563vw;
  right: 1.563vw;
  min-width: 20.833vw;
  padding: 1.042vw 1.563vw;
  border-radius: 0.625vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  box-shadow: 0 0.521vw 1.042vw rgba(0, 0, 0, 0.25);

  &.success {
    background: rgba(57, 184, 116, 0.95);
  }

  &.error {
    background: rgba(255, 91, 91, 0.95);
  }

  &.warning {
    background: rgba(255, 193, 7, 0.95);
  }

  &.info {
    background: rgba(8, 220, 207, 0.95);
  }

  &__text {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.938vw;
    color: #fff;
  }

  &__close {
    font-size: 1.25vw;
    color: #fff;
    opacity: 0.7;
    width: 1.563vw;
    height: 1.563vw;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }
}

.notification-enter-active {
  animation: slideInRight 0.3s ease;
}

.notification-leave-active {
  animation: slideInRight 0.3s ease reverse;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(2.083vw);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

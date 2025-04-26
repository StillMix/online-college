<!-- src/components/UI/AppSpinner.vue -->
<template>
  <div class="app-spinner" :style="{ width: size, height: size }">
    <div class="app-spinner__inner" :style="{ borderWidth: borderWidth }"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "AppSpinner",
  props: {
    size: {
      type: String,
      default: "2.5vw",
    },
    color: {
      type: String,
      default: "#08dccf",
    },
  },
  setup(props) {
    const borderWidth = computed(() => {
      // Вычисляем толщину границы как 1/8 от размера
      const sizeNumber = parseFloat(props.size);
      const unit = props.size.replace(/[\d.]/g, "");
      return `${sizeNumber / 8}${unit}`;
    });

    return {
      borderWidth,
    };
  },
});
</script>

<style scoped lang="scss">
.app-spinner {
  display: inline-block;
  position: relative;

  &__inner {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    border: 0.3vw solid;
    border-radius: 50%;
    animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: v-bind(color) transparent transparent transparent;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <svg
    :width="width"
    :height="height"
    :class="customClass"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M2 20V4H22V20H2ZM12 13L4 8V18H20V8L12 13ZM12 11L20 6H4L12 11ZM4 8V6V18V8Z"
        :fill="color"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "emailIcon",
  props: {
    width: {
      type: [String, Number],
      default: "24",
    },
    height: {
      type: [String, Number],
      default: "24",
    },
    color: {
      type: String,
      default: "white",
    },
    customClass: {
      type: String,
      default: "",
    },
  },
});
</script>

<style>
svg {
  display: block;
  min-width: 0;
  min-height: 0;
}
</style>

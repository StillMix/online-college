<template>
  <svg
    :width="width"
    :height="height"
    :class="customClass"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 11C17.34 11 17.67 11.04 18 11.09V7.5L12.5 2H6C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H12.81C12.3 21.12 12 20.1 12 19C12 14.58 14.58 11 17 11Z"
      :fill="color"
    />
    <path d="M13 8V3.5L17.5 8H13Z" :fill="color" />
    <path
      d="M17 13C14.24 13 12 15.24 12 18C12 20.76 14.24 23 17 23C19.76 23 22 20.76 22 18C22 15.24 19.76 13 17 13ZM19.5 19.5H17.5V21.5H16.5V19.5H14.5V18.5H16.5V16.5H17.5V18.5H19.5V19.5Z"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "adminsIcon",
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

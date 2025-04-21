<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M10 28.3333H30L23.75 20L18.75 26.6667L15 21.6667L10 28.3333ZM5 35V5H35V35H5ZM8.33333 31.6667H31.6667V8.33333H8.33333V31.6667Z"
        :fill="color"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "inputImg",
  props: {
    width: {
      type: [String, Number],
      default: "40",
    },
    height: {
      type: [String, Number],
      default: "40",
    },
    color: {
      type: String,
      default: "white",
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

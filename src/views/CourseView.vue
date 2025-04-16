<template>
  <div class="CourseView">
    <Header />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "CourseView",
  components: {
    Header,
  },
});
</script>

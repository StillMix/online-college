<template>
  <div class="PodView">
    <Header />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "PodView",
  components: {
    Header,
  },
});
</script>

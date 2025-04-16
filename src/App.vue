<template>
  <div id="app">
    <AppLoader :is-visible="isLoading" loading-text="Загрузка приложения..." />
    <nav v-if="!isLoading"></nav>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AppLoader from "@/components/Loader.vue";

export default defineComponent({
  name: "App",
  components: {
    AppLoader,
  },
  setup() {
    const isLoading = ref(true);

    setTimeout(() => {
      isLoading.value = false;
    }, 10);

    return {
      isLoading,
    };
  },
});
</script>

<style lang="scss">
#app {
  width: 72.552vw;
}

body {
  background-color: #212121;
  display: flex;
  justify-content: center;
  position: relative;
}
</style>

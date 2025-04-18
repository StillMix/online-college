<template>
  <div class="app">
    <router-view v-slot="{ Component, route }">
      <transition
        :name="route.meta.transition as string || 'fade'"
        mode="out-in"
      >
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CourseData } from "./data/courseData";
localStorage.setItem("courseData", JSON.stringify(CourseData));
export default defineComponent({
  name: "App",
});
</script>

<style lang="scss">
:root {
  --font-family: "Roboto", sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  width: 72.552vw;
  background-color: transparent;
}

body {
  background-color: #212121;
  display: flex;
  justify-content: center;
  position: relative;
}

/* Анимации перехода */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
  background-color: transparent;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  background-color: transparent;
}

/* Анимация слайда */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  background-color: transparent;
}

.slide-enter-from {
  transform: translateX(50px);
  opacity: 0;
  background-color: transparent;
}

.slide-leave-to {
  transform: translateX(-50px);
  opacity: 0;
  background-color: transparent;
}

/* Анимация увеличения */
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  background-color: transparent;
}

.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.95);
  opacity: 0;
  background-color: transparent;
}
</style>

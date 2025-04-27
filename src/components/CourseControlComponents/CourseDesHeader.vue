<template>
  <div class="CourseDesHeader">
    <button>Слева</button>
    <button>По центру</button>
    <button>Справа</button>
    <button>Жирный</button>
    <button>Курсив</button>
    <button>Вставить картинку</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CourseDesHeader",
  components: {},
});
</script>

<style lang="scss">
.CourseDesHeader {
  display: flex;
  gap: 10px;
  width: 100%;
  height: 34px;
  background-color: #4b4b4b;
  overflow: hidden;
}
</style>

<template>
  <div class="CourseDesAddImg">
    <div class="CourseDesAddImg__popup">
      <AppButton
        :styleOverrides="{
          width: 'auto',
          padding: '0.417vw 0.833vw',
          backgroundColor: 'white',
          color: 'black',
        }"
      >
        Добавить картинку
      </AppButton>
      <div class="CourseDesAddImg__popup__imgs"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AppButton } from "../UI";

export default defineComponent({
  name: "CourseDesAddImg",
  components: { AppButton },
});
</script>

<style lang="scss">
.CourseDesAddImg {
  position: absolute;
  width: 100%;
  height: 90%;
  background-color: #00000096;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  &__popup {
    width: 438px;
    height: 221px;
    background-color: #292929;
    border-radius: 10px;
  }
}
</style>

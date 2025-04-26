<template>
  <div class="course-info">
    <AppInput
      :styleLabel="{
        margin: '0',
      }"
      :styleInput="{
        width: '20vw',
      }"
      type="text"
      placeholder="Название"
      required
    />
    <AppInput
      :styleLabel="{
        margin: '0',
      }"
      :styleInput="{
        width: '20vw',
      }"
      type="text"
      placeholder="Подзаголовок"
      required
    />
    <AppButton
      :styleOverrides="{
        width: '11.177vw',
        backgroundColor: 'white',
        color: 'black',
      }"
    >
      Сохранить
    </AppButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AppInput, AppButton } from "../UI";

export default defineComponent({
  name: "CourseInfo",
  components: { AppInput, AppButton },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.course-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.042vw;
  width: 100%;
  background-color: #2a2a2a;
  border-radius: 0.625vw;
  padding: 1.042vw;
  box-shadow: 0 0.104vw 0.417vw rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  margin-bottom: 1.042vw;

  &:hover {
    background-color: #333333;
    box-shadow: 0 0.208vw 0.625vw rgba(0, 0, 0, 0.2);
    transform: translateY(-0.052vw);
  }

  &__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.833vw;
    padding-bottom: 0.521vw;
    border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);

    &__title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 0.938vw;
      color: #fff;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: -0.313vw;
        left: 0;
        width: 2.083vw;
        height: 0.104vw;
        background: linear-gradient(90deg, #08dccf, rgba(8, 220, 207, 0));
        transition: width 0.3s ease;
      }
    }

    &:hover &__title::after {
      width: 4.167vw;
    }
  }

  &__form {
    display: flex;
    flex-wrap: wrap;
    gap: 0.833vw;
    width: 100%;
  }

  &__input-group {
    flex: 1;
    min-width: 15.625vw;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.521vw;
    margin-top: 0.833vw;
    width: 100%;
  }

  // Анимация появления компонента
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-0.521vw);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>

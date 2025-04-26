<template>
  <div class="course-Lessonsinfo">
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
    <AppButton
      :styleOverrides="{
        width: '11.177vw',
        backgroundColor: 'white',
        color: 'black',
      }"
    >
      Добавить описание
    </AppButton>
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
  name: "CourseLessons",
  components: { AppInput, AppButton },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.course-Lessonsinfo {
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
  overflow: hidden;
  margin-bottom: 0.521vw;

  // Декоративная линия слева
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0.156vw;
    height: 100%;
    background: linear-gradient(to bottom, #08dccf, #39b874);
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background-color: #333333;
    box-shadow: 0 0.208vw 0.625vw rgba(0, 0, 0, 0.2);
    transform: translateY(-0.052vw);

    &::before {
      opacity: 1;
    }
  }

  &__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.521vw;
    margin-bottom: 0.833vw;
    border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);

    &__title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 0.938vw;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 0.417vw;

      &__number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.563vw;
        height: 1.563vw;
        background: rgba(8, 220, 207, 0.2);
        border-radius: 50%;
        font-size: 0.729vw;
        color: #08dccf;
      }
    }

    &__status {
      padding: 0.208vw 0.417vw;
      border-radius: 1.042vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.625vw;

      &--active {
        background: rgba(57, 184, 116, 0.2);
        color: #39b874;
      }

      &--pending {
        background: rgba(255, 193, 7, 0.2);
        color: #ffc107;
      }
    }
  }

  &__content {
    display: flex;
    flex-wrap: wrap;
    gap: 0.833vw;
    width: 100%;
  }

  &__input-area {
    flex: 1;
    min-width: 20.833vw;
  }

  &__controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.521vw;
    align-items: center;
  }

  &__description {
    width: 100%;
    margin-top: 0.833vw;
    padding: 0.833vw;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0.417vw;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.833vw;
    color: rgba(255, 255, 255, 0.8);

    &__label {
      font-size: 0.729vw;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 0.417vw;
      display: block;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.521vw;
    margin-top: 0.833vw;
    width: 100%;
  }

  // Анимация появления компонента
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-0.521vw);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
}
</style>

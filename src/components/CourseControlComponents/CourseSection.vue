<template>
  <div class="course-sectioninfo">
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
    <div class="course-sectioninfo__lessons">
      <CourseLessons />
    </div>
    <AppButton
      :styleOverrides="{
        width: '11.177vw',
        backgroundColor: 'white',
        color: 'black',
      }"
    >
      Добавить урок
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
import CourseLessons from "./CourseLessons.vue";

export default defineComponent({
  name: "CourseSection",
  components: { AppInput, AppButton, CourseLessons },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.course-sectioninfo {
  display: flex;
  flex-wrap: wrap;
  gap: 1.042vw;
  width: 100%;
  background-color: #2a2a2a;
  border-radius: 0.625vw;
  padding: 1.563vw;
  box-shadow: 0 0.156vw 0.625vw rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  margin-bottom: 1.042vw;

  // Декоративная линия сверху
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 1.563vw;
    right: 1.563vw;
    height: 0.104vw;
    background: linear-gradient(
      90deg,
      #08dccf,
      rgba(8, 220, 207, 0.1),
      #08dccf
    );
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background-color: #333333;
    box-shadow: 0 0.313vw 1.042vw rgba(0, 0, 0, 0.3);
    transform: translateY(-0.104vw);

    &::before {
      opacity: 1;
    }
  }

  &__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.042vw;
    padding-bottom: 0.833vw;
    border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);

    &__title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 1.042vw;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 0.417vw;

      &__icon {
        font-size: 0.938vw;
        color: #08dccf;
      }
    }

    &__actions {
      display: flex;
      gap: 0.521vw;
    }
  }

  &__input-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.042vw;
    width: 100%;
    margin-bottom: 1.042vw;
  }

  &__form-group {
    flex: 1;
    min-width: 15.625vw;

    &__label {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.729vw;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 0.313vw;
      display: block;
    }
  }

  &__lessons {
    width: 100%;
    margin: 1.042vw 0;
    padding: 0.833vw;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0.417vw;
    transition: background-color 0.3s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }

    &__empty {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
      padding: 1.563vw 0;
    }

    &__header {
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
      }
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: 0.521vw;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 1.042vw;
    gap: 0.521vw;

    &__left {
      display: flex;
      gap: 0.521vw;
    }

    &__right {
      display: flex;
      gap: 0.521vw;
    }
  }

  &__button {
    padding: 0.521vw 1.042vw;
    border-radius: 0.417vw;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.833vw;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.313vw;

    &--primary {
      background: #fff;
      color: #000;

      &:hover {
        background: #f0f0f0;
        transform: translateY(-0.104vw);
        box-shadow: 0 0.208vw 0.417vw rgba(255, 255, 255, 0.2);
      }

      &__icon {
        color: #08dccf;
      }
    }

    &--secondary {
      background: #363636;
      color: #fff;

      &:hover {
        background: #424242;
        transform: translateY(-0.104vw);
      }
    }

    &--delete {
      background: #363636;
      color: #ff5b5b;

      &:hover {
        background: #ff5b5b;
        color: #fff;
        transform: translateY(-0.104vw);
        box-shadow: 0 0.208vw 0.417vw rgba(255, 91, 91, 0.3);
      }
    }

    &:active {
      transform: translateY(0.052vw);
    }
  }

  // Стили для перетаскивания элементов
  &__draggable {
    cursor: move;
    position: relative;

    &::before {
      content: "≡";
      position: absolute;
      left: -1.042vw;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.042vw;
      color: rgba(255, 255, 255, 0.3);
      transition: color 0.2s ease;
    }

    &:hover::before {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  // Анимация появления компонента
  animation: zoomIn 0.3s ease-out;

  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>

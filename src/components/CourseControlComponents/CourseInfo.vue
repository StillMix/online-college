<template>
  <div class="course-info">
    <div class="course-info__header">
      <h3 class="course-info__header__title">
        <i class="course-info__header__title__icon">i</i>
        Блок информации
      </h3>

      <div class="course-info__header__actions">
        <button
          class="course-info__header__actions__button course-info__header__actions__button--delete"
          @click="deleteInfo"
        >
          ✕
        </button>
      </div>
    </div>

    <div class="course-info__form">
      <div class="course-info__form__row">
        <div class="course-info__form__group">
          <label class="course-info__form__group__label">Заголовок</label>
          <AppInput
            v-model="infoTitle"
            :styleLabel="{ margin: '0' }"
            :styleInput="{ width: '100%', paddingLeft: '10px' }"
            type="text"
            placeholder="Заголовок информационного блока"
            required
          />
        </div>
      </div>

      <div class="course-info__form__row">
        <div class="course-info__form__group">
          <label class="course-info__form__group__label">Описание</label>
          <AppInput
            v-model="infoSubtitle"
            :styleLabel="{ margin: '0' }"
            :styleInput="{ width: '100%', paddingLeft: '10px' }"
            type="text"
            placeholder="Описание информационного блока"
            required
          />
        </div>
      </div>
    </div>

    <div class="course-info__actions">
      <AppButton
        :styleOverrides="{
          width: '11.177vw',
          backgroundColor: 'white',
          color: 'black',
        }"
        @click="saveInfo"
      >
        Сохранить
      </AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, onMounted, watch } from "vue";
import { AppInput, AppButton } from "../UI";

export default defineComponent({
  name: "CourseInfo",
  components: { AppInput, AppButton },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
  },
  emits: ["save", "delete"],
  setup(props, { emit }) {
    const infoTitle = ref(props.title || "");
    const infoSubtitle = ref(props.subtitle || "");
    const isModified = ref(false);

    // Отслеживаем изменения полей
    watch([infoTitle, infoSubtitle], () => {
      isModified.value =
        infoTitle.value !== props.title ||
        infoSubtitle.value !== props.subtitle;
    });

    // Отслеживаем изменения props
    watch(
      () => [props.title, props.subtitle],
      ([newTitle, newSubtitle]) => {
        if (!isModified.value) {
          infoTitle.value = newTitle || "";
          infoSubtitle.value = newSubtitle || "";
        }
      }
    );

    // Сохранение информации
    const saveInfo = () => {
      console.log(props.id);
      if (infoTitle.value.trim() === "") return;

      emit("save", props.id, infoTitle.value, infoSubtitle.value);
      isModified.value = false;
    };
    // Удаление информации
    const deleteInfo = () => {
      emit("delete", props.id);
    };

    onMounted(() => {
      infoTitle.value = props.title || "";
      infoSubtitle.value = props.subtitle || "";
    });

    return {
      infoTitle,
      infoSubtitle,
      saveInfo,
      deleteInfo,
      isModified,
    };
  },
});
</script>

<style lang="scss" scoped>
.course-info {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #2a2a2a;
  border-radius: 0.625vw;
  padding: 1.042vw;
  box-shadow: 0 0.104vw 0.417vw rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  margin-bottom: 0.521vw;
  overflow: hidden;

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
    margin-bottom: 0.833vw;
    padding-bottom: 0.521vw;
    border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);

    &__title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 0.938vw;
      color: #fff;
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.417vw;
      margin: 0;

      &__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.146vw;
        height: 1.146vw;
        background: rgba(8, 220, 207, 0.2);
        border-radius: 50%;
        font-style: normal;
        font-size: 0.729vw;
        color: #08dccf;
      }

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

    &__actions {
      display: flex;
      gap: 0.417vw;

      &__button {
        width: 1.563vw;
        height: 1.563vw;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.2);
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.729vw;
        transition: all 0.2s ease;
        cursor: pointer;

        &--delete {
          &:hover {
            background: #ff5b5b;
            color: #fff;
            transform: rotate(90deg);
          }
        }
      }
    }

    &:hover &__title::after {
      width: 4.167vw;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 0.833vw;
    width: 100%;

    &__row {
      display: flex;
      gap: 1.042vw;
      width: 100%;
    }

    &__group {
      flex: 1;

      &__label {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.729vw;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 0.313vw;
        display: block;
      }
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

// Пульсация при изменении
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(8, 220, 207, 0.4);
  }
  70% {
    box-shadow: 0 0 0 0.5vw rgba(8, 220, 207, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(8, 220, 207, 0);
  }
}

// Эффект появления элемента
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(0.521vw);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

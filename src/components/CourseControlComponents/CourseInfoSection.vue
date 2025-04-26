<!-- CourseInfoSection.vue -->
<template>
  <div class="course-info-section">
    <h3 class="course-info-section__title">Информация о курсе</h3>

    <div
      v-for="(item, index) in localInfo"
      :key="index"
      class="course-info-section__info"
    >
      <div class="course-info-section__info__header">
        <span class="course-info-section__info__number">{{ index + 1 }}</span>
        <button
          type="button"
          class="course-info-section__info__remove"
          @click="removeInfoItem(index)"
        >
          Удалить
        </button>
      </div>

      <div class="course-info-section__row">
        <div class="course-info-section__col">
          <label class="course-info-section__label">
            Заголовок
            <input
              type="text"
              class="course-info-section__input"
              v-model="item.title"
              required
            />
          </label>
        </div>
        <div class="course-info-section__col">
          <label class="course-info-section__label">
            Описание
            <input
              type="text"
              class="course-info-section__input"
              v-model="item.subtitle"
              required
            />
          </label>
        </div>
      </div>
    </div>

    <button type="button" class="course-info-section__add" @click="addInfoItem">
      Добавить информацию о курсе
    </button>

    <div class="course-info-section__buttons">
      <button
        type="button"
        class="course-info-section__button course-info-section__button--secondary"
        @click="$emit('back')"
      >
        Назад
      </button>
      <button
        type="button"
        class="course-info-section__button course-info-section__button--primary"
        @click="saveInfo"
      >
        Сохранить и продолжить
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { CourseInfoItem } from "@/types";

export default defineComponent({
  name: "CourseInfoSection",
  props: {
    info: {
      type: Array as PropType<CourseInfoItem[]>,
      required: true,
    },
  },
  emits: ["update:info", "save", "back"],
  setup(props, { emit }) {
    const localInfo = ref<CourseInfoItem[]>([...props.info]);

    // Наблюдаем за изменениями входящей информации
    watch(
      () => props.info,
      (newInfo) => {
        localInfo.value = [...newInfo];
      }
    );

    // Добавление нового элемента информации
    const addInfoItem = () => {
      const newId = (localInfo.value.length + 1).toString();

      localInfo.value.push({
        id: newId,
        title: "",
        subtitle: "",
      });

      emit("update:info", [...localInfo.value]);
    };

    // Удаление элемента информации
    const removeInfoItem = (index: number) => {
      if (localInfo.value.length > 1) {
        localInfo.value.splice(index, 1);
        emit("update:info", [...localInfo.value]);
      } else {
        emit(
          "save",
          false,
          "Должен быть хотя бы один элемент информации о курсе"
        );
      }
    };

    // Сохранение информации о курсе
    const saveInfo = () => {
      // Валидация информации о курсе
      if (localInfo.value.some((item) => !item.title || !item.subtitle)) {
        emit(
          "save",
          false,
          "Заполните все обязательные поля информации о курсе"
        );
        return;
      }

      emit("update:info", [...localInfo.value]);
      emit("save", true);
    };

    return {
      localInfo,
      addInfoItem,
      removeInfoItem,
      saveInfo,
    };
  },
});
</script>

<style scoped lang="scss">
.course-info-section {
  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 1.042vw;
    color: #fff;
    margin: 0 0 1.042vw 0;
  }

  &__info {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0.521vw;
    padding: 1.042vw;
    margin-bottom: 1.042vw;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.781vw;
    }

    &__number {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 0.938vw;
      color: #08dccf;
    }

    &__remove {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.729vw;
      color: #ff5b5b;
      background: transparent;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        text-decoration: underline;
        opacity: 0.8;
      }
    }
  }

  &__row {
    display: flex;
    gap: 1.042vw;
  }

  &__col {
    flex: 1;
  }

  &__label {
    display: flex;
    flex-direction: column;
    gap: 0.313vw;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.833vw;
    color: rgba(255, 255, 255, 0.7);
  }

  &__input {
    border-radius: 0.417vw;
    background: #363636;
    height: 2.083vw;
    padding: 0 0.781vw;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.833vw;
    color: #fff;
    transition: all 0.3s ease;

    &:focus {
      background: #404040;
      box-shadow: 0 0 0.417vw rgba(8, 220, 207, 0.5);
    }
  }

  &__add {
    padding: 0.521vw 1.042vw;
    border-radius: 0.417vw;
    background: #08dccf;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.833vw;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;

    &:hover {
      background: #09e9db;
      transform: translateY(-0.104vw);
      box-shadow: 0 0.26vw 0.781vw rgba(8, 220, 207, 0.4);
    }

    &:active {
      transform: translateY(0.052vw);
    }
  }

  &__buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.781vw;
    margin-top: 1.563vw;
  }

  &__button {
    padding: 0.521vw 1.563vw;
    border-radius: 0.417vw;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.938vw;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-0.104vw);
    }

    &:active {
      transform: translateY(0.052vw);
    }

    &--secondary {
      background: #363636;

      &:hover {
        background: #404040;
      }
    }

    &--primary {
      background: #39b874;

      &:hover {
        background: #45cc83;
        box-shadow: 0 0.26vw 0.781vw rgba(57, 184, 116, 0.4);
      }
    }
  }
}
</style>

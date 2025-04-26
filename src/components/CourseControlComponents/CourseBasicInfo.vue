<!-- CourseBasicInfo.vue -->
<template>
  <div class="course-basic-info">
    <div class="course-basic-info__row">
      <div class="course-basic-info__col">
        <label class="course-basic-info__label">
          Название курса
          <input
            type="text"
            class="course-basic-info__input"
            v-model="localCourse.title"
            required
          />
        </label>

        <label class="course-basic-info__label">
          Подзаголовок
          <input
            type="text"
            class="course-basic-info__input"
            v-model="localCourse.subtitle"
            required
          />
        </label>

        <label class="course-basic-info__label">
          Тип курса
          <select
            class="course-basic-info__input course-basic-info__select"
            v-model="localCourse.type"
            @change="handleTypeChange"
            required
          >
            <option v-for="type in courseTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </label>

        <label class="course-basic-info__label">
          Уровень курса
          <select
            class="course-basic-info__input course-basic-info__select"
            v-model="localCourse.timetoendL"
            required
          >
            <option v-for="level in courseLevels" :key="level" :value="level">
              {{ level }}
            </option>
          </select>
        </label>
      </div>

      <div class="course-basic-info__col">
        <label class="course-basic-info__label">
          Название для страницы курса
          <input
            type="text"
            class="course-basic-info__input"
            v-model="localCourse.titleForCourse"
            required
          />
        </label>

        <label class="course-basic-info__label">
          Цвет курса
          <input
            type="color"
            class="course-basic-info__input course-basic-info__color"
            v-model="localCourse.color"
          />
        </label>

        <label v-if="isEditMode" class="course-basic-info__label">
          Иконка курса
          <div class="course-basic-info__file">
            <input
              type="file"
              class="course-basic-info__file__input"
              @change="handleIconUpload"
              accept="image/svg+xml"
            />
            <span class="course-basic-info__file__label">
              {{ iconFileName || "Выберите SVG файл..." }}
            </span>
            <button type="button" class="course-basic-info__file__button">
              Обзор
            </button>
          </div>

          <div v-if="iconPreview" class="course-basic-info__file__preview">
            <img :src="iconPreview" alt="Предпросмотр иконки" />
          </div>
        </label>
      </div>
    </div>

    <div class="course-basic-info__buttons">
      <button
        type="button"
        class="course-basic-info__button course-basic-info__button--secondary"
        @click="$emit('cancel')"
      >
        Отмена
      </button>
      <button
        type="button"
        class="course-basic-info__button course-basic-info__button--primary"
        @click="saveBasicInfo"
      >
        Сохранить и продолжить
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";

interface CourseBasicData {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  timetoendL: string;
  color: string;
  icon: string;
  icontype: string;
  titleForCourse: string;
}

export default defineComponent({
  name: "CourseBasicInfo",
  props: {
    course: {
      type: Object as PropType<CourseBasicData>,
      required: true,
    },
    courseTypes: {
      type: Array as PropType<string[]>,
      required: true,
    },
    courseLevels: {
      type: Array as PropType<string[]>,
      required: true,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:course", "save", "cancel", "icon-upload"],
  setup(props, { emit }) {
    const localCourse = ref({ ...props.course });
    const iconPreview = ref<string | null>(null);
    const iconFile = ref<File | null>(null);
    const iconFileName = ref("");

    // Наблюдаем за изменениями входящего курса
    watch(
      () => props.course,
      (newCourse) => {
        localCourse.value = { ...newCourse };
      }
    );

    // Обработчик загрузки иконки
    const handleIconUpload = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        iconFile.value = input.files[0];
        iconFileName.value = input.files[0].name;

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            iconPreview.value = e.target.result as string;
          }
        };
        reader.readAsDataURL(iconFile.value);

        emit("icon-upload", iconFile.value);
      }
    };

    // Обновление icontype в зависимости от типа курса
    const handleTypeChange = () => {
      switch (localCourse.value.type) {
        case "ПРОГРАММИРОВАНИЕ":
          localCourse.value.icontype = "programIcon";
          break;
        case "ДИЗАЙН":
          localCourse.value.icontype = "designIcon";
          break;
        case "МАРКЕТИНГ":
          localCourse.value.icontype = "marketingIcon";
          break;
        case "МЕНЕДЖМЕНТ":
          localCourse.value.icontype = "managementIcon";
          break;
        case "АНАЛИТИКА":
          localCourse.value.icontype = "analyticsIcon";
          break;
        default:
          localCourse.value.icontype = "programIcon";
      }

      emit("update:course", { ...localCourse.value });
    };

    // Сохранение базовой информации
    const saveBasicInfo = () => {
      // Валидация основных полей
      if (
        !localCourse.value.title ||
        !localCourse.value.subtitle ||
        !localCourse.value.type ||
        !localCourse.value.timetoendL ||
        !localCourse.value.titleForCourse
      ) {
        emit("save", false, "Заполните все обязательные поля");
        return;
      }

      emit("update:course", { ...localCourse.value });
      emit("save", true);
    };

    return {
      localCourse,
      iconPreview,
      iconFileName,
      handleIconUpload,
      handleTypeChange,
      saveBasicInfo,
    };
  },
});
</script>

<style scoped lang="scss">
.course-basic-info {
  &__row {
    display: flex;
    gap: 1.042vw;
  }

  &__col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.781vw;
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

  &__select {
    appearance: none;
    background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
    background-repeat: no-repeat;
    background-position: right 0.781vw center;
    padding-right: 2.604vw;
  }

  &__file {
    position: relative;
    display: flex;
    height: 2.083vw;

    &__input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      z-index: 1;
    }

    &__label {
      display: flex;
      align-items: center;
      padding: 0 0.781vw;
      background: #363636;
      border-radius: 0.417vw 0 0 0.417vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
      color: rgba(255, 255, 255, 0.7);
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__button {
      padding: 0 0.781vw;
      height: 100%;
      background: #08dccf;
      border-radius: 0 0.417vw 0.417vw 0;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #09e9db;
      }
    }

    &__preview {
      margin-top: 0.521vw;
      width: 3.646vw;
      height: 3.646vw;
      border-radius: 0.417vw;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      img {
        max-width: 80%;
        max-height: 80%;
        object-fit: contain;
      }
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

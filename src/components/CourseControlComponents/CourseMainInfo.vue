<template>
  <form @submit.prevent="handleSubmit" class="course-maininfo">
    <div class="course-maininfo__header">
      <h2 class="course-maininfo__header__title">
        <i class="fas fa-edit course-maininfo__header__title__icon"></i>
        {{ edit ? "Создание нового курса" : "Редактирование курса" }}
      </h2>
      <p class="course-maininfo__header__subtitle">
        {{
          edit
            ? "Заполните основную информацию о курсе"
            : "Измените основную информацию о курсе"
        }}
      </p>
    </div>

    <div class="course-maininfo__left">
      <div class="course-maininfo__form-row">
        <div class="course-maininfo__form-group">
          <label class="course-maininfo__form-group__label"
            >Название курса</label
          >
          <AppInput
            v-model="title"
            :styleLabel="{ margin: '0' }"
            :styleInput="{ width: '100%', paddingLeft: '10px' }"
            type="text"
            placeholder="Введите название курса"
            required
          />
        </div>

        <div class="course-maininfo__form-group">
          <label class="course-maininfo__form-group__label">Подзаголовок</label>
          <AppInput
            v-model="subtitle"
            :styleLabel="{ margin: '0' }"
            :styleInput="{ width: '100%', paddingLeft: '10px' }"
            type="text"
            placeholder="Краткое описание курса"
            required
          />
        </div>
      </div>

      <div class="course-maininfo__form-row">
        <div class="course-maininfo__form-group">
          <label class="course-maininfo__form-group__label">Тип курса</label>
          <select v-model="selectedType" class="course-maininfo__select">
            <option value="" disabled selected>Выберите тип курса</option>
            <option value="ПРОГРАММИРОВАНИЕ">ПРОГРАММИРОВАНИЕ</option>
            <option value="ДИЗАЙН">ДИЗАЙН</option>
            <option value="ПАЯЛЬНИК">ПАЯЛЬНИК</option>
            <option value="ДРУГОЕ">ДРУГОЕ</option>
          </select>
        </div>

        <div class="course-maininfo__form-group">
          <label class="course-maininfo__form-group__label"
            >Уровень сложности</label
          >
          <select v-model="selectedLevel" class="course-maininfo__select">
            <option value="" disabled selected>
              Выберите уровень сложности
            </option>
            <option value="С НУЛЯ">С НУЛЯ</option>
            <option value="НАЧАЛЬНЫЙ">НАЧАЛЬНЫЙ</option>
            <option value="СРЕДНИЙ">СРЕДНИЙ</option>
            <option value="ПРОДВИНУТЫЙ">ПРОДВИНУТЫЙ</option>
            <option value="ЭКСПЕРТ">ЭКСПЕРТ</option>
          </select>
        </div>
      </div>

      <div class="course-maininfo__form-row--full">
        <div class="course-maininfo__form-group">
          <label class="course-maininfo__form-group__label"
            >Подробное описание курса</label
          >
          <textarea
            v-model="titleForCourse"
            class="course-maininfo__description"
            placeholder="Введите подробное описание курса..."
            required
          ></textarea>
        </div>
      </div>
    </div>

    <div class="course-maininfo__right">
      <div class="course-maininfo__selImg">
        <input
          class="course-maininfo__selImg__input"
          type="file"
          accept="image/*"
          @change="onFileChange"
        />
        <template v-if="!previewUrl">
          <p>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Загрузите изображение курса
          </p>
        </template>
        <div v-if="previewUrl" class="course-maininfo__selImg__prew">
          <img
            class="course-maininfo__selImg__prew__img"
            :src="previewUrl"
            alt="Preview"
          />
          <button
            type="button"
            class="course-maininfo__selImg__remove"
            @click="removeImage"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="course-maininfo__actions">
      <button
        type="button"
        class="course-maininfo__actions__button course-maininfo__actions__button--cancel"
        @click="$emit('click')"
      >
        Отмена
      </button>
      <button
        type="submit"
        class="course-maininfo__actions__button course-maininfo__actions__button--primary"
        :disabled="isSubmitting"
      >
        {{
          isSubmitting
            ? "Сохранение..."
            : edit
            ? "Создать курс"
            : "Сохранить изменения"
        }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, onMounted } from "vue";
import { CourseItem } from "@/types";
import { AppInput } from "../UI";
import { courseApi } from "@/api";

export default defineComponent({
  name: "CourseMainInfo",
  props: {
    edit: {
      type: Boolean,
      required: true,
    },
    elemRed: {
      type: Object as PropType<CourseItem>,
      required: false,
    },
  },
  emits: ["click"],
  components: { AppInput },
  setup(props) {
    const title = ref(props.elemRed ? props.elemRed.title : "");
    const subtitle = ref(props.elemRed ? props.elemRed.subtitle : "");
    const selectedType = ref(props.elemRed ? props.elemRed.type : "");
    const selectedLevel = ref(props.elemRed ? props.elemRed.timetoendL : "");
    const color = ref(props.elemRed ? props.elemRed.color : "#2d82b7");
    const icon = ref(props.elemRed ? props.elemRed.icon : "");
    const icontype = ref(
      props.elemRed ? props.elemRed.icontype : "programIcon"
    );
    const titleForCourse = ref(
      props.elemRed ? props.elemRed.titleForCourse : ""
    );
    const info = ref(props.elemRed?.info || []);
    const sections = ref(props.elemRed?.sections || []);
    const previewUrl = ref<string | null>(null);
    const isSubmitting = ref(false);

    // Инициализация превью изображения, если есть
    onMounted(() => {
      if (props.elemRed && props.elemRed.icon) {
        // Если путь начинается с http, используем его напрямую
        if (props.elemRed.icon.startsWith("http")) {
          previewUrl.value = props.elemRed.icon;
        } else {
          // Иначе добавляем базовый URL
          previewUrl.value = `http://127.0.0.1:8000/${props.elemRed.icon}`;
        }
      }
    });

    const onFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        previewUrl.value = URL.createObjectURL(file);
      }
    };

    // Удаление превью изображения
    const removeImage = () => {
      previewUrl.value = null;
      if (icon.value) {
        icon.value = "";
      }

      // Сброс input file
      const fileInput = document.querySelector(
        ".course-maininfo__selImg__input"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    };

    return {
      selectedType,
      selectedLevel,
      onFileChange,
      previewUrl,
      title,
      subtitle,
      color,
      icon,
      icontype,
      titleForCourse,
      info,
      sections,
      isSubmitting,
      removeImage,
    };
  },
  methods: {
    async handleSubmit(event: Event) {
      event.preventDefault();
      try {
        this.isSubmitting = true;

        const courseData = {
          title: this.title,
          subtitle: this.subtitle,
          type: this.selectedType,
          timetoendL: this.selectedLevel,
          color: this.color,
          icon: this.icon,
          icontype: this.icontype,
          titleForCourse: this.titleForCourse,
          info: this.info,
          sections: this.sections || [],
        };

        let courses;
        if (this.edit) {
          // Создаем новый курс
          courses = await courseApi.createCourse(courseData);
        } else {
          // Обновляем существующий курс
          if (this.elemRed) {
            courses = await courseApi.updateCourse(this.elemRed.id, courseData);
          }
        }

        if (courses) {
          console.log(
            this.edit ? "Курс успешно создан:" : "Курс успешно обновлен:",
            courses
          );
          await courseApi.getAllCourses();
          this.$emit("click");
        }
      } catch (error) {
        console.error(
          this.edit
            ? "Ошибка при создании курса:"
            : "Ошибка при обновлении курса:",
          error
        );
      } finally {
        this.isSubmitting = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.course-maininfo {
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
  margin-bottom: 1.563vw;

  // Декоративный элемент верхнего угла
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 3.125vw;
    height: 3.125vw;
    background: linear-gradient(
      135deg,
      transparent 50%,
      rgba(8, 220, 207, 0.3) 50%
    );
    border-top-right-radius: 0.625vw;
    transition: all 0.3s ease;
  }

  &:hover {
    background-color: #333333;
    box-shadow: 0 0.313vw 1.042vw rgba(0, 0, 0, 0.3);
    transform: translateY(-0.104vw);

    &::before {
      width: 4.167vw;
      height: 4.167vw;
      background: linear-gradient(
        135deg,
        transparent 50%,
        rgba(8, 220, 207, 0.5) 50%
      );
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
      font-weight: 600;
      font-size: 1.25vw;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 0.521vw;

      &__icon {
        font-size: 1.042vw;
        color: #08dccf;
      }
    }

    &__subtitle {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  &__left {
    flex: 1;
    min-width: 31.25vw;
    display: flex;
    flex-direction: column;
    gap: 0.833vw;
  }

  &__right {
    width: 15.625vw;
    display: flex;
    flex-direction: column;
    gap: 1.042vw;
  }

  &__form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.042vw;
    width: 100%;

    &--full {
      flex: 1 0 100%;
    }
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

  &__select {
    width: 100%;
    height: 2.604vw;
    background: #363636;
    border: none;
    border-radius: 0.417vw;
    padding: 0 0.833vw;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.833vw;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.833vw center;
    background-size: 1.042vw;

    &:focus {
      outline: none;
      background-color: #404040;
      box-shadow: 0 0 0 0.104vw rgba(8, 220, 207, 0.5);
    }

    option {
      background-color: #2a2a2a;
    }
  }

  &__description {
    width: 100%;
    min-height: 5.208vw;
    background: #363636;
    border: none;
    border-radius: 0.417vw;
    padding: 0.833vw;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.833vw;
    color: #fff;
    resize: vertical;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      background-color: #404040;
      box-shadow: 0 0 0 0.104vw rgba(8, 220, 207, 0.5);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
  }

  &__selImg {
    width: 100%;
    height: 9.375vw;
    border-radius: 0.625vw;
    overflow: hidden;
    position: relative;
    background-color: #363636;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    border: 0.104vw dashed rgba(255, 255, 255, 0.2);

    &:hover {
      background-color: #404040;
      border-color: rgba(8, 220, 207, 0.5);
    }

    p {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
      color: rgba(255, 255, 255, 0.5);
      text-align: center;

      svg {
        display: block;
        margin: 0 auto 0.521vw;
        opacity: 0.5;
      }
    }

    &__input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
      z-index: 2;
    }

    &__prew {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    // Кнопка удаления превью
    &__remove {
      position: absolute;
      top: 0.521vw;
      right: 0.521vw;
      width: 1.563vw;
      height: 1.563vw;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.833vw;
      z-index: 3;
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.2s ease;
      cursor: pointer;

      &:hover {
        background: #ff5b5b;
      }
    }

    &:hover &__remove {
      opacity: 1;
      transform: scale(1);
    }
  }

  &__color-picker {
    width: 100%;

    &__label {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.729vw;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 0.313vw;
      display: block;
    }

    &__options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.417vw;
    }

    &__option {
      width: 1.563vw;
      height: 1.563vw;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 0.104vw solid transparent;

      &--selected,
      &:hover {
        transform: scale(1.2);
        border-color: #fff;
        box-shadow: 0 0.104vw 0.313vw rgba(0, 0, 0, 0.3);
      }
    }
  }

  &__icon-type {
    width: 100%;

    &__label {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.729vw;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 0.313vw;
      display: block;
    }

    &__options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.417vw;
    }

    &__option {
      width: 3.125vw;
      height: 3.125vw;
      border-radius: 0.417vw;
      background: #363636;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0.417vw;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        max-width: 100%;
        max-height: 100%;
        opacity: 0.7;
        transition: opacity 0.2s ease;
      }

      &--selected,
      &:hover {
        background: #404040;
        box-shadow: 0 0.104vw 0.313vw rgba(0, 0, 0, 0.3);

        img {
          opacity: 1;
        }
      }
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.833vw;
    margin-top: 1.563vw;
    width: 100%;

    &__button {
      padding: 0.625vw 1.042vw;
      border-radius: 0.417vw;
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 0.833vw;
      cursor: pointer;
      transition: all 0.3s ease;

      &--primary {
        background: #ffffff;
        color: #000000;

        &:hover {
          background: #f0f0f0;
          transform: translateY(-0.104vw);
          box-shadow: 0 0.208vw 0.417vw rgba(255, 255, 255, 0.3);
        }
      }

      &--cancel {
        background: #363636;
        color: #ffffff;

        &:hover {
          background: #404040;
          transform: translateY(-0.104vw);
        }
      }

      &:active {
        transform: translateY(0.104vw);
      }
    }
  }

  // Анимация появления компонента
  animation: fadeInUp 0.4s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(0.833vw);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>

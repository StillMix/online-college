<!-- src/components/CourseControlComponents/CourseImportPdf.vue -->
<template>
  <div class="course-import-pdf">
    <div class="course-import-pdf__header">
      <h2 class="course-import-pdf__header__title">
        <i class="fas fa-file-pdf course-import-pdf__header__title__icon"></i>
        Импорт курса из PDF
      </h2>
      <p class="course-import-pdf__header__subtitle">
        Загрузите PDF-файл для автоматического создания структуры курса
      </p>
    </div>

    <div class="course-import-pdf__content">
      <div
        class="course-import-pdf__dropzone"
        :class="{ active: isDragging, 'has-file': selectedFile }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleFileDrop"
      >
        <input
          type="file"
          ref="fileInput"
          class="course-import-pdf__dropzone__input"
          accept=".pdf"
          @change="handleFileSelect"
        />

        <div
          v-if="!selectedFile"
          class="course-import-pdf__dropzone__placeholder"
        >
          <i class="fas fa-file-pdf course-import-pdf__dropzone__icon"></i>
          <p class="course-import-pdf__dropzone__text">
            Перетащите PDF-файл сюда или нажмите для выбора
          </p>
          <button
            type="button"
            class="course-import-pdf__dropzone__button"
            @click="triggerFileInput"
          >
            Выбрать файл
          </button>
        </div>

        <div v-else class="course-import-pdf__dropzone__file">
          <div class="course-import-pdf__dropzone__file__info">
            <i
              class="fas fa-file-pdf course-import-pdf__dropzone__file__icon"
            ></i>
            <div class="course-import-pdf__dropzone__file__details">
              <p class="course-import-pdf__dropzone__file__name">
                {{ selectedFile.name }}
              </p>
              <p class="course-import-pdf__dropzone__file__size">
                {{ formatFileSize(selectedFile.size) }}
              </p>
            </div>
          </div>
          <button
            type="button"
            class="course-import-pdf__dropzone__file__remove"
            @click="removeFile"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="course-import-pdf__options" v-if="selectedFile">
        <div class="course-import-pdf__options__group">
          <label class="course-import-pdf__options__label">
            Параметры обработки PDF:
          </label>
          <div class="course-import-pdf__options__checkboxes">
            <label class="course-import-pdf__options__checkbox">
              <input type="checkbox" v-model="options.extractToc" />
              Извлечь оглавление
            </label>
            <label class="course-import-pdf__options__checkbox">
              <input type="checkbox" v-model="options.createLessons" />
              Создать уроки из подразделов
            </label>
            <label class="course-import-pdf__options__checkbox">
              <input type="checkbox" v-model="options.extractContent" />
              Извлечь содержимое для уроков
            </label>
          </div>
        </div>
      </div>

      <div
        class="course-import-pdf__preview"
        v-if="previewData && !isProcessing"
      >
        <h3 class="course-import-pdf__preview__title">
          Предварительный просмотр структуры курса:
        </h3>

        <div class="course-import-pdf__preview__structure">
          <p class="course-import-pdf__preview__course-title">
            {{ previewData.title }}
          </p>

          <div class="course-import-pdf__preview__sections">
            <div
              v-for="(section, index) in previewData.sections"
              :key="index"
              class="course-import-pdf__preview__section"
            >
              <p class="course-import-pdf__preview__section-title">
                {{ section.name }}
              </p>

              <div class="course-import-pdf__preview__lessons">
                <p
                  v-for="(lesson, lessonIndex) in section.content"
                  :key="lessonIndex"
                  class="course-import-pdf__preview__lesson"
                >
                  {{ lesson.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="course-import-pdf__progress" v-if="isProcessing">
        <AppSpinner color="#08dccf" />
        <p class="course-import-pdf__progress__text">{{ processingStatus }}</p>
      </div>

      <div class="course-import-pdf__result" v-if="processingResult">
        <div
          class="course-import-pdf__result__content"
          :class="{
            'course-import-pdf__result__content--error': processingResult.error,
          }"
        >
          <i
            :class="
              processingResult.error
                ? 'fas fa-exclamation-circle'
                : 'fas fa-check-circle'
            "
            class="course-import-pdf__result__icon"
          ></i>
          <div class="course-import-pdf__result__details">
            <p class="course-import-pdf__result__message">
              {{ processingResult.message }}
            </p>
            <p
              class="course-import-pdf__result__info"
              v-if="!processingResult.error"
            >
              Создано разделов: {{ processingResult.sectionsCount }}, уроков:
              {{ processingResult.lessonsCount }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="course-import-pdf__actions">
      <button
        type="button"
        class="course-import-pdf__actions__button course-import-pdf__actions__button--cancel"
        @click="$emit('close')"
      >
        Отмена
      </button>
      <button
        type="button"
        class="course-import-pdf__actions__button course-import-pdf__actions__button--primary"
        :disabled="!selectedFile || isProcessing"
        @click="processPdf"
      >
        {{ isProcessing ? "Обработка..." : "Импортировать курс" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { AppSpinner } from "../UI";
import axios from "axios";
import { CourseItem, CourseItemCourse } from "@/types";
export default defineComponent({
  name: "CourseImportPdf",
  components: { AppSpinner },
  emits: ["close", "import-complete"],
  setup(props, { emit }) {
    const fileInput = ref<HTMLInputElement | null>(null);
    const selectedFile = ref<File | null>(null);
    const isDragging = ref(false);
    const isProcessing = ref(false);
    const processingStatus = ref("Анализ PDF...");
    const processingResult = ref<any>(null);
    const previewData = ref<any>(null);

    const options = ref({
      extractToc: true,
      createLessons: true,
      extractContent: true,
    });

    // Вызов выбора файла
    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    // Обработка выбора файла
    const handleFileSelect = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0];
        processingResult.value = null;
      }
    };

    // Обработка перетаскивания файла
    const handleFileDrop = (event: DragEvent) => {
      isDragging.value = false;
      if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0];
        if (file.type === "application/pdf") {
          selectedFile.value = file;
          processingResult.value = null;
        }
      }
    };

    // Удаление выбранного файла
    const removeFile = () => {
      selectedFile.value = null;
      if (fileInput.value) {
        fileInput.value.value = "";
      }
      previewData.value = null;
      processingResult.value = null;
    };

    // Форматирование размера файла
    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) {
        return bytes + " байт";
      } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + " КБ";
      } else {
        return (bytes / (1024 * 1024)).toFixed(1) + " МБ";
      }
    };

    // Обработка PDF
    // Обработка PDF
    const processPdf = async () => {
      if (!selectedFile.value) return;

      try {
        isProcessing.value = true;
        processingStatus.value = "Загрузка и анализ PDF...";
        processingResult.value = null;

        const formData = new FormData();
        formData.append("file", selectedFile.value);

        // Добавляем опции обработки
        formData.append("extract_toc", options.value.extractToc.toString());
        formData.append(
          "create_lessons",
          options.value.createLessons.toString()
        );
        formData.append(
          "extract_content",
          options.value.extractContent.toString()
        );

        // Получаем предварительный просмотр структуры
        const previewResponse = await axios.post<CourseItem>(
          "https://back.kktsback.tw1.ru/api/pdf/preview",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Показываем предпросмотр пользователю
        previewData.value = previewResponse.data;
        processingStatus.value = "Создание курса на основе структуры...";

        // Теперь создаем курс с полученной структурой
        const response = await axios.post<CourseItem>(
          "https://back.kktsback.tw1.ru/api/courses/",
          previewData.value,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Правильно типизированный подсчет уроков
        const lessonsCount = previewData.value.sections.reduce(
          (total: number, section: CourseItemCourse) =>
            total + section.content.length,
          0
        );

        processingResult.value = {
          error: false,
          message: "Курс успешно импортирован из PDF!",
          courseId: response.data.id,
          sectionsCount: previewData.value.sections.length,
          lessonsCount: lessonsCount,
        };

        // Обновляем список курсов через API
        await axios.get("https://back.kktsback.tw1.ru/api/courses/");

        // Оповещаем родительский компонент о завершении импорта
        emit("import-complete", response.data.id);
      } catch (error: unknown) {
        console.error("Ошибка при импорте PDF:", error);

        // Правильная обработка ошибки с типизацией
        const errorMessage =
          error instanceof Error
            ? error.message
            : (error as any)?.response?.data?.detail ?? "Неизвестная ошибка";

        processingResult.value = {
          error: true,
          message: `Ошибка при импорте: ${errorMessage}`,
        };
      } finally {
        isProcessing.value = false;
      }
    };
    return {
      fileInput,
      selectedFile,
      isDragging,
      isProcessing,
      processingStatus,
      processingResult,
      previewData,
      options,
      triggerFileInput,
      handleFileSelect,
      handleFileDrop,
      removeFile,
      formatFileSize,
      processPdf,
    };
  },
});
</script>

<style scoped lang="scss">
.course-import-pdf {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #2a2a2a;
  border-radius: 0.625vw;
  padding: 1.563vw;
  box-shadow: 0 0.156vw 0.625vw rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  animation: fadeIn 0.4s ease-out;

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

  &__content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.042vw;
  }

  &__dropzone {
    width: 100%;
    min-height: 10.417vw;
    border: 0.104vw dashed rgba(255, 255, 255, 0.2);
    border-radius: 0.625vw;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
    padding: 1.042vw;
    background-color: rgba(0, 0, 0, 0.1);

    &.active {
      border-color: #08dccf;
      background-color: rgba(8, 220, 207, 0.05);
    }

    &.has-file {
      min-height: auto;
      padding: 0.833vw;
    }

    &__input {
      position: absolute;
      width: 0.052vw;
      height: 0.052vw;
      opacity: 0;
      overflow: hidden;
    }

    &__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 1.563vw;
    }

    &__icon {
      font-size: 2.604vw;
      color: rgba(255, 255, 255, 0.3);
      margin-bottom: 1.042vw;
    }

    &__text {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 1.042vw;
    }

    &__button {
      padding: 0.521vw 1.042vw;
      background-color: #363636;
      border-radius: 0.417vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
      color: #fff;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        background-color: #08dccf;
        transform: translateY(-0.104vw);
      }
    }

    &__file {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.521vw;

      &__info {
        display: flex;
        align-items: center;
        gap: 0.833vw;
      }

      &__icon {
        font-size: 1.563vw;
        color: #08dccf;
      }

      &__details {
        display: flex;
        flex-direction: column;
        gap: 0.208vw;
      }

      &__name {
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 0.938vw;
        color: #fff;
      }

      &__size {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.729vw;
        color: rgba(255, 255, 255, 0.5);
      }

      &__remove {
        width: 1.563vw;
        height: 1.563vw;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.2);
        color: rgba(255, 255, 255, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background-color: #ff5b5b;
          color: #fff;
        }
      }
    }
  }

  &__options {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 0.417vw;
    padding: 0.833vw;

    &__group {
      margin-bottom: 0.521vw;
    }

    &__label {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 0.833vw;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0.521vw;
      display: block;
    }

    &__checkboxes {
      display: flex;
      flex-wrap: wrap;
      gap: 0.833vw;
    }

    &__checkbox {
      display: flex;
      align-items: center;
      gap: 0.313vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.729vw;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;

      input[type="checkbox"] {
        accent-color: #08dccf;
      }

      &:hover {
        color: #fff;
      }
    }
  }

  &__preview {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 0.417vw;
    padding: 0.833vw;
    animation: fadeIn 0.3s ease-out;

    &__title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 0.938vw;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0.833vw;
    }

    &__structure {
      max-height: 15.625vw;
      overflow-y: auto;
      padding-right: 0.521vw;

      &::-webkit-scrollbar {
        width: 0.313vw;
      }

      &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 0.156vw;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(8, 220, 207, 0.3);
        border-radius: 0.156vw;
      }
    }

    &__course-title {
      font-family: var(--font-family);
      font-weight: 600;
      font-size: 0.938vw;
      color: #fff;
      margin-bottom: 0.833vw;
    }

    &__sections {
      display: flex;
      flex-direction: column;
      gap: 0.833vw;
    }

    &__section {
      margin-left: 0.521vw;
      padding-left: 0.521vw;
      border-left: 0.104vw solid rgba(8, 220, 207, 0.5);
    }

    &__section-title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 0.833vw;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 0.417vw;
    }

    &__lessons {
      display: flex;
      flex-direction: column;
      gap: 0.313vw;
      margin-left: 0.833vw;
    }

    &__lesson {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.729vw;
      color: rgba(255, 255, 255, 0.7);
      position: relative;
      padding-left: 0.833vw;

      &::before {
        content: "•";
        position: absolute;
        left: 0;
        color: #08dccf;
      }
    }
  }

  &__progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.833vw;
    padding: 2.083vw 0;
    animation: fadeIn 0.3s ease-out;

    &__text {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  &__result {
    padding: 0.833vw;
    animation: fadeIn 0.3s ease-out;

    &__content {
      display: flex;
      align-items: center;
      gap: 0.833vw;
      background-color: rgba(57, 184, 116, 0.1);
      border-left: 0.156vw solid #39b874;
      padding: 0.833vw;
      border-radius: 0.313vw;

      &--error {
        background-color: rgba(255, 91, 91, 0.1);
        border-left-color: #ff5b5b;
      }
    }

    &__icon {
      font-size: 1.563vw;
      color: #39b874;

      .course-import-pdf__result__content--error & {
        color: #ff5b5b;
      }
    }

    &__details {
      display: flex;
      flex-direction: column;
      gap: 0.313vw;
    }

    &__message {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 0.938vw;
      color: #fff;
    }

    &__info {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
      color: rgba(255, 255, 255, 0.7);
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

        &:hover:not(:disabled) {
          background: #f0f0f0;
          transform: translateY(-0.104vw);
          box-shadow: 0 0.208vw 0.417vw rgba(255, 255, 255, 0.3);
        }

        &:disabled {
          background: rgba(255, 255, 255, 0.3);
          color: rgba(0, 0, 0, 0.5);
          cursor: not-allowed;
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

      &:active:not(:disabled) {
        transform: translateY(0.104vw);
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<template>
  <div class="course-lesson-editor">
    <!-- Панель инструментов редактора -->
    <div class="course-lesson-editor__toolbar">
      <div class="course-lesson-editor__toolbar__group">
        <button
          class="course-lesson-editor__toolbar__button"
          :class="{ active: currentTextAlign === 'left' }"
          @click="applyTextAlign('left')"
          title="По левому краю"
        >
          <i class="fas fa-align-left"></i>
        </button>
        <button
          class="course-lesson-editor__toolbar__button"
          :class="{ active: currentTextAlign === 'center' }"
          @click="applyTextAlign('center')"
          title="По центру"
        >
          <i class="fas fa-align-center"></i>
        </button>
        <button
          class="course-lesson-editor__toolbar__button"
          :class="{ active: currentTextAlign === 'right' }"
          @click="applyTextAlign('right')"
          title="По правому краю"
        >
          <i class="fas fa-align-right"></i>
        </button>
      </div>

      <div class="course-lesson-editor__toolbar__group">
        <button
          class="course-lesson-editor__toolbar__button"
          :class="{ active: isBold }"
          @click="applyFormat('bold')"
          title="Жирный"
        >
          <i class="fas fa-bold"></i>
        </button>
        <button
          class="course-lesson-editor__toolbar__button"
          :class="{ active: isItalic }"
          @click="applyFormat('italic')"
          title="Курсив"
        >
          <i class="fas fa-italic"></i>
        </button>
        <button
          class="course-lesson-editor__toolbar__button"
          :class="{ active: isUnderline }"
          @click="applyFormat('underline')"
          title="Подчеркнутый"
        >
          <i class="fas fa-underline"></i>
        </button>
      </div>

      <div class="course-lesson-editor__toolbar__group">
        <select
          class="course-lesson-editor__toolbar__select"
          @change="applyHeading(($event.target as HTMLSelectElement)?.value)"
        >
          <option value="">Обычный текст</option>
          <option value="h1">Заголовок 1</option>
          <option value="h2">Заголовок 2</option>
          <option value="h3">Заголовок 3</option>
        </select>
      </div>

      <div class="course-lesson-editor__toolbar__group">
        <button
          class="course-lesson-editor__toolbar__button course-lesson-editor__toolbar__button--image"
          @click="openImageModal"
          title="Вставить изображение"
        >
          <i class="fas fa-image"></i> Изображение
        </button>
      </div>
    </div>

    <!-- Область редактирования контента -->
    <div
      class="course-lesson-editor__content"
      ref="editorContent"
      contenteditable="true"
      @input="updateContent"
      @keydown="handleKeyDown"
      @mouseup="checkFormatState"
      v-html="editorContent"
    ></div>

    <!-- Модальное окно для добавления изображений -->
    <div
      class="course-lesson-editor__image-modal"
      v-if="showImageModal"
      @click.self="closeImageModal"
    >
      <div class="course-lesson-editor__image-modal__content">
        <h3 class="course-lesson-editor__image-modal__title">
          Вставить изображение
        </h3>

        <div class="course-lesson-editor__image-modal__tabs">
          <button
            class="course-lesson-editor__image-modal__tab"
            :class="{ active: imageModalTab === 'upload' }"
            @click="imageModalTab = 'upload'"
          >
            Загрузить
          </button>
          <button
            class="course-lesson-editor__image-modal__tab"
            :class="{ active: imageModalTab === 'url' }"
            @click="imageModalTab = 'url'"
          >
            По ссылке
          </button>
        </div>

        <div class="course-lesson-editor__image-modal__body">
          <!-- Вкладка загрузки файла -->
          <div
            v-if="imageModalTab === 'upload'"
            class="course-lesson-editor__image-modal__upload"
          >
            <div
              class="course-lesson-editor__image-modal__dropzone"
              :class="{ active: isDragging }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
            >
              <input
                type="file"
                ref="fileInput"
                @change="handleFileSelect"
                accept="image/*"
                class="course-lesson-editor__image-modal__file-input"
              />
              <div
                v-if="!imagePreview"
                class="course-lesson-editor__image-modal__placeholder"
              >
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Перетащите изображение сюда или</p>
                <button
                  class="course-lesson-editor__image-modal__browse"
                  @click="triggerFileInput"
                >
                  Выберите файл
                </button>
              </div>
              <div v-else class="course-lesson-editor__image-modal__preview">
                <img
                  :src="imagePreview"
                  alt="Preview"
                  class="course-lesson-editor__image-modal__preview-img"
                />
                <button
                  class="course-lesson-editor__image-modal__remove"
                  @click="removeImagePreview"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Вкладка ссылки на изображение -->
          <div
            v-if="imageModalTab === 'url'"
            class="course-lesson-editor__image-modal__url"
          >
            <label class="course-lesson-editor__image-modal__label">
              URL изображения:
              <input
                type="url"
                v-model="imageUrl"
                placeholder="https://example.com/image.jpg"
                class="course-lesson-editor__image-modal__input"
              />
            </label>
            <div
              v-if="imageUrl"
              class="course-lesson-editor__image-modal__url-preview"
            >
              <img
                :src="imageUrl"
                alt="Preview"
                class="course-lesson-editor__image-modal__preview-img"
              />
            </div>
          </div>
        </div>

        <div class="course-lesson-editor__image-modal__actions">
          <button
            class="course-lesson-editor__image-modal__button course-lesson-editor__image-modal__button--cancel"
            @click="closeImageModal"
          >
            Отмена
          </button>
          <button
            class="course-lesson-editor__image-modal__button course-lesson-editor__image-modal__button--insert"
            @click="insertImage"
            :disabled="!canInsertImage"
          >
            Вставить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";

export default defineComponent({
  name: "CourseLessonDescriptionEdit",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    nachalDescription: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    // Основное содержимое редактора
    const editorContent = ref(
      props.nachalDescription || props.modelValue || ""
    );
    const editorContent$ = ref<HTMLDivElement | null>(null);

    // Состояние форматирования
    const isBold = ref(false);
    const isItalic = ref(false);
    const isUnderline = ref(false);
    const currentTextAlign = ref("left");

    // Ссылка на элемент редактора
    const editorRef = ref<HTMLDivElement | null>(null);

    // Состояние модального окна для изображений
    const showImageModal = ref(false);
    const imageModalTab = ref("upload");
    const imagePreview = ref("");
    const imageUrl = ref("");
    const isDragging = ref(false);
    const fileInput = ref<HTMLInputElement | null>(null);

    // Отслеживание изменений в свойстве modelValue
    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue !== editorContent.value) {
          editorContent.value = newValue;
        }
      }
    );

    // Отслеживание изменений в свойстве nachalDescription
    watch(
      () => props.nachalDescription,
      (newValue) => {
        if (newValue && !editorContent.value) {
          editorContent.value = newValue;
        }
      }
    );

    // Обработка ввода в редакторе
    const updateContent = () => {
      if (!editorRef.value) return;
      const content = editorRef.value.innerHTML;
      emit("update:modelValue", content);
      editorContent.value = content;
    };

    // Проверка состояния форматирования
    const checkFormatState = () => {
      isBold.value = document.queryCommandState("bold");
      isItalic.value = document.queryCommandState("italic");
      isUnderline.value = document.queryCommandState("underline");

      // Проверка выравнивания
      if (document.queryCommandState("justifyLeft")) {
        currentTextAlign.value = "left";
      } else if (document.queryCommandState("justifyCenter")) {
        currentTextAlign.value = "center";
      } else if (document.queryCommandState("justifyRight")) {
        currentTextAlign.value = "right";
      }
    };

    // Применение форматирования
    const applyFormat = (command: string) => {
      document.execCommand(command, false, undefined);

      checkFormatState();
      updateContent();
    };

    // Применение выравнивания текста
    const applyTextAlign = (align: string) => {
      if (align === "left") {
        document.execCommand("justifyLeft", false, undefined);
      } else if (align === "center") {
        document.execCommand("justifyCenter", false, undefined);
      } else if (align === "right") {
        document.execCommand("justifyRight", false, undefined);
      }
      currentTextAlign.value = align;
      updateContent();
    };

    // Применение заголовка
    const applyHeading = (heading: string) => {
      if (heading) {
        document.execCommand("formatBlock", false, `<${heading}>`);
      } else {
        document.execCommand("formatBlock", false, "<p>");
      }
      updateContent();
    };

    // Открытие модального окна для вставки изображения
    const openImageModal = () => {
      showImageModal.value = true;
      imageModalTab.value = "upload";
      imagePreview.value = "";
      imageUrl.value = "";
    };

    // Закрытие модального окна
    const closeImageModal = () => {
      showImageModal.value = false;
    };

    // Обработка выбора файла через диалог
    const handleFileSelect = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target) {
              imagePreview.value = e.target.result as string;
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };

    // Открытие диалога выбора файла
    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    // Обработка перетаскивания файла
    const handleFileDrop = (event: DragEvent) => {
      isDragging.value = false;
      if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target) {
              imagePreview.value = e.target.result as string;
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };

    // Удаление предварительного просмотра изображения
    const removeImagePreview = () => {
      imagePreview.value = "";
      if (fileInput.value) {
        fileInput.value.value = "";
      }
    };

    // Вставка изображения в редактор
    const insertImage = () => {
      let imageSource = "";

      if (imageModalTab.value === "upload" && imagePreview.value) {
        imageSource = imagePreview.value;
      } else if (imageModalTab.value === "url" && imageUrl.value) {
        imageSource = imageUrl.value;
      }

      if (imageSource) {
        document.execCommand(
          "insertHTML",
          false,
          `<img src="${imageSource}" style="max-width:100%;">`
        );
        updateContent();
        closeImageModal();
      }
    };

    // Проверка, можно ли вставить изображение
    const canInsertImage = computed(() => {
      return (
        (imageModalTab.value === "upload" && imagePreview.value) ||
        (imageModalTab.value === "url" && imageUrl.value)
      );
    });

    // Обработка нажатий клавиш
    const handleKeyDown = (event: KeyboardEvent) => {
      // Обработка Tab для добавления отступа
      if (event.key === "Tab") {
        event.preventDefault();
        document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
      }
    };

    // Инициализация редактора
    onMounted(() => {
      editorRef.value = document.querySelector(
        ".course-lesson-editor__content"
      );
      fileInput.value = document.querySelector(
        ".course-lesson-editor__image-modal__file-input"
      );

      // Обработчик для отслеживания клика вне редактора
      const handleClickOutside = (event: MouseEvent) => {
        if (
          editorRef.value &&
          !editorRef.value.contains(event.target as Node)
        ) {
          checkFormatState();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      // Очистка обработчика при размонтировании
      onBeforeUnmount(() => {
        document.removeEventListener("mousedown", handleClickOutside);
      });
    });

    return {
      editorContent,
      editorRef,
      isBold,
      isItalic,
      isUnderline,
      currentTextAlign,
      showImageModal,
      imageModalTab,
      imagePreview,
      imageUrl,
      isDragging,
      fileInput,
      canInsertImage,
      updateContent,
      checkFormatState,
      applyFormat,
      applyTextAlign,
      applyHeading,
      openImageModal,
      closeImageModal,
      handleFileSelect,
      triggerFileInput,
      handleFileDrop,
      removeImagePreview,
      insertImage,
      handleKeyDown,
    };
  },
});
</script>

<style lang="scss">
.course-lesson-editor {
  width: 100%;
  border-radius: 0.521vw;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 0.052vw solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0.104vw 0.417vw rgba(0, 0, 0, 0.2);
  background-color: #2a2a2a;

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.417vw;
    padding: 0.521vw;
    background-color: #363636;
    border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);

    &__group {
      display: flex;
      border-radius: 0.313vw;
      overflow: hidden;
      background-color: #404040;
      margin-right: 0.417vw;
    }

    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.979vw;
      height: 1.979vw;
      font-size: 0.729vw;
      background-color: transparent;
      color: rgba(255, 255, 255, 0.7);
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
      }

      &.active {
        background-color: #08dccf;
        color: #fff;
      }

      &--image {
        width: auto;
        padding: 0 0.833vw;
        display: flex;
        gap: 0.313vw;
      }
    }

    &__select {
      height: 1.979vw;
      background-color: #404040;
      color: rgba(255, 255, 255, 0.7);
      border: none;
      font-size: 0.729vw;
      font-family: var(--font-family);
      padding: 0 0.417vw;
      cursor: pointer;

      &:focus {
        outline: none;
      }

      option {
        background-color: #363636;
        color: #fff;
      }
    }
  }

  &__content {
    padding: 0.833vw;
    min-height: 15.625vw;
    max-height: 31.25vw;
    overflow-y: auto;
    background-color: #2a2a2a;
    font-family: var(--font-family);
    font-size: 0.833vw;
    line-height: 1.5;
    color: #fff;

    &:focus {
      outline: none;
    }

    &::-webkit-scrollbar {
      width: 0.417vw;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 0.521vw;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(8, 220, 207, 0.3);
      border-radius: 0.521vw;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(8, 220, 207, 0.5);
    }

    // Стили для элементов содержимого редактора
    h1,
    h2,
    h3 {
      margin-top: 0.833vw;
      margin-bottom: 0.833vw;
      font-weight: 500;
    }

    h1 {
      font-size: 1.563vw;
    }

    h2 {
      font-size: 1.25vw;
    }

    h3 {
      font-size: 1.042vw;
    }

    p {
      margin-bottom: 0.625vw;
    }

    img {
      max-width: 100%;
      border-radius: 0.313vw;
      margin: 0.833vw 0;
    }
  }

  &__image-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(0.156vw);
    animation: fadeIn 0.2s ease;

    &__content {
      width: 31.25vw;
      max-width: 90vw;
      background-color: #2a2a2a;
      border-radius: 0.625vw;
      box-shadow: 0 0.521vw 1.563vw rgba(0, 0, 0, 0.5);
      animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      overflow: hidden;
    }

    &__title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 1.042vw;
      color: #fff;
      margin: 0;
      padding: 1.042vw;
      border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);
    }

    &__tabs {
      display: flex;
      background-color: #363636;

      &__tab {
        flex: 1;
        padding: 0.625vw;
        background-color: transparent;
        border: none;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        transition: all 0.2s ease;

        &.active {
          color: #fff;
          background-color: rgba(8, 220, 207, 0.2);
          box-shadow: inset 0 -0.156vw 0 #08dccf;
        }

        &:hover:not(.active) {
          background-color: rgba(255, 255, 255, 0.05);
        }
      }
    }

    &__body {
      padding: 1.042vw;
    }

    &__dropzone {
      width: 100%;
      height: 10.417vw;
      border: 0.104vw dashed rgba(255, 255, 255, 0.2);
      border-radius: 0.417vw;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      position: relative;

      &.active {
        border-color: #08dccf;
        background-color: rgba(8, 220, 207, 0.05);
      }
    }

    &__file-input {
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
      color: rgba(255, 255, 255, 0.5);
      font-family: var(--font-family);
      font-size: 0.833vw;

      i {
        font-size: 2.083vw;
        margin-bottom: 0.521vw;
      }

      p {
        margin-bottom: 0.833vw;
      }
    }

    &__browse {
      background-color: #08dccf;
      color: #fff;
      border: none;
      border-radius: 0.313vw;
      padding: 0.417vw 0.833vw;
      font-family: var(--font-family);
      font-size: 0.729vw;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: #09e9db;
        transform: translateY(-0.052vw);
      }
    }

    &__preview {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      &-img {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 0.313vw;
      }
    }

    &__remove {
      position: absolute;
      top: 0.417vw;
      right: 0.417vw;
      width: 1.563vw;
      height: 1.563vw;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.5);
      border: none;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: #ff5b5b;
        transform: rotate(90deg);
      }
    }

    &__url {
      display: flex;
      flex-direction: column;
      gap: 0.833vw;
    }

    &__label {
      font-family: var(--font-family);
      font-size: 0.833vw;
      color: rgba(255, 255, 255, 0.7);
      display: flex;
      flex-direction: column;
      gap: 0.417vw;
    }

    &__input {
      padding: 0.521vw;
      border-radius: 0.313vw;
      background-color: #363636;
      border: 0.052vw solid rgba(255, 255, 255, 0.1);
      color: #fff;
      font-family: var(--font-family);
      font-size: 0.833vw;

      &:focus {
        outline: none;
        border-color: #08dccf;
      }
    }

    &__url-preview {
      width: 100%;
      height: 10.417vw;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 0.417vw;
      overflow: hidden;

      img {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
      }
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.833vw;
      padding: 1.042vw;
      background-color: #363636;
    }

    &__button {
      padding: 0.521vw 1.042vw;
      border-radius: 0.313vw;
      font-family: var(--font-family);
      font-size: 0.833vw;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;

      &--cancel {
        background-color: transparent;
        color: rgba(255, 255, 255, 0.7);

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
      }

      &--insert {
        background-color: #08dccf;
        color: #fff;

        &:hover:not(:disabled) {
          background-color: #09e9db;
          transform: translateY(-0.052vw);
        }

        &:disabled {
          background-color: rgba(8, 220, 207, 0.3);
          cursor: not-allowed;
        }
      }
    }
  }
}

// Анимации
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

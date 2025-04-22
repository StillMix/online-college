<template>
  <div class="rich-text-editor">
    <div class="rich-text-editor__toolbar">
      <div class="rich-text-editor__toolbar__group">
        <button
          v-for="(button, index) in textFormatButtons"
          :key="`format-${index}`"
          class="rich-text-editor__toolbar__button"
          :class="{
            'rich-text-editor__toolbar__button--active': button.isActive,
          }"
          @click="executeCommand(button.command, button.value)"
          :title="button.title"
        >
          <i :class="button.icon"></i>
        </button>
      </div>

      <div class="rich-text-editor__toolbar__group">
        <button
          v-for="(button, index) in alignmentButtons"
          :key="`align-${index}`"
          class="rich-text-editor__toolbar__button"
          :class="{
            'rich-text-editor__toolbar__button--active': button.isActive,
          }"
          @click="executeCommand(button.command, button.value)"
          :title="button.title"
        >
          <i :class="button.icon"></i>
        </button>
      </div>

      <div class="rich-text-editor__toolbar__group">
        <button
          class="rich-text-editor__toolbar__button"
          @click="insertImage"
          title="Вставить изображение"
        >
          <i class="fas fa-image"></i>
        </button>
        <button
          class="rich-text-editor__toolbar__button"
          @click="insertLink"
          title="Вставить ссылку"
        >
          <i class="fas fa-link"></i>
        </button>
      </div>
    </div>

    <div
      class="rich-text-editor__content"
      contenteditable="true"
      ref="editorContent"
      @input="updateContent"
      @keydown="handleKeyDown"
    ></div>

    <!-- Модальное окно для вставки изображения -->
    <div
      class="rich-text-editor__modal"
      v-if="showImageModal"
      @click.self="showImageModal = false"
    >
      <div class="rich-text-editor__modal__content">
        <h3 class="rich-text-editor__modal__title">Вставить изображение</h3>
        <div class="rich-text-editor__modal__form">
          <label class="rich-text-editor__modal__label">
            URL изображения:
            <input
              type="text"
              v-model="imageUrl"
              class="rich-text-editor__modal__input"
              placeholder="https://example.com/image.jpg"
            />
          </label>
          <p class="rich-text-editor__modal__or">или</p>
          <div class="rich-text-editor__modal__file">
            <input
              type="file"
              accept="image/*"
              ref="imageFileInput"
              @change="handleImageFile"
              class="rich-text-editor__modal__file__input"
            />
            <button class="rich-text-editor__modal__file__button">
              Выбрать файл
            </button>
            <span class="rich-text-editor__modal__file__name">
              {{ imageFileName || "Файл не выбран" }}
            </span>
          </div>

          <div class="rich-text-editor__modal__preview" v-if="imagePreview">
            <img :src="imagePreview" alt="Предпросмотр" />
          </div>

          <div class="rich-text-editor__modal__actions">
            <button
              @click="showImageModal = false"
              class="rich-text-editor__modal__button rich-text-editor__modal__button--cancel"
            >
              Отмена
            </button>
            <button
              @click="confirmImageInsert"
              class="rich-text-editor__modal__button rich-text-editor__modal__button--confirm"
              :disabled="!canInsertImage"
            >
              Вставить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для вставки ссылки -->
    <div
      class="rich-text-editor__modal"
      v-if="showLinkModal"
      @click.self="showLinkModal = false"
    >
      <div class="rich-text-editor__modal__content">
        <h3 class="rich-text-editor__modal__title">Вставить ссылку</h3>
        <div class="rich-text-editor__modal__form">
          <label class="rich-text-editor__modal__label">
            Текст ссылки:
            <input
              type="text"
              v-model="linkText"
              class="rich-text-editor__modal__input"
              placeholder="Текст ссылки"
            />
          </label>
          <label class="rich-text-editor__modal__label">
            URL:
            <input
              type="text"
              v-model="linkUrl"
              class="rich-text-editor__modal__input"
              placeholder="https://example.com"
            />
          </label>

          <div class="rich-text-editor__modal__actions">
            <button
              @click="showLinkModal = false"
              class="rich-text-editor__modal__button rich-text-editor__modal__button--cancel"
            >
              Отмена
            </button>
            <button
              @click="confirmLinkInsert"
              class="rich-text-editor__modal__button rich-text-editor__modal__button--confirm"
              :disabled="!linkUrl"
            >
              Вставить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from "vue";

export default defineComponent({
  name: "RichTextEditor",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Начните вводить текст...",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const editorContent = ref<HTMLDivElement | null>(null);
    // Изменяем тип с null на undefined
    const lastSelection = ref<Range | undefined>(undefined);
    const savedSelection = ref<Range | undefined>(undefined);

    // Модальные окна
    const showImageModal = ref(false);
    const showLinkModal = ref(false);

    // Параметры для изображения
    const imageUrl = ref("");
    const imageFileInput = ref<HTMLInputElement | null>(null);
    const imageFileName = ref("");
    const imagePreview = ref("");

    // Параметры для ссылки
    const linkText = ref("");
    const linkUrl = ref("");

    // Кнопки форматирования текста
    const textFormatButtons = ref([
      {
        command: "bold",
        icon: "fas fa-bold",
        title: "Полужирный (Ctrl+B)",
        isActive: false,
        value: undefined,
      },
      {
        command: "italic",
        icon: "fas fa-italic",
        title: "Курсив (Ctrl+I)",
        isActive: false,
        value: undefined,
      },
      {
        command: "underline",
        icon: "fas fa-underline",
        title: "Подчеркнутый (Ctrl+U)",
        isActive: false,
        value: undefined,
      },
      {
        command: "strikeThrough",
        icon: "fas fa-strikethrough",
        title: "Зачеркнутый",
        isActive: false,
        value: undefined,
      },
      {
        command: "formatBlock",
        value: "h1",
        icon: "fas fa-heading",
        title: "Заголовок 1",
        isActive: false,
      },
      {
        command: "formatBlock",
        value: "h2",
        icon: "fas fa-heading fa-xs",
        title: "Заголовок 2",
        isActive: false,
      },
      {
        command: "formatBlock",
        value: "h3",
        icon: "fas fa-heading fa-xs",
        title: "Заголовок 3",
        isActive: false,
      },
      {
        command: "formatBlock",
        value: "p",
        icon: "fas fa-paragraph",
        title: "Параграф",
        isActive: false,
      },
      {
        command: "insertUnorderedList",
        icon: "fas fa-list-ul",
        title: "Маркированный список",
        isActive: false,
        value: undefined,
      },
      {
        command: "insertOrderedList",
        icon: "fas fa-list-ol",
        title: "Нумерованный список",
        isActive: false,
        value: undefined,
      },
    ]);

    // Кнопки выравнивания
    const alignmentButtons = ref([
      {
        command: "justifyLeft",
        icon: "fas fa-align-left",
        title: "По левому краю",
        isActive: false,
        value: undefined,
      },
      {
        command: "justifyCenter",
        icon: "fas fa-align-center",
        title: "По центру",
        isActive: false,
        value: undefined,
      },
      {
        command: "justifyRight",
        icon: "fas fa-align-right",
        title: "По правому краю",
        isActive: false,
        value: undefined,
      },
      {
        command: "justifyFull",
        icon: "fas fa-align-justify",
        title: "По ширине",
        isActive: false,
        value: undefined,
      },
    ]);

    // Сохранение текущего выделения
    const saveSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        savedSelection.value = selection.getRangeAt(0).cloneRange();
      }
    };

    // Восстановление сохраненного выделения
    const restoreSelection = () => {
      if (savedSelection.value) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(savedSelection.value);
        }
      }
    };

    // Обработка ввода в редакторе
    const updateContent = () => {
      if (editorContent.value) {
        emit("update:modelValue", editorContent.value.innerHTML);
      }
    };

    // Выполнение команды форматирования
    const executeCommand = (command: string, value?: string) => {
      document.execCommand(command, false, value || "");
      updateContent();
      updateButtonStates();
    };

    // Обновление состояния кнопок форматирования
    const updateButtonStates = () => {
      textFormatButtons.value.forEach((button) => {
        if (button.command === "formatBlock" && button.value) {
          const formatBlockValue = document
            .queryCommandValue("formatBlock")
            .toLowerCase();
          button.isActive = formatBlockValue === button.value.toLowerCase();
        } else {
          button.isActive = document.queryCommandState(button.command);
        }
      });

      alignmentButtons.value.forEach((button) => {
        button.isActive = document.queryCommandState(button.command);
      });
    };

    // Открытие модального окна для вставки изображения
    const insertImage = () => {
      saveSelection();
      showImageModal.value = true;
      imageUrl.value = "";
      imageFileName.value = "";
      imagePreview.value = "";
    };

    // Обработка выбора файла изображения
    const handleImageFile = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        imageFileName.value = file.name;

        // Создаем URL для предпросмотра
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            imagePreview.value = e.target.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    };

    // Проверка возможности вставки изображения
    const canInsertImage = computed(() => {
      return imageUrl.value || imagePreview.value;
    });

    // Подтверждение вставки изображения
    const confirmImageInsert = () => {
      restoreSelection();

      const imgSrc = imagePreview.value || imageUrl.value;
      if (imgSrc) {
        document.execCommand(
          "insertHTML",
          false,
          `<img src="${imgSrc}" alt="${
            imageFileName.value || "Изображение"
          }" style="max-width: 100%;">`
        );
        updateContent();
      }

      showImageModal.value = false;
    };

    // Открытие модального окна для вставки ссылки
    const insertLink = () => {
      saveSelection();

      // Получаем выделенный текст
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        linkText.value = selection.toString();
      } else {
        linkText.value = "";
      }

      linkUrl.value = "";
      showLinkModal.value = true;
    };

    // Подтверждение вставки ссылки
    const confirmLinkInsert = () => {
      restoreSelection();

      if (linkUrl.value) {
        if (linkText.value) {
          // Если есть текст, создаем ссылку с этим текстом
          document.execCommand(
            "insertHTML",
            false,
            `<a href="${linkUrl.value}" target="_blank">${linkText.value}</a>`
          );
        } else {
          // Если нет текста, используем URL как текст ссылки
          document.execCommand("createLink", false, linkUrl.value);
        }
        updateContent();
      }

      showLinkModal.value = false;
    };

    // Обработка нажатий клавиш (например, Ctrl+B, Ctrl+I и т.д.)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case "b":
            event.preventDefault();
            executeCommand("bold");
            break;
          case "i":
            event.preventDefault();
            executeCommand("italic");
            break;
          case "u":
            event.preventDefault();
            executeCommand("underline");
            break;
        }
      }
    };

    // Инициализация редактора
    onMounted(() => {
      if (editorContent.value) {
        // Устанавливаем начальное содержимое
        editorContent.value.innerHTML = props.modelValue;

        // Если нет содержимого, показываем плейсхолдер
        if (!props.modelValue) {
          editorContent.value.dataset.placeholder = props.placeholder;
        }

        // Добавляем обработчики событий
        editorContent.value.addEventListener("focus", () => {
          editorContent.value?.classList.add("focused");
        });

        editorContent.value.addEventListener("blur", () => {
          editorContent.value?.classList.remove("focused");
          updateButtonStates();
        });

        // Обработчик для отслеживания выделения
        document.addEventListener("selectionchange", () => {
          if (document.activeElement === editorContent.value) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              lastSelection.value = selection.getRangeAt(0);
              updateButtonStates();
            }
          }
        });
      }
    });

    // Следим за изменениями в props.modelValue
    watch(
      () => props.modelValue,
      (newValue) => {
        if (editorContent.value && editorContent.value.innerHTML !== newValue) {
          editorContent.value.innerHTML = newValue;
        }
      }
    );

    return {
      editorContent,
      textFormatButtons,
      alignmentButtons,
      showImageModal,
      showLinkModal,
      imageUrl,
      imageFileInput,
      imageFileName,
      imagePreview,
      linkText,
      linkUrl,
      updateContent,
      executeCommand,
      insertImage,
      insertLink,
      handleImageFile,
      confirmImageInsert,
      confirmLinkInsert,
      handleKeyDown,
      canInsertImage,
    };
  },
});
</script>

<style scoped lang="scss">
.rich-text-editor {
  width: 100%;
  border-radius: 0.417vw;
  overflow: hidden;
  background: #363636;
  box-shadow: 0 0.104vw 0.417vw rgba(0, 0, 0, 0.1);

  &__toolbar {
    display: flex;
    padding: 0.521vw;
    background: #2a2a2a;
    border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);
    flex-wrap: wrap;
    gap: 0.313vw;

    &__group {
      display: flex;
      gap: 0.208vw;
      margin-right: 0.521vw;
      padding-right: 0.521vw;
      border-right: 0.052vw solid rgba(255, 255, 255, 0.1);

      &:last-child {
        border-right: none;
        margin-right: 0;
        padding-right: 0;
      }
    }

    &__button {
      width: 1.823vw;
      height: 1.823vw;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #363636;
      border-radius: 0.208vw;
      color: #fff;
      font-size: 0.729vw;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #404040;
        transform: translateY(-0.052vw);
      }

      &:active {
        transform: translateY(0.052vw);
      }

      &--active {
        background: #08dccf;
        color: #2a2a2a;

        &:hover {
          background: #09e9db;
        }
      }
    }
  }

  &__content {
    min-height: 15.625vw;
    padding: 0.781vw;
    color: #fff;
    font-family: var(--font-family);
    font-size: 0.833vw;
    line-height: 1.5;
    outline: none;
    transition: all 0.3s ease;

    &[data-placeholder]:empty::before {
      content: attr(data-placeholder);
      color: rgba(255, 255, 255, 0.3);
      pointer-events: none;
    }

    &.focused {
      box-shadow: inset 0 0 0 0.052vw rgba(8, 220, 207, 0.5);
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 0.313vw;
      margin: 0.521vw 0;
    }

    a {
      color: #08dccf;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0.781vw 0;
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

    ul,
    ol {
      margin: 0.521vw 0;
      padding-left: 1.563vw;
    }

    li {
      margin-bottom: 0.313vw;
    }

    p {
      margin: 0.417vw 0;
    }
  }

  &__modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;

    &__content {
      background: #2a2a2a;
      border-radius: 0.521vw;
      padding: 1.042vw;
      width: 26.042vw;
      max-width: 90vw;
      box-shadow: 0 0.521vw 1.042vw rgba(0, 0, 0, 0.3);
      animation: scaleIn 0.3s ease;
    }

    &__title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 1.042vw;
      color: #fff;
      margin: 0 0 1.042vw 0;
      padding-bottom: 0.521vw;
      border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);
    }

    &__form {
      display: flex;
      flex-direction: column;
      gap: 0.781vw;
    }

    &__label {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.729vw;
      color: rgba(255, 255, 255, 0.7);
      display: flex;
      flex-direction: column;
      gap: 0.313vw;
    }

    &__input {
      border-radius: 0.313vw;
      height: 2.083vw;
      background: #363636;
      padding: 0 0.781vw;
      color: #fff;
      font-family: var(--font-family);
      font-size: 0.833vw;
      border: 0.052vw solid transparent;
      transition: all 0.3s ease;

      &:focus {
        border-color: #08dccf;
        box-shadow: 0 0 0.313vw rgba(8, 220, 207, 0.5);
      }
    }

    &__or {
      text-align: center;
      font-family: var(--font-family);
      font-size: 0.729vw;
      color: rgba(255, 255, 255, 0.5);
      position: relative;
      margin: 0.521vw 0;

      &::before,
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        width: 45%;
        height: 0.052vw;
        background: rgba(255, 255, 255, 0.1);
      }

      &::before {
        left: 0;
      }

      &::after {
        right: 0;
      }
    }

    &__file {
      position: relative;
      display: flex;
      align-items: center;
      height: 2.083vw;

      &__input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        z-index: 1;
      }

      &__button {
        min-width: 8.333vw;
        height: 100%;
        background: #08dccf;
        border-radius: 0.313vw;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.729vw;
        color: #2a2a2a;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: #09e9db;
          transform: translateY(-0.052vw);
        }
      }

      &__name {
        margin-left: 0.521vw;
        font-family: var(--font-family);
        font-size: 0.729vw;
        color: rgba(255, 255, 255, 0.7);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 15.625vw;
      }
    }

    &__preview {
      margin-top: 0.521vw;
      width: 100%;
      height: 10.417vw;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 0.313vw;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.521vw;
      margin-top: 1.042vw;
    }

    &__button {
      padding: 0.417vw 0.833vw;
      border-radius: 0.313vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.729vw;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        transform: translateY(-0.052vw);
      }

      &:active:not(:disabled) {
        transform: translateY(0.052vw);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &--cancel {
        background: #363636;
        color: #fff;

        &:hover {
          background: #404040;
        }
      }

      &--confirm {
        background: #39b874;
        color: #fff;

        &:hover:not(:disabled) {
          background: #45cc83;
          box-shadow: 0 0.104vw 0.313vw rgba(57, 184, 116, 0.4);
        }
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

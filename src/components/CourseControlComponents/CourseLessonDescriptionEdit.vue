<template>
  <div class="course-lesson-editor">
    <!-- Панель инструментов редактора -->
    <CourseDesHeader
      :isBold="isBold"
      :isItalic="isItalic"
      :isUnderline="isUnderline"
      :currentTextAlign="currentTextAlign"
      @align="applyTextAlign"
      @format="applyFormat"
      @heading="applyHeading"
      @openImageModal="openImageModal"
      @font="applyFont"
    />

    <!-- Область редактирования контента -->
    <CourseDesEditor
      v-model="editorContent"
      :initialContent="nachalDescription"
      @checkFormat="checkFormatState"
    />

    <!-- Модальное окно для добавления изображений -->
    <CourseDesAddImg
      :show="showImageModal"
      :activeTab="imageModalTab"
      :imagePreview="imagePreview"
      :imageUrl="imageUrl"
      :isDragging="isDragging"
      :uploadedImages="uploadedImages"
      @close="closeImageModal"
      @changeTab="imageModalTab = $event"
      @fileSelect="handleFileSelect"
      @triggerFileInput="triggerFileInput"
      @removePreview="removeImagePreview"
      @urlInput="imageUrl = $event"
      @insert="insertImage"
      @selectUploadedImage="selectUploadedImage"
      @dragover="isDragging = true"
      @dragleave="isDragging = false"
      @drop="handleFileDrop"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from "vue";
import CourseDesHeader from "./CourseDesHeader.vue";
import CourseDesAddImg from "./CourseDesAddImg.vue";
import CourseDesEditor from "./CourseDesEditor.vue";

export default defineComponent({
  name: "CourseLessonDescriptionEdit",
  components: {
    CourseDesHeader,
    CourseDesAddImg,
    CourseDesEditor,
  },
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

    // Состояние форматирования
    const isBold = ref(false);
    const isItalic = ref(false);
    const isUnderline = ref(false);
    const currentTextAlign = ref("left");

    // Состояние модального окна для изображений
    const showImageModal = ref(false);
    const imageModalTab = ref("upload");
    const imagePreview = ref("");
    const imageUrl = ref("");
    const isDragging = ref(false);
    //const fileInput = ref<HTMLInputElement | null>(null);
    // Добавляем отсутствующие свойства и методы
    const uploadedImages = ref<Array<{ url: string; name: string }>>([]);
    // Добавить метод selectUploadedImage
    const selectUploadedImage = (url: string) => {
      imageUrl.value = url;
      imagePreview.value = url;
    };
    // Отслеживание изменений в свойстве modelValue
    watch(
      () => editorContent.value,
      (newValue) => {
        emit("update:modelValue", newValue);
      }
    );

    // Проверка состояния форматирования
    // Изменяем метод checkFormatState для корректного определения выравнивания
    const checkFormatState = () => {
      isBold.value = document.queryCommandState("bold");
      isItalic.value = document.queryCommandState("italic");
      isUnderline.value = document.queryCommandState("underline");

      // Проверка выравнивания путем анализа текущего элемента
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let currentNode = range.commonAncestorContainer;

        // Если это текстовый узел, берем его родителя
        if (currentNode.nodeType === 3 && currentNode.parentNode) {
          currentNode = currentNode.parentNode;
        }

        // Найдем ближайший элемент с установленным text-align
        if (currentNode instanceof HTMLElement) {
          let currentElement = currentNode;
          let align = "";

          while (currentElement) {
            if (currentElement.style && currentElement.style.textAlign) {
              align = currentElement.style.textAlign;
              break;
            } else if (window.getComputedStyle(currentElement).textAlign) {
              align = window.getComputedStyle(currentElement).textAlign;
              if (align !== "start" && align !== "left") {
                break;
              }
            }

            if (currentElement.parentElement) {
              currentElement = currentElement.parentElement;
            } else {
              break;
            }
          }

          // Устанавливаем состояние в зависимости от найденного выравнивания
          if (align === "center") {
            currentTextAlign.value = "center";
          } else if (align === "right") {
            currentTextAlign.value = "right";
          } else {
            currentTextAlign.value = "left";
          }
        }
      }
    };

    // Применение форматирования
    const applyFormat = (command: string) => {
      // Сначала фокусируем редактор
      const editor = document.querySelector(
        ".course-lesson-editor__content"
      ) as HTMLElement;
      if (editor) {
        editor.focus();
        // Затем выполняем команду
        document.execCommand(command, false, undefined);
        checkFormatState();
      }
    };

    // Применение выравнивания текста
    const applyTextAlign = (align: string) => {
      const editor = document.querySelector(
        ".course-lesson-editor__content"
      ) as HTMLElement;

      if (editor) {
        editor.focus();

        // Получаем текущее выделение
        const selection = window.getSelection();
        let targetNode;

        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          // Получаем родительский элемент блока, который нужно выровнять
          targetNode = range.commonAncestorContainer;

          // Если targetNode является текстовым узлом, берем его родителя
          if (targetNode.nodeType === 3) {
            // TEXT_NODE
            targetNode = targetNode.parentNode;
          }
        } else {
          // Если нет выделения, работаем с активным элементом
          targetNode = document.activeElement;
        }

        // Применяем выравнивание через CSS вместо устаревших команд
        if (targetNode && targetNode instanceof HTMLElement) {
          // Находим ближайший блочный элемент
          let blockElement = targetNode;
          while (
            blockElement &&
            getComputedStyle(blockElement).display !== "block" &&
            blockElement.tagName !== "P" &&
            blockElement.tagName !== "DIV" &&
            blockElement.tagName !== "H1" &&
            blockElement.tagName !== "H2" &&
            blockElement.tagName !== "H3"
          ) {
            if (blockElement.parentElement) {
              blockElement = blockElement.parentElement;
            } else {
              break;
            }
          }

          // Применяем стиль выравнивания
          if (blockElement) {
            blockElement.style.textAlign = align;
          } else {
            // Если не нашли блочный элемент, создаем его
            document.execCommand("formatBlock", false, "<p>");
            const newP = selection?.anchorNode?.parentElement;
            if (newP) {
              newP.style.textAlign = align;
            }
          }
        }

        // Принудительно устанавливаем текущее выравнивание
        currentTextAlign.value = align;
      }
    };

    const applyFont = (fontSize: string) => {
      const editor = document.querySelector(
        ".course-lesson-editor__content"
      ) as HTMLElement;
      if (editor) {
        editor.focus();
        console.log(fontSize);
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);

          // Создаём span с нужным размером
          const span = document.createElement("span");
          span.style.fontSize = fontSize; // например "16px", "24px" и т.д.

          // Вставляем выделенный текст внутрь спана
          span.appendChild(range.extractContents());
          range.insertNode(span);

          // Перемещаем курсор после вставленного элемента
          range.setStartAfter(span);
          range.setEndAfter(span);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    };

    const applyHeading = (heading: string) => {
      const editor = document.querySelector(
        ".course-lesson-editor__content"
      ) as HTMLElement;
      if (editor) {
        editor.focus();
        if (heading) {
          document.execCommand("formatBlock", false, `<${heading}>`);
        } else {
          document.execCommand("formatBlock", false, "<p>");
        }
      }
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
      const input = document.querySelector(
        ".course-lesson-editor__image-modal__file-input"
      ) as HTMLInputElement;
      if (input) {
        input.click();
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
      const input = document.querySelector(
        ".course-lesson-editor__image-modal__file-input"
      ) as HTMLInputElement;
      if (input) {
        input.value = "";
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
        // Сфокусируем редактор перед вставкой
        const editor = document.querySelector(
          ".course-lesson-editor__content"
        ) as HTMLElement;
        if (editor) {
          editor.focus();

          // Восстанавливаем выделение, если оно было потеряно
          try {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false); // Перемещаем курсор в конец, если нет выделения
            selection?.removeAllRanges();
            selection?.addRange(range);
          } catch (e) {
            console.error("Ошибка при восстановлении выделения:", e);
          }

          // Вставляем изображение
          document.execCommand(
            "insertHTML",
            false,
            `<img src="${imageSource}" style="max-width:100%; display:block; margin:10px auto;">`
          );
        }
        closeImageModal();
      }
    };

    // Инициализация редактора
    onMounted(() => {
      // Обработчик для отслеживания клика вне редактора
      const handleClickOutside = (event: MouseEvent) => {
        const editor = document.querySelector(".course-lesson-editor__content");
        if (editor && !editor.contains(event.target as Node)) {
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
      isBold,
      isItalic,
      isUnderline,
      currentTextAlign,
      showImageModal,
      imageModalTab,
      imagePreview,
      imageUrl,
      isDragging,
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
      uploadedImages,
      selectUploadedImage,
      applyFont,
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

  /* Стили для элементов содержимого редактора */
  .course-lesson-editor__content {
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
}
</style>

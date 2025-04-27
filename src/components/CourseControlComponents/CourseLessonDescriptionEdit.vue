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

    // Отслеживание изменений в свойстве modelValue
    watch(
      () => editorContent.value,
      (newValue) => {
        emit("update:modelValue", newValue);
      }
    );

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
        if (align === "left") {
          document.execCommand("justifyLeft", false, undefined);
        } else if (align === "center") {
          document.execCommand("justifyCenter", false, undefined);
        } else if (align === "right") {
          document.execCommand("justifyRight", false, undefined);
        }
        currentTextAlign.value = align;
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

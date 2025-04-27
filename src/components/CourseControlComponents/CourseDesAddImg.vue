<template>
  <div
    class="course-lesson-editor__image-modal"
    v-if="show"
    @click.self="$emit('close')"
  >
    <div class="course-lesson-editor__image-modal__content">
      <h3 class="course-lesson-editor__image-modal__title">
        Вставить изображение
      </h3>

      <div class="course-lesson-editor__image-modal__tabs">
        <button
          class="course-lesson-editor__image-modal__tab"
          :class="{ active: activeTab === 'upload' }"
          @click="$emit('changeTab', 'upload')"
        >
          Загрузить
        </button>
        <button
          class="course-lesson-editor__image-modal__tab"
          :class="{ active: activeTab === 'url' }"
          @click="$emit('changeTab', 'url')"
        >
          Загруженные
        </button>
      </div>

      <div class="course-lesson-editor__image-modal__body">
        <!-- Вкладка загрузки файла -->
        <div
          v-if="activeTab === 'upload'"
          class="course-lesson-editor__image-modal__upload"
        >
          <div
            class="course-lesson-editor__image-modal__dropzone"
            :class="{ active: isDragging }"
            @dragover.prevent="$emit('dragover')"
            @dragleave.prevent="$emit('dragleave')"
            @drop.prevent="$emit('drop', $event)"
          >
            <input
              type="file"
              ref="fileInput"
              @change="$emit('fileSelect', $event)"
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
                @click="$emit('triggerFileInput')"
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
                @click="$emit('removePreview')"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Вкладка ссылки на изображение -->
        <div
          v-if="activeTab === 'url'"
          class="course-lesson-editor__image-uploads"
        >
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
          @click="$emit('close')"
        >
          Отмена
        </button>
        <button
          class="course-lesson-editor__image-modal__button course-lesson-editor__image-modal__button--insert"
          @click="$emit('insert')"
          :disabled="!canInsertImage"
        >
          Вставить
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "CourseDesAddImg",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    activeTab: {
      type: String,
      default: "upload",
    },
    imagePreview: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    isDragging: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "close",
    "changeTab",
    "fileSelect",
    "triggerFileInput",
    "removePreview",
    "urlInput",
    "insert",
    "dragover",
    "dragleave",
    "drop",
  ],
  setup(props) {
    const canInsertImage = computed(() => {
      return (
        (props.activeTab === "upload" && props.imagePreview) ||
        (props.activeTab === "url" && props.imageUrl)
      );
    });

    return {
      canInsertImage,
    };
  },
});
</script>

<style scoped lang="scss">
.course-lesson-editor__image-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  }

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

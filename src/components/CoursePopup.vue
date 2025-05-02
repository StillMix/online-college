<template>
  <transition name="fade" appear @after-leave="finishLeaveAnimation">
    <div
      class="courseVib"
      v-if="isVisible && courseVib"
      @click.self="handleClickClose"
    >
      <transition name="slide-fade" appear>
        <div class="courseVib__content" v-if="contentVisible && courseVib">
          <div class="courseVib__content__info">
            <div class="courseVib__content__info__contype">
              <p class="courseVib__content__info__contype__title">
                <img
                  class="courseVib__content__info__contype__title__img"
                  :src="geticonTypeSrc()"
                  alt="Course type icon"
                />{{ courseVib?.type || "" }}
              </p>
              <p class="courseVib__content__info__contype__subtitle">
                <img
                  class="courseVib__content__info__contype__subtitle__img"
                  src="../assets/courseTime.svg"
                  alt="Course time icon"
                />{{ courseVib?.timetoendL || "" }}
              </p>
            </div>
            <transition name="fade-down" appear>
              <p
                class="courseVib__content__info__title"
                v-if="contentVisible && courseVib"
              >
                {{ courseVib?.title || "" }}
              </p>
            </transition>
            <transition name="fade-down" v-if="!courseAdded" appear>
              <p
                class="courseVib__content__info__subtitle"
                v-if="contentVisible && courseVib"
              >
                {{ courseVib?.titleForCourse || "" }}
              </p>
            </transition>
            <div
              v-if="courseAdded"
              class="courseVib__content__info__contentcours"
            >
              <p class="courseVib__content__info__contentcours__title">
                Темы курса
              </p>
              <provide
                class="courseVib__content__info__cours"
                key="expandedElementId"
                :value="expandedElementId"
              >
                <CourseElement
                  v-for="(item, index) in courseVib.sections"
                  :key="item.id"
                  :index="index"
                  :CourseVib="item"
                >
                </CourseElement>
              </provide>
            </div>
            <transition-group
              name="fade-list"
              tag="div"
              class="courseVib__content__info__textcon"
              v-if="
                courseVib?.info?.length > 0 && contentVisible && !courseAdded
              "
            >
              <p class="courseVib__content__info__textcon__title" key="title">
                ЧТО ВЫ УЗНАЕТЕ?
              </p>
              <div
                class="courseVib__content__info__textcon__cards"
                v-for="(item, index) in courseVib?.info || []"
                :key="item.id"
                :style="{ animationDelay: `${0.3 + index * 0.1}s` }"
              >
                <p class="courseVib__content__info__textcon__cards__title">
                  {{ item.title }}
                </p>
                <p class="courseVib__content__info__textcon__cards__subtitle">
                  {{ item.subtitle }}
                </p>
              </div>
            </transition-group>
            <div class="courseVib__content__info__conbtn">
              <transition v-if="!token" name="fade-up" appear>
                <router-link
                  v-if="contentVisible"
                  class="courseVib__content__info__conbtn__open courseVib__content__info__conbtn__open--red pulse-btn"
                  to="/signin"
                  >СНАЧАЛА ВЫПОЛНИТЕ ВХОД?</router-link
                >
              </transition>
              <transition v-if="token && !courseAdded" name="fade-up" appear>
                <button
                  v-if="contentVisible"
                  class="courseVib__content__info__conbtn__open courseVib__content__info__conbtn__open--green pulse-btn"
                  @click="addCourseToStorage"
                >
                  НАЧАТЬ ИЗУЧЕНИЕ КУРСА
                </button>
              </transition>
              <transition name="fade-up" appear>
                <button
                  v-if="contentVisible"
                  @click="handleClickClose"
                  class="courseVib__content__info__conbtn__close"
                  :class="{ 'full-width': courseAdded }"
                  type="button"
                >
                  НАЗАД
                </button>
              </transition>
            </div>
          </div>
          <transition name="fade-right" appear>
            <div
              v-if="contentVisible && courseVib"
              class="courseVib__content__type"
              :style="{ backgroundColor: courseVib?.color || '#333' }"
            >
              <img
                class="courseVib__content__type__img"
                :src="`https://back.kktsback.tw1.ru/${courseVib.icon}`"
                alt="Course type icon"
              />
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";

import CourseElement from "@/components/CourseElement.vue";
import { CourseItem } from "@/types";

export default defineComponent({
  name: "CourseVibPopup",
  components: {
    CourseElement,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    courseVib: {
      type: Object as PropType<CourseItem | null>,
      default: null,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const isVisible = ref(false);
    const contentVisible = ref(false);
    const isClosing = ref(false);
    const token = ref<string | null>(localStorage.getItem("token"));
    const courseAdded = ref(false);
    const expandedElementId = ref("");
    // Проверка, добавлен ли уже курс
    const checkIfCourseAdded = () => {
      if (!props.courseVib) return false;

      const userCoursesStr = localStorage.getItem("userCourses");
      if (!userCoursesStr) return false;

      try {
        const userCourses: string[] = JSON.parse(userCoursesStr);
        return userCourses.includes(props.courseVib.id);
      } catch (e) {
        console.error("Ошибка при парсинге данных курсов:", e);
        return false;
      }
    };

    // Добавление курса в localStorage
    const addCourseToStorage = () => {
      if (!props.courseVib || !token.value) return;

      let userCourses: string[] = []; // Массив строк (id)
      const userCoursesStr = localStorage.getItem("userCourses");

      if (userCoursesStr) {
        try {
          userCourses = JSON.parse(userCoursesStr);
        } catch (e) {
          console.error("Ошибка при парсинге данных курсов:", e);
          userCourses = [];
        }
      }

      // Проверяем, нет ли уже такого id
      if (!userCourses.includes(props.courseVib.id)) {
        userCourses.push(props.courseVib.id);
        localStorage.setItem("userCourses", JSON.stringify(userCourses));
      }

      // Устанавливаем флаг, что курс добавлен
      courseAdded.value = true;
    };
    // Отслеживание изменений открытия/закрытия
    watch(
      () => props.open,
      (newVal) => {
        if (newVal) {
          // При открытии
          isVisible.value = true;
          contentVisible.value = true;
          isClosing.value = false;
          document.body.style.overflow = "hidden";

          // Проверяем, добавлен ли курс
          courseAdded.value = checkIfCourseAdded();
        } else if (!isClosing.value) {
          // При закрытии - сначала скрываем контент (с анимацией)
          contentVisible.value = false;
          isClosing.value = true;
        }
      },
      { immediate: true }
    );

    // Методы для управления попапом
    const handleClickClose = () => {
      if (isClosing.value) return;
      contentVisible.value = false;
      isClosing.value = true;
      emit("close");
    };

    const finishLeaveAnimation = () => {
      isVisible.value = false;
      document.body.style.overflow = ""; // Восстанавливаем прокрутку
      isClosing.value = false;
      emit("close"); // Уведомляем родителя о закрытии
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClickClose();
      }
    };

    const getIconSrc = () => {
      if (!props.courseVib) return "";
      try {
        return require(`@/assets/${props.courseVib.icon}.svg`);
      } catch (error) {
        console.error(`Иконка ${props.courseVib.icon} не найдена:`, error);
        return "";
      }
    };

    const geticonTypeSrc = () => {
      if (!props.courseVib) return "";
      try {
        return require(`@/assets/${props.courseVib.icontype}.svg`);
      } catch (error) {
        console.error(`Иконка ${props.courseVib.icontype} не найдена:`, error);
        return "";
      }
    };

    onMounted(() => {
      // Добавляем обработчик клавиши Escape для закрытия попапа
      window.addEventListener("keydown", handleKeyDown);
    });

    onBeforeUnmount(() => {
      // Удаляем обработчик при уничтожении компонента
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    });

    return {
      token,
      isVisible,
      contentVisible,
      isClosing,
      courseAdded,
      handleClickClose,
      finishLeaveAnimation,
      getIconSrc,
      expandedElementId,
      geticonTypeSrc,
      addCourseToStorage,
    };
  },
});
</script>

<style scoped lang="scss">
.courseVib {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  &__content {
    border-radius: 0.521vw;
    width: 67.396vw;
    height: 43.854vw;
    background: #2a2a2a;
    display: flex;
    overflow: hidden;
    box-shadow: 0 0.521vw 2.083vw rgba(0, 0, 0, 0.3);
    &__info {
      width: 100%;
      padding: 1.563vw;
      position: relative;
      display: flex;
      flex-direction: column;
      &__contentcours {
        width: 100%;
        margin-top: 1.042vw;
        &__title {
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 1.042vw;
          line-height: 125%;
          color: #fff;
          opacity: 0.8;
        }
      }
      &__cours {
        display: block;
        margin-top: 1.042vw;
        height: 27.969vw;
        overflow-y: auto;
        overflow-x: hidden;

        /* Явное определение стилей скроллбара для этого элемента */
        &::-webkit-scrollbar {
          width: 0.417vw !important;
          height: 0.417vw !important;
        }

        &::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05) !important;
          border-radius: 0.521vw !important;
        }

        &::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2) !important;
          border-radius: 0.521vw !important;
          transition: background 0.2s !important;
        }

        &::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.4) !important;
        }
      }
      &__conbtn {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: auto;
        &__open {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 7.292vw;
          width: 25.781vw;
          height: 2.604vw;
          font-family: var(--font-family);
          font-weight: 500;
          font-size: 0.938vw;
          text-align: center;
          color: #fff;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          &--red {
            background: #ff5b5b;

            &:hover {
              background: #ff7272;
              transform: translateY(-0.104vw);
            }
          }
          &--green {
            background: #39b874;

            &:hover {
              background: #45cc83;
              transform: translateY(-0.104vw);
            }
          }
          &:active {
            transform: translateY(0.104vw);
          }
        }
        &__close {
          border-radius: 7.292vw;
          width: 14.271vw;
          height: 2.604vw;
          background: #363636;
          font-family: var(--font-family);
          font-weight: 500;
          font-size: 0.938vw;
          text-align: center;
          color: #fff;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          &:hover {
            background: #424242;
            transform: translateY(-0.104vw);
          }
          &:active {
            transform: translateY(0.104vw);
          }
        }
      }
      &__textcon {
        width: 31.25vw;
        display: flex;
        flex-direction: column;
        gap: 1.042vw;
        margin-top: 1.042vw;
        &__title {
          font-weight: 600;
          font-weight: 400;
          font-size: 1.042vw;
          line-height: 125%;
          color: #fff;
        }
        &__cards {
          width: 100%;
          opacity: 0;
          &__title {
            font-size: 1.042vw;
            font-weight: 600;
            text-transform: uppercase;
            line-height: 125%;
            color: #fff;
          }
          &__subtitle {
            font-size: 1.042vw;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
      &__title {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 1.563vw;
        color: #fff;
        margin-top: 1.042vw;
        width: 24.115vw;
      }
      &__subtitle {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 1.042vw;
        line-height: 125%;
        color: #fff;
        opacity: 0.8;
        margin-top: 1.042vw;
      }
      &__contype {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.25vw;
        &__title {
          display: flex;
          align-items: center;
          gap: 0.521vw;
          &__img {
            width: 1.25vw;
            height: 1.25vw;
          }
        }
        &__subtitle {
          display: flex;
          align-items: center;
          gap: 0.521vw;
          color: #fff;
          opacity: 0.5;
          &__img {
            width: 1.25vw;
            height: 1.25vw;
          }
        }
      }
    }
    &__type {
      flex-shrink: 0;
      width: 22.656vw;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      &__img {
        width: 36.433vw;
        height: 36.433vw;
        transform: rotate(8deg);
        opacity: 0.3;
        transition: transform 1.5s cubic-bezier(0.19, 1, 0.22, 1);

        &:hover {
          transform: rotate(15deg) scale(1.05);
        }
      }
    }
  }
}

.full-width {
  width: 100%;
}
// Анимации
// Общая анимация появления/исчезновения
.fade-enter-active {
  transition: opacity 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.fade-leave-active {
  transition: opacity 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  transition-delay: 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Анимация для центрального элемента
.slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  pointer-events: none; // Предотвращает вмешательство в события при анимации выхода
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(1.042vw) scale(0.95);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(1.042vw) scale(0.95);
}

// Анимация появления сверху вниз
.fade-down-enter-active {
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  transition-delay: 0.2s;
}
.fade-down-leave-active {
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.fade-down-enter-from {
  opacity: 0;
  transform: translateY(-1.042vw);
}
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-1.042vw);
}

// Анимация появления снизу вверх
.fade-up-enter-active {
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  transition-delay: 0.3s;
}
.fade-up-leave-active {
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(1.042vw);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(1.042vw);
}

// Анимация появления справа
.fade-right-enter-active {
  transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1);
}
.fade-right-leave-active {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}
.fade-right-enter-from {
  opacity: 0;
  transform: translateX(2.083vw);
}
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(2.083vw);
}

// Анимация для списка элементов
.fade-list-enter-active {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}
.fade-list-leave-active {
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  position: absolute;
}
.fade-list-enter-from {
  opacity: 0;
  transform: translateY(1.042vw);
}
.fade-list-leave-to {
  opacity: 0;
  transform: translateY(1.042vw);
}

// Анимация карточек
.courseVib__content__info__textcon__cards {
  animation: fadeIn 0.8s forwards;
  animation-delay: 0.3s;
}

.fade-list-leave-to .courseVib__content__info__textcon__cards {
  animation: fadeOut 0.4s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(0.521vw);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-0.521vw);
  }
}

// Пульсация кнопки
.pulse-btn {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 91, 91, 0.5);
  }
  70% {
    box-shadow: 0 0 0 0.521vw rgba(255, 91, 91, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 91, 91, 0);
  }
}
</style>

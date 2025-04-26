<template>
  <div class="signUpFull">
    <img class="signUpFull__img" src="../assets/kktsID.svg" />
    <div class="signUpFull__popup">
      <div v-if="isSubmitting" class="signUpFull__popup__loader">
        <AppLoader :is-visible="true" loading-text="Создание аккаунта..." />
      </div>
      <form
        v-else
        class="signUpFull__popup__form"
        @submit.prevent="handleSubmit"
      >
        <div class="signUpFull__popup__form__left">
          <p class="signUpFull__popup__form__left__title">ЕЩЁ ЧУТЬ ЧУТЬ</p>
          <p class="signUpFull__popup__form__left__subtitle">
            Выполните последние шаги перед созданием аккаунта!
          </p>
          <AppInput
            v-model="login"
            type="login"
            placeholder="Имя"
            required
          ></AppInput>
          <AppInput
            v-model="email"
            type="emailtext"
            placeholder="Введите код из письма"
            required
          >
          </AppInput>
          <AppButton
            :styleOverrides="{
              marginTop: '3.177vw',
            }"
            pulse
            type="submit"
            :disabled="isSubmitting"
            full-width
          >
            Зарегистрироваться
          </AppButton>
        </div>
        <label class="signUpFull__popup__form__label image-upload-animation">
          <transition name="fade-scale">
            <img
              v-if="previewImage"
              :src="previewImage"
              class="signUpFull__popup__form__label__preview"
            />
            <div v-else class="upload-placeholder">
              <inputImg
                color="#484848"
                width="2.083vw"
                height="2.083vw"
                class="floating-icon"
              />
              <p class="signUpFull__popup__form__label__title">
                Загрузите изображение (необязательно)
              </p>
            </div>
          </transition>
          <input
            type="file"
            class="signUpFull__popup__form__label__input"
            accept="image/*"
            @change="handleImageSelect"
          />
        </label>
      </form>
    </div>
    <div class="signUpFull__emailsucc slide-in-animation">
      <div class="signUpFull__emailsucc__textcon">
        <p class="signUpFull__emailsucc__textcon__title">
          <emailIcon
            class="signUpFull__emailsucc__textcon__title__img rotate-icon"
            color="white"
            width="1.25vw"
            height="1.25vw"
          />
          На вашу почту отправлено письмо с подтверждением
        </p>
        <p class="signUpFull__emailsucc__textcon__subtitle">
          Проверьте свою почту на наличие заявки на подтверждение аккаунта.
          Убедитесь что заявка не находится в папке «Спам». После подтверждения,
          нажмите кнопку обновить, что находится справа
        </p>
      </div>
      <button
        class="signUpFull__emailsucc__btn"
        @click="handleRefresh"
        :class="{ refreshing: isRefreshing, 'shine-button': !isRefreshing }"
        :disabled="isRefreshing"
      >
        {{ isRefreshing ? "Обновление..." : "Обновить" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { AppButton, AppInput } from "@/components/UI";
import AppLoader from "@/components/Loader.vue";
export default defineComponent({
  name: "signUpFullView",
  components: {
    AppLoader,
    AppButton,
    AppInput,
  },
  setup() {
    const isLoading = ref(true);
    const isSubmitting = ref(false);
    const login = ref("");
    const email = ref("");
    const password = ref("");
    const previewImage = ref<string | null>(null);
    const isRefreshing = ref(false);
    const router = useRouter();

    // Имитация начальной загрузки приложения
    setTimeout(() => {
      isLoading.value = false;
    }, 10);

    // Обработчик выбора изображения
    const handleImageSelect = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            previewImage.value = e.target.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    };

    // Обработчик нажатия на кнопку обновить
    const handleRefresh = () => {
      isRefreshing.value = true;

      // Имитация запроса обновления - через 3 секунды возвращаем состояние кнопки
      setTimeout(() => {
        isRefreshing.value = false;
      }, 3000);
    };

    // Обработчик формы входа
    const handleSubmit = () => {
      isSubmitting.value = true;

      // Имитация процесса входа с задержкой в 4 секунды
      setTimeout(() => {
        // Сохраняем токен в localStorage
        localStorage.setItem("token", "вошли");

        // Перенаправляем на главную страницу
        router.push("/");
      }, 4000);
    };

    // Применяем поочередную анимацию к полям ввода
    onMounted(() => {
      const animateFields = document.querySelectorAll(".animate-field");
      animateFields.forEach((field, index) => {
        setTimeout(() => {
          field.classList.add("animate-in");
        }, 300 + index * 200);
      });
    });

    return {
      isLoading,
      isSubmitting,
      email,
      login,
      password,
      handleSubmit,
      previewImage,
      handleImageSelect,
      isRefreshing,
      handleRefresh,
    };
  },
});
</script>

<style scoped lang="scss">
.signUpFull {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__emailsucc {
    display: flex;
    padding: 1.042vw;
    align-items: center;
    justify-content: space-between;
    border-radius: 0.521vw;
    width: 44.479vw;
    height: 6.198vw;
    background: #2a2a2a;
    overflow: hidden;
    margin-top: 1.042vw;
    position: relative;

    /* Новая анимация для блока emailsucc */
    &.slide-in-animation {
      opacity: 0;
      transform: translateY(1.5vw);
      animation: slideInUp 0.8s ease-out forwards;
      animation-delay: 0.6s;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(1.5vw);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Добавляем эффект подсветки границ */
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-shadow: 0 0 0 0.052vw rgba(57, 184, 116, 0);
      border-radius: 0.521vw;
      transition: box-shadow 0.5s ease;
      z-index: 0;
      animation: glowBorder 2s infinite alternate;
    }

    @keyframes glowBorder {
      0% {
        box-shadow: 0 0 0 0.052vw rgba(57, 184, 116, 0);
      }
      100% {
        box-shadow: 0 0 0 0.052vw rgba(57, 184, 116, 0.5);
      }
    }

    &__textcon {
      width: 32.552vw;
      position: relative;
      z-index: 1;

      &__title {
        display: flex;
        align-items: center;
        gap: 0.521vw;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.938vw;
        color: var(--colors-default-static-static-100);

        /* Анимация для иконки в заголовке */
        &__img.rotate-icon {
          animation: rotateAnimation 5s infinite alternate;
          transform-origin: center;
        }

        @keyframes rotateAnimation {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
      }

      &__subtitle {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.729vw;
        line-height: 143%;
        color: var(--colors-default-static-static-100);
        opacity: 0.5;
        position: relative;
        overflow: hidden;

        /* Анимация подсветки текста */
        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      }
    }

    &__btn {
      border-radius: 7.292vw;
      width: 9.271vw;
      height: 2.604vw;
      background: var(--colors-default-static-static-100);
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      text-align: center;
      color: var(--colors-default-static-static-200);
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      z-index: 1;

      /* Новая анимация для кнопки обновления */
      &.shine-button {
        overflow: hidden;

        &::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(30deg);
          animation: shineEffect 6s infinite;
          z-index: -1;
        }

        @keyframes shineEffect {
          0% {
            transform: rotate(30deg) translateX(-100%);
          }
          20%,
          100% {
            transform: rotate(30deg) translateX(100%);
          }
        }
      }

      &:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 0.26vw 0.521vw rgba(255, 255, 255, 0.2);
      }

      &:active:not(:disabled) {
        transform: scale(0.98);
      }

      &.refreshing {
        background: #39b874;
        color: #fff;
        cursor: wait;
        animation: pulse 1.5s infinite;
      }

      @keyframes pulse {
        0% {
          opacity: 0.8;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.8;
        }
      }
    }
  }

  &__popup {
    position: relative;
    border-radius: 0.521vw;
    width: 44.479vw;
    height: 20.104vw;
    overflow: hidden;
    background: #2a2a2a;
    padding: 2.083vw;
    box-shadow: 0 0.521vw 1.302vw rgba(0, 0, 0, 0.5);
    animation: fadeIn 0.8s ease-out;

    /* Добавляем эффект тени */
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 0.521vw;
      box-shadow: inset 0 0 1.042vw rgba(0, 0, 0, 0.3);
      pointer-events: none;
    }

    &__form {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 1;

      &__left {
        width: 21.302vw;

        &__title {
          font-family: var(--font-family);
          font-weight: 500;
          font-size: 1.25vw;
          color: var(--colors-default-static-static-100);
          position: relative;
          display: inline-block;

          @keyframes growLine {
            from {
              width: 0;
            }
            to {
              width: 100%;
            }
          }
        }

        &__subtitle {
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.729vw;
          color: var(--colors-default-static-static-100);
          opacity: 0.5;
          margin: 0;
          transition: opacity 0.5s ease;

          &:hover {
            opacity: 0.8;
          }
        }

        &__label {
          margin-top: 1.042vw;
          width: 100%;
          height: 2.604vw;
          position: relative;
          display: flex;
          align-items: center;
          opacity: 0;
          transform: translateY(0.5vw);
          transition: all 0.5s ease-out;

          /* Анимация для полей ввода */
          &.animate-in {
            opacity: 1;
            transform: translateY(0);
          }

          &__img {
            position: absolute;
            left: 1.354vw;
            transition: transform 0.3s ease;
          }

          &__input {
            border-radius: 7.292vw;
            width: 21.302vw;
            height: 2.604vw;
            background: #363636;
            font-family: var(--font-family);
            font-weight: 400;
            font-size: 0.938vw;
            color: var(--colors-default-static-static-100);
            padding-left: 2.813vw;
            transition: all 0.3s ease;
            border: 0.052vw solid transparent;

            &:focus {
              border-color: #39b874;
              box-shadow: 0 0 0.521vw rgba(57, 184, 116, 0.3);
              background: #3a3a3a;
            }

            &:focus + .signUpFull__popup__form__left__label__img {
              transform: scale(1.1) rotate(-10deg);
            }

            &::placeholder {
              font-family: var(--font-family);
              font-weight: 400;
              font-size: 0.938vw;
              color: var(--colors-default-static-static-100);
              opacity: 0.3;
              transition: opacity 0.3s ease;
            }

            &:focus::placeholder {
              opacity: 0.1;
            }
          }
        }

        &__btn {
          border-radius: 7.292vw;
          width: 100%;
          height: 2.604vw;
          background: #39b874;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.938vw;
          text-align: center;
          color: var(--colors-default-static-static-100);
          margin-top: 3.177vw;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;

          /* Новая анимация пульсации для кнопки */
          &.pulse-animation {
            animation: buttonPulse 2s infinite;
          }

          @keyframes buttonPulse {
            0% {
              box-shadow: 0 0 0 0 rgba(57, 184, 116, 0.7);
            }
            70% {
              box-shadow: 0 0 0 0.521vw rgba(57, 184, 116, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(57, 184, 116, 0);
            }
          }

          /* Эффект волны при нажатии */
          &::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0.521vw;
            height: 0.521vw;
            background: rgba(255, 255, 255, 0.7);
            opacity: 0;
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(1);
            transition: all 0.5s ease;
          }

          &:active::after {
            opacity: 1;
            transform: translate(-50%, -50%) scale(20);
            transition: all 0s;
          }

          &:hover {
            background: #45cc83;
            transform: translateY(-0.104vw);
          }

          &:active {
            transform: translateY(0.052vw);
          }
        }
      }

      &__label {
        background: #363636;
        border-radius: 0.521vw;
        width: 16.25vw;
        height: 16.25vw;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;

        /* Новая анимация для блока загрузки изображения */
        &.image-upload-animation {
          animation: float 3s ease-in-out infinite;
          box-shadow: 0 0.521vw 1.042vw rgba(0, 0, 0, 0.2);
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-0.417vw);
          }
          100% {
            transform: translateY(0px);
          }
        }

        &:hover {
          background: #424242;
          transform: scale(1.02);
          box-shadow: 0 0.521vw 1.563vw rgba(0, 0, 0, 0.3);
        }

        &__title {
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.938vw;
          text-align: center;
          color: var(--colors-default-static-static-100);
          opacity: 0.3;
          width: 10.313vw;
          margin-top: 0.781vw;
          transition: opacity 0.3s ease;
        }

        &:hover &__title {
          opacity: 0.6;
        }

        &__input {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          visibility: hidden;
          cursor: pointer;
        }

        &__preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          animation: zoomIn 0.5s ease-out;
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      }
    }
  }

  &__img {
    margin-bottom: 2.083vw;
    width: 8.854vw;
    height: 1.979vw;
    animation: logoIn 1s ease-out;

    @keyframes logoIn {
      from {
        opacity: 0;
        transform: translateY(-1.042vw);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
}

/* Дополнительные анимации */
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.floating-icon {
  animation: floatingIcon 3s ease-in-out infinite;
}

@keyframes floatingIcon {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-0.26vw) rotate(-5deg);
  }
  75% {
    transform: translateY(0.26vw) rotate(5deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

/* Анимации для переходов */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>

<template>
  <div class="signUpFull">
    <AppLoader :is-visible="isLoading" loading-text="Загрузка приложения..." />
    <img class="signUpFull__img" src="../assets/kktsID.svg" />
    <div class="signUpFull__popup">
      <form class="signUpFull__popup__form" @submit.prevent="handleSubmit">
        <div class="signUpFull__popup__form__left">
          <p class="signUpFull__popup__form__left__title">ЕЩЁ ЧУТЬ ЧУТЬ</p>
          <p class="signUpFull__popup__form__left__subtitle">
            Выполните последние шаги перед созданием аккаунта!
          </p>
          <label class="signUpFull__popup__form__left__label">
            <loginIcon
              class="signUpFull__popup__form__left__label__img"
              color="#484848"
              width="1.25vw"
              height="1.25vw"
            />
            <input
              class="signUpFull__popup__form__left__label__input"
              type="login"
              placeholder="Имя"
            />
          </label>
          <label class="signUpFull__popup__form__left__label">
            <emailIcon
              class="signUpFull__popup__form__left__label__img"
              color="#484848"
              width="1.25vw"
              height="1.25vw"
            />
            <input
              class="signUpFull__popup__form__left__label__input"
              type="login"
              placeholder="Введите код из письма"
            />
          </label>
          <button class="signUpFull__popup__form__left__btn" type="submit">
            Сохранить и продолжить
          </button>
        </div>
        <label class="signUpFull__popup__form__label">
          <template v-if="previewImage">
            <img
              :src="previewImage"
              class="signUpFull__popup__form__label__preview"
            />
          </template>
          <template v-else>
            <inputImg color="#484848" width="2.083vw" height="2.083vw" />
            <p class="signUpFull__popup__form__label__title">
              Загрузите изображение (необязательно)
            </p>
          </template>
          <input
            type="file"
            class="signUpFull__popup__form__label__input"
            accept="image/*"
            @change="handleImageSelect"
          />
        </label>
      </form>
    </div>
    <div class="signUpFull__emailsucc">
      <div class="signUpFull__emailsucc__textcon">
        <p class="signUpFull__emailsucc__textcon__title">
          <emailIcon
            class="signUpFull__emailsucc__textcon__title__img"
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
        :class="{ refreshing: isRefreshing }"
        :disabled="isRefreshing"
      >
        {{ isRefreshing ? "Обновление..." : "Обновить" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import AppLoader from "@/components/Loader.vue";
import inputImg from "../assets/icons/inputImg.vue";
import loginIcon from "../assets/icons/loginIcon.vue";
import emailIcon from "../assets/icons/emailIcon.vue";
export default defineComponent({
  name: "signUpFullView",
  components: {
    AppLoader,
    inputImg,
    loginIcon,
    emailIcon,
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

    return {
      isLoading,
      isSubmitting,
      email,
      login,
      password,
      emailIcon,
      inputImg,
      handleSubmit,
      loginIcon,
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
    &__textcon {
      width: 32.552vw;
      &__title {
        display: flex;
        align-items: center;
        gap: 0.521vw;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.938vw;
        color: var(--colors-default-static-static-100);
      }
      &__subtitle {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.729vw;
        line-height: 143%;
        color: var(--colors-default-static-static-100);
        opacity: 0.5;
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
    &__form {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &__left {
        width: 21.302vw;
        &__title {
          font-family: var(--font-family);
          font-weight: 500;
          font-size: 1.25vw;
          color: var(--colors-default-static-static-100);
        }
        &__subtitle {
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.729vw;
          color: var(--colors-default-static-static-100);
          opacity: 0.5;
          margin: 0;
        }
        &__label {
          margin-top: 1.042vw;
          width: 100%;
          height: 2.604vw;
          position: relative;
          display: flex;
          align-items: center;
          &__img {
            position: absolute;
            left: 1.354vw;
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
            &::placeholder {
              font-family: var(--font-family);
              font-weight: 400;
              font-size: 0.938vw;
              color: var(--colors-default-static-static-100);
              opacity: 0.3;
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

        &:hover {
          background: #424242;
        }

        &__title {
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.938vw;
          text-align: center;
          color: var(--colors-default-static-static-100);
          opacity: 0.3;
          width: 10.313vw;
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
</style>

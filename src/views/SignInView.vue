<template>
  <div class="signIn">
    <AppLoader :is-visible="isLoading" loading-text="Загрузка приложения..." />
    <img class="signIn__img" src="../assets/kktsID.svg" />
    <div class="signIn__popup">
      <div v-if="isSubmitting" class="signIn__popup__loader">
        <AppLoader :is-visible="true" loading-text="Вход в систему..." />
      </div>
      <div v-else>
        <p class="signIn__popup__title">ДОБРО ПОЖАЛОВАТЬ</p>
        <p class="signIn__popup__subtitle">
          Выполните вход или зарегистрируйте новый аккаунт
        </p>
        <form class="signIn__popup__form" @submit.prevent="handleSubmit">
          <label class="signIn__popup__form__label">
            <img
              class="signIn__popup__form__label__img"
              src="../assets/email.svg"
              alt="icon"
            />
            <input
              placeholder="Почта/логин"
              class="signIn__popup__form__label__input"
              v-model="email"
            />
          </label>
          <label class="signIn__popup__form__label">
            <img
              class="signIn__popup__form__label__img"
              src="../assets/pass.svg"
              alt="icon"
            />
            <input
              placeholder="Пароль"
              class="signIn__popup__form__label__input"
              type="password"
              v-model="password"
            />
          </label>
          <button type="submit" class="signIn__popup__form__btn">Войти</button>
        </form>
        <div class="signIn__popup__vopr">
          <span class="signIn__popup__vopr__text">нет аккаунта?</span>
        </div>
        <router-link class="signIn__popup__link" to="/signup">
          Зарегистрироваться
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import AppLoader from "@/components/Loader.vue";

export default defineComponent({
  name: "SignInView",
  components: {
    AppLoader,
  },
  setup() {
    const isLoading = ref(true);
    const isSubmitting = ref(false);
    const email = ref("");
    const password = ref("");
    const router = useRouter();

    // Имитация начальной загрузки приложения
    setTimeout(() => {
      isLoading.value = false;
    }, 10);

    // Обработчик формы входа
    const handleSubmit = () => {
      isSubmitting.value = true;

      // Имитация процесса входа с задержкой в 1000 секунд
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
      password,
      handleSubmit,
    };
  },
});
</script>

<style scoped lang="scss">
.signIn {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__popup {
    position: relative;
    border-radius: 0.521vw;
    width: 25vw;
    height: 26.875vw;
    background: #2a2a2a;
    padding: 2.083vw;
    box-shadow: 0 0.521vw 1.302vw rgba(0, 0, 0, 0.5);
    animation: fadeIn 0.8s ease-out;

    &__loader {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(1.563vw);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    &__vopr {
      margin-top: 1.042vw;
      position: relative;
      text-align: center;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.521vw;
      color: #fff;
      opacity: 0.3;
      animation: fadeInLine 1.2s ease-out;

      @keyframes fadeInLine {
        0% {
          opacity: 0;
        }
        70% {
          opacity: 0;
        }
        100% {
          opacity: 0.3;
        }
      }

      &:before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        height: 0.052vw;
        background-color: #8b8b8b;
        z-index: 0;
      }

      &__text {
        position: relative;
        display: inline-block;
        padding: 0 0.781vw;
        background-color: #2a2a2a;
        z-index: 1;
      }
    }

    &__link {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 7.292vw;
      margin-top: 1.042vw;
      width: 21.302vw;
      height: 2.604vw;
      background: #363636;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      text-align: center;
      color: #fff;
      transition: all 0.3s ease;

      &:hover {
        background: #454545;
        transform: translateY(-0.104vw);
      }

      &:active {
        transform: translateY(0.052vw);
      }
    }

    &__form {
      width: 100%;
      display: flex;
      flex-direction: column;

      &__label {
        margin-top: 1.042vw;
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;

        &__img {
          width: 1.25vw;
          height: 1.25vw;
          position: absolute;
          left: 1.042vw;
          transition: transform 0.3s ease;
        }

        &__input {
          border-radius: 7.292vw;
          width: 100%;
          height: 2.604vw;
          background: #363636;
          padding-left: 2.813vw;
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.938vw;
          color: #fff;
          transition: all 0.3s ease;
          border: 0.052vw solid transparent;

          &:focus {
            outline: none;
            border-color: #39b874;
            box-shadow: 0 0 0.417vw rgba(57, 184, 116, 0.5);
          }

          &:focus + .signIn__popup__form__label__img {
            transform: scale(1.1);
          }
        }

        &__input::placeholder {
          font-family: var(--font-family);
          font-weight: 400;
          font-size: 0.938vw;
          color: #fff;
          opacity: 0.3;
        }
      }

      &__btn {
        border-radius: 7.292vw;
        width: 100%;
        height: 2.604vw;
        background: #39b874;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.938vw;
        text-align: center;
        color: #fff;
        margin-top: 4.531vw;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        border: none;

        &:hover {
          background: #45cc83;
          transform: translateY(-0.104vw);
          box-shadow: 0 0.26vw 0.781vw rgba(57, 184, 116, 0.4);
        }

        &:active {
          transform: translateY(0.052vw);
        }

        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0.26vw;
          height: 0.26vw;
          background: rgba(255, 255, 255, 0.5);
          opacity: 0;
          border-radius: 100%;
          transform: scale(1, 1) translate(-50%);
          transform-origin: 50% 50%;
        }

        &:focus:not(:active)::after {
          animation: ripple 1s ease-out;
        }

        @keyframes ripple {
          0% {
            transform: scale(0, 0);
            opacity: 0.5;
          }
          20% {
            transform: scale(25, 25);
            opacity: 0.3;
          }
          100% {
            opacity: 0;
            transform: scale(40, 40);
          }
        }
      }
    }

    &__title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 1.25vw;
      color: #fff;
      animation: slideDown 0.5s ease-out;

      @keyframes slideDown {
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

    &__subtitle {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.729vw;
      color: #fff;
      opacity: 0.5;
      animation: slideDown 0.5s ease-out 0.2s forwards;
      opacity: 0;
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

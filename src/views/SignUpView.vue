<template>
  <div class="signUp">
    <AppLoader :is-visible="isLoading" loading-text="Загрузка приложения..." />
    <img class="signUp__img" src="../assets/kktsID.svg" />
    <div class="signUp__popup">
      <div v-if="isSubmitting" class="signUp__popup__loader">
        <AppLoader :is-visible="true" loading-text="Вход в систему..." />
      </div>
      <div v-else>
        <p class="signUp__popup__title">ДОБРО ПОЖАЛОВАТЬ</p>
        <p class="signUp__popup__subtitle">
          Выполните вход или зарегистрируйте новый аккаунт
        </p>
        <form class="signUp__popup__form" @submit.prevent="handleSubmit">
          <AppInput
            v-model="login"
            type="login"
            placeholder="Логин"
            required
          ></AppInput>
          <AppInput v-model="email" type="email" placeholder="Почта" required>
          </AppInput>
          <AppInput
            v-model="password"
            type="password"
            placeholder="Пароль"
            required
          ></AppInput>
          <AppInput
            v-model="password"
            type="password"
            placeholder="Повторите пароль"
            required
          ></AppInput>
          <router-link class="signUp__popup__link" to="/signin">
            Есть аккаунт. Войти
          </router-link>
          <AppButton
            :styleOverrides="{
              marginTop: '1.042vw',
            }"
            pulse
            type="submit"
            :disabled="isSubmitting"
            full-width
          >
            Зарегистрироваться
          </AppButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AppButton, AppInput } from "@/components/UI";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import AppLoader from "@/components/Loader.vue";
export default defineComponent({
  name: "signUpView",
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
        // Перенаправляем на главную страницу
        router.push("/signupfull");
      }, 4000);
    };

    return {
      isLoading,
      isSubmitting,
      email,
      login,
      password,
      handleSubmit,
    };
  },
});
</script>

<style scoped lang="scss">
.signUp {
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
    height: 30.208vw;
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
      margin-top: 3.438vw;
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

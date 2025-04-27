<template>
  <div class="signUp">
    <AppLoader :is-visible="isLoading" loading-text="Загрузка приложения..." />
    <img class="signUp__img" src="../assets/kktsID.svg" />
    <div class="signUp__popup">
      <div v-if="isSubmitting" class="signUp__popup__loader">
        <AppLoader :is-visible="true" loading-text="Обработка..." />
      </div>
      <div v-else>
        <p class="signUp__popup__title">ДОБРО ПОЖАЛОВАТЬ</p>
        <p class="signUp__popup__subtitle">
          Для начала регистрации укажите вашу электронную почту
        </p>

        <form class="signUp__popup__form" @submit.prevent="handleStepSubmit">
          <!-- Шаг 1: Ввод электронной почты -->
          <div v-if="currentStep === 1">
            <AppInput
              v-model="email"
              type="email"
              placeholder="Электронная почта"
              required
              :disabled="isEmailSent"
            ></AppInput>
            <div class="signUp__popup__verification" v-if="isEmailSent">
              <p class="signUp__popup__verification__text">
                На вашу почту отправлен код подтверждения
              </p>
              <AppInput
                v-model="verificationCode"
                type="text"
                placeholder="Введите код подтверждения"
                required
              ></AppInput>
            </div>
          </div>

          <!-- Шаг 2: Заполнение данных пользователя -->
          <div v-if="currentStep === 2">
            <div class="signUp__popup__email-display">
              <p class="signUp__popup__email-display__label">Ваша почта:</p>
              <p class="signUp__popup__email-display__value">{{ email }}</p>
            </div>
            <AppInput
              v-model="login"
              type="login"
              placeholder="Логин"
              required
            ></AppInput>
            <AppInput
              v-model="password"
              type="password"
              placeholder="Пароль"
              required
            ></AppInput>
            <AppInput
              v-model="passwordConfirm"
              type="password"
              placeholder="Повторите пароль"
              required
            ></AppInput>
          </div>

          <!-- Кнопки для всех шагов -->
          <div class="signUp__popup__buttons">
            <AppButton
              v-if="!isEmailSent && currentStep === 1"
              :styleOverrides="{
                marginTop: '1.042vw',
              }"
              pulse
              type="submit"
              :disabled="!isEmailValid || isSubmitting"
              full-width
            >
              Отправить код подтверждения
            </AppButton>

            <AppButton
              v-if="isEmailSent && currentStep === 1"
              :styleOverrides="{
                marginTop: '1.042vw',
              }"
              pulse
              type="submit"
              :disabled="!verificationCode || isSubmitting"
              full-width
            >
              Подтвердить код
            </AppButton>

            <AppButton
              v-if="currentStep === 2"
              :styleOverrides="{
                marginTop: '1.042vw',
              }"
              pulse
              type="submit"
              :disabled="!isFormValid || isSubmitting"
              full-width
            >
              Зарегистрироваться
            </AppButton>
          </div>
        </form>

        <div class="signUp__popup__login-link">
          <router-link class="signUp__popup__link" to="/signin">
            Уже есть аккаунт? Войти
          </router-link>
        </div>
      </div>
    </div>

    <!-- Уведомление -->
    <div
      v-if="notification.show"
      class="signUp__notification"
      :class="notification.type"
    >
      <p class="signUp__notification__text">{{ notification.message }}</p>
      <button class="signUp__notification__close" @click="closeNotification">
        ×
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { AppButton, AppInput } from "@/components/UI";
import { defineComponent, ref, computed } from "vue";
import { useRouter } from "vue-router";
import AppLoader from "@/components/Loader.vue";
import { userApi } from "@/api";

export default defineComponent({
  name: "signUpView",
  components: {
    AppLoader,
    AppButton,
    AppInput,
  },
  setup() {
    const router = useRouter();
    const isLoading = ref(true);
    const isSubmitting = ref(false);
    const isEmailSent = ref(false);
    const currentStep = ref(1);

    // Форма
    const email = ref("");
    const verificationCode = ref("");
    const login = ref("");
    const password = ref("");
    const passwordConfirm = ref("");

    // Уведомление
    const notification = ref({
      show: false,
      message: "",
      type: "success" as "success" | "error",
    });

    // Валидаторы
    const isEmailValid = computed(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.value);
    });

    const isFormValid = computed(() => {
      return (
        login.value.trim() !== "" &&
        password.value.trim() !== "" &&
        password.value === passwordConfirm.value
      );
    });

    // Показать уведомление
    const showNotification = (message: string, type: "success" | "error") => {
      notification.value.message = message;
      notification.value.type = type;
      notification.value.show = true;

      // Автоматически скрыть через 5 секунд
      setTimeout(() => {
        closeNotification();
      }, 5000);
    };

    // Закрыть уведомление
    const closeNotification = () => {
      notification.value.show = false;
    };

    // Обработка отправки формы
    const handleStepSubmit = async () => {
      isSubmitting.value = true;

      try {
        // Шаг 1: отправка и подтверждение email
        if (currentStep.value === 1) {
          if (!isEmailSent.value) {
            // Отправка кода подтверждения
            await userApi.sendVerificationCode(email.value);
            isEmailSent.value = true;
            showNotification(
              "Код подтверждения отправлен на вашу почту",
              "success"
            );
          } else {
            // Проверка кода подтверждения и переход к следующему шагу
            // Здесь мы просто переходим на следующий шаг, а проверка будет при финальной регистрации
            currentStep.value = 2;
          }
        }

        // Шаг 2: Регистрация пользователя
        else if (currentStep.value === 2) {
          if (password.value !== passwordConfirm.value) {
            showNotification("Пароли не совпадают", "error");
            isSubmitting.value = false;
            return;
          }

          const userData = {
            email: email.value,
            verification_code: verificationCode.value,
            login: login.value,
            password: password.value,
          };

          // Отправка запроса на регистрацию
          await userApi.confirmEmail(userData);

          // Сохраняем токен в localStorage для имитации входа
          localStorage.setItem("token", "вошли");

          // Перенаправляем на страницу с дополнительными данными
          router.push("/");
        }
      } catch (error: any) {
        console.error("Ошибка:", error);
        const errorMessage =
          error.response?.data?.detail || "Произошла ошибка при регистрации";
        showNotification(errorMessage, "error");
      } finally {
        isSubmitting.value = false;
      }
    };

    // Имитация начальной загрузки приложения
    setTimeout(() => {
      isLoading.value = false;
    }, 10);

    return {
      isLoading,
      isSubmitting,
      isEmailSent,
      currentStep,
      email,
      verificationCode,
      login,
      password,
      passwordConfirm,
      isEmailValid,
      isFormValid,
      handleStepSubmit,
      notification,
      closeNotification,
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
  position: relative;

  &__popup {
    position: relative;
    border-radius: 0.521vw;
    width: 25vw;
    min-height: 28vw;
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
      background: rgba(42, 42, 42, 0.8);
      border-radius: 0.521vw;
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

    &__verification {
      margin-top: 1.042vw;
      animation: fadeIn 0.5s ease-out;

      &__text {
        font-family: var(--font-family);
        font-size: 0.729vw;
        color: #39b874;
        margin-bottom: 0.521vw;
      }
    }

    &__form {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 1.563vw;
    }

    &__buttons {
      margin-top: 1.563vw;
    }

    &__email-display {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 0.417vw;
      padding: 0.521vw 0.781vw;
      margin-bottom: 1.042vw;

      &__label {
        font-family: var(--font-family);
        font-size: 0.729vw;
        color: rgba(255, 255, 255, 0.5);
      }

      &__value {
        font-family: var(--font-family);
        font-size: 0.938vw;
        color: #fff;
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

    &__login-link {
      margin-top: 1.563vw;
      text-align: center;
    }

    &__link {
      display: inline-block;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
      color: #08dccf;
      transition: all 0.3s ease;

      &:hover {
        color: #0ae2d5;
        text-shadow: 0 0 0.521vw rgba(8, 220, 207, 0.5);
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

  &__notification {
    position: fixed;
    bottom: 1.563vw;
    right: 1.563vw;
    padding: 0.833vw 1.042vw;
    min-width: 20.833vw;
    border-radius: 0.417vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
    animation: slideInRight 0.3s ease;

    &.success {
      background-color: rgba(57, 184, 116, 0.9);
    }

    &.error {
      background-color: rgba(255, 91, 91, 0.9);
    }

    &__text {
      font-family: var(--font-family);
      font-size: 0.833vw;
      color: #fff;
    }

    &__close {
      font-size: 1.25vw;
      color: #fff;
      cursor: pointer;
      opacity: 0.7;
      transition: all 0.2s ease;
      margin-left: 0.833vw;

      &:hover {
        opacity: 1;
      }
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  }
}
</style>

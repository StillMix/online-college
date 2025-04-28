<template>
  <div class="settingsView">
    <Header />
    <div class="settingsView__container">
      <h1 class="settingsView__title slide-down-animation">
        Настройки аккаунта
      </h1>

      <div class="settingsView__content">
        <div class="settingsView__form fade-in-animation">
          <div class="settingsView__form__left">
            <p class="settingsView__form__subtitle">Личная информация</p>

            <transition-group
              name="field-animation"
              tag="div"
              class="settingsView__form__fields"
            >
              <AppInput
                v-model="userData.name"
                type="text"
                placeholder="Имя"
                :styleLabel="{
                  marginTop: '10px',
                }"
                :styleInput="{
                  width: '100%',
                  paddingLeft: '10px',
                  opacity: '0.7',
                  backgroundColor: '#2a2a2a',
                }"
              ></AppInput>
              <AppInput
                v-model="userData.login"
                type="login"
                placeholder="Логин"
                :styleLabel="{
                  marginTop: '10px',
                }"
                :styleInput="{
                  width: '100%',
                  paddingLeft: '10px',
                  opacity: '0.7',
                  backgroundColor: '#2a2a2a',
                }"
              ></AppInput>
              <AppInput
                v-model="userData.email"
                type="email"
                disabled
                placeholder="Почта"
                :styleLabel="{
                  marginTop: '10px',
                }"
                :styleInput="{
                  width: '100%',
                  paddingLeft: '10px',
                  opacity: '0.7',
                  backgroundColor: '#2a2a2a',
                }"
              ></AppInput>
            </transition-group>

            <p class="settingsView__form__subtitle settings-section-animation">
              Безопасность
            </p>

            <transition-group
              name="field-animation"
              tag="div"
              class="settingsView__form__fields"
            >
              <label class="settingsView__form__label" key="password">
                <img
                  class="settingsView__form__label__img"
                  src="../assets/pass.svg"
                  alt="icon"
                />
                <input
                  class="settingsView__form__label__input"
                  placeholder="Текущий пароль"
                  type="password"
                  v-model="userData.currentPassword"
                />
              </label>

              <label class="settingsView__form__label" key="new-password">
                <img
                  class="settingsView__form__label__img"
                  src="../assets/pass.svg"
                  alt="icon"
                />
                <input
                  class="settingsView__form__label__input"
                  placeholder="Новый пароль"
                  type="password"
                  v-model="userData.newPassword"
                />
              </label>

              <label class="settingsView__form__label" key="confirm-password">
                <img
                  class="settingsView__form__label__img"
                  src="../assets/pass.svg"
                  alt="icon"
                />
                <input
                  class="settingsView__form__label__input"
                  placeholder="Подтвердите новый пароль"
                  type="password"
                  v-model="userData.confirmPassword"
                />
              </label>
            </transition-group>

            <div class="settingsView__form__buttons">
              <button class="settingsView__form__reset" @click="resetForm">
                Отменить
              </button>

              <button
                class="settingsView__form__save pulse-animation"
                @click="saveSettings"
                :disabled="isSaving"
              >
                {{ isSaving ? "Сохранение..." : "Сохранить изменения" }}
              </button>
            </div>
          </div>

          <div class="settingsView__form__right">
            <div class="settingsView__form__image">
              <div class="settingsView__form__image__container scale-animation">
                <transition name="fade-scale">
                  <img
                    v-if="previewImage || userData.img"
                    :src="
                      previewImage ??
                      `https://stillmix-online-college-fastapi-e9c2.twc1.net/${userData.img}` ??
                      undefined
                    "
                    class="settingsView__form__image__preview"
                    alt="Аватар пользователя"
                  />
                  <div v-else class="settingsView__form__image__placeholder">
                    <inputImg
                      color="#484848"
                      width="3.5vw"
                      height="3.5vw"
                      class="floating-icon"
                    />
                    <p class="settingsView__form__image__text">
                      Нет изображения
                    </p>
                  </div>
                </transition>
              </div>

              <label class="settingsView__form__image__upload">
                <input
                  type="file"
                  class="settingsView__form__image__input"
                  accept="image/*"
                  @change="handleImageSelect"
                />
                <span class="settingsView__form__image__label"
                  >Изменить изображение</span
                >
              </label>
            </div>

            <div class="settingsView__form__info slide-up-animation">
              <p class="settingsView__form__info__title">
                <img
                  class="settingsView__form__info__title__img"
                  src="../assets/settings.svg"
                  alt="Settings icon"
                />
                Информация профиля
              </p>
              <p class="settingsView__form__info__text">
                Изменения в профиле будут видны другим пользователям и
                преподавателям. Убедитесь, что указали корректную информацию.
              </p>
              <p class="settingsView__form__info__date">
                Дата регистрации:
                <span>{{ registrationDate }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <transition name="notification">
        <div
          v-if="showNotification"
          class="settingsView__notification"
          :class="notificationType"
        >
          <p class="settingsView__notification__text">
            {{ notificationMessage }}
          </p>
          <button
            class="settingsView__notification__close"
            @click="closeNotification"
          >
            ×
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import Header from "@/components/Header.vue";
import inputImg from "../assets/icons/inputImg.vue";
import { AppInput } from "@/components/UI";
import { userApi } from "@/api";

export default defineComponent({
  name: "SettingsView",
  components: {
    Header,
    AppInput,
    inputImg,
  },
  setup() {
    const isSaving = ref(false);
    const previewImage = ref<string | null>(null);
    const showNotification = ref(false);
    const notificationMessage = ref("");
    const notificationType = ref("success");
    const userData = ref<any>(null);
    // Имитация данных пользователя
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        userData.value = JSON.parse(userDataStr);
      } catch (e) {
        console.error("Ошибка при парсинге данных пользователя:", e);
      }
    }
    // Сохраняем начальные данные для возможности сброса формы
    const initialUserData = { ...userData.value };

    // Форматированная дата регистрации
    const registrationDate = computed(() => {
      const date = new Date();
      return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
    });

    // Обработчик выбора изображения
    const handleImageSelect = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        await userApi.uploadAvatar(userData.value.id, file);
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            previewImage.value = e.target.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    };

    // Сохранение настроек
    const saveSettings = () => {
      // Проверка паролей
      if (
        userData.value.newPassword &&
        userData.value.newPassword !== userData.value.confirmPassword
      ) {
        showErrorNotification("Пароли не совпадают");
        return;
      }

      isSaving.value = true;

      // Имитация сохранения данных
      setTimeout(() => {
        isSaving.value = false;

        // Обновляем изображение профиля если было выбрано новое
        if (previewImage.value) {
          userData.value.avatar = previewImage.value;
        }

        // Сохраняем начальные данные для возможности сброса формы
        initialUserData.name = userData.value.name;
        initialUserData.login = userData.value.login;
        initialUserData.email = userData.value.email;
        initialUserData.avatar = userData.value.avatar;

        // Сбрасываем поля паролей
        userData.value.currentPassword = "";
        userData.value.newPassword = "";
        userData.value.confirmPassword = "";

        showSuccessNotification("Настройки успешно сохранены");
      }, 1500);
    };

    // Сброс формы
    const resetForm = () => {
      userData.value.name = initialUserData.name;
      userData.value.login = initialUserData.login;
      userData.value.email = initialUserData.email;
      userData.value.currentPassword = "";
      userData.value.newPassword = "";
      userData.value.confirmPassword = "";

      // Сбрасываем предпросмотр изображения
      previewImage.value = null;
      userData.value.img = initialUserData.img;

      showNotification.value = false;
    };

    // Показ уведомления об успехе
    const showSuccessNotification = (message: string) => {
      notificationType.value = "success";
      notificationMessage.value = message;
      showNotification.value = true;

      // Автоматически скрываем уведомление через 5 секунд
      setTimeout(() => {
        showNotification.value = false;
      }, 5000);
    };

    // Показ уведомления об ошибке
    const showErrorNotification = (message: string) => {
      notificationType.value = "error";
      notificationMessage.value = message;
      showNotification.value = true;

      // Автоматически скрываем уведомление через 5 секунд
      setTimeout(() => {
        showNotification.value = false;
      }, 5000);
    };

    // Закрытие уведомления
    const closeNotification = () => {
      showNotification.value = false;
    };

    // Применяем анимации последовательно при монтировании
    onMounted(() => {
      // Загружаем данные пользователя из localStorage если они есть
      const token = localStorage.getItem("token");
      if (!token) {
        // Если пользователь не авторизован, перенаправляем на страницу входа
        window.location.href = "/signin";
      }

      // Применяем последовательные анимации к элементам
      const elements = document.querySelectorAll(".settingsView__form__fields");
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("visible");
        }, 300 * (index + 1));
      });
    });

    return {
      isSaving,
      userData,
      previewImage,
      registrationDate,
      showNotification,
      notificationMessage,
      notificationType,
      handleImageSelect,
      saveSettings,
      resetForm,
      closeNotification,
    };
  },
});
</script>

<style scoped lang="scss">
.settingsView {
  width: 100%;
  min-height: 100vh;

  &__container {
    width: 71.615vw;
    max-width: 71.615vw;
    margin: 0 auto;
    padding: 1.563vw 0;
    position: relative;
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 1.5vw;
    color: #fff;
    margin-bottom: 1.5vw;
    opacity: 0;
    transform: translateY(-0.5vw);
    animation: slideDown 0.5s ease-out forwards;
  }

  &__content {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__form {
    display: flex;
    gap: 2.604vw;
    opacity: 0;
    transform: translateY(1vw);
    animation: fadeIn 0.7s ease-out 0.2s forwards;

    &__left {
      flex: 1;
      max-width: 41.667vw;
    }

    &__right {
      width: 22.917vw;
      display: flex;
      flex-direction: column;
      gap: 1.563vw;
    }

    &__subtitle {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 1.042vw;
      color: #fff;
      margin-bottom: 1.042vw;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -0.313vw;
        width: 3.125vw;
        height: 0.104vw;
        background: linear-gradient(90deg, #39b874, rgba(57, 184, 116, 0));
        transition: width 0.5s ease;
      }

      &:hover::after {
        width: 6.25vw;
      }

      &.settings-section-animation {
        opacity: 0;
        transform: translateY(0.5vw);
        animation: slideDown 0.5s ease-out 0.6s forwards;
      }
    }

    &__fields {
      margin-bottom: 1.563vw;
      opacity: 0;
      transform: translateY(1vw);
      transition: opacity 0.5s ease, transform 0.5s ease;

      &.visible {
        opacity: 1;
        transform: translateY(0);
      }
    }

    &__label {
      margin-bottom: 1.042vw;
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
        border-radius: 0.625vw;
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
          background: #2d2d2d;
        }

        &:focus + .settingsView__form__label__img {
          transform: scale(1.1) rotate(-10deg);
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

    &__buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 2.083vw;
    }

    &__reset {
      border-radius: 0.625vw;
      width: 13.021vw;
      height: 2.604vw;
      background: #363636;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      text-align: center;
      color: #fff;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        background: #424242;
        transform: translateY(-0.104vw);
      }

      &:active {
        transform: translateY(0.052vw);
      }
    }

    &__save {
      border-radius: 0.625vw;
      width: 23.438vw;
      height: 2.604vw;
      background: #39b874;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      text-align: center;
      color: #fff;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover:not(:disabled) {
        background: #45cc83;
        transform: translateY(-0.104vw);
        box-shadow: 0 0.26vw 0.781vw rgba(57, 184, 116, 0.4);
      }

      &:active:not(:disabled) {
        transform: translateY(0.052vw);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
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

      &:focus:not(:active):not(:disabled)::after {
        animation: ripple 1s ease-out;
      }
    }

    &__image {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #2a2a2a;
      border-radius: 0.625vw;
      padding: 1.563vw;
      box-shadow: 0 0.26vw 1.042vw rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 0.417vw 1.563vw rgba(0, 0, 0, 0.25);
        transform: translateY(-0.104vw);
      }

      &__container {
        width: 11.458vw;
        height: 11.458vw;
        background: #363636;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.042vw;
        transition: all 0.3s ease;
        transform: scale(0.95);
        animation: scaleIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s
          forwards;

        &:hover {
          transform: scale(1.05);
          box-shadow: 0 0.417vw 1.042vw rgba(0, 0, 0, 0.3);
        }
      }

      &__placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }

      &__preview {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &__text {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.938vw;
        color: #fff;
        opacity: 0.5;
        margin-top: 0.521vw;
      }

      &__upload {
        width: 100%;
        height: 2.604vw;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #08dccf;
        border-radius: 0.625vw;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 0.781vw;
        overflow: hidden;
        position: relative;

        &:hover {
          background: #09e9db;
          transform: translateY(-0.104vw);
          box-shadow: 0 0.26vw 0.781vw rgba(8, 220, 207, 0.4);

          .settingsView__form__image__label {
            letter-spacing: 0.052vw;
          }
        }

        &:active {
          transform: translateY(0.052vw);
        }

        &::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(30deg) translateX(-100%);
          animation: shine 6s infinite;
          z-index: 1;
        }
      }

      &__input {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      &__label {
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 0.938vw;
        color: #fff;
        z-index: 2;
        transition: all 0.3s ease;
      }

      &__remove {
        width: 100%;
        height: 2.604vw;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #363636;
        border-radius: 0.625vw;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        color: #ff5b5b;

        &:hover {
          background: #424242;
          transform: translateY(-0.104vw);
        }

        &:active {
          transform: translateY(0.052vw);
        }
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      background: #2a2a2a;
      border-radius: 0.625vw;
      padding: 1.563vw;
      transform: translateY(1vw);
      opacity: 0;
      animation: slideUp 0.7s ease-out 0.5s forwards;

      &__title {
        display: flex;
        align-items: center;
        gap: 0.521vw;
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 1.042vw;
        color: #fff;
        margin-bottom: 0.781vw;

        &__img {
          width: 1.25vw;
          height: 1.25vw;
          animation: rotate 20s infinite linear;
        }
      }

      &__text {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 1.042vw;
        line-height: 135%;
      }

      &__date {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        color: rgba(255, 255, 255, 0.5);

        span {
          color: #08dccf;
          font-weight: 500;
        }
      }
    }
  }

  &__notification {
    position: fixed;
    bottom: 1.563vw;
    right: 1.563vw;
    min-width: 20.833vw;
    padding: 1.042vw 1.563vw;
    border-radius: 0.625vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1000;
    box-shadow: 0 0.521vw 1.042vw rgba(0, 0, 0, 0.25);

    &.success {
      background: rgba(57, 184, 116, 0.95);
    }

    &.error {
      background: rgba(255, 91, 91, 0.95);
    }

    &__text {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      color: #fff;
    }

    &__close {
      font-size: 1.25vw;
      color: #fff;
      opacity: 0.7;
      width: 1.563vw;
      height: 1.563vw;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        opacity: 1;
        transform: scale(1.1);
      }
    }
  }
}

/* Анимации */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-0.5vw);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(1vw);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(1vw);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}

@keyframes shine {
  0% {
    transform: rotate(30deg) translateX(-100%);
  }
  20%,
  100% {
    transform: rotate(30deg) translateX(100%);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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

/* Анимация пульсации для кнопки сохранения */
.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
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
</style>

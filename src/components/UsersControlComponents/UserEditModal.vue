<template>
  <div class="user-edit-modal" v-if="show" @click.self="$emit('close')">
    <div class="user-edit-modal__content">
      <h2 class="user-edit-modal__title">
        {{
          editMode
            ? "Редактирование пользователя"
            : "Создание нового пользователя"
        }}
      </h2>

      <form
        class="user-edit-modal__form"
        @submit.prevent="$emit('save', user, isAdmin)"
      >
        <div class="user-edit-modal__form__avatar">
          <div
            class="user-edit-modal__form__avatar__preview"
            :style="{
              backgroundImage: avatarPreview
                ? `url(${avatarPreview})`
                : user.img
                ? `url(${apiBaseUrl}/${user.img})`
                : 'none',
            }"
          >
            <div
              v-if="!avatarPreview && !user.img"
              class="user-edit-modal__form__avatar__placeholder"
            >
              {{ getUserInitials(user) }}
            </div>
          </div>
          <div class="user-edit-modal__form__avatar__actions">
            <label class="user-edit-modal__form__avatar__upload">
              <input
                type="file"
                accept="image/*"
                @change="onAvatarChange($event)"
                class="user-edit-modal__form__avatar__input"
              />
              <span>Загрузить аватар</span>
            </label>
            <button
              v-if="avatarPreview || user.img"
              type="button"
              class="user-edit-modal__form__avatar__remove"
              @click="$emit('remove-avatar')"
            >
              Удалить аватар
            </button>
          </div>
        </div>

        <div class="user-edit-modal__form__row">
          <div class="user-edit-modal__form__col">
            <label class="user-edit-modal__form__label">
              Имя пользователя
              <input
                type="text"
                class="user-edit-modal__form__input"
                v-model="user.name"
                placeholder="Имя пользователя"
              />
            </label>

            <label class="user-edit-modal__form__label">
              Логин
              <input
                type="text"
                class="user-edit-modal__form__input"
                v-model="user.login"
                required
                placeholder="Логин"
              />
            </label>

            <label class="user-edit-modal__form__label">
              Электронная почта
              <input
                type="email"
                class="user-edit-modal__form__input"
                v-model="user.email"
                required
                placeholder="Email"
              />
            </label>
          </div>

          <div class="user-edit-modal__form__col">
            <label class="user-edit-modal__form__label">
              Пароль
              {{ editMode ? "(оставьте пустым, чтобы не менять)" : "" }}
              <input
                type="password"
                class="user-edit-modal__form__input"
                v-model="user.password"
                :required="!editMode"
                placeholder="Пароль"
              />
            </label>

            <label class="user-edit-modal__form__label">
              Повторите пароль
              <input
                type="password"
                class="user-edit-modal__form__input"
                v-model="passwordConfirm"
                :required="!editMode || user.password !== ''"
                placeholder="Повторите пароль"
              />
            </label>

            <label
              class="user-edit-modal__form__label user-edit-modal__form__label--checkbox"
            >
              <input
                type="checkbox"
                class="user-edit-modal__form__checkbox"
                v-model="isAdmin"
              />
              Администратор
            </label>
          </div>
        </div>

        <div class="user-edit-modal__actions">
          <button
            type="button"
            class="user-edit-modal__actions__button user-edit-modal__actions__button--cancel"
            @click="$emit('close')"
          >
            Отмена
          </button>
          <button
            type="submit"
            class="user-edit-modal__actions__button user-edit-modal__actions__button--save"
            :disabled="submitting || !isFormValid"
          >
            {{
              submitting
                ? "Сохранение..."
                : editMode
                ? "Сохранить изменения"
                : "Создать пользователя"
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch } from "vue";
import { UserData } from "@/types";

export default defineComponent({
  name: "UserEditModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    userData: {
      type: Object as PropType<UserData>,
      required: true,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    submitting: {
      type: Boolean,
      default: false,
    },
    apiBaseUrl: {
      type: String,
      required: true,
    },
    avatarPreview: {
      type: String,
      default: "",
    },
  },
  emits: ["close", "save", "avatar-change", "remove-avatar"],
  setup(props, { emit }) {
    const user = ref<UserData>({ ...props.userData });
    const passwordConfirm = ref("");
    const isAdmin = ref(props.userData.role === "admin");

    // Обновляем локальную копию данных при изменении props
    watch(
      () => props.userData,
      (newUserData) => {
        user.value = { ...newUserData };
        isAdmin.value = newUserData.role === "admin";
        passwordConfirm.value = "";
      }
    );

    // Валидация формы
    const isFormValid = computed(() => {
      if (!user.value.login || !user.value.email) return false;
      if (user.value.password !== passwordConfirm.value) return false;
      if (!props.editMode && !user.value.password) return false;
      return true;
    });

    // Получение инициалов пользователя
    const getUserInitials = (user: UserData): string => {
      if (!user) return "";

      if (user.name) {
        const parts = user.name.split(" ");
        if (parts.length > 1) {
          return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0].slice(0, 2).toUpperCase();
      }

      if (user.login) {
        return user.login.substring(0, 2).toUpperCase();
      }

      return "??";
    };

    // Обработка изменения аватара
    const onAvatarChange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        emit("avatar-change", input.files[0]);
      }
    };

    return {
      user,
      passwordConfirm,
      isAdmin,
      isFormValid,
      getUserInitials,
      onAvatarChange,
    };
  },
});
</script>

<style scoped lang="scss">
.user-edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  &__content {
    background: #2a2a2a;
    border-radius: 0.625vw;
    padding: 1.563vw;
    width: 60vw;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 0.521vw 1.563vw rgba(0, 0, 0, 0.3);
    animation: scaleIn 0.3s ease;

    /* Стилизация скроллбара */
    &::-webkit-scrollbar {
      width: 0.417vw;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 0.521vw;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(8, 220, 207, 0.3);
      border-radius: 0.521vw;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(8, 220, 207, 0.5);
    }
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 1.25vw;
    color: #fff;
    margin: 0 0 1.563vw 0;
    border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.781vw;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.563vw;

    &__avatar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.042vw;
      margin-bottom: 1.042vw;

      &__preview {
        width: 7.292vw;
        height: 7.292vw;
        border-radius: 50%;
        overflow: hidden;
        background: linear-gradient(135deg, #363636, #404040);
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__placeholder {
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 2.083vw;
        color: rgba(255, 255, 255, 0.7);
      }

      &__actions {
        display: flex;
        gap: 0.781vw;
      }

      &__upload {
        position: relative;
        overflow: hidden;
        display: inline-block;
        padding: 0.521vw 1.042vw;
        border-radius: 0.417vw;
        background: #08dccf;
        color: #fff;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: #09e9db;
          transform: translateY(-0.104vw);
        }

        &:active {
          transform: translateY(0.052vw);
        }
      }

      &__input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }

      &__remove {
        padding: 0.521vw 1.042vw;
        border-radius: 0.417vw;
        background: #363636;
        color: #ff5b5b;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: #404040;
          transform: translateY(-0.104vw);
        }

        &:active {
          transform: translateY(0.052vw);
        }
      }
    }

    &__row {
      display: flex;
      gap: 1.042vw;
    }

    &__col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.781vw;
    }

    &__label {
      display: flex;
      flex-direction: column;
      gap: 0.313vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
      color: rgba(255, 255, 255, 0.7);

      &--checkbox {
        flex-direction: row;
        align-items: center;
        gap: 0.521vw;
        margin-top: 0.781vw;
      }
    }

    &__input {
      border-radius: 0.417vw;
      background: #363636;
      height: 2.083vw;
      padding: 0 0.781vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
      color: #fff;
      transition: all 0.3s ease;

      &:focus {
        background: #404040;
        box-shadow: 0 0 0.417vw rgba(8, 220, 207, 0.5);
      }
    }

    &__checkbox {
      width: 0.938vw;
      height: 0.938vw;
      accent-color: #08dccf;
      cursor: pointer;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.781vw;
    margin-top: 1.042vw;

    &__button {
      padding: 0.521vw 1.563vw;
      border-radius: 0.417vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-0.104vw);
      }

      &:active {
        transform: translateY(0.052vw);
      }

      &--cancel {
        background: #363636;

        &:hover {
          background: #404040;
        }
      }

      &--save {
        background: #39b874;

        &:hover {
          background: #45cc83;
          box-shadow: 0 0.26vw 0.781vw rgba(57, 184, 116, 0.4);
        }

        &:disabled {
          background: rgba(57, 184, 116, 0.5);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      }
    }
  }
}

/* Анимации */
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
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

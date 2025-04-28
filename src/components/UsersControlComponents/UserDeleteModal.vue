<template>
  <div class="user-delete-modal" v-if="show" @click.self="$emit('close')">
    <div class="user-delete-modal__content">
      <h2 class="user-delete-modal__title">Подтверждение удаления</h2>

      <p class="user-delete-modal__text">
        Вы действительно хотите удалить пользователя "{{ getUserDisplayName }}"?
        <br />
        Это действие нельзя будет отменить.
      </p>

      <div class="user-delete-modal__actions">
        <button
          class="user-delete-modal__actions__button user-delete-modal__actions__button--cancel"
          @click="$emit('close')"
        >
          Отмена
        </button>
        <button
          class="user-delete-modal__actions__button user-delete-modal__actions__button--confirm"
          @click="$emit('confirm')"
          :disabled="submitting"
        >
          {{ submitting ? "Удаление..." : "Удалить" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { UserData } from "@/types";

export default defineComponent({
  name: "UserDeleteModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object as PropType<UserData>,
      required: true,
    },
    submitting: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close", "confirm"],
  setup(props) {
    const getUserDisplayName = computed(() => {
      return props.user.name || props.user.login || "выбранного пользователя";
    });

    return {
      getUserDisplayName,
    };
  },
});
</script>

<style scoped lang="scss">
.user-delete-modal {
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
    width: 31.25vw;
    max-width: 90vw;
    box-shadow: 0 0.521vw 1.563vw rgba(0, 0, 0, 0.3);
    animation: scaleIn 0.3s ease;
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

  &__text {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.938vw;
    color: #fff;
    line-height: 1.4;
    margin-bottom: 1.563vw;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.781vw;

    &__button {
      padding: 0.521vw 1.042vw;
      border-radius: 0.417vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
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

      &--confirm {
        background: #ff5b5b;

        &:hover {
          background: #ff7272;
          box-shadow: 0 0.26vw 0.781vw rgba(255, 91, 91, 0.4);
        }

        &:disabled {
          background: rgba(255, 91, 91, 0.5);
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

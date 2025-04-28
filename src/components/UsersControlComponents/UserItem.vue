<template>
  <div class="user-item" :class="{ 'user-item--admin': user.role === 'admin' }">
    <div class="user-item__content">
      <div class="user-item__avatar">
        <img
          v-if="user.img"
          :src="apiBaseUrl + '/' + user.img"
          alt="Аватар пользователя"
          class="user-item__avatar__img"
        />
        <div v-else class="user-item__avatar__placeholder">
          {{ getUserInitials(user) }}
        </div>
      </div>

      <div class="user-item__info">
        <h3 class="user-item__info__name">
          {{ user.name || user.login }}
          <span v-if="user.role === 'admin'" class="user-item__info__badge"
            >Администратор</span
          >
        </h3>
        <p class="user-item__info__login">
          {{ user.login }}
        </p>
        <p class="user-item__info__email">
          {{ user.email }}
        </p>
      </div>
    </div>

    <div class="user-item__actions">
      <button
        v-if="user.role !== 'admin'"
        class="user-item__actions__button user-item__actions__button--admin"
        @click="$emit('make-admin', user)"
      >
        Сделать администратором
      </button>
      <button
        v-else
        class="user-item__actions__button user-item__actions__button--user"
        @click="$emit('remove-admin', user)"
      >
        Убрать права администратора
      </button>
      <button
        class="user-item__actions__button user-item__actions__button--edit"
        @click="$emit('edit', user)"
      >
        Редактировать
      </button>
      <button
        class="user-item__actions__button user-item__actions__button--delete"
        @click="$emit('delete', user)"
      >
        Удалить
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { UserData } from "@/types";

export default defineComponent({
  name: "UserItem",
  props: {
    user: {
      type: Object as PropType<UserData>,
      required: true,
    },
    apiBaseUrl: {
      type: String,
      required: true,
    },
  },
  emits: ["make-admin", "remove-admin", "edit", "delete"],
  setup() {
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

    return {
      getUserInitials,
    };
  },
});
</script>

<style scoped lang="scss">
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2a2a2a;
  border-radius: 0.625vw;
  padding: 1.042vw;
  border-left: 0.313vw solid #363636;
  transition: all 0.3s ease;

  &--admin {
    border-left-color: #08dccf;
  }

  &:hover {
    transform: translateX(0.208vw);
    box-shadow: 0 0.26vw 0.781vw rgba(0, 0, 0, 0.2);
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 1.042vw;
  }

  &__avatar {
    width: 3.646vw;
    height: 3.646vw;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: linear-gradient(135deg, #363636, #404040);
    display: flex;
    align-items: center;
    justify-content: center;

    &__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__placeholder {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 1.25vw;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.313vw;

    &__name {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 1.042vw;
      color: #fff;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.521vw;
    }

    &__badge {
      font-size: 0.625vw;
      font-weight: 400;
      background: #08dccf;
      color: #2a2a2a;
      padding: 0.156vw 0.417vw;
      border-radius: 0.26vw;
    }

    &__login {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }

    &__email {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.729vw;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }
  }

  &__actions {
    display: flex;
    gap: 0.521vw;
    flex-wrap: wrap;
    justify-content: flex-end;
    width: 20vw;

    &__button {
      padding: 0.521vw 0.781vw;
      border-radius: 0.417vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.729vw;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;

      &:hover {
        transform: translateY(-0.104vw);
      }

      &:active {
        transform: translateY(0.052vw);
      }

      &--admin {
        background: #08dccf;

        &:hover {
          background: #09e9db;
          box-shadow: 0 0.26vw 0.781vw rgba(8, 220, 207, 0.4);
        }
      }

      &--user {
        background: #363636;

        &:hover {
          background: #404040;
        }
      }

      &--edit {
        background: #363636;

        &:hover {
          background: #08dccf;
        }
      }

      &--delete {
        background: #363636;

        &:hover {
          background: #ff5b5b;
          box-shadow: 0 0.26vw 0.521vw rgba(255, 91, 91, 0.4);
        }
      }
    }
  }
}
</style>

<template>
  <div class="users-control">
    <div class="users-control__actions">
      <button
        class="users-control__actions__button users-control__actions__button--create"
        @click="openCreateModal"
      >
        <span class="users-control__actions__button__icon">+</span>
        Добавить пользователя
      </button>

      <div class="users-control__actions__search">
        <img
          alt="icon"
          src="../assets/search.svg"
          class="users-control__actions__search__img"
        />
        <input
          class="users-control__actions__search__input"
          placeholder="Поиск пользователей"
          v-model="searchQuery"
        />
        <button
          v-if="searchQuery"
          class="users-control__actions__search__clear"
          @click="clearSearch"
        >
          ×
        </button>
      </div>
    </div>

    <div class="users-control__tabs">
      <button
        class="users-control__tabs__button"
        :class="{ 'users-control__tabs__button--active': userType === 'all' }"
        @click="userType = 'all'"
      >
        Все пользователи
      </button>
      <button
        class="users-control__tabs__button"
        :class="{ 'users-control__tabs__button--active': userType === 'admin' }"
        @click="userType = 'admin'"
      >
        Администраторы
      </button>
      <button
        class="users-control__tabs__button"
        :class="{ 'users-control__tabs__button--active': userType === 'user' }"
        @click="userType = 'user'"
      >
        Обычные пользователи
      </button>
    </div>

    <div v-if="loading" class="users-control__loader">
      <AppLoader :is-visible="true" loading-text="Загрузка пользователей..." />
    </div>

    <div v-else-if="filteredUsers.length > 0" class="users-control__users">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="users-control__user"
        :class="{
          'users-control__user--admin': user.isAdmin,
        }"
      >
        <div class="users-control__user__content">
          <div class="users-control__user__avatar">
            <img
              v-if="user.avatar"
              :src="user.avatar"
              alt="Аватар пользователя"
              class="users-control__user__avatar__img"
            />
            <div v-else class="users-control__user__avatar__placeholder">
              {{ getUserInitials(user) }}
            </div>
          </div>

          <div class="users-control__user__info">
            <h3 class="users-control__user__info__name">
              {{ user.name }}
              <span v-if="user.isAdmin" class="users-control__user__info__badge"
                >Администратор</span
              >
            </h3>
            <p class="users-control__user__info__login">
              {{ user.login }}
            </p>
            <p class="users-control__user__info__email">
              {{ user.email }}
            </p>
          </div>
        </div>

        <div class="users-control__user__actions">
          <button
            v-if="!user.isAdmin"
            class="users-control__user__actions__button users-control__user__actions__button--admin"
            @click="makeAdmin(user)"
          >
            Сделать администратором
          </button>
          <button
            v-else
            class="users-control__user__actions__button users-control__user__actions__button--user"
            @click="removeAdmin(user)"
          >
            Убрать права администратора
          </button>
          <button
            class="users-control__user__actions__button users-control__user__actions__button--edit"
            @click="openEditModal(user)"
          >
            Редактировать
          </button>
          <button
            class="users-control__user__actions__button users-control__user__actions__button--delete"
            @click="openDeleteModal(user)"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>

    <div v-else class="users-control__empty">
      <div class="users-control__empty__con">
        <img
          class="users-control__empty__con-icon"
          src="../assets/nosignin.svg"
          alt="Нет пользователей"
        />
        <p class="users-control__empty__con-text">Пользователи не найдены</p>
      </div>
      <button
        v-if="searchQuery"
        class="users-control__empty__button"
        @click="clearSearch"
      >
        Сбросить поиск
      </button>
    </div>

    <!-- Модальное окно создания/редактирования пользователя -->
    <div
      class="users-control__modal"
      v-if="showEditModal"
      @click.self="closeModals"
    >
      <div class="users-control__modal__content">
        <h2 class="users-control__modal__title">
          {{
            editMode
              ? "Редактирование пользователя"
              : "Создание нового пользователя"
          }}
        </h2>

        <form class="users-control__modal__form" @submit.prevent="saveUser">
          <div class="users-control__modal__form__avatar">
            <div
              class="users-control__modal__form__avatar__preview"
              :style="{
                backgroundImage: userAvatarPreview
                  ? `url(${userAvatarPreview})`
                  : 'none',
              }"
            >
              <div
                v-if="!userAvatarPreview"
                class="users-control__modal__form__avatar__placeholder"
              >
                {{ getUserInitials(editingUser) }}
              </div>
            </div>
            <div class="users-control__modal__form__avatar__actions">
              <label class="users-control__modal__form__avatar__upload">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleAvatarUpload"
                  class="users-control__modal__form__avatar__input"
                />
                <span>Загрузить аватар</span>
              </label>
              <button
                v-if="userAvatarPreview || editingUser.avatar"
                type="button"
                class="users-control__modal__form__avatar__remove"
                @click="removeAvatar"
              >
                Удалить аватар
              </button>
            </div>
          </div>

          <div class="users-control__modal__form__row">
            <div class="users-control__modal__form__col">
              <label class="users-control__modal__form__label">
                Имя пользователя
                <input
                  type="text"
                  class="users-control__modal__form__input"
                  v-model="editingUser.name"
                  required
                />
              </label>

              <label class="users-control__modal__form__label">
                Логин
                <input
                  type="text"
                  class="users-control__modal__form__input"
                  v-model="editingUser.login"
                  required
                />
              </label>

              <label class="users-control__modal__form__label">
                Электронная почта
                <input
                  type="email"
                  class="users-control__modal__form__input"
                  v-model="editingUser.email"
                  required
                />
              </label>
            </div>

            <div class="users-control__modal__form__col">
              <label class="users-control__modal__form__label">
                Пароль
                {{ editMode ? "(оставьте пустым, чтобы не менять)" : "" }}
                <input
                  type="password"
                  class="users-control__modal__form__input"
                  v-model="editingUser.password"
                  :required="!editMode"
                />
              </label>

              <label class="users-control__modal__form__label">
                Повторите пароль
                <input
                  type="password"
                  class="users-control__modal__form__input"
                  v-model="passwordConfirm"
                  :required="!editMode || editingUser.password !== ''"
                />
              </label>

              <label
                class="users-control__modal__form__label users-control__modal__form__label--checkbox"
              >
                <input
                  type="checkbox"
                  class="users-control__modal__form__checkbox"
                  v-model="editingUser.isAdmin"
                />
                Администратор
              </label>
            </div>
          </div>

          <div class="users-control__modal__actions">
            <button
              type="button"
              class="users-control__modal__actions__button users-control__modal__actions__button--cancel"
              @click="closeModals"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="users-control__modal__actions__button users-control__modal__actions__button--save"
            >
              {{ editMode ? "Сохранить изменения" : "Создать пользователя" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно подтверждения удаления -->
    <div
      class="users-control__confirm"
      v-if="showDeleteModal"
      @click.self="closeModals"
    >
      <div class="users-control__confirm__content">
        <h2 class="users-control__confirm__title">Подтверждение удаления</h2>

        <p class="users-control__confirm__text">
          Вы действительно хотите удалить пользователя "{{
            deletingUser?.name
          }}"?
          <br />
          Это действие нельзя будет отменить.
        </p>

        <div class="users-control__confirm__actions">
          <button
            class="users-control__confirm__actions__button users-control__confirm__actions__button--cancel"
            @click="closeModals"
          >
            Отмена
          </button>
          <button
            class="users-control__confirm__actions__button users-control__confirm__actions__button--confirm"
            @click="deleteUser"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>

    <!-- Уведомление о выполнении действия -->
    <transition name="notification">
      <div
        v-if="notification.show"
        class="users-control__notification"
        :class="notification.type"
      >
        <p class="users-control__notification__text">
          {{ notification.message }}
        </p>
        <button
          class="users-control__notification__close"
          @click="notification.show = false"
        >
          ×
        </button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import AppLoader from "@/components/Loader.vue";
import { User } from "@/types";

export default defineComponent({
  name: "UsersControl",
  components: {
    AppLoader,
  },
  setup() {
    // Состояние
    const users = ref<User[]>([]);
    const loading = ref(true);
    const searchQuery = ref("");
    const userType = ref("all"); // all, admin, user

    // Модальные окна
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const editMode = ref(false);

    // Редактируемый пользователь
    const editingUser = ref<User>({
      id: "",
      name: "",
      login: "",
      email: "",
      password: "",
      avatar: null,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    });

    const passwordConfirm = ref("");
    const userAvatarPreview = ref<string | null>(null);
    const deletingUser = ref<User | null>(null);

    // Уведомление
    const notification = ref({
      show: false,
      message: "",
      type: "success",
    });

    // Отфильтрованные пользователи
    const filteredUsers = computed(() => {
      let filtered = users.value;

      // Фильтрация по типу пользователя
      if (userType.value === "admin") {
        filtered = filtered.filter((user) => user.isAdmin);
      } else if (userType.value === "user") {
        filtered = filtered.filter((user) => !user.isAdmin);
      }

      // Фильтрация по запросу поиска
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim();
        filtered = filtered.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.login.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
      }

      return filtered;
    });

    // Получение инициалов пользователя
    const getUserInitials = (user: User) => {
      if (!user || !user.name) return "";

      const parts = user.name.split(" ");
      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }

      return parts[0].slice(0, 2).toUpperCase();
    };

    // Загрузка данных пользователей
    const loadUsers = () => {
      loading.value = true;

      // Проверяем, есть ли пользователи в localStorage
      const usersData = localStorage.getItem("userData");

      if (usersData) {
        try {
          users.value = JSON.parse(usersData);
        } catch (e) {
          console.error("Ошибка при парсинге данных пользователей:", e);

          // Создаем тестовые данные, если произошла ошибка
          createTestUsers();
        }
      } else {
        // Создаем тестовые данные, если пользователей нет
        createTestUsers();
      }

      loading.value = false;
    };

    // Создание тестовых пользователей
    const createTestUsers = () => {
      users.value = [
        {
          id: "1",
          name: "Администратор Системы",
          login: "admin",
          email: "admin@example.com",
          password: "admin123",
          avatar: null,
          isAdmin: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Иван Петров",
          login: "ivanpetrov",
          email: "ivan@example.com",
          password: "password123",
          avatar: null,
          isAdmin: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Мария Иванова",
          login: "mariaivanova",
          email: "maria@example.com",
          password: "password123",
          avatar: null,
          isAdmin: false,
          createdAt: new Date().toISOString(),
        },
      ];

      // Сохраняем тестовых пользователей в localStorage
      localStorage.setItem("userData", JSON.stringify(users.value));
    };

    // Обработка загрузки аватара
    const handleAvatarUpload = (event: Event) => {
      const input = event.target as HTMLInputElement;

      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          if (e.target) {
            userAvatarPreview.value = e.target.result as string;
          }
        };

        reader.readAsDataURL(file);
      }
    };

    // Удаление аватара
    const removeAvatar = () => {
      userAvatarPreview.value = null;
      editingUser.value.avatar = null;
    };

    // Очистка поискового запроса
    const clearSearch = () => {
      searchQuery.value = "";
    };

    // Открытие модального окна создания пользователя
    const openCreateModal = () => {
      editMode.value = false;

      // Генерация нового ID
      const newId = (
        Math.max(0, ...users.value.map((u) => parseInt(u.id))) + 1
      ).toString();

      // Очистка формы
      editingUser.value = {
        id: newId,
        name: "",
        login: "",
        email: "",
        password: "",
        avatar: null,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      };

      passwordConfirm.value = "";
      userAvatarPreview.value = null;

      showEditModal.value = true;
    };

    // Открытие модального окна редактирования пользователя
    const openEditModal = (user: User) => {
      editMode.value = true;

      // Копируем пользователя для редактирования
      editingUser.value = { ...user, password: "" };
      passwordConfirm.value = "";

      // Устанавливаем аватар, если он есть
      userAvatarPreview.value = user.avatar;

      showEditModal.value = true;
    };

    // Открытие модального окна удаления пользователя
    const openDeleteModal = (user: User) => {
      deletingUser.value = user;
      showDeleteModal.value = true;
    };

    // Закрытие всех модальных окон
    const closeModals = () => {
      showEditModal.value = false;
      showDeleteModal.value = false;
    };

    // Назначение пользователя администратором
    const makeAdmin = (user: User) => {
      const index = users.value.findIndex((u) => u.id === user.id);

      if (index !== -1) {
        users.value[index].isAdmin = true;

        // Сохраняем изменения
        localStorage.setItem("userData", JSON.stringify(users.value));

        showNotification(
          `Пользователь "${user.name}" назначен администратором`
        );
      }
    };

    // Снятие прав администратора
    const removeAdmin = (user: User) => {
      const index = users.value.findIndex((u) => u.id === user.id);

      if (index !== -1) {
        users.value[index].isAdmin = false;

        // Сохраняем изменения
        localStorage.setItem("userData", JSON.stringify(users.value));

        showNotification(
          `У пользователя "${user.name}" удалены права администратора`
        );
      }
    };

    // Сохранение пользователя
    const saveUser = () => {
      // Проверка паролей
      if (
        editingUser.value.password &&
        editingUser.value.password !== passwordConfirm.value
      ) {
        showNotification("Пароли не совпадают", "error");
        return;
      }

      if (editMode.value) {
        // Редактирование существующего пользователя
        const index = users.value.findIndex(
          (u) => u.id === editingUser.value.id
        );

        if (index !== -1) {
          // Сохраняем старый пароль, если новый не указан
          if (!editingUser.value.password) {
            editingUser.value.password = users.value[index].password;
          }

          // Обновляем аватар
          if (userAvatarPreview.value) {
            editingUser.value.avatar = userAvatarPreview.value;
          }

          users.value[index] = { ...editingUser.value };

          showNotification(
            `Пользователь "${editingUser.value.name}" успешно обновлен`
          );
        }
      } else {
        // Создание нового пользователя
        const newUser: User = {
          ...editingUser.value,
          avatar: userAvatarPreview.value,
        };

        users.value.push(newUser);

        showNotification(`Пользователь "${newUser.name}" успешно создан`);
      }

      // Сохраняем изменения в localStorage
      localStorage.setItem("userData", JSON.stringify(users.value));

      // Закрываем модальное окно
      closeModals();
    };

    // Удаление пользователя
    const deleteUser = () => {
      if (deletingUser.value) {
        const index = users.value.findIndex(
          (u) => u.id === deletingUser.value?.id
        );

        if (index !== -1) {
          users.value.splice(index, 1);

          // Сохраняем изменения
          localStorage.setItem("userData", JSON.stringify(users.value));

          showNotification(
            `Пользователь "${deletingUser.value.name}" успешно удален`
          );
        }
      }

      // Закрываем модальное окно
      closeModals();
    };

    // Показ уведомления
    const showNotification = (message: string, type = "success") => {
      notification.value = {
        show: true,
        message,
        type,
      };

      // Автоматически скрываем через 5 секунд
      setTimeout(() => {
        notification.value.show = false;
      }, 5000);
    };

    // Инициализация компонента
    onMounted(() => {
      // Проверка авторизации
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/signin";
        return;
      }

      // Загрузка пользователей
      loadUsers();
    });

    return {
      users,
      loading,
      searchQuery,
      userType,
      filteredUsers,
      editingUser,
      passwordConfirm,
      deletingUser,
      notification,
      showEditModal,
      showDeleteModal,
      editMode,
      userAvatarPreview,
      clearSearch,
      getUserInitials,
      handleAvatarUpload,
      removeAvatar,
      openCreateModal,
      openEditModal,
      openDeleteModal,
      closeModals,
      makeAdmin,
      removeAdmin,
      saveUser,
      deleteUser,
    };
  },
});
</script>

<style scoped lang="scss">
.users-control {
  width: 100%;

  &__actions {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.563vw;

    &__button {
      display: flex;
      align-items: center;
      padding: 0.521vw 1.042vw;
      border-radius: 0.625vw;
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

      &--create {
        background: #39b874;

        &:hover {
          background: #45cc83;
          box-shadow: 0 0.26vw 0.781vw rgba(57, 184, 116, 0.4);
        }

        &__icon {
          font-size: 1.25vw;
          margin-right: 0.521vw;
        }
      }
    }

    &__search {
      position: relative;
      width: 31.25vw;
      height: 2.604vw;
      display: flex;
      align-items: center;

      &__img {
        width: 1.25vw;
        height: 1.25vw;
        position: absolute;
        left: 1.042vw;
      }

      &__input {
        width: 100%;
        height: 100%;
        border-radius: 0.625vw;
        background: #363636;
        padding-left: 2.813vw;
        padding-right: 2.5vw;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.938vw;
        color: #fff;
        transition: all 0.3s ease;

        &:focus {
          background: #404040;
          box-shadow: 0 0 0.521vw rgba(8, 220, 207, 0.5);
        }
      }

      &__input::placeholder {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.938vw;
        color: #fff;
        opacity: 0.3;
      }

      &__clear {
        position: absolute;
        right: 1.042vw;
        width: 1.25vw;
        height: 1.25vw;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1vw;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }

  &__tabs {
    display: flex;
    margin-bottom: 1.563vw;
    background: #2a2a2a;
    border-radius: 0.625vw;
    padding: 0.313vw;

    &__button {
      flex: 1;
      padding: 0.521vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.833vw;
      color: rgba(255, 255, 255, 0.7);
      background: transparent;
      border-radius: 0.417vw;
      cursor: pointer;
      transition: all 0.3s ease;

      &--active {
        background: #363636;
        color: #fff;
        box-shadow: 0 0.104vw 0.313vw rgba(0, 0, 0, 0.2);
      }

      &:hover:not(&--active) {
        background: rgba(54, 54, 54, 0.5);
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  &__loader {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 20.833vw;
  }

  &__users {
    display: flex;
    flex-direction: column;
    gap: 1.042vw;
  }

  &__user {
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

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 20vw;

    &__con {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 2.604vw;

      &-icon {
        width: 2.604vw;
        height: 2.604vw;
        opacity: 0.3;
      }

      &-text {
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 1.042vw;
        color: #fff;
        opacity: 0.3;
      }
    }

    &__button {
      margin-top: 0.521vw;
      border-radius: 0.625vw;
      width: 10vw;
      height: 2.604vw;
      background: rgba(8, 220, 207, 0.8);
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      text-align: center;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        background: rgba(7, 201, 188, 0.8);
        transform: translateY(-0.104vw);
        box-shadow: 0 0.26vw 0.781vw rgba(8, 220, 207, 0.4);
      }

      &:active {
        transform: translateY(0.052vw);
      }
    }
  }

  &__modal,
  &__confirm {
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
        }
      }
    }
  }

  &__confirm {
    &__content {
      width: 31.25vw;
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
    animation: slideInRight 0.3s ease;

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

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(2.083vw);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification-enter-active {
  animation: slideInRight 0.3s ease;
}

.notification-leave-active {
  animation: slideInRight 0.3s ease reverse;
}
</style>

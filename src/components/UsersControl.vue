<template>
  <div class="users-control">
    <!-- Поиск и фильтрация -->
    <UserSearchFilter
      v-model:searchQuery="searchQuery"
      v-model:userType="userType"
      @clear-search="clearSearch"
    />

    <!-- Список пользователей -->
    <UsersList
      :users="filteredUsers"
      :loading="loading"
      :api-base-url="API_BASE_URL"
      @make-admin="makeAdmin"
      @remove-admin="removeAdmin"
      @edit="openEditModal"
      @delete="openDeleteModal"
    >
      <template #loader>
        <AppLoader
          :is-visible="true"
          loading-text="Загрузка пользователей..."
        />
      </template>
      <template #empty-state>
        <UserEmptyState
          :message="
            searchQuery
              ? 'Пользователи не найдены по вашему запросу'
              : 'Пользователи не найдены'
          "
        >
          <template #action>
            <button
              v-if="searchQuery"
              class="users-control__empty-button"
              @click="clearSearch"
            >
              Сбросить поиск
            </button>
          </template>
        </UserEmptyState>
      </template>
    </UsersList>

    <!-- Модальное окно редактирования пользователя -->
    <UserEditModal
      :show="showEditModal"
      :user-data="editingUser"
      :edit-mode="editMode"
      :submitting="isSubmitting"
      :api-base-url="API_BASE_URL"
      :avatar-preview="userAvatarPreview"
      @close="closeModals"
      @save="saveUser"
      @avatar-change="handleAvatarChange"
      @remove-avatar="removeAvatar"
    />

    <!-- Модальное окно подтверждения удаления -->
    <UserDeleteModal
      :show="showDeleteModal"
      :user="deletingUser"
      :submitting="isSubmitting"
      @close="closeModals"
      @confirm="deleteUser"
    />

    <!-- Уведомление -->
    <UserNotification
      :show="notification.show"
      :message="notification.message"
      :type="notification.type"
      @close="notification.show = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppLoader from "@/components/Loader.vue";
import {
  UserSearchFilter,
  UsersList,
  UserEditModal,
  UserDeleteModal,
  UserNotification,
  UserEmptyState,
} from "./UsersControlComponents";

import { UserData } from "@/types";
import { userApi } from "@/api";
import apiClient from "@/api/config";

export default defineComponent({
  name: "UsersControl",
  components: {
    AppLoader,
    UserSearchFilter,
    UsersList,
    UserEditModal,
    UserDeleteModal,
    UserNotification,
    UserEmptyState,
  },
  setup() {
    const router = useRouter();
    const API_BASE_URL = apiClient.defaults.baseURL;

    // Состояние
    const users = ref<UserData[]>([]);
    const loading = ref(true);
    const searchQuery = ref("");
    const userType = ref("all"); // all, admin, user
    const isSubmitting = ref(false);

    // Модальные окна
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const editMode = ref(false);

    // Редактируемый пользователь
    const editingUser = ref<UserData>({
      login: "",
      email: "",
      password: "",
      img: undefined,
      name: "",
      role: "student",
    });

    const userAvatarFile = ref<File | null>(null);
    const userAvatarPreview = ref<string | null>(null);
    const deletingUser = ref<UserData>({
      login: "",
      email: "",
    });

    // Уведомление
    const notification = ref({
      show: false,
      message: "",
      type: "success" as "success" | "error",
    });

    // Отфильтрованные пользователи
    const filteredUsers = computed(() => {
      let filtered = users.value;

      // Фильтрация по типу пользователя
      if (userType.value === "admin") {
        filtered = filtered.filter((user) => user.role === "admin");
      } else if (userType.value === "user") {
        filtered = filtered.filter((user) => user.role !== "admin");
      }

      // Фильтрация по запросу поиска
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim();
        filtered = filtered.filter(
          (user) =>
            (user.name && user.name.toLowerCase().includes(query)) ||
            user.login.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
      }

      return filtered;
    });

    // Загрузка данных пользователей
    const loadUsers = async () => {
      loading.value = true;

      try {
        const usersData = await userApi.getAllUsers();
        if (usersData) {
          users.value = usersData;
        }
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
        showNotification("Не удалось загрузить пользователей", "error");
      } finally {
        loading.value = false;
      }
    };

    // Обработка загрузки аватара
    const handleAvatarChange = (file: File) => {
      userAvatarFile.value = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          userAvatarPreview.value = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    };

    // Удаление аватара
    const removeAvatar = () => {
      userAvatarPreview.value = null;
      userAvatarFile.value = null;
      editingUser.value.img = undefined;
    };

    // Очистка поискового запроса
    const clearSearch = () => {
      searchQuery.value = "";
    };

    // Открытие модального окна редактирования пользователя
    const openEditModal = (user: UserData) => {
      editMode.value = true;

      // Копируем пользователя для редактирования
      editingUser.value = { ...user, password: "" };

      // Сбрасываем превью аватара
      userAvatarPreview.value = null;
      userAvatarFile.value = null;

      showEditModal.value = true;
    };

    // Открытие модального окна удаления пользователя
    const openDeleteModal = (user: UserData) => {
      deletingUser.value = user;
      showDeleteModal.value = true;
    };

    // Закрытие всех модальных окон
    const closeModals = () => {
      showEditModal.value = false;
      showDeleteModal.value = false;
    };

    // Назначение пользователя администратором
    const makeAdmin = async (user: UserData) => {
      try {
        isSubmitting.value = true;
        const updatedUser = await userApi.updateUser(user.id as number, {
          ...user,
          role: "admin",
        });

        // Обновляем пользователя в списке
        const index = users.value.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          users.value[index] = updatedUser;
        }

        showNotification(
          `Пользователь "${user.name || user.login}" назначен администратором`
        );
      } catch (error) {
        console.error("Ошибка при назначении администратором:", error);
        showNotification("Не удалось назначить администратором", "error");
      } finally {
        isSubmitting.value = false;
      }
    };

    // Снятие прав администратора
    const removeAdmin = async (user: UserData) => {
      try {
        isSubmitting.value = true;
        const updatedUser = await userApi.updateUser(user.id as number, {
          ...user,
          role: "student",
        });

        // Обновляем пользователя в списке
        const index = users.value.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          users.value[index] = updatedUser;
        }

        showNotification(
          `У пользователя "${
            user.name || user.login
          }" удалены права администратора`
        );
      } catch (error) {
        console.error("Ошибка при удалении прав администратора:", error);
        showNotification("Не удалось удалить права администратора", "error");
      } finally {
        isSubmitting.value = false;
      }
    };

    // Сохранение пользователя
    const saveUser = async (user: UserData, isAdmin: boolean) => {
      try {
        isSubmitting.value = true;

        // Устанавливаем роль в зависимости от чекбокса
        user.role = isAdmin ? "admin" : "student";

        if (editMode.value) {
          // Редактирование существующего пользователя
          const userData = {
            ...user,
            // Не отправляем пароль, если он пустой
            password: user.password || undefined,
          };

          const updatedUser = await userApi.updateUser(
            user.id as number,
            userData
          );

          // Если есть новый аватар, загружаем его
          if (userAvatarFile.value) {
            const result = await userApi.uploadAvatar(
              user.id as number,
              userAvatarFile.value
            );

            // Обновляем путь к аватару
            if (result && result.img_path) {
              updatedUser.img = result.img_path;
            }
          }

          // Обновляем пользователя в списке
          const index = users.value.findIndex((u) => u.id === updatedUser.id);
          if (index !== -1) {
            users.value[index] = updatedUser;
          }

          showNotification(
            `Пользователь "${
              updatedUser.name || updatedUser.login
            }" успешно обновлен`
          );
        }

        // Закрываем модальное окно
        closeModals();
      } catch (error) {
        console.error("Ошибка при сохранении пользователя:", error);
        showNotification("Не удалось сохранить пользователя", "error");
      } finally {
        isSubmitting.value = false;
      }
    };

    // Удаление пользователя
    const deleteUser = async () => {
      if (!deletingUser.value || !deletingUser.value.id) {
        showNotification(
          "Не удалось удалить пользователя: ID не указан",
          "error"
        );
        return;
      }

      try {
        isSubmitting.value = true;

        // Удаляем пользователя через API
        await userApi.deleteUser(deletingUser.value.id as number);

        // Удаляем пользователя из списка
        users.value = users.value.filter(
          (u) => u.id !== deletingUser.value?.id
        );

        showNotification(
          `Пользователь "${
            deletingUser.value.name || deletingUser.value.login
          }" успешно удален`
        );

        // Закрываем модальное окно
        closeModals();
      } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
        showNotification("Не удалось удалить пользователя", "error");
      } finally {
        isSubmitting.value = false;
      }
    };

    // Показ уведомления
    const showNotification = (message: string, type = "success") => {
      notification.value = {
        show: true,
        message,
        type: type as "success" | "error",
      };

      // Автоматически скрываем через 5 секунд
      setTimeout(() => {
        notification.value.show = false;
      }, 5000);
    };

    // Инициализация компонента
    onMounted(() => {
      // Проверка авторизации и прав администратора
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin");

      if (!token || isAdmin !== "true") {
        // Если пользователь не авторизован или не админ, перенаправляем на страницу входа
        router.push("/signin");
        return;
      }

      // Загрузка пользователей
      loadUsers();
    });

    return {
      API_BASE_URL,
      users,
      loading,
      searchQuery,
      userType,
      filteredUsers,
      editingUser,
      deletingUser,
      notification,
      showEditModal,
      showDeleteModal,
      editMode,
      userAvatarPreview,
      isSubmitting,
      clearSearch,
      handleAvatarChange,
      removeAvatar,
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

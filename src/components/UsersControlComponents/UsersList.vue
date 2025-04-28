<template>
  <div class="users-list">
    <div v-if="loading" class="users-list__loader">
      <slot name="loader"></slot>
    </div>
    <div v-else-if="users.length > 0" class="users-list__users">
      <UserItem
        v-for="user in users"
        :key="user.id"
        :user="user"
        :api-base-url="apiBaseUrl"
        @make-admin="$emit('make-admin', $event)"
        @remove-admin="$emit('remove-admin', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
    <div v-else class="users-list__empty">
      <slot name="empty-state"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { UserData } from "@/types";
import UserItem from "./UserItem.vue";

export default defineComponent({
  name: "UsersList",
  components: {
    UserItem,
  },
  props: {
    users: {
      type: Array as PropType<UserData[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    apiBaseUrl: {
      type: String,
      required: true,
    },
  },
  emits: ["make-admin", "remove-admin", "edit", "delete"],
});
</script>

<style scoped lang="scss">
.users-list {
  display: flex;
  flex-direction: column;
  width: 100%;

  &__users {
    display: flex;
    flex-direction: column;
    gap: 1.042vw;
  }

  &__loader,
  &__empty {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 20.833vw;
  }
}
</style>

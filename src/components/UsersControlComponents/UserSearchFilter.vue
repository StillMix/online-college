<template>
  <div class="user-search-filter">
    <div class="user-search-filter__search">
      <img
        alt="icon"
        src="@/assets/search.svg"
        class="user-search-filter__search__img"
      />
      <input
        class="user-search-filter__search__input"
        placeholder="Поиск пользователей"
        :value="searchQuery"
        @input="
          $emit('update:searchQuery', ($event.target as HTMLInputElement).value)
        "
      />
      <button
        v-if="searchQuery"
        class="user-search-filter__search__clear"
        @click="$emit('clear-search')"
      >
        ×
      </button>
    </div>

    <div class="user-search-filter__tabs">
      <button
        class="user-search-filter__tabs__button"
        :class="{
          'user-search-filter__tabs__button--active': userType === 'all',
        }"
        @click="$emit('update:userType', 'all')"
      >
        Все пользователи
      </button>
      <button
        class="user-search-filter__tabs__button"
        :class="{
          'user-search-filter__tabs__button--active': userType === 'admin',
        }"
        @click="$emit('update:userType', 'admin')"
      >
        Администраторы
      </button>
      <button
        class="user-search-filter__tabs__button"
        :class="{
          'user-search-filter__tabs__button--active': userType === 'user',
        }"
        @click="$emit('update:userType', 'user')"
      >
        Обычные пользователи
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserSearchFilter",
  props: {
    searchQuery: {
      type: String,
      default: "",
    },
    userType: {
      type: String,
      default: "all",
    },
  },
  emits: ["update:searchQuery", "update:userType", "clear-search"],
});
</script>

<style scoped lang="scss">
.user-search-filter {
  display: flex;
  flex-direction: column;
  gap: 1.563vw;
  margin-bottom: 1.563vw;

  &__search {
    position: relative;
    width: 100%;
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

  &__tabs {
    display: flex;
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
}
</style>

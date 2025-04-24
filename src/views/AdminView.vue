<template>
  <div class="adminView">
    <Header />
    <div class="adminView__container">
      <h1 class="adminView__title">Панель администрирования</h1>

      <div class="adminView__tabs">
        <button
          class="adminView__tabs__button"
          :class="{
            'adminView__tabs__button--active': activeTab === 'courses',
          }"
          @click="activeTab = 'courses'"
        >
          Управление курсами
        </button>
        <button
          class="adminView__tabs__button"
          :class="{ 'adminView__tabs__button--active': activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          Управление пользователями
        </button>
      </div>

      <div class="adminView__content">
        <CourseControl v-if="activeTab === 'courses'" />
        <UsersControl v-if="activeTab === 'users'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Header from "@/components/Header.vue";
import CourseControl from "@/components/CourseControl.vue";
import UsersControl from "@/components/UsersControl.vue";

export default defineComponent({
  name: "AdminView",
  components: {
    Header,
    CourseControl,
    UsersControl,
  },
  setup() {
    const activeTab = ref("courses");

    return {
      activeTab,
    };
  },
});
</script>

<style scoped lang="scss">
.adminView {
  width: 100%;
  min-height: 100vh;

  &__container {
    width: 71.615vw;
    max-width: 71.615vw;
    margin: 0 auto;
    padding: 1.563vw 0;
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 1.5vw;
    color: #fff;
    margin-bottom: 1.5vw;
  }

  &__tabs {
    display: flex;
    margin-bottom: 1.563vw;
    border-bottom: 0.052vw solid rgba(255, 255, 255, 0.1);

    &__button {
      padding: 0.781vw 1.563vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      color: rgba(255, 255, 255, 0.7);
      background: transparent;
      border-bottom: 0.156vw solid transparent;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        color: #fff;
      }

      &--active {
        color: #08dccf;
        border-bottom-color: #08dccf;
      }
    }
  }

  &__content {
    min-height: 30vw;
  }
}
</style>

<template>
  <div class="auth-layout">
    <AppLoader :is-visible="isLoading" loading-text="Загрузка приложения..." />
    <img class="auth-layout__img" src="@/assets/kktsID.svg" />
    <div class="auth-layout__content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import AppLoader from "@/components/Loader.vue";

export default defineComponent({
  name: "AuthLayout",
  components: {
    AppLoader,
  },
  setup() {
    const isLoading = ref(true);

    onMounted(() => {
      // Имитация начальной загрузки приложения
      setTimeout(() => {
        isLoading.value = false;
      }, 10);
    });

    return {
      isLoading,
    };
  },
});
</script>

<style scoped lang="scss">
.auth-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

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

  &__content {
    position: relative;
    perspective: 1000px;
    width: 25vw;
    height: auto;
  }
}
</style>

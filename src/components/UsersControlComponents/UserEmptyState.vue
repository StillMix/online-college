<template>
  <div class="user-empty-state">
    <div class="user-empty-state__con">
      <img
        class="user-empty-state__con-icon"
        src="@/assets/nosignin.svg"
        alt="Нет пользователей"
      />
      <p class="user-empty-state__con-text">{{ message }}</p>
    </div>
    <slot name="action"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserEmptyState",
  props: {
    message: {
      type: String,
      default: "Пользователи не найдены",
    },
  },
});
</script>

<style scoped lang="scss">
.user-empty-state {
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
}
</style>

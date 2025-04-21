<template>
  <div class="not-found">
    <div class="not-found__content">
      <div class="not-found__error">
        <div class="not-found__code">404</div>
        <h1 class="not-found__title">Страница не найдена</h1>
        <p class="not-found__description">
          Извините, запрашиваемая страница не существует или была перемещена.
        </p>
      </div>

      <div class="not-found__actions">
        <router-link
          to="/"
          class="not-found__button not-found__button--primary"
        >
          Вернуться на главную
        </router-link>
        <router-link
          to="/course"
          class="not-found__button not-found__button--secondary"
        >
          Перейти к курсам
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NotFoundView",
});
</script>

<style scoped lang="scss">
.not-found {
  width: 100%;

  &__content {
    width: 71.615vw;
    max-width: 71.615vw;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 4.583vw);
    padding: 2.604vw 0;
  }

  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2.604vw;
    animation: fadeIn 0.8s ease-out;
  }

  &__code {
    font-family: var(--font-family);
    font-weight: 700;
    font-size: 9.375vw;
    color: #08dccf;
    text-shadow: 0 0 1.042vw rgba(8, 220, 207, 0.7);
    margin-bottom: 1.563vw;
    animation: pulse 4s ease-in-out infinite;
    background: linear-gradient(90deg, #08dccf, #0099ff, #08dccf);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 2.083vw;
    color: #fff;
    margin-bottom: 1.042vw;
    text-align: center;
    animation: fadeInUp 0.8s ease-out 0.3s backwards;
  }

  &__description {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 1.042vw;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    max-width: 36.458vw;
    line-height: 1.5;
    animation: fadeInUp 0.8s ease-out 0.6s backwards;
  }

  &__actions {
    display: flex;
    gap: 1.042vw;
    animation: fadeInUp 0.8s ease-out 0.9s backwards;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.781vw 1.563vw;
    border-radius: 7.292vw;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.938vw;
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-0.104vw);
    }

    &:active {
      transform: translateY(0.052vw);
    }

    &--primary {
      background: #39b874;
      color: #fff;

      &:hover {
        background: #45cc83;
        box-shadow: 0 0.26vw 0.781vw rgba(57, 184, 116, 0.4);
      }
    }

    &--secondary {
      background: #363636;
      color: #fff;

      &:hover {
        background: #424242;
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(1.563vw);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes backgroundMove {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
</style>

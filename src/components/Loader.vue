<template>
  <div class="loader-container" v-if="isVisible">
    <div class="pulse-container">
      <div
        v-for="(image, index) in currentImages"
        :key="`image-${index}`"
        class="image-item"
        :class="[
          `image-position-${index}`,
          { 'fade-in': imageTransitions[index] },
          { 'scale-out': exitTransitions[index] },
        ]"
      >
        <img
          :src="require(`@/assets/loader/${image.group}.${image.number}.svg`)"
          alt="Загрузка"
          class="loader-image"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";

interface ImageItem {
  group: number;
  number: number;
}

export default defineComponent({
  name: "SmoothLoader",
  props: {
    isVisible: {
      type: Boolean,
      default: true,
    },
    loadingText: {
      type: String,
      default: "Загрузка...",
    },
  },
  setup() {
    // Максимальные значения для каждой группы изображений
    const maxValues = [5, 6, 6]; // для групп 1, 2, 3

    // Текущие отображаемые изображения
    const currentImages = ref<ImageItem[]>([
      { group: 1, number: 1 },
      { group: 2, number: 1 },
      { group: 3, number: 1 },
    ]);

    // Состояния анимаций
    const imageTransitions = reactive([false, false, false]);
    const exitTransitions = reactive([false, false, false]);

    // Направление анимации
    const animationDirection = ref(true); // true = вверх, false = вниз

    // Индексы для обновления изображений
    let updateIndex = 0;
    let animationTimer: number | null = null;

    // Функция для получения следующего номера изображения
    const getNextNumber = (group: number, current: number): number => {
      const max = maxValues[group - 1];
      if (animationDirection.value) {
        return current < max ? current + 1 : max;
      } else {
        return current > 1 ? current - 1 : 1;
      }
    };

    // Проверка, достигли ли мы предела
    const isAtLimit = computed(() => {
      if (animationDirection.value) {
        return currentImages.value.every(
          (img) => img.number === maxValues[img.group - 1]
        );
      } else {
        return currentImages.value.every((img) => img.number === 1);
      }
    });

    // Функция для обновления изображений
    const updateImage = async (index: number) => {
      // Применяем анимацию исчезновения
      exitTransitions[index] = true;

      // Ждем завершения анимации исчезновения
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Обновляем номер изображения
      const currentGroup = currentImages.value[index].group;
      const currentNumber = currentImages.value[index].number;
      const nextNumber = getNextNumber(currentGroup, currentNumber);

      // Обновляем только если есть изменение
      if (nextNumber !== currentNumber) {
        currentImages.value[index] = {
          group: currentGroup,
          number: nextNumber,
        };

        // Сбрасываем анимации
        exitTransitions[index] = false;
        imageTransitions[index] = false;

        // Запускаем анимацию появления после небольшой задержки
        setTimeout(() => {
          imageTransitions[index] = true;
        }, 50);

        return true; // Изображение обновлено
      }

      // Сбрасываем анимацию исчезновения без обновления
      exitTransitions[index] = false;
      return false; // Изображение не обновлено (достигнут предел)
    };

    // Функция для анимации
    const animate = async () => {
      // Если достигли предела, меняем направление
      if (isAtLimit.value) {
        animationDirection.value = !animationDirection.value;
        return;
      }

      // Обновляем текущий индекс
      const updated = await updateImage(updateIndex);

      // Переходим к следующему индексу
      if (animationDirection.value) {
        // При движении вверх: 0 -> 1 -> 2
        updateIndex = (updateIndex + 1) % 3;
      } else {
        // При движении вниз: 2 -> 1 -> 0
        updateIndex = updateIndex === 0 ? 2 : updateIndex - 1;
      }

      // Если все изображения достигли предела, сбрасываем
      if (!updated && isAtLimit.value) {
        animationDirection.value = !animationDirection.value;
        updateIndex = animationDirection.value ? 0 : 2;
      }
    };

    // Запуск анимации при монтировании компонента
    onMounted(() => {
      // Инициализируем анимацию появления
      setTimeout(() => {
        imageTransitions[0] = true;
        setTimeout(() => {
          imageTransitions[1] = true;
          setTimeout(() => {
            imageTransitions[2] = true;
          }, 100);
        }, 100);
      }, 100);

      // Запускаем цикл анимации через 1.5 секунды
      setTimeout(() => {
        animationTimer = window.setInterval(animate, 900);
      }, 100);
    });

    // Очистка интервала при размонтировании компонента
    onBeforeUnmount(() => {
      if (animationTimer) window.clearInterval(animationTimer);
    });

    return {
      currentImages,
      imageTransitions,
      exitTransitions,
    };
  },
});
</script>

<style scoped lang="scss">
.loader-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

.pulse-container {
  position: relative;
  width: 12vw;
  height: 3vw;
  margin-bottom: 1.5vw;
}

.image-item {
  position: absolute;
  top: 0;
  opacity: 0;
  transform: scale(0.7);
  transition: all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.image-position-0 {
  left: 0;
}

.image-position-1 {
  left: calc(50% - 1.25vw);
}

.image-position-2 {
  right: 0;
}

.fade-in {
  opacity: 1;
  transform: scale(1);
}

.scale-out {
  opacity: 0;
  transform: scale(1.3);
}

.loader-image {
  width: 2.5vw;
  height: auto;
}

.loading-text {
  color: #f0f0f0;
  font-size: 1.2vw;
  font-weight: 300;
  letter-spacing: 0.08em;
  margin-top: 1vw;
  opacity: 0.8;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.9;
  }
  100% {
    opacity: 0.5;
  }
}
</style>

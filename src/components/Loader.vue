<template>
  <div class="loader-container" v-if="isVisible">
    <div class="cube-container">
      <div class="cube" :class="{ 'rotate-cube': oneRotating }">
        <div class="cube-face cube-front">
          <img
            :src="require(`@/assets/loader/1.${oneImageNumber}.svg`)"
            alt="Загрузка"
            class="loader-image"
          />
        </div>
        <div class="cube-face cube-back">
          <img
            :src="require(`@/assets/loader/1.${oneNextNumber}.svg`)"
            alt="Загрузка"
            class="loader-image"
          />
        </div>
      </div>
    </div>

    <div class="cube-container">
      <div class="cube" :class="{ 'rotate-cube': twoRotating }">
        <div class="cube-face cube-front">
          <img
            :src="require(`@/assets/loader/2.${twoImageNumber}.svg`)"
            alt="Загрузка"
            class="loader-image"
          />
        </div>
        <div class="cube-face cube-back">
          <img
            :src="require(`@/assets/loader/2.${twoNextNumber}.svg`)"
            alt="Загрузка"
            class="loader-image"
          />
        </div>
      </div>
    </div>

    <div class="cube-container">
      <div class="cube" :class="{ 'rotate-cube': threeRotating }">
        <div class="cube-face cube-front">
          <img
            :src="require(`@/assets/loader/3.${threeImageNumber}.svg`)"
            alt="Загрузка"
            class="loader-image"
          />
        </div>
        <div class="cube-face cube-back">
          <img
            :src="require(`@/assets/loader/3.${threeNextNumber}.svg`)"
            alt="Загрузка"
            class="loader-image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";

export default defineComponent({
  name: "AppLoader",
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
    const oneImageNumber = ref(1);
    const twoImageNumber = ref(1);
    const threeImageNumber = ref(1);

    const oneNextNumber = ref(2);
    const twoNextNumber = ref(2);
    const threeNextNumber = ref(2);

    const oneRotating = ref(false);
    const twoRotating = ref(false);
    const threeRotating = ref(false);

    // Максимальные значения для каждого изображения
    const oneMax = 5;
    const twoMax = 6;
    const threeMax = 6;

    // Направление анимации (true = вверх/увеличение, false = вниз/уменьшение)
    const animationDirection = ref(true);

    let animationTimer: number | null = null;
    let currentImageToUpdate = 0; // 0 = первое, 1 = второе, 2 = третье

    // Функция для получения максимального значения в зависимости от индекса
    const getMaxValue = (index: number): number => {
      if (index === 0) return oneMax;
      if (index === 1) return twoMax;
      return threeMax;
    };

    // Получение следующего номера в зависимости от направления
    const getNextNumber = (current: number, max: number, goingUp: boolean) => {
      if (goingUp) {
        return current < max ? current + 1 : max;
      } else {
        return current > 1 ? current - 1 : 1;
      }
    };

    // Функция для вращения куба с задержкой
    const rotateCube = async (
      cubeIndex: number,
      currentRef: any,
      nextRef: any,
      rotatingRef: any
    ) => {
      const maxValue = getMaxValue(cubeIndex);
      const next = getNextNumber(
        currentRef.value,
        maxValue,
        animationDirection.value
      );

      if (next === currentRef.value) {
        // Если достигли предела, меняем направление для всей анимации
        if (
          (animationDirection.value && cubeIndex === 2 && next === maxValue) ||
          (!animationDirection.value && cubeIndex === 0 && next === 1)
        ) {
          animationDirection.value = !animationDirection.value;
        }
        return false; // Нет изменений
      }

      nextRef.value = next;
      rotatingRef.value = true;

      // Ждем завершения анимации вращения
      await new Promise((resolve) => setTimeout(resolve, 500));

      currentRef.value = next;
      rotatingRef.value = false;
      return true; // Изменения произошли
    };

    // Функция для обновления анимации
    const updateAnimation = async () => {
      let updated = false;

      if (animationDirection.value) {
        // Порядок обновления при движении вверх: 0 -> 1 -> 2
        if (currentImageToUpdate === 0) {
          updated = await rotateCube(
            0,
            oneImageNumber,
            oneNextNumber,
            oneRotating
          );
          currentImageToUpdate = 1;
        } else if (currentImageToUpdate === 1) {
          updated = await rotateCube(
            1,
            twoImageNumber,
            twoNextNumber,
            twoRotating
          );
          currentImageToUpdate = 2;
        } else {
          updated = await rotateCube(
            2,
            threeImageNumber,
            threeNextNumber,
            threeRotating
          );
          currentImageToUpdate = 0;
        }
      } else {
        // Порядок обновления при движении вниз: 2 -> 1 -> 0
        if (currentImageToUpdate === 2) {
          updated = await rotateCube(
            2,
            threeImageNumber,
            threeNextNumber,
            threeRotating
          );
          currentImageToUpdate = 1;
        } else if (currentImageToUpdate === 1) {
          updated = await rotateCube(
            1,
            twoImageNumber,
            twoNextNumber,
            twoRotating
          );
          currentImageToUpdate = 0;
        } else {
          updated = await rotateCube(
            0,
            oneImageNumber,
            oneNextNumber,
            oneRotating
          );
          currentImageToUpdate = 2;
        }
      }

      // Если все кубы достигли предела, переключаем направление
      if (!updated) {
        if (
          (animationDirection.value &&
            oneImageNumber.value === oneMax &&
            twoImageNumber.value === twoMax &&
            threeImageNumber.value === threeMax) ||
          (!animationDirection.value &&
            oneImageNumber.value === 1 &&
            twoImageNumber.value === 1 &&
            threeImageNumber.value === 1)
        ) {
          animationDirection.value = !animationDirection.value;
          if (animationDirection.value) {
            currentImageToUpdate = 0; // Начинаем с первого при движении вверх
          } else {
            currentImageToUpdate = 2; // Начинаем с третьего при движении вниз
          }
        }
      }
    };

    // Функция для запуска анимации
    const startAnimation = () => {
      animationTimer = window.setInterval(() => {
        updateAnimation();
      }, 1000); // Задержка в 1 секунду между изменениями
    };

    // Запуск анимации при монтировании компонента
    onMounted(() => {
      startAnimation();
    });

    // Очистка интервала при размонтировании компонента
    onBeforeUnmount(() => {
      if (animationTimer) clearInterval(animationTimer);
    });

    return {
      oneImageNumber,
      twoImageNumber,
      threeImageNumber,
      oneNextNumber,
      twoNextNumber,
      threeNextNumber,
      oneRotating,
      twoRotating,
      threeRotating,
    };
  },
});
</script>

<style scoped lang="scss">
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.042vw;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #212121;
  z-index: 9999;
}

.cube-container {
  perspective: 800px;
  width: 2.5vw;
  height: 2.5vw;
}

.cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.cube.rotate-cube {
  transform: rotateX(-180deg);
}

.cube-face {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  backface-visibility: hidden;
}

.cube-front {
  transform: rotateX(0deg);
}

.cube-back {
  transform: rotateX(180deg);
}

.loader-image {
  width: 2.5vw;
  height: auto;
}
</style>

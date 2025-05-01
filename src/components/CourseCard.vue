<template>
  <div
    class="courseCardes"
    @click="handleClick"
    :style="{ backgroundColor: course.color }"
  >
    <div class="courseCardes__header">
      <img
        class="courseCardes__header__img"
        :src="geticonTypeSrc()"
        alt="Course type icon"
      />
      <div class="courseCardes__header__con">
        <p class="courseCardes__header__con__title">{{ course.type }}</p>
        <p class="courseCardes__header__con__subtitle">
          {{ course.timetoendL }}
        </p>
      </div>
    </div>
    <img
      class="courseCardes__img"
      :src="`https://stillmix-online-college-fastapi-e9c2.twc1.net/${course.icon}`"
      alt="Course icon"
    />
    <div class="courseCardes__info">
      <p class="courseCardes__info__title">{{ course.title }}</p>
      <p class="courseCardes__info__subtitle">{{ course.subtitle }}</p>
    </div>
    <div class="courseCardes__overlay"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { CourseItem } from "@/types";

export default defineComponent({
  name: "CourseCard",
  props: {
    course: {
      type: Object as PropType<CourseItem>,
      required: true,
    },
    courseVib: {
      type: Object as PropType<CourseItem | null>,
      default: null,
    },
  },
  methods: {
    handleClick() {
      this.$emit("courseSelected", this.course);
    },
    getIconSrc() {
      try {
        return require(`https://stillmix-online-college-fastapi-e9c2.twc1.net/${this.course.icon}`);
      } catch (error) {
        console.error(`Иконка ${this.course.icon} не найдена:`, error);
        return "";
      }
    },
    geticonTypeSrc() {
      try {
        return require(`@/assets/${this.course.icontype}.svg`);
      } catch (error) {
        console.error(`Иконка ${this.course.icontype} не найдена:`, error);
        return "";
      }
    },
  },
});
</script>

<style scoped lang="scss">
.courseCardes {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
  position: relative;
  border-radius: 0.521vw;
  width: 17.396vw;
  height: 19.219vw;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform, box-shadow;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at 50% 30%,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(0, 0, 0, 0) 70%
    );
    opacity: 0;
    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
    pointer-events: none;
  }

  &__header {
    display: flex;
    margin-top: 0.938vw;
    margin-left: 1.094vw;
    gap: 0.521vw;
    position: relative;
    z-index: 2;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);

    &__con {
      &__title {
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 0.625vw;
        color: #fff;
        transition: font-size 0.3s ease;
      }
      &__subtitle {
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 0.521vw;
        color: #fff;
        opacity: 0.7;
        transition: opacity 0.3s ease;
      }
    }
    &__img {
      width: 1.25vw;
      height: 1.25vw;
      transition: transform 0.3s ease;
    }
  }
  &__img {
    width: 16.302vw;
    height: 16.302vw;
    opacity: 0.3;
    position: absolute;
    bottom: 3.333vw;
    right: -3.438vw;
    transform: rotate(8deg);
    transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  &__info {
    position: absolute;
    bottom: -0.052vw;
    z-index: 2;
    background: #2a2a2a;
    height: 7.448vw;
    width: 100%;
    padding-left: 1.042vw;
    display: flex;
    flex-direction: column;
    justify-content: end;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, height, background;

    &__title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 0.833vw;
      color: #fff;
      margin-bottom: 0px;
      width: 15.833vw;
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform, color;
    }
    &__subtitle {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: 0.625vw;
      line-height: 125%;
      color: #949494;
      margin-bottom: 1.042vw;
      width: 15.833vw;
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform, opacity;
    }
  }

  &:hover {
    transform: translateY(-0.3vw) scale(1.02);
    box-shadow: 0 0.521vw 1.5vw rgba(0, 0, 0, 0.25);

    .courseCardes__overlay {
      opacity: 1;
    }

    .courseCardes__header {
      transform: translateY(0.15vw);

      &__img {
        transform: scale(1.1) rotate(-5deg);
      }

      &__con__subtitle {
        opacity: 1;
      }
    }

    .courseCardes__img {
      opacity: 0.4;
      transform: rotate(12deg) scale(1.05) translateX(-0.5vw);
    }

    .courseCardes__info {
      transform: translateY(0);
      height: 7.8vw;

      &__title {
        transform: translateY(-0.2vw);
        color: #ffffff;
      }

      &__subtitle {
        transform: translateY(-0.15vw);
        opacity: 0.9;
      }
    }
  }

  /* Добавим анимацию нажатия */
  &:active {
    transform: translateY(-0.1vw) scale(0.98);
    transition: all 0.25s cubic-bezier(0.33, 1, 0.68, 1);

    .courseCardes__img {
      transform: rotate(6deg) scale(0.98);
      transition: all 0.25s cubic-bezier(0.33, 1, 0.68, 1);
    }

    .courseCardes__info {
      transition: all 0.25s cubic-bezier(0.33, 1, 0.68, 1);
    }
  }
}
</style>

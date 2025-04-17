<template>
  <div class="header">
    <img alt="kktslogo" class="header__logo" src="../assets/logo.png" />
    <div class="header__navs">
      <div class="header__navs__indicator" :style="indicatorStyle"></div>
      <router-link
        to="/"
        class="header__navs__link"
        active-class="header__navs__link__active"
        exact
        @mouseenter="onHoverLink('main')"
        @mouseleave="onLeaveLink"
      >
        <img
          class="header__navs__link__img"
          alt="icon"
          :src="
            $route.path === '/'
              ? require('../assets/linkIcon/mainActive.svg')
              : require('../assets/linkIcon/main.svg')
          "
        />ГЛАВНАЯ
      </router-link>
      <router-link
        v-if="token"
        to="/course"
        class="header__navs__link"
        active-class="header__navs__link__active"
        @mouseenter="onHoverLink('course')"
        @mouseleave="onLeaveLink"
      >
        <img
          class="header__navs__link__img"
          alt="icon"
          :src="
            $route.path === '/course'
              ? require('../assets/linkIcon/courseActive.svg')
              : require('../assets/linkIcon/course.svg')
          "
        />МОИ КУРСЫ
      </router-link>
      <div v-if="token" class="header__navs__razdel"></div>
      <router-link
        v-if="token"
        to="/pod"
        class="header__navs__link"
        active-class="header__navs__link__active"
        @mouseenter="onHoverLink('pod')"
        @mouseleave="onLeaveLink"
      >
        <img
          alt="icon"
          class="header__navs__link__img"
          :src="
            $route.path === '/pod'
              ? require('../assets/linkIcon/podActive.svg')
              : require('../assets/linkIcon/pod.svg')
          "
        />ПОДДЕРЖКА
      </router-link>
    </div>
    <div class="header__acc__sign" v-if="token">
      <p class="header__acc__sign__title">TESTUSERNICKNAME</p>
      <img
        alt="accImg"
        class="header__acc__sign__img"
        src="../assets/testimg.png"
      />
    </div>
    <div class="header__acc" v-if="!token">
      <p class="header__acc__title">
        ВХОД В АККАУНТ НЕ ВЫПОЛНЕН.
        <router-link to="/signin" class="header__acc__title__link"
          >ВОЙТИ</router-link
        >?
      </p>
      <img alt="accImg" class="header__acc__img" src="../assets/nosignin.svg" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "AppHeader",
  setup() {
    const route = useRoute();
    const currentLink = ref("");
    const hoveredLink = ref("");
    const isHovered = ref(false);
    const indicatorPosition = ref({ left: 0, width: 0 });
    const token = ref<string | null>(localStorage.getItem("token"));

    const updateIndicatorPosition = (linkName: string) => {
      const linkElement = document.querySelector(
        `.header__navs__link[to$="${linkMap[linkName] || "/"}"]`
      ) as HTMLElement;

      if (linkElement) {
        const parentLeft = (linkElement.parentElement as HTMLElement)
          .offsetLeft;
        indicatorPosition.value = {
          left: linkElement.offsetLeft - parentLeft,
          width: linkElement.offsetWidth,
        };
      }
    };

    const linkMap: Record<string, string> = {
      main: "/",
      course: "/course",
      pod: "/pod",
    };

    const currentRoutePath = computed(() => {
      if (route.path === "/") return "main";
      if (route.path === "/course") return "course";
      if (route.path === "/pod") return "pod";
      return "";
    });

    const indicatorStyle = computed(() => {
      return {
        left: `${indicatorPosition.value.left}px`,
        width: `${indicatorPosition.value.width}px`,
        opacity: currentLink.value ? "1" : "0",
      };
    });

    const setCurrentLink = () => {
      currentLink.value = currentRoutePath.value;
      updateIndicatorPosition(currentLink.value);
    };

    const onHoverLink = (link: string) => {
      hoveredLink.value = link;
      isHovered.value = true;
      updateIndicatorPosition(link);
    };

    const onLeaveLink = () => {
      isHovered.value = false;
      updateIndicatorPosition(currentLink.value);
    };

    watch(
      () => route.path,
      () => {
        setCurrentLink();
      }
    );

    onMounted(() => {
      setCurrentLink();
    });

    return {
      token,
      indicatorStyle,
      onHoverLink,
      onLeaveLink,
    };
  },
});
</script>

<style scoped lang="scss">
.header {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: flex;
  align-items: center;
  height: 4.583vw;
  position: relative;
  overflow: hidden;

  &__logo {
    width: 12.448vw;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__navs {
    margin-left: 2.604vw;
    display: flex;
    align-items: center;
    gap: 2.083vw;
    position: relative;

    &__indicator {
      position: absolute;
      bottom: -0.8vw;
      height: 0.2vw;
      background: linear-gradient(90deg, #08dccf, #0099ff, #08dccf);
      background-size: 200% 100%;
      border-radius: 0.2vw;
      transition: all 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6);
      animation: glow 2s infinite alternate;
      box-shadow: 0 0 0.521vw rgba(8, 220, 207, 0.7);
      z-index: 1;
    }

    &__razdel {
      border-radius: 1.563vw;
      width: 0.104vw;
      height: 1.406vw;
      background: #909090;
      position: relative;
      overflow: hidden;

      &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 30%;
        background: rgba(255, 255, 255, 0.3);
        top: 0;
        left: -100%;
        animation: shine 3s infinite;
      }
    }

    &__link {
      display: flex;
      cursor: pointer;
      align-items: center;
      gap: 0.521vw;
      color: #909090;
      padding: 0.5vw 0.8vw;
      border-radius: 0.5vw;
      transition: all 0.3s ease;
      position: relative;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(8, 220, 207, 0.1);
        border-radius: 0.5vw;
        opacity: 0;
        transform: scale(0.9);
        transition: all 0.3s ease;
      }

      &:hover {
        color: #ffffff;
        transform: translateY(-0.104vw);

        &::before {
          opacity: 1;
          transform: scale(1);
        }

        .header__navs__link__img {
          transform: rotate(5deg) scale(1.15);
        }
      }

      &__img {
        width: 1.25vw;
        height: 1.25vw;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      &__active {
        display: flex;
        align-items: center;
        gap: 0.521vw;
        color: #ffffff;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        .header__navs__link__img {
          animation: pulse 2s infinite;
        }
      }
    }
  }

  &__acc {
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: 0;
    transition: all 0.3s ease;

    &:hover {
      transform: translateX(-0.26vw);
    }
    &__sign {
      display: flex;
      align-items: center;
      margin-left: auto;
      margin-right: 0;
      gap: 0.521vw;
      padding: 0.5vw;
      border-radius: 0.8vw;
      transition: all 0.3s cubic-bezier(0.68, -0.6, 0.32, 1.6);
      cursor: pointer;
      &:hover {
        background: rgba(8, 220, 207, 0.1);
        transform: translateY(-0.15vw);

        .header__acc__sign__img {
          transform: scale(1.1);
          box-shadow: 0 0 0.8vw rgba(8, 220, 207, 0.5);
        }

        .header__acc__sign__title {
          opacity: 1;
          color: #08dccf;
        }
      }
      &__title {
        font-family: var(--font-family);
        font-weight: 500;
        font-size: 0.729vw;
        text-align: right;
        color: #fff;
        opacity: 0.5;
      }
      &__img {
        border-radius: 42.708vw;
        width: 1.25vw;
        height: 1.25vw;
        object-fit: cover;
      }
    }
    &__title {
      max-width: 15.104vw;
      color: #909090;
      transition: all 0.3s ease;

      &__link {
        color: #08dccf;
        position: relative;
        transition: all 0.3s ease;

        &::after {
          content: "";
          position: absolute;
          width: 0;
          height: 0.052vw;
          bottom: -0.104vw;
          left: 0;
          background: linear-gradient(90deg, #08dccf, #0099ff);
          transition: width 0.3s ease;
        }

        &:hover {
          color: #0099ff;
          text-shadow: 0 0 0.417vw rgba(8, 220, 207, 0.5);

          &::after {
            width: 100%;
          }
        }
      }
    }

    &__img {
      width: 1.25vw;
      height: 1.25vw;
      margin-left: 0.5vw;
      transition: all 0.5s ease;

      &:hover {
        transform: rotate(360deg);
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes glow {
  0% {
    background-position: 0% 50%;
    box-shadow: 0 0 0.26vw rgba(8, 220, 207, 0.5);
  }
  100% {
    background-position: 100% 50%;
    box-shadow: 0 0 0.781vw rgba(8, 220, 207, 0.8);
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  20% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}
</style>

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
    <div class="header__acc__sign" v-if="token" @click.stop="toggleDropdown">
      <p class="header__acc__sign__title">TESTUSERNICKNAME</p>
      <img
        alt="accImg"
        class="header__acc__sign__img"
        src="../assets/testimg.png"
      />
      <!-- Выпадающее меню -->
      <transition name="fade">
        <div class="header__acc__dropdown" v-show="isDropdownVisible">
          <router-link to="/settings" class="header__acc__dropdown__item">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="header__acc__dropdown__item__icon"
            >
              <path
                d="M9.95 19.4L8.8 16.1C8.38333 15.9667 7.98333 15.8 7.6 15.6C7.21667 15.4 6.85 15.1833 6.5 14.95L3.35 16.2L1.5 13L4.25 11C4.23333 10.8167 4.225 10.6333 4.225 10.45C4.225 10.2667 4.23333 10.0833 4.25 9.9L1.5 7.95L3.35 4.8L6.5 5.95C6.85 5.71667 7.21667 5.5 7.6 5.3C7.98333 5.1 8.38333 4.93333 8.8 4.8L9.95 1.6H13.65L14.8 4.8C15.2333 4.93333 15.6417 5.1 16.025 5.3C16.4083 5.5 16.7667 5.71667 17.1 5.95L20.35 4.8L22.2 7.9L19.4 9.85C19.4167 10.05 19.425 10.2417 19.425 10.425C19.425 10.6083 19.4167 10.7917 19.4 10.975L22.15 12.95L20.35 16.05L17.1 14.95C16.7667 15.1833 16.4083 15.4 16.025 15.6C15.6417 15.8 15.2333 15.9667 14.8 16.1L13.65 19.4H9.95ZM11.8 13.9C12.8 13.9 13.6417 13.5583 14.325 12.875C15.0083 12.1917 15.35 11.35 15.35 10.35C15.35 9.35 15.0083 8.50833 14.325 7.825C13.6417 7.14167 12.8 6.8 11.8 6.8C10.8 6.8 9.95833 7.14167 9.275 7.825C8.59167 8.50833 8.25 9.35 8.25 10.35C8.25 11.35 8.59167 12.1917 9.275 12.875C9.95833 13.5583 10.8 13.9 11.8 13.9Z"
                fill="white"
              />
            </svg>
            Настройки
          </router-link>
          <div class="header__acc__dropdown__separator"></div>
          <div class="header__acc__dropdown__item" @click.stop="logout">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="header__acc__dropdown__item__icon"
            >
              <path
                d="M15.325 16.275L14.05 15L16.05 13H8.5V11H16.05L14.05 9L15.325 7.725L19.6 12L15.325 16.275ZM11.5 20C10.95 20 10.4792 19.8042 10.0875 19.4125C9.69583 19.0208 9.5 18.55 9.5 18V16H11.5V18H18.5V6H11.5V8H9.5V6C9.5 5.45 9.69583 4.97917 10.0875 4.5875C10.4792 4.19583 10.95 4 11.5 4H18.5C19.05 4 19.5208 4.19583 19.9125 4.5875C20.3042 4.97917 20.5 5.45 20.5 6V18C20.5 18.55 20.3042 19.0208 19.9125 19.4125C19.5208 19.8042 19.05 20 18.5 20H11.5ZM5.5 16V13H7.5V16H5.5ZM5.5 11V8H7.5V11H5.5Z"
                fill="#FF5B5B"
              />
            </svg>
            Выйти
          </div>
        </div>
      </transition>
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
import {
  defineComponent,
  computed,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
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
    const isDropdownVisible = ref(false);

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

    // Функция для открытия/закрытия выпадающего меню
    const toggleDropdown = () => {
      isDropdownVisible.value = !isDropdownVisible.value;
      console.log("Dropdown visibility toggled:", isDropdownVisible.value);
    };

    // Функция для выхода из аккаунта
    const logout = () => {
      console.log("Logging out...");
      // Удаляем токен из localStorage
      localStorage.removeItem("token");
      // Обновляем состояние
      token.value = null;
      // Закрываем выпадающее меню
      isDropdownVisible.value = false;
    };

    // Обработчик клика вне выпадающего меню для его закрытия
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector(".header__acc__dropdown");
      const accountElement = document.querySelector(".header__acc__sign");

      if (
        isDropdownVisible.value &&
        dropdown &&
        accountElement &&
        !dropdown.contains(event.target as Node) &&
        !accountElement.contains(event.target as Node)
      ) {
        isDropdownVisible.value = false;
      }
    };

    watch(
      () => route.path,
      () => {
        setCurrentLink();
      }
    );

    onMounted(() => {
      setCurrentLink();
      // Добавляем обработчик клика для закрытия выпадающего меню
      document.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      // Удаляем обработчик клика при размонтировании компонента
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      token,
      indicatorStyle,
      onHoverLink,
      onLeaveLink,
      isDropdownVisible,
      toggleDropdown,
      logout,
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
      position: relative;
      z-index: 100;

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

    &__dropdown {
      position: absolute;
      top: calc(100% + 0.5vw);
      right: 0;
      width: 12vw;
      background: #363636;
      border-radius: 0.8vw;
      box-shadow: 0 0.521vw 1.042vw rgba(0, 0, 0, 0.25);
      z-index: 1000;
      padding: 0.521vw 0;

      &::before {
        content: "";
        position: absolute;
        top: -0.521vw;
        right: 0.781vw;
        width: 1.042vw;
        height: 1.042vw;
        background: #363636;
        transform: rotate(45deg);
        z-index: -1;
      }

      &__item {
        display: flex;
        align-items: center;
        gap: 0.521vw;
        padding: 0.781vw 1.042vw;
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 0.833vw;
        color: #fff;
        transition: all 0.2s ease;
        cursor: pointer;

        &:hover {
          background: rgba(8, 220, 207, 0.1);

          .header__acc__dropdown__item__icon {
            transform: scale(1.1);
          }
        }

        &__icon {
          width: 1.042vw;
          height: 1.042vw;
          transition: transform 0.2s ease;
        }
      }

      &__separator {
        height: 0.052vw;
        width: 90%;
        margin: 0.26vw auto;
        background: rgba(255, 255, 255, 0.1);
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

// Animations
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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

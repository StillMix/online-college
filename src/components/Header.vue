<template>
  <div class="header">
    <img alt="kktslogo" class="header__logo" src="../assets/logo.png" />
    <div class="header__navs">
      <router-link
        to="/"
        class="header__navs__link"
        active-class="header__navs__link__active"
        exact
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
        to="/course"
        class="header__navs__link"
        active-class="header__navs__link__active"
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
      <div class="header__navs__razdel"></div>
      <router-link
        to="/pod"
        class="header__navs__link"
        active-class="header__navs__link__active"
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
    <div class="header__acc">
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
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppHeader",
});
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  height: 4.583vw;
  &__logo {
    width: 12.448vw;
  }
  &__navs {
    margin-left: 2.604vw;
    display: flex;
    align-items: center;
    gap: 2.083vw;
    &__razdel {
      border-radius: 1.563vw;
      width: 0.104vw;
      height: 1.406vw;
      background: #909090;
    }
    &__link {
      display: flex;
      cursor: pointer;
      align-items: center;
      gap: 0.521vw;
      color: #909090;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      &__img {
        width: 1.25vw;
        height: 1.25vw;
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
      }
    }
  }
  &__acc {
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: 0;
    &__title {
      max-width: 15.104vw;
      color: #909090;
      &__link {
        color: #08dccf;
      }
    }
    &__img {
      width: 1.25vw;
      height: 1.25vw;
    }
  }
}
</style>

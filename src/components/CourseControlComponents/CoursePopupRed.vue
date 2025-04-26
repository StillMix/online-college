<template>
  <div class="course-popup">
    <div class="course-popup__card">
      <CourseMainInfo :elemRed="elemRed" :edit="edit" @click="$emit('click')" />
      <template v-if="!edit">
        <CourseInfo
          v-for="info in courseInfoList"
          :key="info.id"
          :id="info.id"
          :title="info.title"
          :subtitle="info.subtitle"
        />
      </template>

      <AppButton
        :styleOverrides="{
          width: '11.177vw',
          backgroundColor: 'white',
          color: 'black',
        }"
        @click="addInfo"
      >
        Добавить информации
      </AppButton>

      <CourseSection v-if="!edit" />
      <AppButton
        :styleOverrides="{
          width: '11.177vw',
          backgroundColor: 'white',
          color: 'black',
        }"
      >
        Добавить раздел
      </AppButton>
      <AppButton
        :styleOverrides="{
          width: '11.177vw',
          backgroundColor: 'white',
          color: 'black',
        }"
        @click="$emit('click')"
      >
        Отменить
      </AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";
import { CourseItem } from "@/types";
import CourseMainInfo from "./CourseMainInfo.vue";
import CourseInfo from "./CourseInfo.vue";
import CourseSection from "./CourseSection.vue";
import { AppButton } from "../UI";
export default defineComponent({
  name: "CoursePopupRed",
  props: {
    edit: {
      type: Boolean,
      required: true,
    },
    elemRed: {
      type: Object as PropType<CourseItem>,
      required: false,
    },
  },
  emits: ["click"],
  components: { CourseMainInfo, CourseInfo, CourseSection, AppButton },
  setup(props) {
    const courseInfoList = ref<
      { id: number; title?: string; subtitle?: string }[]
    >([]);
    const nextId = ref(1);

    const addInfo = () => {
      courseInfoList.value.push({ id: nextId.value }); // только id
      nextId.value++;
    };

    onMounted(() => {
      if (
        props.elemRed &&
        props.elemRed.info &&
        props.elemRed.info.length > 0
      ) {
        console.log(props.elemRed.info);
        courseInfoList.value = props.elemRed.info.map((infoItem) => ({
          id: Number(infoItem.id), // приводим id к числу
          title: infoItem.title,
          subtitle: infoItem.subtitle,
        }));

        if (courseInfoList.value.length > 0) {
          nextId.value = Math.max(...courseInfoList.value.map((i) => i.id)) + 1;
        }
      }
    });

    return {
      courseInfoList,
      addInfo,
    };
  },
});
</script>

<style lang="scss" scoped>
.course-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(0.208vw);
  animation: fadeIn 0.3s ease;

  &__card {
    display: flex;
    flex-direction: column;
    gap: 1.042vw;
    max-height: 85vh;
    width: 60vw;
    background-color: #2a2a2a;
    border-radius: 0.833vw;
    padding: 1.563vw;
    overflow-y: auto;
    overflow-x: hidden;
    box-shadow: 0 0.521vw 2.083vw rgba(0, 0, 0, 0.5);
    animation: slideDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 0.052vw solid rgba(255, 255, 255, 0.05);
    position: relative;

    // Стилизация скроллбара
    &::-webkit-scrollbar {
      width: 0.417vw;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 0.521vw;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(8, 220, 207, 0.3);
      border-radius: 0.521vw;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(8, 220, 207, 0.5);
    }

    // Декоративный элемент в верхней части карточки
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0.208vw;
      background: linear-gradient(90deg, #08dccf, #0099ff, #39b874);
      background-size: 200% 100%;
      animation: gradientMove 3s linear infinite;
    }
  }
}

// Кнопки внутри попапа редактирования
.course-popup__button {
  padding: 0.625vw 1.25vw;
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 0.833vw;
  border-radius: 0.417vw;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.521vw;

  &--primary {
    background: #39b874;
    color: #fff;

    &:hover {
      background: #45cc83;
      transform: translateY(-0.104vw);
      box-shadow: 0 0.26vw 0.521vw rgba(57, 184, 116, 0.4);
    }
  }

  &--secondary {
    background: #363636;
    color: #fff;

    &:hover {
      background: #424242;
      transform: translateY(-0.104vw);
    }
  }

  &--danger {
    background: #363636;
    color: #ff5b5b;

    &:hover {
      background: #ff5b5b;
      color: #fff;
      transform: translateY(-0.104vw);
      box-shadow: 0 0.26vw 0.521vw rgba(255, 91, 91, 0.4);
    }
  }

  &:active {
    transform: translateY(0.052vw);
  }
}

// Анимации для попапа
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-1.042vw) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
</style>

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
  background-color: rgba(0, 0, 0, 0.397);
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;
  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    max-height: 98%;
    padding: 20px;
    width: 72.552vw;
    background-color: #404640;
    border-radius: 20px;
  }
}
</style>

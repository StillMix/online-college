<template>
  <form @submit.prevent="handleSubmit" class="course-maininfo">
    <AppInput
      v-model="title"
      :styleLabel="{
        margin: '0',
      }"
      :styleInput="{
        width: '20vw',
      }"
      type="text"
      placeholder="Название"
      required
    />
    <AppInput
      v-model="subtitle"
      :styleLabel="{
        margin: '0',
      }"
      :styleInput="{
        width: '20vw',
      }"
      type="text"
      placeholder="Подзаголовок"
      required
    />
    <select v-model="selectedType">
      <option value="ПРОГРАММИРОВАНИЕ">ПРОГРАММИРОВАНИЕ</option>
      <option value="ДИЗАЙН">ДИЗАЙН</option>
      <option value="ПАЯЛЬНИК">ПАЯЛЬНИК</option>
    </select>

    <select v-model="selectedLevel">
      <option value="С НУЛЯ">С НУЛЯ</option>
      <option value="СРЕДНИЙ">СРЕДНИЙ</option>
      <option value="ПРОДВИНУТЫЙ">ПРОДВИНУТЫЙ</option>
    </select>

    <AppInput
      v-model="titleForCourse"
      :styleLabel="{
        margin: '0',
      }"
      :styleInput="{
        width: '20vw',
      }"
      type="text"
      placeholder="Описание"
      required
    />

    <div v-if="!edit" class="course-maininfo__selImg">
      <input
        class="course-maininfo__selImg__input"
        type="file"
        accept="image/*"
        @change="onFileChange"
      />
      <p v-if="!previewUrl">Добавте изображение</p>
      <div v-if="previewUrl" class="course-maininfo__selImg__prew">
        <img
          class="course-maininfo__selImg__prew__img"
          :src="previewUrl"
          alt="Preview"
        />
      </div>
    </div>
    <AppButton
      type="submit"
      :styleOverrides="{
        width: '11.177vw',
        backgroundColor: 'white',
        color: 'black',
      }"
    >
      {{ !edit ? "Редактировать курс" : "Создать курс" }}
    </AppButton>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import { CourseItem } from "@/types";
import { AppInput, AppButton } from "../UI";
import { courseApi } from "@/api";

export default defineComponent({
  name: "CourseMainInfo",
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
  components: { AppInput, AppButton },
  setup(props) {
    const title = ref(props.elemRed ? props.elemRed.title : "");
    const subtitle = ref(props.elemRed ? props.elemRed.subtitle : "");
    const selectedType = ref(props.elemRed ? props.elemRed.type : "");
    const selectedLevel = ref(props.elemRed ? props.elemRed.timetoendL : "");
    const color = ref("#2d82b7");
    const icon = ref(props.elemRed ? props.elemRed.icon : "");
    const icontype = ref("programIcon");
    const titleForCourse = ref(
      props.elemRed ? props.elemRed.titleForCourse : ""
    );
    const info = ref([]);
    const course = ref([]);
    const previewUrl = ref<string | null>(null);

    const onFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        previewUrl.value = URL.createObjectURL(file);
      }
    };

    return {
      selectedType,
      selectedLevel,
      onFileChange,
      previewUrl,
      title,
      subtitle,
      color,
      icon,
      icontype,
      titleForCourse,
      info,
      course,
    };
  },
  methods: {
    async handleSubmit(event: Event) {
      event.preventDefault();
      try {
        const courseData = {
          title: this.title,
          subtitle: this.subtitle,
          type: this.selectedType,
          timetoendL: this.selectedLevel,
          color: this.color,
          icon: this.icon,
          icontype: this.icontype,
          titleForCourse: this.titleForCourse,
          info: this.info,
          sections: [],
        };
        const courses = await courseApi.createCourse(courseData);
        if (courses) {
          console.log("Курс успешно создан:", courses);
          await courseApi.getAllCourses();
          this.$emit("click");
        }
      } catch (error) {
        console.error("Ошибка при отправке курса:", error);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.course-maininfo {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  background-color: #212121;
  border-radius: 10px;
  padding: 5px;
  &__selImg {
    width: 150px;
    height: 150px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #363636;
    border-radius: 20px;
    overflow: hidden;
    &__input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    &__prew {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      &__img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
</style>

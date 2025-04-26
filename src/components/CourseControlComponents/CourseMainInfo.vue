<template>
  <div class="course-maininfo">
    <AppInput
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

    <AppInput
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

    <select v-model="selectedLevel">
      <option value="С НУЛЯ">С НУЛЯ</option>
      <option value="СРЕДНИЙ">СРЕДНИЙ</option>
      <option value="ПРОДВИНУТЫЙ">ПРОДВИНУТЫЙ</option>
    </select>

    <div class="course-maininfo__selImg">
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
      :styleOverrides="{
        width: '11.177vw',
        backgroundColor: 'white',
        color: 'black',
      }"
    >
      Создать курс
    </AppButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { AppInput, AppButton } from "../UI";

export default defineComponent({
  name: "CourseMainInfo",
  components: { AppInput, AppButton },
  setup() {
    const selectedType = ref("");
    const selectedLevel = ref("");
    const previewUrl = ref<string | null>(null);
    const onFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        previewUrl.value = URL.createObjectURL(file);
      }
    };
    return { selectedType, selectedLevel, onFileChange, previewUrl };
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

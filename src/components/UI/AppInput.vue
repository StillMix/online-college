<template>
  <div class="app-input-wrapper">
    <label class="app-input__container">
      <emailIcon
        v-if="type === 'email' || type === 'emailtext'"
        customClass="app-input__container__img"
        color="#484848"
        width="1.25vw"
        height="1.25vw"
      />
      <PassIccon
        v-if="type === 'password'"
        customClass="app-input__container__img"
        color="#484848"
        width="1.25vw"
        height="1.25vw"
      />

      <loginIcon
        v-if="type === 'login'"
        customClass="app-input__container__img"
        color="#484848"
        width="1.25vw"
        height="1.25vw"
      />
      <input
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'app-input__container__input',
          { 'app-input--error': hasError },
        ]"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement)?.value)
        "
        @focus="$emit('focus')"
        @blur="$emit('blur')"
      />
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import emailIcon from "@/assets/icons/emailIcon.vue";
import PassIccon from "@/assets/icons/passIccon.vue";
import LoginIcon from "@/assets/icons/loginIcon.vue";
export default defineComponent({
  name: "AppInput",
  components: {
    emailIcon,
    PassIccon,
    LoginIcon,
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "focus", "blur"],
  setup(props) {
    const hasError = computed(() => !!props.error);

    return {
      hasError,
    };
  },
});
</script>

<style scoped lang="scss">
.app-input {
  &__container {
    margin-top: 1.042vw;
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;

    &__img {
      width: 1.25vw;
      height: 1.25vw;
      position: absolute;
      left: 1.042vw;
      transition: transform 0.3s ease;
    }

    &__input {
      border-radius: 7.292vw;
      width: 100%;
      height: 2.604vw;
      background: #363636;
      padding-left: 2.813vw;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      color: #fff;
      transition: all 0.3s ease;
      border: 0.052vw solid transparent;

      &:focus {
        outline: none;
        border-color: #39b874;
        box-shadow: 0 0 0.417vw rgba(57, 184, 116, 0.5);
      }

      &:focus + .signUp__popup__form__label__img {
        transform: scale(1.1);
      }
    }

    &__input::placeholder {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 0.938vw;
      color: #fff;
      opacity: 0.3;
    }
  }
}
</style>

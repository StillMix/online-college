<template>
  <div class="app-input-wrapper">
    <label v-if="label" class="app-input__label">
      {{ label }}
      <span v-if="required" class="app-input__label__required">*</span>
    </label>

    <div class="app-input__container">
      <slot name="prefix"></slot>

      <input
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="['app-input', { 'app-input--error': hasError }]"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
      />

      <slot name="suffix"></slot>

      <button
        v-if="clearable && modelValue"
        type="button"
        class="app-input__clear"
        @click="$emit('update:modelValue', '')"
      >
        ×
      </button>
    </div>

    <div v-if="hasError" class="app-input__error">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "AppInput",
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
.app-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.313vw;
  width: 100%;
}

.app-input__label {
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 0.833vw;
  color: rgba(255, 255, 255, 0.7);

  &__required {
    color: var(--error-color);
    margin-left: 0.104vw;
  }
}

.app-input__container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  ::v-slotted([name="prefix"]) {
    position: absolute;
    left: 1.042vw;
    pointer-events: none;
  }

  ::v-slotted([name="suffix"]) {
    position: absolute;
    right: 1.042vw;
    pointer-events: none;
  }
}

.app-input {
  width: 100%;
  height: 2.083vw;
  padding: 0 0.781vw;
  border-radius: var(--border-radius-md);
  background: var(--bg-input);
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 0.833vw;
  color: #fff;
  transition: all 0.3s ease;

  &:focus {
    background: var(--bg-input-focus);
    box-shadow: 0 0 0.417vw var(--primary-shadow);
  }

  &::placeholder {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 0.833vw;
    color: #fff;
    opacity: 0.3;
  }

  &--error {
    border: 0.052vw solid var(--error-color);

    &:focus {
      box-shadow: 0 0 0.417vw var(--error-shadow);
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.app-input__clear {
  position: absolute;
  right: 0.781vw;
  width: 1.042vw;
  height: 1.042vw;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.833vw;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
}

.app-input__error {
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 0.729vw;
  color: var(--error-color);
  margin-top: 0.208vw;
}
</style>

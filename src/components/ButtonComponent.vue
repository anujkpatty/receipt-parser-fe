<template>
  <button
    v-bind="attrs"
    :class="['custom-button', `btn-${size}`, { disabled }]"
    :style="customStyles"
    :disabled="disabled"
  >
    <slot>Button</slot>
  </button>
</template>

<script setup>
import { computed, useAttrs } from 'vue'
const attrs = useAttrs()

const props = defineProps({
  color: {
    type: String,
    default: '#f2f5f3', // Indigo
  },
  textColor: {
    type: String,
    default: '#000',
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (val) => ['sm', 'md', 'lg'].includes(val),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const customStyles = computed(() => ({
  backgroundColor: props.color,
  color: props.textColor,
  cursor: props.disabled ? 'not-allowed' : 'pointer',
  opacity: props.disabled ? 0.6 : 1,
}))
</script>

<style scoped lang="scss">
.custom-button {
  border: 1px solid #000;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.1s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;

  &.btn-sm {
    padding: 6px 12px;
    font-size: 0.875rem;
  }

  &.btn-md {
    padding: 10px 10px;
    font-size: 1rem;
    height: 50px;
    width: 160px;
  }

  &.btn-lg {
    padding: 14px 28px;
    font-size: 1.125rem;
  }

  &:not(.disabled):hover {
    filter: brightness(0.9);
  }

  &.disabled {
    pointer-events: none;
  }
}
</style>

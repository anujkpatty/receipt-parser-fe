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
    default: '#4f46e5', // Indigo
  },
  textColor: {
    type: String,
    default: '#fff',
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
  border: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &.btn-sm {
    padding: 6px 12px;
    font-size: 0.875rem;
  }

  &.btn-md {
    padding: 10px 20px;
    font-size: 1rem;
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

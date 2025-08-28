<template>
  <div class="spinner">
    {{ dots }}
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const dots = ref('.')
let intervalId

onMounted(() => {
  intervalId = setInterval(() => {
    if (dots.value.length >= 3) {
      dots.value = '.' // reset
    } else {
      dots.value += '.'
    }
  }, 750)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.spinner {
  font-size: 1.5rem;
  font-family: monospace;
  color: #000;
}
</style>

<template>
  <div class="group">
    <span>ID: {{ group.id }}</span>
    <span>Total: {{ totalPrice || 0 }}</span>
  </div>
</template>

<script setup>
import { useItemsStore } from '@/stores/items'
import { computed } from 'vue'
const store = useItemsStore()
const props = defineProps({
  group: Object,
})

const totalPrice = computed(() => props.group.items?.reduce((acc, curr) => acc + curr.price, 0))
</script>

<style lang="scss">
.group {
  border: 1px solid #000;
  display: flex;
  flex-direction: column;
  max-width: 300px;
}
</style>

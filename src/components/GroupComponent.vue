<template>
  <div class="group">
    <span>Group name: {{ group.name }}</span>
    <span>SubTotal: ${{ subtotalPrice.toFixed(2) || 0 }}</span>
    <span>Total (tax and tip): ${{ totalPrice }}</span>
    <button-component @click="editGroup"></button-component>
  </div>
</template>

<script setup>
import { useItemsStore } from '@/stores/items'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ButtonComponent from './ButtonComponent.vue'

const router = useRouter()

const store = useItemsStore()
const props = defineProps({
  group: Object,
})

const items = computed(() => store.getItemsInGroup(props.group.id))
const subtotalPrice = computed(() => items.value?.reduce((acc, curr) => acc + curr.price, 0))
const totalPrice = computed(() => {
  if (subtotalPrice.value) {
    const multiplier = 1 + (store.tax + store.tip) / 100
    return (subtotalPrice.value * multiplier).toFixed(2)
  }
  return 0
})

function editGroup() {
  router.push(`/editGroup/${props.group.id}`)
}
</script>

<style lang="scss">
.group {
  border: 1px solid #000;
  display: flex;
  flex-direction: column;
  max-width: 300px;
}
</style>

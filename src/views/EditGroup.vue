<template>
  <div class="container">
    <span>Edit Group: {{ group.name }}</span>
    <ButtonComponent @click="router.back">Save</ButtonComponent>
    <ListItem
      v-for="item in groupItems"
      :key="item.id"
      :itemName="item.name"
      :itemPrice="item.price"
      :item-id="item.id"
    ></ListItem>
  </div>
</template>

<script setup>
import { useItemsStore } from '@/stores/items'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import ListItem from '@/components/ListItem.vue'
const route = useRoute()
const router = useRouter()
const group = computed(() => store.getGroup(route.params.id))
const groupItems = computed(() => store.getItemsInGroup(route.params.id))
const store = useItemsStore()
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
}
</style>

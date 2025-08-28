<template>
  <div class="header">
    <span>Edit Group: {{ group.name }}</span>
    <ButtonComponent @click="router.back">Save</ButtonComponent>
  </div>
  <div class="main-container">
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
.header {
  height: 80px;
  width: 100%;
  padding: 12px;
  color: #000;
  position: fixed;
  border-bottom: 1px solid #000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  z-index: 9999;
  background-color: #f2f5f3;
}

.main-container {
  top: 80px;
  bottom: 0;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  padding-bottom: 100px;
  width: 100%;
  overflow-y: scroll;
}
</style>

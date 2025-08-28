<template>
  <ButtonComponent @click="router.push('/')">Back to items</ButtonComponent>
  <GroupComponent v-for="group in store.groups" :key="group.id" :group="group" />
  <ButtonComponent @click="taxTipForm = true">Edit tax and tip</ButtonComponent>
  <div v-if="taxTipForm" class="edit-overlay" @click.self="taxTipForm = false">
    <div class="edit-form" @click.stop tabindex="0">
      <h3>Enter tax and tip %</h3>
      <label>
        Tax
        <input v-model.number="store.tax" />%
      </label>
      <label>
        Tip
        <input v-model.number="store.tip" />%
      </label>
      <div class="buttons">
        <ButtonComponent @click="taxTipForm = false">Save</ButtonComponent>
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonComponent from '@/components/ButtonComponent.vue'
import GroupComponent from '@/components/GroupComponent.vue'
import { useItemsStore } from '@/stores/items'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const store = useItemsStore()
const router = useRouter()

const taxTipForm = ref(false)
</script>

<style lang="scss">
.edit-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
}

.edit-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px;
  min-width: 300px;
}
</style>

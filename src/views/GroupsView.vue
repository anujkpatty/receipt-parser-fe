<template>
  <div class="header">
    <ButtonComponent @click="router.push('/')">Back to items</ButtonComponent>
    <ButtonComponent @click="taxTipForm = true">Edit tax and tip</ButtonComponent>
  </div>
  <div class="main-container">
    <GroupComponent v-for="group in store.groups" :key="group.id" :group="group" />
    <div v-if="taxTipForm" class="edit-overlay" @click.self="taxTipForm = false">
      <div class="edit-form" @click.stop tabindex="0">
        <h3>Enter tax and tip %</h3>
        <div class="edit-form-inputs">
          <span>Tax</span>
          <input v-model.number="store.tax" class="edit-form-input" />%
        </div>
        <div class="edit-form-inputs">
          <span>Tip</span>
          <input v-model.number="store.tip" class="edit-form-input" />%
        </div>
        <div class="buttons">
          <ButtonComponent @click="taxTipForm = false">Save</ButtonComponent>
        </div>
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

<style scoped lang="scss">
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

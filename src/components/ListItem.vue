<template>
  <div class="list-item">
    <div
      class="item"
      @click="selectable ? store.toggleSelect(itemId) : openEdit()"
      :class="{ selected: isSelected }"
    >
      <span>{{ name }}</span>
      <span>${{ price.toFixed(2) }}</span>
    </div>
  </div>
  <div v-if="editing" class="edit-overlay" @click.self="cancelEdit">
    <div class="edit-form" @click.stop tabindex="0">
      <h3>Edit Item</h3>
      <label>
        Name
        <input v-model="tempName" />
      </label>
      <label>
        Price
        <input v-model.number="tempPrice" type="number" />
      </label>
      <div class="buttons">
        <ButtonComponent @click="editItem">Save</ButtonComponent>
        <ButtonComponent @click="cancelEdit">Cancel</ButtonComponent>
        <ButtonComponent @click="deleteItem">Delete</ButtonComponent>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { useItemsStore } from '@/stores/items'

const store = useItemsStore()

const isSelected = computed(() => store.isSelected(props.itemId))

const props = defineProps({
  itemName: String,
  itemPrice: Number,
  itemId: Number,
  selectable: Boolean,
})

const name = ref(props.itemName)
const price = ref(props.itemPrice)
const editing = ref(false)

// Temporary variables for editing
const tempName = ref('')
const tempPrice = ref(0)

function openEdit() {
  tempName.value = name.value
  tempPrice.value = price.value
  editing.value = true
}

function editItem() {
  name.value = tempName.value
  price.value = tempPrice.value
  store.editItem(name.value, price.value, props.itemId)
  editing.value = false
}

function cancelEdit() {
  editing.value = false
}

function deleteItem() {
  store.deleteItem(props.itemId)
}
</script>

<style scoped lang="scss">
.list-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.item {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  &.selected {
    background: #cce5ff;
    border: 1px solid;
    border-color: #66b2ff;
  }
}

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
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.radio-select {
  margin-right: 16px;
}
</style>

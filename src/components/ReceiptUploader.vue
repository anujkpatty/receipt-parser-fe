<template>
  <div class="main-container">
    <h1>Receipt Parser</h1>
    <!-- Upload and capture controls -->

    <label v-if="!imageFile" class="upload-label">
      <input type="file" accept="image/*" @change="handleFileChange" class="upload-input" />
      <span class="upload-button">📷 Upload Photo</span>
    </label>
    <ButtonComponent
      @click="uploadReceipt"
      v-if="imageFile"
      :disabled="loading"
      class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
    >
      {{ loading ? 'Parsing...' : 'Upload & Parse' }}
    </ButtonComponent>
    <div class="buttons">
      <ButtonComponent v-if="itemsStore.parsedItems.length" @click="addItemForm = true"
        >Add Item</ButtonComponent
      >
      <button-component v-if="itemsStore.parsedItems.length" @click="toggleSelect">{{
        selectItems ? 'Cancel' : 'Select Items'
      }}</button-component>
    </div>

    <div v-if="addItemForm" class="edit-overlay" @click.self="addItemForm = false">
      <div class="edit-form" @click.stop tabindex="0">
        <h3>Add Item</h3>
        <label>
          Name
          <input v-model="newItem.name" />
        </label>
        <label>
          Quantity
          <input v-model.number="newItem.quantity" type="number" />
        </label>
        <label>
          Price per
          <input v-model.number="newItem.price_per_unit" type="number" />
        </label>
        <div class="buttons">
          <ButtonComponent @click="addItem">Add</ButtonComponent>
          <ButtonComponent @click="addItemForm = false">Cancel</ButtonComponent>
        </div>
      </div>
    </div>

    <!-- Display result -->
    <div v-if="itemsStore.parsedItems.length">
      <div class="items">
        <ListItem
          v-for="(item, index) in itemsStore.parsedItems"
          :key="item.name + index"
          :itemName="item.name"
          :itemPrice="item.price"
          :item-id="item.id"
          :selectable="selectItems"
        />
      </div>
    </div>

    <button-component v-if="itemsStore.selectedItems.length && selectItems" @click="createGroup">
      Group
    </button-component>

    <div v-if="error" class="mt-4 text-red-500">Error: {{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ListItem from '@/components/ListItem.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { useItemsStore } from '@/stores/items'
import { useRouter } from 'vue-router'

const router = useRouter()

const imageFile = ref(null)
const error = ref(null)
const loading = ref(false)
const addItemForm = ref(false)
const selectItems = ref(false)

const newItem = ref({
  name: '',
  quantity: 1,
  price_per_unit: 0,
  total_price: undefined,
})

const itemsStore = useItemsStore()

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    itemsStore.parsedItems = []
    error.value = null
  }
}

function toggleSelect() {
  itemsStore.clearSelectedItems()
  selectItems.value = !selectItems.value
}

async function uploadReceipt() {
  console.log('HELLO')
  loading.value = true
  try {
    await itemsStore.uploadReceipt(imageFile.value)
  } catch (e) {
    error.value = `error uploading/parsing receipt: ${e}`
  }
  imageFile.value = null
  loading.value = false
}

function addItem() {
  itemsStore.addItem(newItem.value)
  newItem.value = {
    name: '',
    quantity: 1,
    price_per_unit: 0,
    total_price: undefined,
  }
  addItemForm.value = false
}
function createGroup() {
  itemsStore.createGroup()
  router.push('/groups')
}
</script>

<style scoped lang="scss">
.main-container {
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.inputs-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.upload-wrapper {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.upload-label {
  position: relative;
  cursor: pointer;

  .upload-input {
    display: none;
  }

  .upload-button {
    background-color: #4f46e5;
    color: #fff;
    padding: 12px 20px;
    font-size: 1rem;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s ease;
    display: inline-block;

    &:hover {
      background-color: #4338ca;
    }
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
  margin: 16px;
  min-width: 300px;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>

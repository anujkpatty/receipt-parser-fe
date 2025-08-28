<template>
  <div class="header" :style="{ background: gradient }">
    <h2>Total: ${{ itemsStore.total.toFixed(2) }}</h2>
    <button-component v-if="itemsStore.parsedItems.length" @click="toggleSelect" class="select">{{
      selectItems ? 'X' : '⎷'
    }}</button-component>
  </div>
  <div class="main-container">
    <ButtonComponent
      @click="uploadReceipt"
      v-if="imageFile"
      :disabled="loading"
      class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
    >
      {{ loading ? 'Parsing...' : 'Upload & Parse' }}
    </ButtonComponent>
    <div class="buttons">
      <label v-if="!imageFile" class="upload-label">
        <input type="file" accept="image/*" @change="handleFileChange" class="upload-input" />
        <span class="upload-button">Upload Receipt</span>
      </label>
      <ButtonComponent
        v-if="itemsStore.parsedItems.length"
        @click="addItemForm = true"
        class="add-button"
        >Add Item</ButtonComponent
      >
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
    <div v-if="itemsStore.ungroupedItems.length">
      <div class="items">
        <ListItem
          v-for="(item, index) in itemsStore.ungroupedItems"
          :key="item.name + index"
          :itemName="item.name"
          :itemPrice="item.price"
          :item-id="item.id"
          :selectable="selectItems"
        />
      </div>
    </div>

    <button-component
      v-if="itemsStore.selectedItems.length && selectItems"
      @click="createGroupForm = true"
      class="create-group"
    >
      Create Group
    </button-component>

    <div v-if="createGroupForm" class="edit-overlay" @click.self="createGroupForm = false">
      <div class="edit-form" @click.stop tabindex="0">
        <h3>Create Group</h3>
        <label>
          Name
          <input v-model="newGroupName" />
        </label>
        <div class="buttons">
          <ButtonComponent @click="createGroup">Add</ButtonComponent>
        </div>
      </div>
    </div>

    <div v-if="error" class="mt-4 text-red-500">Error: {{ error }}</div>
    <div v-if="!itemsStore.ungroupedItems.length && itemsStore.parsedItems.length">
      No items remaining
    </div>
    <button-component
      v-if="itemsStore.groups.length && !selectItems"
      @click="router.push('/groups')"
      class="create-group"
      >View Groups</button-component
    >
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
const createGroupForm = ref(false)

const newGroupName = ref('')

// const gradient = ref('linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)')

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
  itemsStore.createGroup(newGroupName.value)
  newGroupName.value = ''
  router.push('/groups')
}
</script>

<style scoped lang="scss">
.header {
  height: 60px;
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
  top: 75px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 100px;
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
    background-color: #f2f5f3;
    color: #fff;
    padding: 12px 20px;
    font-size: 1rem;
    font-weight: 600;
    border: 1px solid #000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.1s ease;
    display: inline-block;
    color: #000;
    height: 50px;
    width: 160;
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
.select {
  height: 30px !important;
  width: 30px !important;
}
.add-button {
  height: 50px;
  width: 160px;
}
.create-group {
  position: fixed;
  bottom: 30px;
  height: 50px;
  width: 160px;
}
</style>

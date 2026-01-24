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
      v-if="imageFile && !loading"
      :disabled="loading"
      class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
    >
      Go
    </ButtonComponent>
    <SpinnerComponent v-if="loading" />
    <div class="buttons">
      <label v-if="!imageFile" class="upload-label">
        <input type="file" accept="image/*" @change="handleFileChange" class="upload-input" />
        <span class="upload-button">{{
          itemsStore.parsedItems.length ? 'Re-upload' : 'Upload'
        }}</span>
      </label>
      <ButtonComponent
        v-if="itemsStore.parsedItems.length"
        @click="addItemForm = true"
        class="add-button"
        >Add Item</ButtonComponent
      >
    </div>
    <GettingStarted v-if="!itemsStore.parsedItems.length && !imageFile" />

    <div v-if="addItemForm" class="edit-overlay" @click.self="addItemForm = false">
      <div class="edit-form" @click.stop tabindex="0">
        <h3>Add Item</h3>
        <div class="edit-form-inputs">
          <span>Name</span>
          <input v-model="newItem.name" class="edit-form-input" />
        </div>
        <div class="edit-form-inputs">
          <span>Quantity</span>
          <input v-model="newItem.quantity" type="number" class="edit-form-input" />
        </div>
        <div class="edit-form-inputs">
          <span>Price per</span>
          <input v-model="newItem.price_per_unit" type="number" class="edit-form-input" />
        </div>
        <div class="buttons">
          <ButtonComponent size="sm" @click="addItem">Add</ButtonComponent>
          <ButtonComponent size="sm" @click="addItemForm = false">Cancel</ButtonComponent>
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
        <div class="edit-form-inputs">
          <span>Name</span>
          <input v-model="newGroupName" class="edit-form-input" />
        </div>
        <div class="buttons">
          <ButtonComponent @click="createGroup" size="sm">Add</ButtonComponent>
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
import GettingStarted from '@/components/GettingStarted.vue'
import { useItemsStore } from '@/stores/items'
import { useRouter } from 'vue-router'
import SpinnerComponent from './SpinnerComponent.vue'

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
  top: 60px;
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
    width: 160px;
    text-align: center;
  }
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

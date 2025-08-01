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

    <!-- Display result -->
    <div v-if="parsedData">
      <div class="items">
        <ListItem
          v-for="(item, index) in parsedData.items"
          :key="index"
          :itemName="item.name"
          :itemPrice="item.price_per_unit"
          :itemQuantity="item.quantity"
          :totalPrice="item.total_price"
        />
      </div>
    </div>

    <div v-if="error" class="mt-4 text-red-500">Error: {{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import ListItem from '@/components/ListItem.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const ENDPOINT =
  import.meta.env.VITE_MOCK == 'true'
    ? import.meta.env.VITE_MOCK_ENDPOINT
    : import.meta.env.VITE_ENDPOINT

const imageFile = ref(null)
const imagePreview = ref(null)
const parsedData = ref(null)
const error = ref(null)
const loading = ref(false)

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
    parsedData.value = null
    error.value = null
  }
}

async function uploadReceipt() {
  if (!imageFile.value) return

  loading.value = true
  parsedData.value = null
  error.value = null

  const formData = new FormData()
  formData.append('image', imageFile.value)

  try {
    const response = await axios.post(API_URL + ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    parsedData.value = response.data
  } catch (error) {
    error.value = error
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      error.value = error.response.data
      // error.value = error.response.status
      // error.value = error.response.headers
    } else if (error.request) {
      error.value = 'here'
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      error.value = error.request
    } else {
      // Something happened in setting up the request that triggered an Error
      error.value = error.message
    }
    error.value = error.config
  } finally {
    loading.value = false
  }
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
</style>

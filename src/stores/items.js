import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useItemsStore = defineStore('items', () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const ENDPOINT =
    import.meta.env.VITE_MOCK == 'true'
      ? import.meta.env.VITE_MOCK_ENDPOINT
      : import.meta.env.VITE_ENDPOINT

  const parsedItems = ref([])
  const selectedItems = ref([])
  const groups = ref([])
  const currId = ref(0)

  function toggleSelect(id) {
    if (selectedItems.value.includes(id)) {
      selectedItems.value = selectedItems.value.filter((itemId) => itemId !== id)
    } else {
      selectedItems.value.push(id)
    }
  }

  function clearSelectedItems() {
    selectedItems.value = []
  }

  function isSelected(id) {
    return selectedItems.value.includes(id)
  }

  function initItemIds(items) {
    if (!items || !items.length) {
      return
    }
    return items.map((item) => {
      item.id = currId.value++
      return item
    })
  }

  async function uploadReceipt(imageFile) {
    if (!imageFile) return

    parsedItems.value = []
    currId.value = 0
    selectedItems.value = []

    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await axios.post(API_URL + ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    parsedItems.value = initItemIds(response.data?.items)
  }

  function addItem(item) {
    item.id = currId.value++
    console.log(item)
    parsedItems.value.push(item)
  }

  function editItem(name, price, id) {
    const index = parsedItems.value.findIndex((el) => el.id === id)
    if (!index) return
    parsedItems.value[index].name = name
    parsedItems.value[index].price = price
  }

  function deleteItem(id) {
    const index = parsedItems.value.findIndex((el) => el.id === id)
    parsedItems.value.splice(index, 1)
  }

  function createGroup() {
    const newGroup = {}
    newGroup.id = currId.value++
    newGroup.items = []
    selectedItems.value.forEach((id) => {
      const index = parsedItems.value.findIndex((el) => el.id === id)
      newGroup.items.push(parsedItems.value[index])
      parsedItems.value.splice(index, 1)
    })
    clearSelectedItems()
    groups.value.push(newGroup)
  }

  return {
    selectedItems,
    parsedItems,
    uploadReceipt,
    toggleSelect,
    addItem,
    editItem,
    deleteItem,
    clearSelectedItems,
    isSelected,
    createGroup,
    groups,
  }
})

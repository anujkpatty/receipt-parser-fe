import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useItemsStore = defineStore('items', () => {
  const mock = import.meta.env.VITE_MOCK == 'true'
  const API_URL = mock ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_API_URL
  const ENDPOINT = mock ? import.meta.env.VITE_MOCK_ENDPOINT : import.meta.env.VITE_ENDPOINT

  const parsedItems = ref([])
  const selectedItems = ref([])
  const groups = ref([])
  const currId = ref(0)
  const total = computed(() =>
    parsedItems.value.length ? parsedItems.value.reduce((acc, el) => acc + el.price, 0) : 0,
  )
  const tax = ref(8.87)
  const tip = ref(20)

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
    groups.value = []
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
    const item = parsedItems.value[index]
    if (item.groupId) {
      parsedItems.value[index].groupId = null
    } else {
      parsedItems.value.splice(index, 1)
    }
  }

  function createGroup(name) {
    const newGroup = {}
    newGroup.name = name
    newGroup.id = currId.value++
    selectedItems.value.forEach((id) => {
      const index = parsedItems.value.findIndex((el) => el.id === id)
      parsedItems.value[index].groupId = newGroup.id
    })
    clearSelectedItems()
    groups.value.push(newGroup)
  }

  function getGroup(id) {
    return groups.value.find((group) => group.id === parseInt(id))
  }

  const ungroupedItems = computed(() => parsedItems.value.filter((item) => !item.groupId))
  const groupedItems = computed(() => parsedItems.value.filter((item) => item.groupId))

  function getItemsInGroup(id) {
    return groupedItems.value.filter((item) => item.groupId === parseInt(id))
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
    tax,
    tip,
    getGroup,
    ungroupedItems,
    groupedItems,
    getItemsInGroup,
    total,
  }
})

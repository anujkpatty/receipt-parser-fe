<template>
  <div class="item" @click="editing = true">
    <span>{{ name + ' x ' + quantity }}</span>
    <span>${{ total.toFixed(2) }}</span>
  </div>
  <div v-if="editing" class="edit-form" @click.self="editing = false">
    <div class="form" @click.stop>
      <h3>Edit Item</h3>
      <label>
        Name
        <input v-model="name" />
      </label>
      <label>
        Quantity
        <input v-model.number="quantity" type="number" />
      </label>
      <label>
        Price
        <input v-model.number="price" type="number" />
      </label>
      <div class="buttons">
        <button @click="save">Save</button>
        <button @click="editing = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  itemName: String,
  itemPrice: Number,
  itemQuantity: Number,
  totalPrice: Number,
})

const price = ref(props.itemPrice)
const quantity = ref(props.itemQuantity)
const total = ref(props.totalPrice)
const name = ref(props.itemName)
const editing = ref(false)
</script>

<style scoped lang="scss">
.item {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
}

.edit-form {
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
</style>

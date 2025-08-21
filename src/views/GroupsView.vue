<template>
  <ButtonComponent @click="router.push('/')">Back</ButtonComponent>
  <GroupComponent v-for="group in store.groups" :key="group.id" :group="group" />
</template>

<script setup>
import ButtonComponent from '@/components/ButtonComponent.vue'
import GroupComponent from '@/components/GroupComponent.vue'
import { useItemsStore } from '@/stores/items'
import { useRouter } from 'vue-router'

const store = useItemsStore()
const router = useRouter()
</script>

<style lang="scss"></style>

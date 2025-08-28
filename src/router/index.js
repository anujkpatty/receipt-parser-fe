import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GroupsView from '@/views/GroupsView.vue'
import EditGroup from '@/views/EditGroup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/groups',
      name: 'groups',
      component: GroupsView,
    },
    {
      path: '/editGroup/:id',
      name: 'editGroup',
      component: EditGroup,
    },
  ],
})

export default router

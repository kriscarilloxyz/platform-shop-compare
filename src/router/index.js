import Vue from 'vue'
import VueRouter from 'vue-router'
import MenetaAuth from '../views/meneta/MenetaAuth.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Meneta Auth',
    component: MenetaAuth
  }
]

const router = new VueRouter({
  routes
})

export default router

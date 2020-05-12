import Vue from 'vue'
import VueRouter from 'vue-router'
import Landing from '../views/Landing.vue'
import Dashboard from '../views/Dashboard.vue'
import RecentSales from '../views/RecentSales'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      guarded: true,
      layout: 'dashboard'
    }
  },
  {
    path: '/dashboard/recent_sales',
    name: 'Recent Sales',
    component: RecentSales,
    meta: {
      guarded: true,
      layout: 'dashboard'
    }
  },
  {
    path: '/dashboard/recent_sales/:spider',
    name: 'Recent Sales',
    component: RecentSales,
    meta: {
      guarded: true,
      layout: 'dashboard'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

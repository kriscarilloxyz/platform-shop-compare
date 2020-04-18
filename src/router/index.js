import Vue from 'vue'
import VueRouter from 'vue-router'
import MinetaLogin from '../views/mineta/MinetaLogin'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Mineta Auth',
    component: MinetaLogin
  }
]

const router = new VueRouter({
  routes
})

export default router

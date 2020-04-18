import Vue from 'vue'
import VueRouter from 'vue-router'
import MinetaLogin from '../views/mineta/MinetaLogin.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Mineta Login',
    component: MinetaLogin
  }
]

const router = new VueRouter({
  routes
})

export default router

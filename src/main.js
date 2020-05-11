import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { firestorePlugin } from 'vuefire'
// eslint-disable-next-line
import db from './plugins/db'
import Page from './layouts/Page'
import Dashboard from './layouts/Dashboard'

Vue.component('page', Page)
Vue.component('dashboard', Dashboard)

Vue.use(firestorePlugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

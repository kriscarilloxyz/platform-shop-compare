import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'
import db from './plugins/db'

/** Layouts */
import Page from './layouts/Page'

Vue.component('page', Page)

/** Global Mixin */

Vue.mixin({
  data: () => ({
    // Project Details
    firebase: firebase,
    db: db,
    project: {
      name: 'Mineta XYZ'
    },
    // Global Form Rules
    formRules: {
      email: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      password: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 8) || 'Password must be higher than 8 characters'
      ]
    }
  })
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

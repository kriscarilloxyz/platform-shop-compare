import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#ffeb7a',
        accent: '#ffdd57',
        error: '#f14668'
      }
    }
  }
})

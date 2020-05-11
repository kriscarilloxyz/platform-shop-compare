<template>
  <div id="App">
    <Loading v-if="loadingScreen" />
    <component v-else
               :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import firebase from 'firebase'
import { mapState } from 'vuex'
export default {
  name: 'App',
  components: {
    Loading
  },
  computed: {
    layout () { return this.$route.meta.layout || 'page' },
    ...mapState([
      'loadingScreen'
    ])
  },
  mounted () {
    firebase.auth().onAuthStateChanged(user => {
      this.$store.commit('UPDATE_LOADING_SCREEN', true)
      if (user) {
        this.$store.commit('UPDATE_USER', user)
        if (this.$route.path === '/') {
          this.$router.push('/dashboard')
        }
      } else {
        this.$store.commit('UPDATE_USER', false)
        if (this.$route.meta.guarded) {
          this.$router.push('/')
        }
      }
      this.$store.commit('UPDATE_LOADING_SCREEN', false)
    })
  }
}
</script>

<template>
  <div id="App">
    <component :is="layout">
      <v-container v-if="global.loading"
                   fill-height>
        <v-layout justify-center
                  align-center>
          <v-flex xs12
                  class="text-center">
            <v-progress-circular color="primary"
                                 indeterminate />
            <p class="display-1 grey--text mt-5">{{project.name.toLowerCase()}}</p>
          </v-flex>
        </v-layout>
      </v-container>
      <router-view v-else />
    </component>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    layout () { return (this.$route.meta.layout || 'page') }
  },
  async mounted () {
    this.global.loading = true
    await this.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit('UPDATE_USER', user)
        this.global.loading = false
      } else {
        this.$store.commit('UPDATE_USER', {})
        this.global.loading = false
      }
    })
  }
}
</script>

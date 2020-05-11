<template>
  <div id="Landing">
    <v-container fill-height>
      <v-img cover
             src="@/assets/abstract-8.png">
        <v-container fill-height>
          <v-layout justify-center
                    align-center
                    class="text-center">
            <v-flex xs12>

              <v-card max-width="300"
                      class="mx-auto">
                <v-alert color="error"
                         v-if="error"
                         dark>
                  {{error}}
                </v-alert>
                <v-card-text>
                  <v-icon large
                          class="primary--text">mdi-google-analytics</v-icon>
                  <h1 class="title font-weight-bold">
                    Shop Compare
                  </h1>
                  <p class="headline ">
                    Monitor online shop prices in realtime.
                  </p>
                </v-card-text>
                <v-card-text>
                  <v-btn large
                         color="primary"
                         @click="login">
                    Login With Google
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-img>
    </v-container>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  data: () => ({
    error: false
  }),
  methods: {
    async login () {
      var provider = new firebase.auth.GoogleAuthProvider()
      await firebase.auth().signInWithPopup(provider)
        .catch(error => {
          this.error = error.message
        })
    }
  }
}
</script>

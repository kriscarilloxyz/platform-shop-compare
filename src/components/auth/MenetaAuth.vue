<template>
  <v-card max-width="300">
    <v-card-text>
      <h1 class="primary--text">
        {{project.name}}
      </h1>
    </v-card-text>
    <v-card-text v-if="errorMsg">
      <v-alert color="error"
               dark
               transition="scale-up">
        {{errorMsg}}
      </v-alert>
    </v-card-text>
    <v-card-text>
      <v-form ref="form"
              v-model="valid">
        <v-text-field v-model="email"
                      type="email"
                      :placeholder="`hello@${project.name.split(' ').join('-').toLowerCase()}.com`"
                      :rules="formRules.email" />
        <v-text-field v-model="password"
                      type="password"
                      placeholder="********"
                      :rules="formRules.password" />
      </v-form>

      <a href="#"
         @click="register=!register"
         v-if="!register">Don't have an account?</a>
      <a href="#"
         @click="register=!register"
         v-else>Already have an account?</a>

    </v-card-text>
    <v-card-actions>
      <v-btn :loading="loading"
             color="primary"
             @click="login"
             :disabled="!valid">
        {{btnText}}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: 'MenetaAuth',
  data: () => ({
    valid: true,
    email: '',
    password: '',
    errorMsg: false,
    loading: false,
    register: false
  }),
  computed: {
    btnText () { return this.register ? 'register and login' : 'login' }
  },
  methods: {
    async login () {
      if (this.$refs.form.validate()) {
        this.loading = true

        if (this.register) {
          await this.firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .catch(err => {
              console.log(err)
              this.errorMsg = err
              this.loading = false
            })
        } else {
          await this.firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .catch(err => {
              console.log(err)
              this.errorMsg = err
              this.loading = false
            })
        }

        this.loading = false
      }
    }
  }
}
</script>

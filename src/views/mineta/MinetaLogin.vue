<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex xs12>
        <mineta-auth class="mx-auto" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MinetaAuth from '@/components/auth/MinetaAuth'

export default {
  name: 'Home',
  components: {
    MinetaAuth
  }
}
</script>

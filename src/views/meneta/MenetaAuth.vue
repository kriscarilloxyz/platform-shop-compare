<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex xs12>
        <meneta-auth class="mx-auto" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MenetaAuth from '@/components/auth/MenetaAuth'

export default {
  name: 'Home',
  components: {
    MenetaAuth
  }
}
</script>

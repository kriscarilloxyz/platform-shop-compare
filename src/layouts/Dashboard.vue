<template>
  <v-app>
    <v-app-bar app
               clipped-left
               color="primary"
               dense
               class="elevation-1">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-icon class="mr-4">mdi-google-analytics</v-icon>
        <span>shopcompare</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer"
                         app
                         clipped
                         color="grey lighten-4">

      <v-card>
        <v-img :aspect-ratio="16/9"
               src="@/assets/abstract-8.png">
        </v-img>
        <v-card-text>
          {{user.email}}
        </v-card-text>
      </v-card>
      <v-btn block
             color="error"
             @click="logout">Logout</v-btn>
      <v-divider class="my-4"></v-divider>
      <v-list dense
              class="grey lighten-4">
        <template v-for="(item, i) in items">
          <v-row v-if="item.heading"
                 :key="i"
                 align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col cols="6"
                   class="text-right">
              <v-btn small
                     text>edit</v-btn>
            </v-col>
          </v-row>
          <v-divider v-else-if="item.divider"
                     :key="i"
                     dark
                     class="my-4"></v-divider>
          <v-list-item v-else
                       :key="i"
                       link
                       exact
                       :to="item.to">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-content class="grey lighten-4">
      <slot />
    </v-content>
  </v-app>
</template>

<script>
import db from '@/plugins/db'
import { mapState } from 'vuex'
import firebase from 'firebase'
export default {
  props: {
    source: String
  },
  data: () => ({
    scheduled: [],
    drawer: null,
    items: [
      { icon: 'mdi-clipboard-list', text: 'Monitor', to: '/dashboard' },
      { icon: 'mdi-point-of-sale', text: 'Recent Sales', to: '/dashboard/recent_sales' }
    ]
  }),
  computed: {
    ...mapState([
      'user'
    ])
  },
  mounted () {
    this.$bind('scheduled', db.collection('scheduled').where('userEmail', '==', this.user.email))
  },
  methods: {
    logout () { firebase.auth().signOut() }
  }
}
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>

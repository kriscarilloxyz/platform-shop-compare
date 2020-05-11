<template>
  <v-container>
    <v-row>
      <v-col>
        <monitoring-table :scheduled="scheduled"></monitoring-table>
      </v-col>
      <v-navigation-drawer class="mt-3"
                           float
                           clipped
                           right>
        <v-list dense
                rounded>
          <v-list-item v-for="item in products"
                       :key="item.id">
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <small>$ {{item.price}} | {{item.createdAt.toDate().toLocaleString()}}</small>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-row>
  </v-container>
</template>

<script>
import db from '@/plugins/db'
import { mapState } from 'vuex'
import monitoringTable from '@/components/monitoringTable'
export default {
  components: {
    monitoringTable
  },
  data: () => ({
    scheduled: [],
    products: []
  }),
  mounted () {
    this.$bind('scheduled', db.collection('scheduled').where('userEmail', '==', this.user.email))
    this.$bind('products', db.collection('products').where('userEmail', '==', this.user.email))
  },
  computed: {
    ...mapState([
      'user'
    ])
  }
}
</script>

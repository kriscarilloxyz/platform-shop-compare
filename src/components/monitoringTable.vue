<template>
  <v-data-table :headers="headers"
                :items="scheduled"
                sort-by="calories"
                class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat
                 color="white">
        <v-toolbar-title>Monitor</v-toolbar-title>
        <v-divider class="mx-4"
                   inset
                   vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog"
                  max-width="350"
                  overlay-color="primary">
          <template v-slot:activator="{ on }">
            <v-btn outlined
                   color="warning"
                   class="mb-2"
                   v-on="on">New Product</v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-icon large
                            class="primary--text">
                      {{editedIndex === -1 ? 'mdi-new-box' : 'mdi-pencil'}}
                    </v-icon>
                    <h1 class="title font-weight-bold">
                      {{formTitle}}
                    </h1>
                    <v-textarea label="Link"
                                v-model="editedItem.link"
                                :hint="`Currently there are only ${spiders.length} supported online shops.`"
                                persistent-hint></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
              <v-btn color="warning"
                     block
                     @click="save">Save</v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small
              @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary"
             @click="dialog = true">New Product</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import db from '@/plugins/db'
import { mapState } from 'vuex'
import firebase from 'firebase'
import validUrl from 'valid-url'

export default {
  props: {
    scheduled: {
      default: []
    }
  },
  data: () => ({
    spiders: [
      'slhobie',
      'dinga',
      'chsmith',
      'surgekayaks',
      'motackle',
      'baysports',
      'findsports',
      'whitworths',
      'dreamkayaks',
      'anacondastores',
      'weekendwarrior',
      'boatingcentral',
      'kayaksandsups',
      'arnoldsboatshop',
      'blackhawkoutdoor',
      'paddlesportsmegastore',
      'theboatwarehouse',
      'adelaidecanoeworks',
      'kayaks2fish'
    ],
    dialog: false,
    headers: [
      { text: 'Category', value: 'spider' },
      { text: 'LTS Price', value: 'lastPrice' },
      { text: 'Link', value: 'link' },
      { text: 'Actions', value: 'actions', sortable: false }

    ],
    editedIndex: -1,
    editedItem: {
      link: ''
    },
    defaultItem: {
      link: ''
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    ...mapState([
      'user'
    ])
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  methods: {
    editItem (item) {
      this.editedIndex = this.scheduled.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.scheduled.indexOf(item)
      confirm('Are you sure you want to delete this item?') && db.collection('scheduled').doc(this.scheduled[index].id).delete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        // Edit
        return false
      } else {
        // Save
        const { link } = this.editedItem
        const spider = this.spiders.filter(sp => link.includes(sp))

        if (!validUrl.isUri(link)) {
          this.close()
          return alert('This is not valid link.')
        }

        const alreadyScheduled = this.scheduled
          .map(sc => sc.link)
          .filter(sc => sc === link)
          .length

        if (alreadyScheduled) {
          this.close()
          return alert('Link already in monitoring table.')
        }

        if (spider.length) {
          db.collection('scheduled').add({
            link,
            userEmail: this.user.email,
            lastPrice: 0,
            spider: spider[0]
          })
        } else {
          const submit = confirm('This is not a supported online store, would you like to submit a request?')

          if (submit) {
            db.collection('spiderRequests').add({
              userEmail: this.userEmail,
              createdAt: firebase.firestore.Timestamp.now(),
              supported: false,
              link
            })
          }

          return this.close()
        }
      }
      this.close()
    }
  }
}
</script>

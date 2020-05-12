<template>
  <v-container>
    <v-dialog v-model="dialog"
              max-width="350"
              overlay-color="primary">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-icon large
                        class="primary--text">
                  mdi-new-box
                </v-icon>
                <h1 class="title font-weight-bold">
                  Online Shop (NETO CRM)
                </h1>
                <v-textarea label="https://www.onlineshop.com"
                            v-model="link"
                            :hint="`Available for only online shops using Neto CRM and supported online stores.`"
                            persistent-hint></v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <v-btn color="warning"
                 block
                 :loading="isLoading"
                 @click="save">Save</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="grey--text">

            <vc-date-picker v-if="sales.length"
                            v-model="dateRange"
                            :popover="{ placement: 'bottom-left', visibility: 'click' }"
                            mode="range">
              <v-btn icon
                     color="warning">
                <v-icon>mdi-calendar-month</v-icon>
              </v-btn>
            </vc-date-picker>
          </v-card-title>

          <v-card-text>
            <chart-sales :chartData="chartData"></chart-sales>
          </v-card-text>

          <v-card-text>
            <v-row class="text-center">
              <v-col>
                <p class="display-3">
                  {{ $route.params.spider || 'All'}}
                </p>
              </v-col>
              <v-col>
                <p class="display-3">
                  $ {{grossRevenue}}
                </p>
                <h1>Gross Revenue</h1>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text>
            <v-row class="text-center">
              <v-col>
                <p class="display-3">
                  {{todaySales}}
                </p>
                <h1>Today</h1>
              </v-col>
              <v-col>
                <p class="display-3">{{monthSales}}</p>
                <h1>Month</h1>
              </v-col>
              <v-col>
                <p class="display-3">
                  {{yearSales}}
                </p>
                <h1>Year</h1>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text>
            <v-card flat>
              <v-card-title>
                Sales Volume
                <v-spacer></v-spacer>
                <v-text-field v-model="search"
                              append-icon="mdi-magnify"
                              label="Search"
                              single-line
                              hide-details></v-text-field>
              </v-card-title>

              <v-data-table :headers="headers"
                            :items="salesVolume"
                            :search="search">
              </v-data-table>
            </v-card>
          </v-card-text>
        </v-card>

      </v-col>

      <v-navigation-drawer class="mt-3"
                           float
                           clipped
                           permanent>
        <v-btn block
               color="warning"
               outlined
               @click="dialog = true">
          New Link
        </v-btn>
        <v-list v-if="recentSales.length"
                dense
                rounded>
          <v-list-item link
                       exact
                       :to="`/dashboard/recent_sales`">
            <v-list-item-content>
              <v-list-item-title>All</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-for="
                item
                in
                recentSales"
                       :key="item.id"
                       link
                       exact
                       :to="`/dashboard/recent_sales/${item.spider}`">
            <v-list-item-content>
              <v-list-item-title>{{ item.link }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

    </v-row>
  </v-container>
</template>

<script>

import _ from 'lodash'
import axios from 'axios'
import moment from 'moment'
import db from '@/plugins/db'
import { mapState } from 'vuex'
import firebase from 'firebase'
import validUrl from 'valid-url'
import ChartSales from '@/components/ChartSales'
import randomFlatColors from 'random-flat-colors'

export default {
  components: {
    ChartSales
  },
  data: () => ({
    dateRange: {
      start: null, // Jan 16th, 2018
      end: null // Jan 19th, 2018
    },
    minDate: null,
    maxDate: null,
    selectedView: 'Monthly',
    headers: [
      { text: 'SKU', value: 'sku' },
      { text: 'LTS Price', value: 'price' },
      { text: 'Quantity', value: 'quantity' },
      { text: 'Gross Revenue', value: 'gross' }
    ],
    sales: [],
    recentSales: [],
    totalSales: [],
    link: '',
    dialog: false,
    isLoading: false,
    search: '',
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
    ]
  }),
  mounted () {
    this.$bind('recentSales', db.collection('recentSales').where('userEmail', '==', this.user.email))
    this.$bind('sales', db.collection('sales').where('userEmail', '==', this.user.email))
    this.dateRange.start = moment().startOf('month').toDate()
    this.dateRange.end = moment().endOf('month').toDate()
  },
  computed: {
    ...mapState([
      'user'
    ]),

    grossRevenue () {
      if (this.salesVolume.length) {
        return _.sum(this.salesVolume.map(sale => parseFloat(sale.gross))).toFixed()
      } else {
        return 0
      }
    },

    salesVolume () {
      const reducer = (accumulator, currentValue) => accumulator + currentValue

      let saleCollection = []
      const spider = this.$route.params.spider

      if (spider) {
        saleCollection = this.sales
          .filter(sale => sale.spider === spider)
      } else {
        saleCollection = this.sales
      }
      if (saleCollection.length) {
        const salesBySKU = []
        const skus = [...new Set(saleCollection.map(s => s.sku))]

        skus.forEach(sku => {
          const salesFiltered = saleCollection.filter(sale => sale.sku === sku)
          const quantity = salesFiltered.map(sale => parseInt(sale.quantity)).reduce(reducer)
          const price = salesFiltered.map(sale => sale.price).sort((a, b) => a - b)[0]
          const gross = _.sum(salesFiltered.map(sale => parseFloat(sale.price) * parseInt(sale.quantity))).toFixed()
          const saleVolume = {
            sku,
            price,
            gross,
            quantity
          }
          salesBySKU.push(saleVolume)
        })

        return salesBySKU
      } else {
        return []
      }
    },
    todaySales () {
      let saleCollection = []
      const spider = this.$route.params.spider

      if (spider) {
        saleCollection = this.sales
          .filter(sale => sale.spider === spider)
      } else {
        saleCollection = this.sales
      }
      if (saleCollection.length) {
        return saleCollection
          .filter(sale => {
            return moment(sale.createdAt.toDate()).format('D') === moment().format('D')
          })
          .length
      } else {
        return 0
      }
    },
    monthSales () {
      let saleCollection = []
      const spider = this.$route.params.spider

      if (spider) {
        saleCollection = this.sales
          .filter(sale => sale.spider === spider)
      } else {
        saleCollection = this.sales
      }
      if (saleCollection.length) {
        return saleCollection
          .filter(sale => {
            return moment(sale.createdAt.toDate()).format('MM YYYY') === moment().format('MM YYYY')
          })
          .length
      } else {
        return 0
      }
    },
    yearSales () {
      let saleCollection = []
      const spider = this.$route.params.spider

      if (spider) {
        saleCollection = this.sales
          .filter(sale => sale.spider === spider)
      } else {
        saleCollection = this.sales
      }
      if (saleCollection.length) {
        return saleCollection
          .filter(sale => {
            return moment(sale.createdAt.toDate()).format('YYYY') === moment().format('YYYY')
          })
          .length
      } else {
        return 0
      }
    },
    chartData () {
      const chartDefault = {
        labels: [],
        datasets: []
      }
      const hasRecentSales = this.recentSales.length

      if (!hasRecentSales) { return chartDefault }

      const hasSales = this.sales.length
      if (!hasSales) { return chartDefault }

      // Get sales by spider (Default All)
      const spider = this.$route.params.spider
      let saleCollection = []

      if (spider) {
        saleCollection = this.sales
          .filter(sale => sale.spider === spider)
      } else {
        saleCollection = this.sales
      }

      // Calculate total sales
      const totalSales = []

      const startDate = moment(this.dateRange.start)
      const endDate = moment(this.dateRange.end)

      saleCollection.forEach(sale => {
        const newOpt = {}
        newOpt.description = sale.description
        newOpt.sku = sale.sku
        newOpt.total = sale.quantity * sale.price
        const d = new Date(sale.ts * 1000)
        newOpt.date = moment(d)
        newOpt.spider = sale.spider

        if (startDate.isValid && endDate.isValid) {
          const optD = newOpt.date
          if (optD.isSameOrAfter(startDate) && optD.isSameOrBefore(endDate)) {
            totalSales.push(newOpt)
          }
        } else {
          totalSales.push(newOpt)
        }
      })

      const chartSales = {}
      chartSales.labels = []

      for (var i = parseInt(startDate.format('D')); i <= parseInt(endDate.format('D')); i++) {
        chartSales.labels.push(i)
      }
      chartSales.datasets = []

      const categories = [...new Set(this.sales.map(sale => sale.spider))]

      categories.forEach(category => {
        const color = randomFlatColors()
        const sales = totalSales.filter(sale => sale.spider === category)
        const data = []

        chartSales.labels.forEach(label => {
          const filteredSales = sales
            .filter(sale => parseInt(sale.date.format('D')) === label)

          if (filteredSales.length) {
            data.push(
              _.sum(filteredSales.map(sale => sale.total)).toFixed(2)
            )
          } else {
            data.push(0)
          }
        })

        chartSales.datasets.push({
          label: category,
          backgroundColor: color,
          pointBackgroundColor: color,
          borderColor: color,
          fill: false,
          data
        })
      })
      return chartSales
    }
  },
  methods: {
    close () {
      this.isLoading = false
      this.link = ''
      this.dialog = false
    },
    async save () {
      this.isLoading = true
      const link = this.link
      const netoUrl = this.link + '/ajax/recent_sales'
      const spider = this.spiders.filter(sp => link.includes(sp))

      if (!validUrl.isUri(link)) {
        this.close()
        return alert('This is not valid link.')
      }

      const alreadyScheduled = this.recentSales
        .map(sc => sc.link)
        .filter(sc => sc === link)
        .length

      if (alreadyScheduled) {
        this.close()
        return alert('Link already linked to your account.')
      }

      try {
        await axios.post('https://us-central1-shopcompare-33b52.cloudfunctions.net/validateNeto', { link: netoUrl })
      } catch (error) {
        this.close()
        return alert(`Error validating ${netoUrl}, online shop might be using another CRM other than Neto.`)
      }

      if (spider.length) {
        db.collection('recentSales').add({
          link,
          netoUrl,
          userEmail: this.user.email,
          spider: spider[0],
          createdAt: firebase.firestore.Timestamp.now()
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
      }

      this.link = ''
      return this.close()
    }
  }
}
</script>

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
            <v-spacer />
            {{ $route.params.spider || 'All'}}
          </v-card-title>

          <v-card-text>
            <chart-sales :chartData="chartData"></chart-sales>
          </v-card-text>

          <v-card-text>
            <v-data-table :headers="headers"
                          :items="sales">
            </v-data-table>
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
      { text: 'Name', value: 'description' },
      { text: 'Price', value: 'price' },
      { text: 'Quantity', value: 'quantity' },
      { text: 'SKU', value: 'sku' }
    ],
    sales: [],
    recentSales: [],
    link: '',
    dialog: false,
    isLoading: false,
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
  computed: {

    ...mapState([
      'user'
    ]),
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
      chartSales.labels = moment.monthsShort()
      chartSales.datasets = []

      const description = [...new Set(totalSales.map(sale => sale.description))]

      description.forEach(description => {
        const color = randomFlatColors()
        const data = []
        chartSales.labels.forEach(label => {
          const totalSalesFiltered = totalSales
            .filter(sale => sale.date.format('MMM') === label)
            .filter(sale => sale.description === description)

          if (totalSalesFiltered.length) {
            data.push(_.sum(totalSalesFiltered.map(sale => sale.total)))
          } else {
            data.push(0)
          }
        })
        chartSales.datasets.push({
          label: description,
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
  mounted () {
    this.$bind('recentSales', db.collection('recentSales').where('userEmail', '==', this.user.email))
    this.$bind('sales', db.collection('sales').where('userEmail', '==', this.user.email))
  },
  methods: {
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
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
        const { data } = await axios.post('https://us-central1-shopcompare-33b52.cloudfunctions.net/validateNeto', { link: netoUrl })
        console.log(data)
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

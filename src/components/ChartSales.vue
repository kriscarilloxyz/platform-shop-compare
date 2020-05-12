<template>
  <ChartLine :options="options"
             :chartData="chartData" />
</template>

<script>
import ChartLine from './ChartLine'
export default {
  props: {
    chartData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    ChartLine
  },
  data: () => ({
    options: {
      response: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  })
}
</script>

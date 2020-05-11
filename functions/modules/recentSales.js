const admin = require('firebase-admin')
const axios = require('axios')

async function _recentSales (db, params) {
  const content = await axios.get(params.link)
    .then(response => response.data)

  const items = content.split('|SKU')
  // remove first element in array NETO
  items.shift()

  const sales = items.map((item, index) => {
    const divided = item
      .split('|')
      .map(d => {
        // decode URI
        const decoded = decodeURIComponent(d)
        // remove $
        const noMark = decoded.split('$')[0]
        return noMark.trim()
      })
      .filter(noMark => !!noMark)

    // Extraction
    const sale = {}
    sale.sku = divided[0]

    divided.forEach((divide, index) => {
      if (index % 2 !== 0) {
        sale[divide] = divided[index + 1]
      }
    })

    const d = new Date(sale.ts * 1000)
    sale.createdAt = admin.firestore.Timestamp.fromDate(d)
    sale.spider = params.spider
    return sale
  })

  if (!db) {
    console.log(`[DEBUG] ${sales.length} sales found.`)
    return false
  }

  for (let i = 0; sales.length > i; i++) {
    const sale = sales[i]
    const docId = `${sale.ts}-${sale.sku}`
    const querySale = db.collection('sales').doc(docId)
    const snapshot = await querySale.get()

    if (!snapshot.empty) {
      querySale.set(sale)
      console.log(`[SALE] ADDED FROM ${params.spider}`)
    }
  }
}

async function run () {

  // ping for recent_sales
  const pinged = [
    // { link: 'https://adelaidecanoeworks.com.au', spider: 'adelaidecanoeworks' },
    // { link: 'https://www.anacondastores.com', spider: 'anacondastores' },
    // { link: 'https://arnoldsboatshop.com.au', spider: 'arnoldsboatshop' },
    // { link: 'https://www.baysports.com.au', spider: 'baysports' },
    // { link: 'https://www.blackhawkoutdoor.com.au', spider: 'blackhawkoutdoor' },
    // { link: 'https://www.boatingcentral.com.au', spider: 'boatingcentral' },
    // { link: 'https://www.chsmith.com.au', spider: 'chsmith' },
    // { link: 'https://dinga.com.au', spider: 'dinga' },
    // { link: 'https://dreamkayaks.com.au', spider: 'dreamkayaks' },
    { link: 'https://www.findsports.com.au', spider: 'findsports' },
    { link: 'https://kayaks2fish.com', spider: 'kayaks2fish' },
    { link: 'https://kayaksandsups.com.au', spider: 'kayaksandsups' },
    // { link: 'https://www.motackle.com.au', spider: 'motackle' },
    // { link: 'https://paddlesportsmegastore.com.au', spider: 'paddlesportsmegastore' },
    // { link: 'https://slhobie.com.au', spider: 'slhobie' },
    // { link: 'https://surgekayaks.com.au', spider: 'surgekayaks' },
    // { link: 'https://theboatwarehouse.com.au', spider: 'theboatwarehouse' },
    // { link: 'https://weekendwarrior.net.au', spider: 'weekendwarrior' },
    // { link: 'https://www.whitworths.com.au', spider: 'whitworths' }
  ]

  for (let i = 0; pinged.length > i; i++) {
    const ping = pinged[i]
    console.log(`[LOG] Recent sales extraction start ${ping.link + '/ajax/recent_sales'}`)
    const params = {
      link: ping.link + '/ajax/recent_sales',
      spider: ping.spider

    }

    await _recentSales(false, params)
  }
}

run()

exports.recentSales = _recentSales

const admin = require('firebase-admin')
const axios = require('axios')

async function _recentSales (db, doc) {
  const content = await axios.get(doc.netoUrl)
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
    sale.spider = doc.spider
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
    const spider = require(`../nest/spiders/${doc.spider}`)[doc.spider]
    sale.url = doc.link + sale.url
    sale.price = await spider(false, { link: sale.url })
    sale.userEmail = doc.userEmail
    if (!snapshot.empty) {
      querySale.set(sale)
      console.log(`[LOG] SALE ADDED FROM ${doc.spider} linked ${doc.userEmail}`)
    }
  }
}

exports.recentSales = _recentSales

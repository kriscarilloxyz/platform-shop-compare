const { spider } = require('./spider')

async function _paddlesportsmegastore (db, doc) {
  console.log('[START] https://paddlesportsmegastore.com.au')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('h1.product-title').text())

  const prices = []
  $('span.woocommerce-Price-amount.amount').each((index, element) => {
    const elemPrice = spider.sanitizePrice($(element).text())
    if (elemPrice !== '0.00') {
      prices.push(
        parseFloat(elemPrice)
      )
    }
  })

  const price = parseFloat(Math.min.apply(Math, prices))

  if (title && price && db) { spider.saveResults(db, doc, title, price) }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
  return price || 0
}

exports.paddlesportsmegastore = _paddlesportsmegastore

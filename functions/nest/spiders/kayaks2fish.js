const { spider } = require('./spider')

async function _kayaks2fish (db, doc) {
  console.log('[START] https://kayaks2fish.com.au')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('h1.flex-product-header-title').text())

  const prices = []
  $('.wrapper-pricing-inner > div').each((index, element) => {
    const elemPrice = spider.sanitizePrice($(element).text())
    if (elemPrice !== '0.00' && !!elemPrice) {
      prices.push(
        parseFloat(elemPrice)
      )
    }
  })

  console.log(prices)

  const price = parseFloat(Math.min.apply(Math, prices))

  if (title && price && db) { spider.saveResults(db, doc, title, price) }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
  return price || 0
}

exports.kayaks2fish = _kayaks2fish

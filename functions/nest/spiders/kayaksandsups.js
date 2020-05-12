const { spider } = require('./spider')

async function _kayaksandsups (db, doc) {
  console.log('[START] https://kayaksandsups.com.au')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('h2.productName').text())
  const price = spider.sanitizePrice($('.productprice.productpricetext').text())
  if (title && price && db) { if (title && price && db) { spider.saveResults(db, doc, title, price) } }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
  return price || 0
}

exports.kayaksandsups = _kayaksandsups

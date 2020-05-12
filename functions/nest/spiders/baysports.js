const { spider } = require('./spider')

async function _baysports (db, doc) {
  console.log('[START] https://www.baysports.com.au/')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('h1[itemprop="name"]').text())
  const price = spider.sanitizePrice($('span.product-single__price-number.product-single__price-number--sale').text())

  if (title && price && db) { spider.saveResults(db, doc, title, price) }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
  return price || 0
}

exports.baysports = _baysports

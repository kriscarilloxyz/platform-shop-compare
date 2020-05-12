const { spider } = require('./spider')

async function _dinga (db, doc) {
  console.log('[START] https://dinga.com.au')
  const $ = await spider.GET(doc.link, false, true)
  const title = spider.sanitizeText($('div.product-name > h1[itemprop="name"]').text())
  const price = spider.sanitizePrice($('span.price[itemprop="price"]').text())
  if (title && price && db) { spider.saveResults(db, doc, title, price) }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
  return price || 0
}

exports.dinga = _dinga

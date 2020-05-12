const { spider } = require('./spider')

async function _anacondastores (db, doc) {
  console.log('[START] https://anacondastores.com.au')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('.pdp-title[itemprop="name"]').text())
  const price = spider.sanitizePrice($('p.price.price-regular').first().text())
  if (title && price && db) { spider.saveResults(db, doc, title, price) }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
  return price || 0
}

exports.anacondastores = _anacondastores

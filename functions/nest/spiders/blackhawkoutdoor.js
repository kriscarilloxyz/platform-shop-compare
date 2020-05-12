const { spider } = require('./spider')

async function _blackhawkoutdoor (db, doc) {
  console.log('[START] https://www.blackhawkoutdoor.com.au')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('h1.product-description-header').text())
  const price = spider.sanitizePrice($('h3#price-field').text())
  if (title && price && db) { if (title && price && db) { spider.saveResults(db, doc, title, price) } }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
  return price || 0
}

exports.blackhawkoutdoor = _blackhawkoutdoor

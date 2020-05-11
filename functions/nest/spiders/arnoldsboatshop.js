
const { spider } = require('./spider')

async function _arnoldsboatshop (db, doc) {
  console.log('[START] https://arnoldsboatshop.com.au')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('.product-title').text())
  const price = spider.sanitizePrice($('#productPrice').text())
  if (title && price && db) { spider.saveResults(db, doc, title, price) }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
}

exports.arnoldsboatshop = _arnoldsboatshop

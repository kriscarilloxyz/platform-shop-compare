
const { spider } = require('./spider')

async function _dreamkayaks (db, doc) {
  console.log('[START] https://dreamkayaks.com.au')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('h1').text())
  const price = spider.sanitizePrice($('.ProductPrice').text())
  if (title && price && db) { spider.saveResults(db, doc, title, price) }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
}

exports.dreamkayaks = _dreamkayaks

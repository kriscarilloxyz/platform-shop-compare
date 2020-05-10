const { spider } = require('./spider')

async function _surgekayaks (db, doc) {
  console.log('[START] https://surgekayaks.com.au')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('h1.product-title.entry-title').text())
  const price = spider.sanitizePrice($('ins').text())
  if (title && price && db) { spider.saveResults(db, doc, title, price) }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
}

exports.surgekayaks = _surgekayaks

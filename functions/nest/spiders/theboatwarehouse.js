const { spider } = require('./spider')

async function _theboatwarehouse (db, doc) {
  console.log('[START] https://theboatwarehouse.com.au')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('h1.title').text())
  const price = spider.sanitizePrice($('em.ProductPrice').text())
  if (title && price && db) { spider.saveResults(db, doc, title, price) }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
  return price || 0
}

exports.theboatwarehouse = _theboatwarehouse


const { spider } = require('./spider')

async function _weekendwarrior (db, doc) {
  console.log('[START] https://weekendwarrior.net.au')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('.product_title').text())
  const price = spider.sanitizePrice($('ins').first().text())
  if (title && price && db) { spider.saveResults(db, doc, title, price) }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
  return price || 0
}

exports.weekendwarrior = _weekendwarrior

const { spider } = require('./spider')

async function _slhobie (db, doc) {
  console.log('[START] https://slhobie.com.au')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('h2[itemprop="headline"]').text())
  const price = spider.sanitizePrice($('.sale-price').text())
  if (title && price && db) { if (title && price && db) { spider.saveResults(db, doc, title, price) } }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
  return price || 0
}

exports.slhobie = _slhobie

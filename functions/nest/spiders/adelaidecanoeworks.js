const { spider } = require('./spider')

async function _adelaidecanoeworks (db, doc) {
  console.log('[START] https://adelaidecanoeworks.com.au')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('h1[itemprop="name"]').text())
  const price = spider.sanitizePrice($('span#our_price_display').text())
  if (title && price && db) { spider.saveResults(db, doc, title, price) }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
}

exports.adelaidecanoeworks = _adelaidecanoeworks

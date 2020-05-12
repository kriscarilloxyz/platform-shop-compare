const { spider } = require('./spider')

async function _boatingcentral (db, doc) {
  console.log('[START] https://www.boatingcentral.com.au/')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('h1[itemprop="name"]').text())
  let price

  $('div.productView-price > div.price-section.price-section--withTax > span.price').each((index, element) => {
    const CLASS = $(element).attr('class')
    const content = $(element).text()
    if (!CLASS.includes('rrp')) {
      price = spider.sanitizePrice(content)
    }
  })
  if (title && price && db) { spider.saveResults(db, doc, title, price) }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
  return price || 0
}

exports.boatingcentral = _boatingcentral

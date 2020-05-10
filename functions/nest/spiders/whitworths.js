const { spider } = require('./spider')

async function _whitworths (db, doc) {
  console.log('[START] https://www.whitworths.com.au/')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('div.product-name > h1').text())
  let price

  $('span.price').each((index, element) => {
    const id = $(element).attr('id')
    const content = $(element).text()
    if (id && !price) {
      if (id.includes('product-price')) {
        price = spider.sanitizePrice(content)
      }
    }
  })

  if (title && price && db) { spider.saveResults(db, doc, title, price) }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
}

exports.whitworths = _whitworths

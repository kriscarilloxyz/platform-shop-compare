const { spider } = require('./spider')

async function _findsports (db, doc) {
  console.log('[START] https://www.findsports.com.au/')
  const $ = await spider.GET(doc.link)
  const title = spider.sanitizeText($('h1[itemprop="name"]').text())
  let price

  $('div[itemprop="offers"]').each((index, element) => {
    const content = spider.sanitizeText($(element).text())

    if (content) {
      const prices = content
        .split('\n')
        .filter(item => !!item)
        .filter(item => !item.toLowerCase().includes('save'))
        .map(item => spider.sanitizePrice(item))
        .filter(item => !!item)

      if (prices) {
        price = Math.min(...prices)
      }
    }
  })

  if (title && price && db) { spider.saveResults(db, doc, title, price) }
  console.log(`[RESULTS] TITLE: ${title || 'n/a'} | PRICE: ${price || 'n/a'} | DEBUG: ${db ? 'NO' : 'YES'}`)
  return price || 0
}

exports.findsports = _findsports

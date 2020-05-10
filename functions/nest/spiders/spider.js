const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio')
const admin = require('firebase-admin')
const puppeteer = require('puppeteer')

function createdAt () {
  return admin.firestore.Timestamp.now()
}

function saveHTML (content) {
  fs.writeFile('spider.html', content, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('[LOG] OUTPUT TO spider.html')
    }
  })
}

function sanitizeText (content) {
  return content.trim()
}

function sanitizePrice (content) {
  return content.replace(/[^0-9.,]/g, '')
}

async function GET (link, debug = false, phantom = false) {
  console.log(`[GET] ${link}`)
  let $
  let content

  if (!phantom) {
    const response = await axios.get(link)
    $ = cheerio.load(response.data)
    content = response.data
  } else {
    console.log('[PUPPETEER] Launching')
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true
    })
    console.log('[PUPPETEER] Waiting for page to load...')
    const page = await browser.newPage()
    await page.goto(link, { waitUntil: 'networkidle0', timeout: 0 })

    content = await page.content()
    $ = cheerio.load(content)

    console.log('[PUPPETEER] Page loaded. Closing.')
    await browser.close()
  }

  if (debug) { saveHTML(content) }

  return $
}

function saveResults (db, doc, title, price) {
  if (parseInt(doc.lastPrice) < parseInt(price)) {
    console.log(`[ALERT] ${title} price went from ${doc.lastPrice} to ${price}`)
    console.log(`[ALERT] Sending email to inform ${doc.userEmail}`)

    db
      .collection('products')
      .add({
        title,
        price,
        source: doc.link,
        scheduleId: doc.id,
        createdAt: createdAt()
      })
  }

  db
    .collection('scheduled')
    .doc(doc.id)
    .update({ lastPrice: price })
}

exports.spider = {
  GET,
  saveHTML,
  createdAt,
  saveResults,
  sanitizeText,
  sanitizePrice
}

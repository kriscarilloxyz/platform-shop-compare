const admin = require('firebase-admin')
const functions = require('firebase-functions')
const { spiders } = require('./nest/spiders')
const { recentSales } = require('./modules/recentSales')

/** Initialize firebase */
admin.initializeApp()
const db = admin.firestore()

exports.recentSales = functions
  .pubsub
  .schedule('every 5 minutes')
  .onRun(async context => {

    // ping for recent_sales
    const pinged = [
      // { link: 'https://adelaidecanoeworks.com.au', spider: 'adelaidecanoeworks' },
      // { link: 'https://www.anacondastores.com', spider: 'anacondastores' },
      // { link: 'https://arnoldsboatshop.com.au', spider: 'arnoldsboatshop' },
      // { link: 'https://www.baysports.com.au', spider: 'baysports' },
      // { link: 'https://www.blackhawkoutdoor.com.au', spider: 'blackhawkoutdoor' },
      // { link: 'https://www.boatingcentral.com.au', spider: 'boatingcentral' },
      // { link: 'https://www.chsmith.com.au', spider: 'chsmith' },
      // { link: 'https://dinga.com.au', spider: 'dinga' },
      // { link: 'https://dreamkayaks.com.au', spider: 'dreamkayaks' },
      { link: 'https://www.findsports.com.au', spider: 'findsports' },
      { link: 'https://kayaks2fish.com', spider: 'kayaks2fish' },
      { link: 'https://kayaksandsups.com.au', spider: 'kayaksandsups' },
      // { link: 'https://www.motackle.com.au', spider: 'motackle' },
      // { link: 'https://paddlesportsmegastore.com.au', spider: 'paddlesportsmegastore' },
      // { link: 'https://slhobie.com.au', spider: 'slhobie' },
      // { link: 'https://surgekayaks.com.au', spider: 'surgekayaks' },
      // { link: 'https://theboatwarehouse.com.au', spider: 'theboatwarehouse' },
      // { link: 'https://weekendwarrior.net.au', spider: 'weekendwarrior' },
      // { link: 'https://www.whitworths.com.au', spider: 'whitworths' }
    ]

    for (let i = 0; pinged.length > i; i++) {
      const ping = pinged[i]
      console.log(`[LOG] Recent sales extraction start ${ping.link + '/ajax/recent_sales'}`)
      const params = {
        link: ping.link + '/ajax/recent_sales',
        spider: ping.spider

      }

      await recentSales(db, params)
    }
  })

/** Register scheduled function */
exports.spiders = functions
  .pubsub
  .schedule('every 2 minutes')
  .onRun(async context => {
    const query = db.collection('scheduled')
    const snapshot = await query.get()

    if (!snapshot.empty) {
      const tasks = []
      const docs = []
      snapshot.forEach(doc => docs.push({ ...doc.data(), id: doc.id }))
      console.log(`[LOG] ${docs.length} scheduled jobs.`)

      docs.forEach(doc => {
        const task = new Promise((resolve, reject) => spiders[doc.spider](db, doc))
        tasks.push(task)
      })

      if (tasks.length) {
        console.log(`[LOG] Running ${tasks.length} tasks.`)
        await Promise.all(tasks)
      } else {
        console.log('[LOG] No tasks to run.')
      }
    } else {
      console.log('[LOG] No scheduled jobs.')
    }

    return true
  })

const admin = require('firebase-admin')
const functions = require('firebase-functions')
const { spiders } = require('./nest/spiders')

/** Initialize firebase */
admin.initializeApp()
const db = admin.firestore()

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

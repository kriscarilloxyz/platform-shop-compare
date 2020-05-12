const admin = require('firebase-admin')
const functions = require('firebase-functions')
const axios = require('axios')
const express = require('express')
const cors = require('cors')
const { spiders } = require('./nest/spiders')
const { recentSales } = require('./modules/recentSales')

/** Initialize firebase */
admin.initializeApp()
const db = admin.firestore()

/** API */
const _validateNeto = () => {
  // initialize express server
  const app = express()
  app.use(cors({ origin: true }))

  app.post('/', async (req, res) => {
    const link = req.body.link
    let isValid = false

    if (link) {
      try {
        const response = await axios.get(link)
        if (response.data.includes('NETO')) {
          isValid = true
        }
      } catch (err) {
        isValid = false
      }
    }

    res.send(isValid)
  })

  return app
}

const validateNeto = _validateNeto()
exports.validateNeto = functions.https.onRequest(validateNeto)

exports.recentSales = functions
  .pubsub
  .schedule('every 5 minutes')
  .onRun(async context => {
    const query = db.collection('recentSales')
    const snapshot = await query.get()

    if (!snapshot.empty) {
      const docs = []
      snapshot.forEach(doc => docs.push({ ...doc.data(), id: doc.id }))
      for (let i = 0; docs.length > i; i++) {
        const doc = docs[i]
        console.log(`[LOG] Recent sales extraction start ${doc.netoUrl}`)
        await recentSales(db, doc)
      }
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

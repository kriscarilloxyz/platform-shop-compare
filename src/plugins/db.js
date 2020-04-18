import config from './config'
import firebase from 'firebase'

const db = firebase.initializeApp(config.firebase.config)
  .firestore()

export default db

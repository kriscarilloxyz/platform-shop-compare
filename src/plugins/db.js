import firebase from 'firebase'

const db = firebase
  .initializeApp({
    apiKey: 'AIzaSyDlTlChsM5ErVaZPsO7snd15oH-YH133PQ',
    authDomain: 'shopcompare-33b52.firebaseapp.com',
    databaseURL: 'https://shopcompare-33b52.firebaseio.com',
    projectId: 'shopcompare-33b52',
    storageBucket: 'shopcompare-33b52.appspot.com',
    messagingSenderId: '559838289228',
    appId: '1:559838289228:web:d8747f19740ce3ef4bc3e9'
  })
  .firestore()

export default db

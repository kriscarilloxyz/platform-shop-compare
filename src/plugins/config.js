const config = {
  /** Vuetify */
  vuetify: {
    icons: { iconfont: 'mdi' },
    theme: {
      themes: {
        light: {
          primary: '#00d1b2',
          accent: '#ffdd57',
          error: '#f14668'
        }
      }
    }
  },
  /** Firebase */
  firebase: {
    config: {
      apiKey: 'AIzaSyBFrEO7mmxzvoTIjE3B_u76FHxkD9C_-iI',
      authDomain: 'mineta-template-basic.firebaseapp.com',
      databaseURL: 'https://mineta-template-basic.firebaseio.com',
      projectId: 'mineta-template-basic',
      storageBucket: 'mineta-template-basic.appspot.com',
      messagingSenderId: '132760495513',
      appId: '1:132760495513:web:16474d66df93f4ccbcdf08'
    }
  }
}

export default config

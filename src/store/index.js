import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadingScreen: true,
    user: false,
    scheduled: []
  },
  mutations: {
    UPDATE_USER (state, payload) { state.user = payload },
    UPDATE_LOADING_SCREEN (state, payload) { state.loadingScreen = payload },
    UPDATE_SCHEDULED (state, payload) { state.scheduled = payload }
  },
  actions: {
  },
  modules: {
  }
})

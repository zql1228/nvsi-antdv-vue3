import { createStore } from 'vuex'
import app from './modules/app'
import userinfo from './modules/userInfo'
import codeValue from './modules/codeValue'
import getters from './getters'
import persistedState from 'vuex-persistedstate'

export default createStore({
  modules: {
    app,
    userinfo,
    codeValue,
  },
  getters,
  plugins: [persistedState({ storage: window.sessionStorage })],
})

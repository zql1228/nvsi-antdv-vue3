import storage from 'store'
import Router from '../../router'
import { LocalGetUserInfo } from '@/utils/localStorage'
import { ACCESS_TOKEN, LOGIN_SUCCESS, USER, USERINFO, USER_MENU, USER_ROLE } from '@/store/mutation-types'

export default {
  state: {
    userInfo: {},
    station: {},
    token: '',
    roles: [],
    info: {},
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo
    },
    getStation(state) {
      return state.station
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },

    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SetUserInfo: (state, data) => {
      state.userInfo = data
    },
    SetStation: (state, data) => {
      state.station = data
    },
  },
  actions: {
    ToggleUserInfo: ({ commit }, data) => {
      commit('SetUserInfo', data)
    },
    ToggleStation: ({ commit }, data) => {
      commit('SetStation', data)
    },
    // 获取用户信息
    GetInfo({ commit, state, getters }) {
      return new Promise((resolve) => {
        const userInfo = LocalGetUserInfo()
        commit('SET_ROLES', [])
        resolve(userInfo)
      })
    },

    // 登出
    Logout({ commit, getters }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // commit('SET_TOKEN', '')
          // commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          storage.remove(LOGIN_SUCCESS)
          storage.remove(USERINFO)
          storage.remove(USER)
          storage.remove(USER_MENU)
          storage.remove(USER_ROLE)
          sessionStorage.clear()
          Router.push('/login')
          resolve()
        }, 500)
      })
    },
  },
}

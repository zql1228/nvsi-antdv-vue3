export default {
  state: {
    nav: [],
  },
  // 开发
  mutations: {
    SET_NAV: (state, data) => {
      state.nav = data
    },
  },
  // 产品
  actions: {
    ToggleNav: ({ commit }, data) => {
      commit('SET_NAV', data)
    },
  },
}

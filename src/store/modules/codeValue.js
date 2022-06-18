export default {
  state: {
    codeValue: {},
  },
  getters: {
    getCodeValue(state) {
      return state.codeValue || {}
    },
  },
  mutations: {
    setCodeValue(state, { key, value }) {
      state.codeValue[key] = value
    },
  },
}

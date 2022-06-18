import map from './map.vue'
import BaiduMap from './../BaiduMap.vue'
export default {
  install: (app, options) => {
    const { ak } = options
    app.provide('_ak', { ak })
    app.component('IAMap', map)
    app.component('baidu-map', BaiduMap)
  },
}

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Antd from 'ant-design-vue'
import store from './store'
import './permission' // 全局路由守卫
import './utils/leap/base'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'ant-design-vue/dist/antd.css'
// 全局css 有覆盖全局样式
import './main.less'
import './assets/css/main.css'
import userVuedirective from './plugins/vue-directive'
import useVueIcons from './plugins/icons-vue'
// import useAntd from '@/plugins/antd-components'

import 'default-passive-events'

// 全局组件
import { message } from 'ant-design-vue'
import {
  PageWrapper,
  PageFormTableWrapper,
  BasicSearchForm,
  BasicSearchTable,
  IATable,
  AreaFormItem,
  AreaDevide,
  MultiTab,
  BaiduMap,
  PageTreeAndFormTableWrapper,
  macArea,
  AreaDevNew,
} from '@/components'

import BasicFormTable from '@/components/Page/BasicFormTable.vue'
import pagination from '@/components/pagination/default.vue'

const app = createApp(App)
app.use(router)
app.use(Antd)
app.use(store)
app.use(VueAxios, axios)
app.component('QuillEditor', QuillEditor)

// 全局组合组件
app.component('message', message)
app.component('PageWrapper', PageWrapper)
app.component('PageFormTableWrapper', PageFormTableWrapper)
app.component('PageTreeAndFormTableWrapper', PageTreeAndFormTableWrapper)

// 全局单独组件
app.component('BasicSearchForm', BasicSearchForm)
app.component('BasicSearchTable', BasicSearchTable)
app.component('IATable', IATable)
app.component('AreaFormItem', AreaFormItem)
app.component('AreaDevide', AreaDevide)
app.component('AreaDevNew', AreaDevNew)
app.component('macArea', macArea)
app.component('MultiTab', MultiTab)

app.component('BasicFormTable', BasicFormTable)
app.component('pagination', pagination)
message.config({
  duration: 2,
  maxCount: 1,
})
app.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: '3f5CieCay2AGRyDcDesLpX3uizOqNE40',
})

// 全局自定义指令
userVuedirective(app)
// 全局图标组件
useVueIcons(app)
// antd 组件按需引入
// useAntd(app)

window.onresize = function () {
  window.postMessage({ type: 'resize' })
}

app.mount('#app')

class Stack {
  constructor() {}
}

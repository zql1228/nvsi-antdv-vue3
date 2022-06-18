// 全局的图标组件,可以用这种方式去统一注册,不用再每个组件中去引入
import * as icons from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
const vueIcons = ['']
const vuePagesIcon = [
  {
    page: 'layout',
    name: '',
    module: 'layout',
    vueIcons: ['DeleteOutlined'],
  },
  {
    page: '',
    name: 'yj',
    module: '',
    vueIcons: [],
  },
  {
    page: '',
    name: 'zql',
    module: '',
    vueIcons: [],
  },
  {
    page: '',
    name: 'kj',
    module: '',
    vueIcons: [],
  },
]
export default function useVueIcons(app) {
  vuePagesIcon.forEach((pageModule) => {
    if (Array.isArray(pageModule.vueIcons)) {
      pageModule.vueIcons.forEach((iconName) => {
        if (icons[iconName]) {
          app.component(iconName, icons[iconName])
          // console.log(`图标组件 ${iconName} 注册成功`)
        } else {
          console.log(`icons-vue组件图标库中不存在组件 ${iconName} `)
          // message.warning(`icons-vue组件图标库中不存在组件${iconName}`)
        }
      })
    }
  })
}

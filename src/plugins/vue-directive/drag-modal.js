import { nextTick, onMounted, watch } from 'vue'

export default function useDrag(app, key) {
  // 弹窗拖拽属性
  /**
   * @directive 自定义属性
   * @todo 弹窗拖拽属性
   * @desc 使用在弹窗内部任意加载的html添加v-drag
   * @param .ant-modal-header 弹窗头部用来拖动的属性
   * @param .ant-modal 拖动的属性
   */
  window.dragModal = () => {
    let dragDom = document.querySelector('.ant-modal')
    let dialogHeaderEl = document.querySelector('.ant-modal-header')
    let sty = document.querySelector('.ant-modal').style
    dialogHeaderEl.style.cursor = 'move'
    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const X = e.clientX //鼠标位置
      const Y = e.clientY
      const disX = e.clientX - e.offsetX //拖拽的dom所在位置
      const disY = e.clientY - e.offsetY

      dragDom.style.margin = '0px'
      dragDom.style.position = 'absolute'
      dragDom.style.left = disX
      dragDom.style.top = disY
      // 获取到的值带px 正则匹配替换
      let styL, styT, dragDomWidth, dragDomHeight

      //注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/px/g, '')
        styT = +sty.top.replace(/px/g, '')
        dragDomWidth = +sty.width.replace(/px/g, '')
        dragDomHeight = +sty.height.replace(/px/g, '')
      }

      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - X
        const t = e.clientY - Y

        // 移动当前元素
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`

        const screenWidth = document.body.clientWidth
        const screenHeight = document.body.clientHeight
        if (l + styL <= 0) {
          dragDom.style.left = 0
        } else if (l + styL >= screenWidth - dragDomWidth) {
          dragDom.style.left = `${screenWidth - dragDomWidth}px`
        }
        if (t + styT <= 0) {
          dragDom.style.top = 0
        } else if (t + styT >= screenHeight - dragDomHeight) {
          dragDom.style.top = `${screenHeight - dragDomHeight}px`
        }

        //将此时的位置传出去
        //binding.value({x:e.pageX,y:e.pageY})
      }

      document.onmouseup = function(e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
  app.directive(key, {
    // 当被绑定的元素挂载到 DOM 中时
    mounted(el, binding, vnode) {
      console.log(el, 'el')
      // dragModal()
    },
  })
}

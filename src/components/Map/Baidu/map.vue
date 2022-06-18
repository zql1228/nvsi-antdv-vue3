<template>
  <!--  @change="searchHandle" -->
  <a-spin :spinning="spinning">
    <div class="map-container" :style="containStyleRef">
      <a-auto-complete
        class="map-serach-input"
        v-model:value="searchItemRef.keywords"
        :options="searchResult"
        size="large"
        ref="searchComRef"
        @select="onMapSelect"
        @search="onMapSearch"
      >
        <!-- <template #option="item"> 3333 {{ item.title }} </template> -->
        <a-input-search size="large" :placeholder="searchItemRef.placeholder" enter-button></a-input-search>
      </a-auto-complete>

      <div ref="BMapRef" :style="mapStyle"></div>
      <slot></slot>
    </div>
  </a-spin>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, onMounted, nextTick, inject, watch } from 'vue'
import VueTypes, { func } from 'vue-types'
import util from '@/utils/util'
import { result } from 'lodash'
import getPosition from './getPosition'
// props, { attrs, emit, slots, expose }
export default defineComponent({
  name: 'BaiduMap',
  components: {},
  emits: ['ready', 'mapSelect'],
  props: {
    zoom: VueTypes.number,
    ready: VueTypes.func,
    containStyle: VueTypes.object,
    containerWidht: VueTypes.string.required,
    containerHeight: VueTypes.string.required,
    searchItem: VueTypes.object,
  },
  setup(props, { emit }) {
    const BMapRef = ref()
    const searchResult = ref([])
    const localMapData = ref()
    const searchComRef = ref()
    const spinning = ref(false)
    const searchItemRef = reactive({
      placeholder: '请输入关键字查询',
      keywords: null,
    })
    const centerPoint = inject('centerPoint')
    let center = {
      lng: '',
      lat: '',
    }
    const init = () => {
      const { ak } = inject('_ak')
      nextTick(() => {
        getMapScript(ak).then(async (BMap) => {
          // 创建Map实例
          const map = new BMap.Map(BMapRef.value)
          // 初始化地图,设置中心点坐标和地图级别
          const point = await getPosition(BMap, {})
          // spinning.value = false
          map.centerAndZoom(point, props.zoom)
          //开启鼠标滚轮缩放
          map.enableScrollWheelZoom(true)
          localMapData.value = { localBMap: BMap, localMap: map }
          emit('ready', localMapData)

          // 监听用户点击事件抓取点等操作
          const geocoder = new BMap.Geocoder()
          const markerList = [] // 点标记数组
          let currentId = null
          map.addEventListener('click', (e) => {
            geocoder.getLocation(e.point, (rs) => {
              const result = []
              searchItemRef.keywords = rs.address
              if (rs && rs.surroundingPois && rs.surroundingPois.length > 0) {
                emit('onMapClick', { val: rs.address, e: rs })
              }
            })
            // 添加一个点标记
            // 对每一次点击创建点标记 lat,经度  lng 纬度
            const point = new BMap.Point(e.point.lng, e.point.lat)
            const marker = new BMap.Marker(point) // 创建标注
            currentId = util.randomUUID()
            marker.id = currentId
            markerList.push(marker)
            map.addOverlay(marker) // 将标注添加到地图中
            // console.log(map.getOverlays(), 'getOverlays')
            // 移除其他的点标记,只保留当前点击的点
            markerList.forEach((mark) => {
              if (mark.id !== currentId) {
                map.removeOverlay(mark)
              }
            })
          })
        })
      })
    }

    // 创建地图实例
    // const getCenterPoint = async (BMap) => {
    //   // 默认定位北京
    //   if (Object.values(center).filter((item) => Boolean(item)).length > 0) {
    //     center = centerPoint
    //     console.log(center, '___+===')
    //     return new BMap.Point(center.lat, center.lng)
    //   } else {
    //     center = {
    //       lat: 116.404,
    //       lng: 39.915,
    //     }
    //     return new BMap.Point(center.lat, center.lng)
    //   }
    //   // return new BMap.Point(center.lat, center.lng)
    // }
    const getMapScript = (ak) => {
      return new Promise((resolve) => {
        window._initBaiduMap = function () {
          resolve(BMap)
        }
        const $script = document.createElement('script')
        $script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=_initBaiduMap`
        document.body.appendChild($script)
      })
    }
    const onSearchComplete = (res) => {
      const result = []
      if (res && res.Cr && res.Cr.length > 0) {
        res.Cr.forEach((item) => {
          item.value = item.title
          item.key = item.uid
          result.push(item)
        })
      }
      searchResult.value = result
    }

    const onMapSearch = (keys) => {
      return new Promise((resolve, reject) => {
        const { localBMap, localMap } = localMapData.value
        localMap.clearOverlays()
        var local = new localBMap.LocalSearch(localMap, {
          onSearchComplete,
          renderOptions: { map: localMap },
        })
        local.clearResults()
        local.search(keys)
        resolve()
      })
    }
    const onMapSelect = async (val, e) => {
      onMapSearch(val).then(() => {
        emit('mapSelect', { val, e })
      })
    }

    // 样式处理    ----------↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    const initStyle = () => {
      const searchInputHeight = calculateSearchInputHeight()
      style.mapStyle.height = style.containStyleRef.height = `calc(${props.containerHeight} - ${searchInputHeight})`
      style.mapStyle.top = `-${searchInputHeight}`
    }

    // 计算 搜索框的高度
    const calculateSearchInputHeight = () => {
      return '40px'
    }

    const style = reactive({
      mapStyle: {
        top: '',
        width: `${props.containerWidht}`,
        height: `${props.containerHeight}`,
      },
      containStyleRef: {
        width: `${props.containerWidht}`,
        height: `${props.containerHeight}`,
      },
    })
    // watch(
    //   () => props.center,
    //   () => {
    //     if (Object.values(props.center).filter((item) => Boolean(item)).length > 0) {
    //       console.log(Object.values(props.center))
    //       console.log('init----map')
    //       init()
    //     }
    //   },
    //   {
    //     deep: true,
    //   }
    // )
    // 样式处理    ----------↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    onMounted(() => {
      init()
      initStyle()
    })

    return {
      BMapRef,
      ...toRefs(style),
      searchItemRef,
      onMapSearch,
      searchResult,
      onMapSelect,
      searchComRef,
      spinning,
    }
  },
})
</script>
<style lang="less" scoped>
.map-container {
  overflow: hidden;
  margin: 0;
  font-family: 微软雅黑;
  .map-serach-input {
    top: 20px;
    width: 60%;
    z-index: 999;
    margin-left: 1.25rem;
    background-color: #fff;
    border-radius: 0.25rem;
    font-size: 14px;
    color: #666;
    box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
  }
}
</style>

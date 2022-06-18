<template>
  <div id="baiduMapModal">
    <a-modal :width="'calc(100vw - 560px)'" :visible="visible" title="地图" ok-text="确认" cancel-text="取消" @ok="confirm" @cancel="hideModal">
      <!-- 测试 -->
      <IAMap
        :center="center"
        :zoom="zoom"
        @ready="handler"
        ref="IAMapRef"
        @mapSelect="mapSelect"
        @onMapClick="onMapClick"
        :containerWidht="'calc(100vw - 560px - 48px)'"
        :containerHeight="'calc(100vh - 260px - 48px)'"
      ></IAMap>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, onMounted, provide, watch } from 'vue'
import VueTypes from 'vue-types'
import { message } from 'ant-design-vue'
// props, { attrs, emit, slots, expose }
export default defineComponent({
  name: 'BaiduMap',
  emits: ['resuleHandel'],
  components: {},
  props: {
    visible: VueTypes.bool.required,
    center: {
      type: Object,
      default: () => ({
        lat: '', // 维度
        lng: '', // 经度
      }),
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      loading: false,
      center: {
        lng: '', // 经度
        lat: '', // 维度
      },
      zoom: 15,
    })
    const mapAddressClick = reactive({
      val: null,
      e: null,
    })
    const IAMapRef = ref()
    provide('centerPoint', props.center)
    const handler = (map) => {
      const {
        center: { lng, lat },
      } = props
      state.center.lng = lng // 经度
      state.center.lat = lat // 维度
      state.zoom = 15
    }
    const mapSelect = ({ val, e }) => {
      mapAddressClick.val = val
      mapAddressClick.e = e
      emit('resuleHandel', { val, e })
    }
    const onMapClick = ({ val, e }) => {
      // console.log(val, e)
      mapAddressClick.val = val
      mapAddressClick.e = e
    }
    const confirm = () => {
      const { val, e } = mapAddressClick
      if (val && e) {
        emit('resuleHandel', { val, e })
        emit('update:visible', false)
      } else {
        message.warning('请重新选择地址')
      }
    }
    const hideModal = () => {
      IAMapRef.value.searchItemRef.keywords = ''
      mapAddressClick.val = null
      mapAddressClick.e = null
      emit('update:visible', false)
    }
    return {
      confirm,
      hideModal,
      IAMapRef,
      handler,
      ...toRefs(state),
      mapSelect,
      onMapClick,
    }
  },
})
</script>
<style lang="less" scoped></style>

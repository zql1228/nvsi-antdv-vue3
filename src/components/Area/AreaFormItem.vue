<template>
  <a-cascader :loadData="onLoadData" :options="options" :fieldNames="{ label: 'area', value: 'areaid', children: 'child' }" change-on-select>
  </a-cascader>
</template>

<script>
import VueTypes from 'vue-types'
import { rpcPost } from './../../server/conf/index.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { getMunicipalityAreaId } from './utils'
import { message } from 'ant-design-vue'
import { defineComponent, reactive, ref, toRefs, onMounted } from 'vue'
export default defineComponent({
  name: 'AreaFormItem',
  components: {},
  props: {
    showAll: VueTypes.bool.def(false), // 是否从全国显示
    showLevel: VueTypes.number.def(3), // 显示等级 有问题
    // modelValue: VueTypes.string,
    defaultValue: VueTypes.string, // 默认数据 未实现
    record: VueTypes.func, // 拿到所有数据 未实现
  },
  // props, { attrs, emit, slots, expose }
  setup(props, { emit }) {
    const userInfo = ref(LocalGetUserInfo())
    const state = reactive({
      loading: false,
      options: [],
      defaultValue: [],
    })

    const listAreaCache = (areaId, oneself) => {
      if (!areaId) {
        return null
      }
      const { areaIdData } = getMunicipalityAreaId(areaId)
      const showLevel = props.showLevel
      // if (directlyCity) {
      //   showLevel = showLevel + 1
      // }
      const bean = {
        bean: areaIdData,
      }
      return new Promise((resolve) => {
        rpcPost('areaTree', bean)
          .then((res) => {
            const _data = res.data
            if (!_data) {
              resolve([])
            }
            const areaList = _data.child
            if (areaList) {
              areaList.forEach((item) => {
                if (item.level !== showLevel) {
                  item.isLeaf = false
                } else {
                  item.isLeaf = true
                }
              })
            }
            if (oneself) {
              _data.child = areaList
              _data.isLeaf = false
              resolve([_data])
            } else {
              resolve(areaList)
            }
          })
          .catch((e) => {
            message.error(e)
          })
      })
    }

    const initArea = () => {
      let oneself = false
      let areaId = '0'
      if (props.showAll) {
        // 这个地方还得判断下，要是部级才可以看所有的
        areaId = '0'
      } else {
        oneself = true
        areaId = userInfo.value.areaid
        if (areaId === '000000000000000000') {
          oneself = false
          areaId = '0'
        }
        state.defaultValue = [areaId]
        emit('update:value', state.defaultValue)
      }
      listAreaCache(areaId, oneself).then((res) => {
        state.options = res
      })
    }

    const onLoadData = (selectedOptions) => {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      listAreaCache(targetOption.areaid).then((res) => {
        if (res && res.length > 0) {
          targetOption.child = res
          state.options = [...state.options]
        } else {
          targetOption.isLeaf = true
        }
        targetOption.loading = false
      })
    }

    const defaultInitArea = () => {}

    onMounted(() => {
      if (props.defaultValue) {
        defaultInitArea()
      } else {
        initArea()
      }
    })
    return {
      ...toRefs(state),
      onLoadData,
    }
  },
})
</script>
<style lang="less" scoped></style>

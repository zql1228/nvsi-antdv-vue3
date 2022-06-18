<template>
  <!-- 管理部门页面搜索条件 区划组件 -->
  <a-cascader
    :loadData="onLoadData"
    :options="options"
    :fieldNames="{ label: 'area', value: 'areaid', children: 'child' }"
    change-on-select
    :allowClear="false"
  >
  </a-cascader>
</template>

<script>
import VueTypes from 'vue-types'
import { rpcPost } from './../../server/conf/index.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { getMunicipalityAreaId } from './utils'
import { message } from 'ant-design-vue'
import { defineComponent, reactive, ref, toRefs, onMounted, onBeforeMount } from 'vue'
export default defineComponent({
  name: 'macArea',
  components: {},
  props: {
    islevel: {
      type: Boolean,
      default: true, //是否默认选择第一个子节点
    },
    showLevel: {
      type: Number,
      default: 3, //默认选到区级不在往下
    },
    isHave: {
      type: Boolean,
      default: true, //是否要全国节点
    },
  },
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
                if (item.level * 1 < showLevel * 1) {
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
            console.log(e, 'e')
            message.error(e)
          })
      })
    }

    const initArea = () => {
      let oneself = userInfo.value.areaLevel == '0' ? false : true
      let areaId = userInfo.value.areaLevel == '0' ? '0' : userInfo.value.areaid
      listAreaCache(areaId, oneself).then((res) => {
        state.options = res
        if (userInfo.value.areaLevel == '3') {
          //区级选中自己并且不用显示街道
          state.options[0].isLeaf = true
          delete state.options[0].child
          state.defaultValue = [res[0].areaid]
          emit('update:value', state.defaultValue)
          return
        }
        if (state.options[0].area == '全国') {
          //全国选项没有下一级直接将isLeaf赋值为true
          state.options[0].isLeaf = true
        }
        if (res && res.length > 0) {
          if (!props.islevel) {
            //不需要默认选到下一级
            if (!props.isHave && userInfo.value.areaLevel == '0') state.options.shift() //某些页面去掉全国节点
            state.defaultValue = [state.options[0].areaid]
            emit('update:value', state.defaultValue)
          } else {
            //需要默认选到下一级
            if (userInfo.value.areaLevel != '0') {
              //不是全国的账号默认选中第一个子节点(区级选中自己)
              if (res[0].level === 3) {
                //区级 选中自己
                state.defaultValue = [res[0].areaid]
              } else {
                //省市选中第一个子节点
                state.defaultValue = [res[0].areaid, res[0].child[0].areaid]
              }
              emit('update:value', state.defaultValue)
            } else {
              //去除全国选项 并查询第一个省份下的子节点北京 获取该省第一个市的区划并选中
              state.options.shift()
              listAreaCache(state.options[0].areaid, true).then((res) => {
                state.options[0].child = res[0].child
                state.defaultValue = [state.options[0].areaid, state.options[0].child[0].areaid]
                emit('update:value', state.defaultValue)
              })
            }
          }
        }
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

    onMounted(() => {
      initArea()
    })
    return {
      ...toRefs(state),
      onLoadData,
    }
  },
})
</script>
<style lang="less" scoped></style>

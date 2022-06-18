<template>
  <!-- 管理部门页面搜索条件 区划组件 -->
  <a-cascader
    :loadData="onLoadData"
    :options="options"
    :fieldNames="{ label: 'showname', value: 'resourcecode', children: 'child' }"
    change-on-select
    :allowClear="false"
  >
  </a-cascader>
</template>

<script>
import VueTypes from 'vue-types'
import { rpcPost } from '@/server/conf/index.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { message } from 'ant-design-vue'
import { defineComponent, reactive, ref, toRefs, onMounted, onBeforeMount } from 'vue'
export default defineComponent({
  name: 'seaResource',
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
    minLevel: {
      type: Number,
      default: null, //最低要选到的区划级别 0全国 1省级 2市级 3区级 4街道
    },
  },
  setup(props, { emit }) {
    const userInfo = ref(LocalGetUserInfo())
    const state = reactive({
      loading: false,
      options: [],
      defaultValue: '', //不是数组[] 之后''
    })

    const listAreaCache = (areaId, oneself) => {
      if (!areaId) {
        return null
      }
      const areaIdData = areaId
      const showLevel = props.showLevel
      // if (directlyCity) {
      //   showLevel = showLevel + 1
      // }
      const bean = {
        bean: {
          resourcecode: areaIdData,
        },
      }
      return new Promise((resolve) => {
        rpcPost('getSeaResource', bean)
          .then((res) => {
            const _data = res.data
            if (!_data) {
              resolve([])
            }
            const areaList = _data
            if (areaList) {
              areaList.forEach((item) => {
                if (item.resourcetype !== showLevel) {
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
      let oneself = userInfo.value.areaLevel == '0' || '1' ? false : true
      //要用当前选中的资源选择下一个
      let areaId = userInfo.value.areaLevel == '0' ? '0' : userInfo.value.areaid
      listAreaCache(areaId, oneself).then((res) => {
        state.options = res
        // if (state.options[0].showname == '全国') state.options[0].isLeaf = true //全国选项没有下一级直接将isLeaf赋值为true
        if (res && res.length > 0) {
          if (!props.islevel) {
            //不需要默认选到下一级 不管whichone都选到它自己
            state.defaultValue = [res[0].resourcecode]
            emit('update:value', state.defaultValue)
          } else {
            //需要默认选到下一级
            if (userInfo.value.areaLevel != '0') {
              //不是全国的账号默认选中第一个子节点(区级选中自己)
              if (res[0].resourcetype === 3) {
                //区级 选中自己
                state.defaultValue = [res[0].resourcecode]
              } else {
                //省市选中第一个子节点  这个有点问题选中下一级
                state.defaultValue = [res[0].resourcecode, res[0].child[0].resourcecode]
              }
              emit('update:value', state.defaultValue)
            } else {
              //去除全国选项 并查询第一个省份下的子节点北京 获取该省第一个市的区划并选中
              state.options.shift()
              listAreaCache(state.options[0].resourcecode, true).then((res) => {
                // state.options[0].child = res[0].child
                state.defaultValue = [state.options[0].resourcecode, state.options[0].child[0].resourcecode]
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
      //每次获取了code之后赋值
      listAreaCache(targetOption.resourcecode).then((res) => {
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

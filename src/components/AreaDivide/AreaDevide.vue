<template>
  <a-cascader
    style="max-width: 100%"
    :loadData="onLoadData"
    :options="options"
    :fieldNames="{ label: 'area', value: 'areaid', children: 'child' }"
    v-model:value="defaultValue"
    @change="changeSelect"
    change-on-select
    :disabled="disabled"
    :allowClear="false"
  >
  </a-cascader>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount, watch, nextTick } from 'vue'
import VueTypes from 'vue-types'
import { rpcPost } from './../../server/conf/index.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { getMunicipalityAreaId } from '../Area/utils'
import { message } from 'ant-design-vue'
export default defineComponent({
  name: 'AreaDevide',
  props: {
    type: {
      // mounted走不走：true:走
      type: Boolean,
      default: true,
    }, //true直接调用账号areaid查区划  false等待传参查区划
    showAll: VueTypes.bool.def(false), // 是否从全国显示
    showLevel: VueTypes.number.def(3), // // 显示等级
    value: VueTypes.array, // v-modal绑定的value
    maxArea: VueTypes.string, // 最高级展示的areaid
    disabled: {
      //是否被禁用
      type: Boolean,
      default: false,
    },
    onChange: VueTypes.func, // 去除警告，不知道有什么用,应该是验证的时候 触发条件是 onChange 但是，奇奇怪怪讲不清，
  },
  setup(props, { emit }) {
    const userInfo = ref(LocalGetUserInfo()) // areaLevel 0 全国号 查询的时候逆推到全国
    // userInfo.value.areaLevel = '0'
    const areaName = ref('')
    const state = reactive({
      loading: false,
      options: [],
      value: [],
      defaultValue: [],
    })
    const changeSelect = (value, selectedOptions) => {
      const arrArea = selectedOptions.map((item) => item.area)
      areaName.value = arrArea.join('')
      emit('update:value', value)
      emit('update:areaName', areaName)
      emit('changeArea', value[value.length - 1])
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
    const listAreaCache = (areaId, oneself) => {
      const { showLevel } = props
      if (!areaId) {
        return null
      }
      const { areaIdData } = getMunicipalityAreaId(areaId)
      const bean = {
        bean: areaIdData,
      }

      return new Promise((resolve) => {
        rpcPost('areaTree', bean)
          .then((res) => {
            if (res.data == null) {
              return []
            }
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
                  item.child = null
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
            message.warning(e)
          })
      })
    }
    const defaultInitArea = async (areaid) => {
      let { showAll, showLevel, type } = props
      let value = []
      type ? (value = props.value) : (value = areaid)
      value = value.filter((item) => Boolean(item))
      if (value.length === 1) {
        if (value[0] == '100000000000000000' || value[0] == '000000000000000000') {
          const res = await listAreaCache('0', true)
          res[0].child.find((item) => item.areaid == value[0]).isLeaf = true
          state.options = res[0].child
          state.defaultValue = ['100000000000000000']
          emit('update:value', state.defaultValue)
        } else {
          if (showAll) {
            const res = await listAreaCache('0', true)
            const index = res[0].child.indexOf(res[0].child.find((item) => item.areaid == '100000000000000000'))
            res[0].child.splice(index, 1)
            state.options = res[0].child
          } else {
            const resArea = await listAreaCache(value[0], true)
            const areas = resArea[0].areas
            emit('update:value', areas)
            let proIndex
            let newAreas = []
            for (let i = 0; i < areas.length; i++) {
              const resAreaLevelData = await listAreaCache(areas[i], true)
              if (resAreaLevelData[0].level == showLevel) {
                proIndex = i
                break
              }
              if (showLevel > resAreaLevelData[i].level) {
                proIndex = areas.length - 1
                break
              }
            }
            for (let i = 0; i <= proIndex; i++) {
              newAreas.push(areas[i])
            }
            newAreas = newAreas.filter((item) => Boolean(item))
            if (newAreas.length == 1) {
              const countryArea = await listAreaCache('0', true)
              const option = countryArea[0].child.find((item) => item.areaid == newAreas[0])
              state.options = [option]
            } else if (newAreas.length == 2) {
              const [resCountry, resProvince] = await Promise.all([listAreaCache('0', true), listAreaCache(newAreas[0], true)])
              resCountry[0].child.find((item) => item.areaid == resProvince[0].areaid).child = resProvince[0].child
              const option = resCountry[0].child.find((item) => item.areaid == newAreas[0])
              state.options = [option]
            } else if (newAreas.length == 3) {
              const [resProvince, rescity] = await Promise.all([listAreaCache(newAreas[0], true), listAreaCache(newAreas[1], true)])
              resProvince[0].child.find((item) => item.areaid == rescity[0].areaid).child = rescity[0].child
              state.options = resProvince
            } else if (newAreas.length == 4) {
              const [resProvince, rescity, streetArea] = await Promise.all([
                listAreaCache(newAreas[0], true),
                listAreaCache(newAreas[1], true),
                listAreaCache(newAreas[2], true),
              ])
              rescity[0].child.find((item) => item.areaid == streetArea[0].areaid).child = streetArea[0].child
              resProvince[0].child.find((item) => item.areaid == rescity[0].areaid).child = rescity[0].child
              state.options = resProvince
            }
            if (userInfo.value.areaLevel == '0') {
              const res = await listAreaCache('0', false)
              res[0].isLeaf = true
              res.find((item) => item.areaid == state.options[0].areaid).child = state.options[0].child
              state.options = res
            }
            state.defaultValue = newAreas
            emit('update:value', newAreas)
          }
        }
      }
    }
    const initArea = async () => {
      let oneself = false
      let areaId = '0'
      const { maxArea } = props
      if (props.showAll) {
        areaId = '0'
      } else {
        oneself = true
        areaId = maxArea ? maxArea : userInfo.value.areaid
        if (areaId === '000000000000000000' || areaId === '100000000000000000') {
          oneself = false
          areaId = '0'
        }
        state.defaultValue = [areaId]
        emit('update:value', state.defaultValue)
      }
      listAreaCache(areaId, oneself)
        .then((resTeamAreas) => {
          return listAreaCache(resTeamAreas[0].areas[0], oneself)
        })
        .then((res) => {
          state.options = res
          state.defaultValue = res[0].areas
          emit('update:value', state.defaultValue)
        })
        .catch((e) => {
          message.warning(e)
        })
    }
    watch(
      () => props,
      () => {
        if (props.value.length && props.type) {
          nextTick(() => {
            defaultInitArea()
          })
        } else if (props.type) {
          nextTick(() => {
            initArea()
          })
        }
      },
      {
        immediate: true,
      }
    )
    onMounted(() => {
      if (props.value.length && props.type) {
        nextTick(() => {
          defaultInitArea()
        })
      } else if (props.type) {
        nextTick(() => {
          initArea()
        })
      }
    })
    return {
      ...toRefs(state),
      ...toRefs(props),
      areaName,
      onLoadData,
      defaultInitArea,
      initArea,
      changeSelect,
    }
  },
})
</script>

<style scoped lang="less"></style>

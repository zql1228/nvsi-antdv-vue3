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
import { getMunicipalityAreaId, isMunicipality, municipality } from '../Area/utils'
import { message } from 'ant-design-vue'
const macArea = ['100000000000000000', '000000000000000000']
export default defineComponent({
  name: 'AreaDevNew',
  props: {
    type: {
      type: Boolean,
      default: true,
    },
    showAll: VueTypes.bool.def(false),
    showLevel: VueTypes.number.def(3),
    value: VueTypes.array,
    maxArea: VueTypes.string,
    disabled: {
      type: Boolean,
      default: false,
    },
    showMac: {
      type: Boolean,
      default: true,
    },
    onChange: VueTypes.func,
  },

  setup(props, { emit }) {
    const userInfo = ref(LocalGetUserInfo())
    const uAreaId = [userInfo.value.areaid]
    const areaName = ref('')
    const isInit = ref(false)
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
              resolve([])
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
      if (!Array.isArray(areaid)) {
        value.push(areaid)
      }
      type ? (value = props.value) : (value = areaid)
      value = value.filter((item) => Boolean(item))
      if (value.length == 1) {
        if (macArea.includes(value[0])) {
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

            newAreas = [...new Set(newAreas)]

            newAreas.forEach((areaid) => {
              if (isMunicipality(areaid)) {
                municipality.forEach((munty) => {
                  const munty01 = munty + '0100000000000000'
                  if (areaid === munty01) {
                    const index = newAreas.indexOf(areaid)
                    newAreas.splice(index, 1)
                  }
                })
              }
            })

            if (newAreas.length == 1) {
              const countryArea = await listAreaCache('0', true)
              const option = countryArea[0].child.find((item) => item.areaid == newAreas[0])
              state.options = [option]
            } else if (newAreas.length == 2) {
              const [res_country_area, res_provincial_area] = await Promise.all([listAreaCache('0', true), listAreaCache(newAreas[0], true)])
              res_country_area[0].child.find((item) => item.areaid == res_provincial_area[0].provincearea).child = res_provincial_area[0].child
              const option = res_country_area[0].child.find((item) => item.areaid == newAreas[0])
              state.options = [option]
            } else if (newAreas.length == 3) {
              const [res_country_area, res_provincial_area, res_Municipal_area] = await Promise.all([
                listAreaCache('0', true),
                listAreaCache(newAreas[0], true),
                listAreaCache(newAreas[1], true),
              ])

              res_provincial_area[0].child.find((item) => item.areaid == res_Municipal_area[0].areaid).child = res_Municipal_area[0].child
              res_country_area[0].child.find((item) => item.areaid == res_provincial_area[0].provincearea).child = res_provincial_area[0].child
              const option = res_country_area[0].child.find((item) => item.areaid == newAreas[0])
              state.options = [option]
            } else if (newAreas.length == 4) {
              const [resProvince, rescity, streetArea] = await Promise.all([
                listAreaCache(newAreas[0], true),
                listAreaCache(newAreas[1], true),
                listAreaCache(newAreas[2], true),
              ])

              rescity[0].child.find((item) => item.areaid == streetArea[0].areaid).child = streetArea[0].child
              resProvince[0].child.find((item) => item.areaid == rescity[0].areaid).child = rescity[0].child
              state.options = resProvince
            } else if (newAreas.length == 5) {
              const [resProvince, rescity, streetArea, shequArea] = await Promise.all([
                listAreaCache(newAreas[0], true),
                listAreaCache(newAreas[1], true),
                listAreaCache(newAreas[2], true),
                listAreaCache(newAreas[3], true),
              ])

              streetArea[0].child.find((item) => item.areaid == shequArea[0].areaid).child = shequArea[0].child
              rescity[0].child.find((item) => item.areaid == streetArea[0].areaid).child = streetArea[0].child
              resProvince[0].child.find((item) => item.areaid == rescity[0].areaid).child = rescity[0].child
              state.options = resProvince
            }
            state.defaultValue = newAreas
            emit('update:value', newAreas)
          }
        }
      } else if (value.length === 0) {
        const res = await listAreaCache('0', true)

        const index = res[0].child.indexOf(res[0].child.find((item) => item.areaid == '100000000000000000'))
        res[0].child.splice(index, 1)
        state.options = res[0].child
        state.defaultValue = []
        emit('update:value', [])
        emit('update:areaName', null)
      }
    }
    const initArea = async () => {
      let oneself = false
      let areaId = '0'
      const { maxArea, showAll } = props

      if (showAll) {
        areaId = '0'
      } else {
        oneself = true
        areaId = maxArea ? maxArea : uAreaId[0]
        if (areaId === '000000000000000000' || areaId === '100000000000000000') {
          oneself = false
          areaId = '0'
        }
      }
      if (areaId !== '0') {
        listAreaCache(areaId, oneself)
          .then((teamAreaRes) => {
            return listAreaCache(teamAreaRes[0].areas[0], oneself)
          })
          .then((res) => {
            state.options = res
            state.defaultValue = res[0].areas
            emit('update:value', state.defaultValue)
          })
          .catch((e) => {
            console.log(e)
            message.warning(e)
          })
      } else {
        listAreaCache(areaId, oneself)
          .then((res) => {
            res.find((item) => item.areaid == '100000000000000000').isLeaf = true
            state.defaultValue = ['100000000000000000']
            state.options = res
            emit('update:value', state.defaultValue)
          })
          .catch((e) => {
            message.warning(e)
          })
      }
    }
    watch(
      () => props,
      () => {
        const { type, value } = props
        if (type) {
          if (!isInit.value) {
            if (value.length === 0) {
              nextTick(() => {
                initArea()
                isInit.value = true
              })
            } else if (value.length === 1) {
              nextTick(() => {
                defaultInitArea(uAreaId)
                isInit.value = true
              })
            }
          }
        }
      },
      {
        immediate: true,
      }
    )
    onMounted(() => {
      const { type, value } = props
      if (type) {
        if (value.length === 0) {
          nextTick(() => {
            initArea()
          })
        } else if (value.length === 1) {
          nextTick(() => {
            defaultInitArea(uAreaId)
          })
        }
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

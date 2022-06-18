<template>
  <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }" ref="searchref">
    <a-row>
      <a-col :md="isshow == 2 ? 8 : 6">
        <a-form-item label="岗位名称" style="margin-bottom: 10px" class="m-label">
          <a-select label-in-value v-model:value="queryParam.station" @change="onchange">
            <a-select-option :value="el.id" v-for="(el, index) in selectStationList" :key="index">{{ el.albx0072 }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col v-show="isshow == 2" :md="8">
        <a-form-item label="队伍选择" style="margin-bottom: 10px">
          <a-select label-in-value v-model:value="queryParam.org" @change="changeOrg">
            <a-select-option :value="el.id" :areaid="el.albe0012" v-for="(el, index) in selectOrgList" :key="index">{{
              el.albe0002
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="isshow == 2 ? 8 : 6">
        <a-form-item label="姓名">
          <a-input placeholder="请输入姓名" v-model:value="queryParam.albp0003" @focus="onFocus(1)" />
        </a-form-item>
      </a-col>
      <a-col :md="isshow == 2 ? 8 : 6" v-show="isshow != '3'">
        <a-form-item label="身份证号">
          <a-input placeholder="请输入身份证号" :maxLength="18" v-model:value="queryParam.albp0005" @focus="onFocus(2)" />
        </a-form-item>
      </a-col>
      <a-col :md="isshow == 2 ? 8 : 6">
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="searchVol(1)">查询</a-button>
            <a-button @click="searchVol(2)">重置</a-button>
          </a-space>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
  <!-- </BasicSearchForm> -->
</template>
<script>
import { defineComponent, reactive, toRef, ref, toRefs, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
export default defineComponent({
  props: {
    isshow: {
      type: String, //1成员管理 2邀请队伍成员 3项目评价
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const userInfo = ref(LocalGetUserInfo())
    const areaLevel = userInfo.value.areaLevel
    const queryParam = reactive({
      albp0003: '',
      albp0005: '',
      station: { value: '', label: '' },
      org: { value: '', label: '' },
      albx0072: '',
      orgAreaid: '',
      albx0021: [],
    })
    const searchref = ref()
    const selectOrgList = ref()
    const selectStationList = ref()
    const onFocus = (val) => {
      if (val == 1) {
        queryParam.albp0005 = ''
      } else {
        queryParam.albp0003 = ''
      }
    }
    const init = () => {
      queryParam.albp0003 = ''
      queryParam.albp0005 = ''
      queryParam.albx0021 = []
      // queryParam.station.value = ''
      // queryParam.org.value = ''
      // queryParam.albx0072 = ''
      // queryParam.orgAreaid = ''
    }
    onMounted(() => {
      nextTick(() => {
        init()
        selectOrgList.value = [{ id: userInfo.value.team.groupid, albe0002: userInfo.value.team.albx0002, albe0012: userInfo.value.areaid }]
        queryParam.org.value = selectOrgList.value[0].id
        queryParam.org.label = selectOrgList.value[0].albe0002
        queryParam.orgAreaid = selectOrgList.value[0].albe0012
      })
    })

    const searchVol = (val) => {
      if (val == 2) {
        init()
      }
      emit('searchVol', { queryParam, isshow: props.isshow }) //调用父组件方法
    }
    //获取当前登录队伍下属队伍
    const getNextTeam = () => {
      return new Promise((resolve) => {
        apis.queryNextTeamPage({ id: userInfo.value.team.groupid, pageSize: 10, pageNum: 1 }).then((res) => {
          if (res.length > 0) {
            res.unshift({ id: userInfo.value.team.groupid, albe0002: userInfo.value.team.albe0002, albe0012: userInfo.value.areaid })
            selectOrgList.value = res
            queryParam.org.value = selectOrgList.value[0].id
            queryParam.org.label = selectOrgList.value[0].albe0002
            //  console.log(res)
          } else {
            selectOrgList.value = [{ id: userInfo.value.team.groupid, albe0002: userInfo.value.team.albe0002, albe0012: userInfo.value.areaid }]
            queryParam.org.value = selectOrgList.value[0].id
            queryParam.org.label = selectOrgList.value[0].albe0002
            queryParam.orgAreaid = selectOrgList.value[0].albe0012
          }
          resolve({ areaid: queryParam.orgAreaid, value: queryParam.org.value, label: queryParam.org.label })
        })
      })
    }
    const getSelectStationList = (record) => {
      // 获取当前项目岗位名称
      // console.log(props, 'searForm')
      return new Promise((resolve) => {
        const params = {
          proId: record.id, //,
          areaid: record.albx0021,
        }
        //console.log('岗位名称传参', params)
        apis.commonChangeJobFortis(params).then((res) => {
          //console.log('岗位名称', res)
          if (res) {
            selectStationList.value = res
            queryParam.station.value = res[0].id ? res[0].id : ''
            queryParam.station.label = res[0].albx0072 ? res[0].albx0072 : ''
            queryParam.albx0072 = res[0].albx0072 ? res[0].albx0072 : ''
            if (props.isshow == '2') {
              getNextTeam().then((res) => {
                if (res) {
                  queryParam.org.value = res.value
                  queryParam.org.label = res.label
                  queryParam.orgAreaid = res.areaid
                }
                resolve(queryParam)
              })
            } else {
              resolve(queryParam)
            }
          }
        })
      })
    }
    const onchange = (val) => {
      // console.log(val, '切换岗位')
      queryParam.station.value = val.value
      queryParam.station.label = val.label.children ? val.label.children : val.label
      queryParam.albx0072 = val.label.children ? val.label.children : val.label
      backQueryparam()
    }
    const changeOrg = (val, option) => {
      // console.log(val, option, '切换队伍')
      queryParam.org.value = val.value
      queryParam.org.label = val.label.children ? val.label.children : val.label
      queryParam.orgAreaid = option.areaid
    }
    const backQueryparam = () => {
      return queryParam
    }
    onUnmounted(() => {
      queryParam.station.value = ''
      queryParam.org.value = ''
      queryParam.station.label = ''
      queryParam.org.label = ''
    }),
      watch(
        () => props.isshow,
        (isshow) => {}
      )
    watch(
      () => queryParam,
      () => {}
    )
    return {
      queryParam,
      ...toRefs(props),
      areaLevel,
      onFocus,
      init,
      searchref,
      searchVol,
      selectOrgList,
      selectStationList,
      onchange,
      changeOrg,
      getNextTeam,
      getSelectStationList,
      backQueryparam,
    }
  },
})
</script>
<style scoped></style>

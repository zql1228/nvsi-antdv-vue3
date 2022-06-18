<template>
  <a-drawer title="更换岗位" :headerStyle="{ fontWeight: 800 }" :bodyStyle="{ padding: '12px' }" placement="right" :visible="visible" :maskClosable="false" width="600px" @close="closeStation">
    <a-form :label-col="{ span: 7 }" :wrapper-col="{ span: 15 }">
      <a-row>
        <a-col :sm="24">
          <a-form-item label="已选志愿者">
            <a-input v-model:value="searchParam.volname" disabled />
          </a-form-item>
        </a-col>
        <a-col :sm="24" v-show="searchParam.volstation">
          <a-form-item label="当前所在岗位">
            <a-input v-model:value="searchParam.volstation" disabled />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div style="border-bottom:1px solid #eee;width:100%"></div>
    <div style="margin:10px 0">选择你需要更换的岗位</div>
    <a-select style="width:200px" v-model:value="searchParam.station" label-in-value @change="onChange">
      <a-select-option style="width:200px" :value="el.id" v-for="(el, index) in item.selectStationList" :key="index">{{ el.albx0072 }}</a-select-option>
    </a-select>
    <div
      :style="{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e8e8e8',
        padding: '20px 16px',
        textAlign: 'right',
        left: 0,
        background: '#fff',
        borderRadius: '0 0 4px 4px',
      }"
    >
      <a-row type="flex" justify="space-around">
        <a-col :span="4">
          <a-button
            style="margin-right: 8px"
            @click="
              () => {
                visible = false
              }
            "
            >取消</a-button
          ></a-col
        >
        <a-col :span="4"> <a-button type="primary" :disabled="disabledbtn" @click="changeStation">更换岗位</a-button></a-col>
      </a-row>
    </div>
  </a-drawer>
</template>
<script>
import { message, Modal } from 'ant-design-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
// import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, toRefs, onMounted, watch } from 'vue'
import apis from '@/server/request'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: { type: Object, default: {} },
  },
  setup(props, { emit }) {
    const searchParam = reactive({
      volname: '',
      volstation: '',
      station: { value: '', label: '' },
      albx0072: '',
    })
    const disabledbtn = ref(true)
    const closeStation = (bool) => {
      emit('closeStation', bool)
    }
    const getstation = (val) => {
      if (val.record.length > 1) {
        searchParam.volname = val.record.length + '人'
        searchParam.volstation = false
      } else {
        searchParam.volname = val.record[0].albp0003
        searchParam.volstation = val.record[0].albx0072
        // searchParam.station.value=val.selectStationList[0]
      }
    }
    const changeStation = () => {
      //更换岗位
      const bean = {
        areaid: props.item.albx0021, //项目区划
        proId: props.item.id, //项目
        // list: [{ volId: '', jobId: '' }], //志愿者编号集合
        nowjobid: searchParam.station.value, //需要更换的岗位id
        jobName: searchParam.albx0072, //需要更换的岗位的名称
      }
      let list = []
      props.item.record.forEach((el) => {
        list.push({ volid: el.albx0053, jobid: el.albx0052 })
      })
      bean.list = list
      apis.mostVolChangeJobFortis(bean).then((res) => {
        if (res) {
          message.success(res)
          closeStation(true)
        } else {
          messag.error('更换失败')
          closeStation(false)
        }
      })
    }
    const onChange = (val) => {
      //console.log(val)
      searchParam.albx0072 = val.label.children ? val.label.children : val.label
      searchParam.station.value = val.value
      searchParam.station.label = val.label.children ? val.label.children : val.label
      searchParam.station.value ? (disabledbtn.value = false) : (disabledbtn.value = true)
    }
    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          searchParam.valname = ''
          searchParam.volstation = ''
          searchParam.station.value = ''
          searchParam.station.label = ''
          searchParam.albx0072 = ''
          getstation(props.item)
        }
      }
    )
    return {
      searchParam,
      ...toRefs(props),
      closeStation,
      onChange,
      changeStation,
      disabledbtn,
    }
  },
})
</script>
<style lang="less" scoped>
.teamTabs :deep(.ant-tabs-nav div) {
  padding-left: 10px !important;
}
</style>

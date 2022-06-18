<template>
  <a-drawer title="导入系统外成员" :headerStyle="{ fontWeight: 800 }" :bodyStyle="{ padding: '12px', height: height + 'px' }" placement="right" :visible="visible" :maskClosable="false" width="1000px" style="height:100%" @close="closeOutsideDrawer(true)">
    <div id="addtable_m">
      <div v-show="activeKey == '1'">选择你需要导入成员的岗位，注意，同一项目下志愿者只能加入一个岗位</div>
      <BasicSearchForm>
        <a-form
          :model="searchParam"
          :label-col="{
            xs: { span: 24 },
            sm: { span: 6 },
          }"
          :wrapper-col="{
            xs: { span: 24 },
            sm: { span: 18 },
          }"
        >
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item label="岗位名称" style="margin-bottom:10px">
                <a-select v-model:value="searchParam.station" label-in-value>
                  <a-select-option :value="el.id" v-for="(el, index) in item.selectStationList" :key="index">{{ el.albx0072 }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </BasicSearchForm>
    </div>
    <!-- <div >提示：输入要加入的志愿者信息，点击确定</div> -->
    <a-tabs type="card" v-model:activeKey="activeKey" @change="changeActive">
      <a-tab-pane key="1" tab="导入成员">
        <!-- <div v-if="!showprocess"> -->
        <div id="addtable_f">
          <a-form ref="formRef" :model="modelForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :rules="rules">
            <a-row style="margin-bottom:10px" type="flex" justify="space-between">
              <a-col :span="8">
                <a-form-item label="姓名" name="volname">
                  <a-input v-model:value="modelForm.volname" :allowClear="true"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="身份证号" name="volcard">
                  <a-input v-model:value="modelForm.volcard" :allowClear="true"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="手机号" name="voltel">
                  <a-input v-model:value="modelForm.voltel" :allowClear="true"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="服务区域" name="volareaid">
                  <AreaDevNew placeholder="请选择区域" ref="areaRef" v-model:value="modelForm.volareaid" v-model:areaName="areaname" :maxarea="item.albx0021"></AreaDevNew>
                  <!-- <AreaDevide placeholder="请选择区域" :type="false" maxarea="userInfo.areaid" ref="areaRef" 
                  v-model:value="modelForm.volareaid" v-model:areaName="areaname" :showLevel="3" :maxarea="item.albx0021" :showAll="false" /> -->
                  <!-- <AreaFormItem placeholder="请选择区域" v-model:value="modelForm.volareaid" :showLevel="3" /> -->
                </a-form-item>
              </a-col>
              <a-col :offset="1" :span="15">
                <a-button type="primary" @click="addCount" v-show="dataSource.length < 50">确定</a-button>
              </a-col>
            </a-row>
          </a-form>
          <div class="table-page-search-wrapper">
            <a-row type="flex" justify="space-between">
              <a-col :span="4">
                <span style="font-size:16px;"> 已选择: {{ selectedRowKeys.length ? selectedRowKeys.length : 0 }} / 50人 </span>
              </a-col>
            </a-row>
          </div>
        </div>
        <a-spin :spinning="spinning">
          <a-table
            :scroll="{ y: addtableHeight }"
            :pagination="pagination1"
            :columns="columns3"
            ref="addtable"
            :data-source="dataSource"
            :rowKey="(record) => record.volcard"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
          >
            <template #serial="{index}">
              {{ (pagination1.current - 1) * pagination1.pageSize + (index + 1) }}
            </template>
            <template #action="{record}">
              <a-button type="primary" size="small" @click="deleteMember(record)">
                删除
              </a-button>
            </template>
          </a-table>
        </a-spin>
      </a-tab-pane>
      <a-tab-pane key="2" tab="导入详情">
        <div id="detailtable_s" class="table-page-search-wrapper">
          <a-row type="flex" justify="space-between">
            <a-col :span="24">
              <span style="font-size:16px;">
                共<span style="font-size:16px;color:#c12a2a">{{ sumvol }}</span
                >人，导入成功<span style="font-size:16px;color:#c12a2a">{{ sumvol - falsevol }}</span> 人 ，导入失败<span style="font-size:16px;color:#c12a2a">{{ falsevol }}</span
                >人
              </span>
            </a-col>
          </a-row>
        </div>
        <a-table :scroll="{ y: detailtableHeight }" ref="detailtable" :pagination="false" :columns="columns4" :data-source="processList" :rowKey="(record) => record.volcard">
          <template #serial="{index}">
            {{ (pagination2.current - 1) * pagination2.pageSize + (index + 1) }}
          </template>
          <template #albp3405="{text}">
            {{ text == 0 ? '实名认证中' : text == 1 ? '实名认证失败' : '实名认证成功' }}
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
    <div
      id="addtable_btn"
      v-show="activeKey == 1"
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-row type="flex" justify="end">
        <a-col>
          <a-spin :spinning="spinning">
            <a-button type="primary" :disabled="isdisabled" @click="addoutsideMember">
              开始导入
            </a-button>
          </a-spin>
        </a-col>
      </a-row>
    </div>
    <div
      id="addtable_btn2"
      v-show="activeKey == 2"
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-pagination v-model:current="pagination2.current" v-model:pageSize="pagination2.pageSize" :total="pagination2.total" :showTotal="pagination2.showTotal" @change="changePage" />
    </div>
  </a-drawer>
</template>
<script>
import { message, Modal } from 'ant-design-vue'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons-vue'
import { checkPhoneno, checkName, checkCardNo } from '@/utils/publicMethods/common'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
// import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, toRefs, watch, nextTick, h } from 'vue'
import apis from '@/server/request'
import { addCom, addMemberCom, addOutsideCom } from '../tables/table'
import { forTips } from '../tables/hasSelected'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: { type: Object, default: {} },
  },
  components: {
    MinusCircleOutlined,
    PlusCircleOutlined,
  },
  setup(props, { emit }) {
    ////#region
    const userInfo = ref(LocalGetUserInfo())
    const searchParam = reactive({
      //加入项目的查询条件
      cardno: '', //身份证
      station: { value: '', label: '' },
      albx0072: '',
    })
    const modelForm = reactive({
      volname: '',
      volareaid: [],
      volcard: '',
      voltel: '',
    })
    const selectedRowKeys = ref([])
    const selectedRows = ref([])
    const showmodal = ref(false) //对话框显示影藏
    const formRef = ref()
    const addtable = ref()
    const detailtable = ref()
    const obj = reactive({
      activeKey: '1',
      areaname: '',
      areaRef: ref(),
      spinning: false,
      columns: addMemberCom.columns,
      columns2: addCom.columns2,
      columns3: addOutsideCom.columns,
      columns4: addOutsideCom.columns2,
      showprocess: false, //添加进程显示
      addtableHeight: 500,
      detailtableHeight: 500,
      dataSource: [],
      processList: [],
      isdisabled: true, //开始导入按钮禁用
      sumvol: 0,
      falsevol: 0,
      pagination1: {
        pageSize: 10,
        current: 1,
        total: 0,
        showLessItems: true,
        showTotal: (total, range) => `共${total}条，当前显示${range[0]}~${range[1]}`,
        onChange: (pageNumber) => {
          addtable.value.pagination.current = pageNumber
        },
      },
      pagination2: {
        pageSize: 10,
        current: 1,
        total: 0,
        showLessItems: true,
        showTotal: (total, range) => `共${total}条，当前显示${range[0]}~${range[1]}`,
      },
    })
    //#endregion
    const getstation = (val) => {
      //获取当前项目岗位名称
      if (val.selectStationList != []) {
        searchParam.station.value = val.selectStationList[0].id
        searchParam.station.label = val.selectStationList[0].albx0072
        searchParam.albx0072 = val.selectStationList[0].albx0072
      }
    }
    const getOutVolList = (bean) => {
      apis.getOutVolListFortis(bean).then((res) => {
        if (res.list.length > 0) {
          obj.showprocess = true
          obj.processList = res.list
          obj.pagination2.total = res.sumvol
          obj.sumvol = res.sumvol
          obj.falsevol = res.falsevol
          // res.list.forEach((el) => {
          //   el
          // })
          // obj.pagination2.total = obj.processList.length
        }
      })
    }
    const closeModal = () => {
      showmodal.value = false
    }
    const resetForm = () => {
      searchParam.cardno = '' //身份证
      searchParam.station = { value: '' }
    }
    const addoutsideMember = () => {
      obj.spinning = true
      const params = {
        list: selectedRows.value,
        proId: props.item.id, //项目id
        gwId: searchParam.station.value, //岗位id
        areaId: props.item.albx0021, //服务区域
        teamId: userInfo.value.team.groupid, //团体id
        gwmc: searchParam.albx0072, //岗位名称
        proName: props.item.albx0002, //项目名称
      }
      apis.addOutsideTheSystem(params).then((res) => {
        if (!res.data) {
          message.success(res.message, 5)
        } else {
          // let str = '志愿者已经在邀请中；志愿者已经在邀请中；志愿者已经在邀请中'
          let arr = []
          res.data.split('；').forEach((e) => {
            arr.push(h('p', e))
          })
          Modal.info({
            title: () => '导入结果',
            content: () => h('div', {}, arr),
            width: 500,
          })
        }
        obj.spinning = false
      })
    }
    const closeOutsideDrawer = (bool) => {
      searchParam.station.value = ''
      searchParam.station.label = ''
      emit('onCloseMember', bool)
    }
    const addCount = () => {
      formRef.value
        .validate()
        .then((res) => {
          if (res.volname && res.volareaid[res.volareaid.length - 1] && res.volcard && res.voltel) {
            if (obj.dataSource.length == 0) {
              obj.dataSource.push({
                volname: res.volname,
                volareaid: res.volareaid[res.volareaid.length - 1],
                volcard: res.volcard,
                voltel: res.voltel,
                areaname: obj.areaRef.areaName,
              })
              obj.pagination1.total = obj.dataSource.length
            } else {
              if (
                obj.dataSource.every((e) => {
                  return e.volcard != res.volcard
                })
              ) {
                obj.dataSource.push({
                  volname: res.volname,
                  volareaid: res.volareaid[res.volareaid.length - 1],
                  volcard: res.volcard,
                  voltel: res.voltel,
                  areaname: obj.areaname ? obj.areaname : '湖北省武汉市',
                })
                obj.pagination1.total = obj.dataSource.length
              } else {
                messge.info('下方列表已存在相同身份证号的志愿者')
              }
            }
          }
        })
        .catch((err) => {
        })
        .finally(() => {
          modelForm.volname = ''
          modelForm.volcard = ''
          modelForm.voltel = ''
        })
    }
    const checkvolName = async (rule, value, callback) => {
      if (!value) {
        return Promise.reject('姓名不能为空')
      } else {
        if (checkName(value)) {
          return Promise.resolve()
        } else {
          return Promise.reject('姓名格式不正确')
        }
      }
    }
    const checkCard = async (rule, value) => {
      if (!value) {
        return Promise.reject('身份证号不能为空')
      } else {
        if (checkCardNo(value)) {
          return Promise.resolve()
        } else {
          return Promise.reject('身份证号格式不正确')
        }
      }
    }
    const checkTel = async (rule, value) => {
      if (!value) {
        return Promise.reject('手机号不能为空')
      } else {
        if (checkPhoneno(value)) {
          return Promise.resolve()
        } else {
          return Promise.reject('手机号格式不正确')
        }
      }
    }
    const checkareaid = async (rule, value) => {
      if (value.length < 1) {
        return Promise.reject('服务区域不能为空')
      } else {
        if (value[value.length - 1].slice(4, 6) == '00') {
          return Promise.reject('服务区域必须选到区')
        } else {
          return Promise.resolve()
        }
      }
    }
    const rules = reactive({
      volname: [{ validator: checkvolName, required: true, trigger: 'blur' }],
      volcard: [{ validator: checkCard, required: true, trigger: 'blur' }],
      voltel: [{ validator: checkTel, required: true, trigger: 'blur' }],
      volareaid: [{ validator: checkareaid, required: true, trigger: 'blur' }],
    })
    const onSelectChange = (selectedKeys, Rows) => {
      selectedRowKeys.value = selectedKeys
      selectedRows.value = Rows
      if (selectedRowKeys.value.length > 0) {
        obj.isdisabled = false
      } else {
        obj.isdisabled = true
      }
    }
    const changeActive = (key) => {
      if (key == '2') {
        obj.processList = []
        obj.pagination2.current = 1
        getOutVolList({
          gwId: searchParam.station.value,
          proId: props.item.id,
          pageSize: obj.pagination2.pageSize,
          pageNum: obj.pagination2.current,
          pageNo: obj.pagination2.current,
        })
        setTimeout(() => {
          getSh()
        }, 200)
      }
    }
    const deleteMember = (record) => {
      obj.dataSource.forEach((el, i) => {
        if (el.volcard == record.volcard) {
          obj.dataSource.splice(i, 1)
          selectedRowKeys.value.splice(selectedRowKeys.value.indexOf(record.volcard), 1)
        }
      })
      selectedRows.value.forEach((el, i) => {
        if (el.volcard == record.volcard) {
          selectedRows.value.splice(i, 1)
        }
      })
    }
    const changePage = (pageNumber) => {
      obj.pagination2.current = pageNumber
      getOutVolList({
        gwId: searchParam.station.value,
        proId: props.item.id,
        pageSize: obj.pagination2.pageSize,
        pageNum: obj.pagination2.current,
        pageNo: obj.pagination2.current,
      })
    }
    const getSh = () => {
      //监听窗口改变
      if (document.querySelector('div.ant-drawer-header')) {
        window.addEventListener('resize', getSh)
        setTimeout(() => {
          let h = document.querySelector('div.ant-drawer-header').clientHeight //弹窗头的高度 还有表格头部的高度
          let s = document.getElementById('addtable_m').clientHeight //查询条件的高度
          //24 drawerbody的padding 40 tab的头 16(tab的margin等)
          if (obj.activeKey == '1') {
            let ph1 = document.getElementById('addtable_btn').clientHeight //开始导入按钮的高度
            let f = document.getElementById('addtable_f').clientHeight //form表单的高度
            obj.addtableHeight = window.innerHeight - (h * 2 + ph1 * 2 + s + f + 40 + 24 + 16)
          } else {
            let ph2 = document.getElementById('addtable_btn2').clientHeight //分页的高度
            let r = document.getElementById('detailtable_s').clientHeight //导入结果展示的高
            obj.detailtableHeight = window.innerHeight - (h * 2 + ph2 + s + 24 + 40 + r)
          }
          // console.log(obj)
        }, 200)
      }
    }
    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          obj.activeKey = '1'
          nextTick(() => {
            selectedRowKeys.value = []
            selectedRows.value = []
            getstation(props.item)
            setTimeout(() => {
              getSh()
            }, 100)
          })
        } else {
          obj.dataSource = []
          formRef.value.clearValidate()
          modelForm.volname = ''
          modelForm.volcard = ''
          modelForm.voltel = ''
          modelForm.volareaid = []
        }
      }
    )
    return {
      ...toRefs(props),
      ...toRefs(obj),
      userInfo,
      formRef,
      height: ref(window.clientHeight - 55), //抽屉高度
      addtable,
      detailtable,
      searchParam,
      rules,
      modelForm,
      showmodal,
      closeModal,
      resetForm,
      addoutsideMember,
      closeOutsideDrawer,
      addCount,
      selectedRowKeys,
      onSelectChange,
      changeActive,
      deleteMember,
      changePage,
    }
  },
})
</script>
<style lang="less" scoped>
.ant-table td {
  white-space: nowrap;
}
.ant-tabs-bar {
  margin-bottom: 10px;
}
.ant-form-item {
  margin-bottom: 16px;
}
</style>

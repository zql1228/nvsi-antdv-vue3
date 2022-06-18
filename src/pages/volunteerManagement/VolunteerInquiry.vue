<template>
  <div>
    <PageFormTableWrapper>
      <template #searchForm>
        <div class="table-page-search-wrapper">
          <a-form
            ref="searchFormRef"
            :model="queryParam"
            :rules="rules"
            :label-col="{
              xs: { span: 24 },
              sm: { span: 6 },
            }"
            :wrapper-col="{
              xs: { span: 24 },
              sm: { span: 18 },
            }"
          >
            <a-row :gutter="24">
              <a-col :md="6" :sm="24">
                <a-form-item label="服务区域">
                  <macArea
                    placeholder="请选择区域"
                    v-model:value="queryParam.areaid"
                    :islevel="userInfo.areaLevel == 0 || userInfo.areaLevel == 1"
                    :isHave="false"
                  ></macArea>
                  <!-- <AreaFormItem placeholder="请选择区域" v-model:value="queryParam.areaid" :showLevel="3" /> -->
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="姓名" name="albp0003">
                  <a-input placeholder="请输入姓名" v-model:value="queryParam.albp0003" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="身份证号" name="albp0005">
                  <a-input placeholder="请输入身份证号码" v-model:value="queryParam.albp0005" />
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="性别" name="albp0006">
                  <a-select v-model:value="queryParam.albp0006" :options="optionsList.albp0006List"> </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="学历" name="albp0017">
                  <a-select v-model:value="queryParam.albp0017">
                    <a-select-option v-for="item in optionsList.albp0017List" :key="item.codeid" :value="item.codeid">{{
                      item.codevalue
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="政治面貌" name="albp0007">
                  <a-select v-model:value="queryParam.albp0007">
                    <a-select-option v-for="item in optionsList.albp0007List" :key="item.codeid" :value="item.codeid">{{
                      item.codevalue
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="服务类别" name="albp0021">
                  <a-select v-model:value="queryParam.albp0021">
                    <a-select-option v-for="item in optionsList.albp0021List" :key="item.codeid" :value="item.codeid">{{
                      item.codevalue
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="从业状况" name="albp0018">
                  <a-select v-model:value="queryParam.albp0018">
                    <a-select-option v-for="item in optionsList.albp0018List" :key="item.codeid" :value="item.codeid">{{
                      item.codevalue
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="证件类型" name="albp0004">
                  <a-select v-model:value="queryParam.albp0004">
                    <a-select-option v-for="item in optionsList.albp0004List" :key="item.codeid" :value="item.codeid">{{
                      item.codevalue
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="有无时长" name="albp0089">
                  <a-select v-model:value="queryParam.albp0089" :options="optionsList.albp0089List"> </a-select>
                </a-form-item>
              </a-col>
              <!-- <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="星级" name="albp0026">
                  <a-select v-model:value="queryParam.albp0026">
                    <a-select-option v-for="item in optionsList.albp0026List" :key="item.codeid" :value="item.codeid">{{
                      item.codevalue
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->
              <!-- <a-col :md="6" :sm="24">
                  <a-form-item label="停用/启动" name="albp0090">
                    <a-select v-model:value="queryParam.albp0090" :options="optionsList.albp0090List"> </a-select>
                  </a-form-item>
                </a-col> -->
              <!-- <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="年龄区间" name="age">
                  <a-row class="my_input js-input-width" type="flex" style="flex-wrap:nowrap">
                    <a-col>
                      <a-input
                        v-model:value="queryParam.minage"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        onafterpaste="value=value.replace(/[^\d]/g,'')"
                      />
                    </a-col>
                    <a-col>
                      <img style="position:relative;top:6px;" src="@/assets/img/workBenchImg/date.png" alt="" />
                    </a-col>
                    <a-col>
                      <a-input
                        v-model:value="queryParam.maxage"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        onafterpaste="value=value.replace(/[^\d]/g,'')"
                      />
                    </a-col>
                  </a-row>
                </a-form-item>
              </a-col> -->
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="时长区间" name="timeLength">
                  <a-row class="my_input js-input-width" type="flex" style="flex-wrap: nowrap">
                    <a-col>
                      <a-input
                        style="display: inline-block"
                        v-model:value="queryParam.mintime"
                        onkeyup="value= value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''"
                      />
                    </a-col>
                    <a-col>
                      <img style="position: relative; top: 6px" src="@/assets/img/workBenchImg/date.png" alt="" />
                    </a-col>
                    <a-col>
                      <a-input
                        style="display: inline-block"
                        v-model:value="queryParam.maxtime"
                        onkeyup="value= value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''"
                      />
                    </a-col>
                  </a-row>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item name="registmindate" label="注册时间">
                  <a-date-picker
                    :disabled-date="disabledDate"
                    v-model:value="queryParam.registmindate"
                    style="width: 100%"
                    placeholder="最早注册日期"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item name="registmaxdate" label="注册时间">
                  <a-date-picker
                    :disabled-date="disabledDate"
                    v-model:value="queryParam.registmaxdate"
                    style="width: 100%"
                    placeholder="最晚注册日期"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="(!advanced && 6) || 24" :sm="24">
                <a-form-item>
                  <div style="white-space: nowrap">
                    <a-button type="primary" @click="refresh"> 查询 </a-button>
                    <a-button @click="resetForm" style="margin-left: 8px"> 重置 </a-button>
                    <a @click="showExpand" style="margin-left: 8px; white-space: nowrap">
                      {{ advanced ? '收起筛选' : '展开筛选' }}
                      <UpOutlined v-if="advanced" />
                      <DownOutlined v-if="!advanced" />
                    </a>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </template>
      <template #table>
        <a-tabs type="card" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="level == '全国' || level == '省' ? '已实名' : '正常'">
            <InquiryTable ref="table1" :queryParam="queryParam" activeKey="1">
              <template #action="{ record }">
                <a-space>
                  <!-- :disabled="level == '全国' || level == '省'" -->
                  <a-button type="primary" size="small" @click="edit(record)"> 修改联系方式 </a-button>
                  <a-button size="small" type="primary" @click="updatePassword(record)"> 重置密码 </a-button>
                  <!-- :disabled="level == '全国' || level == '省'" -->
                  <a-button type="primary" ghost size="small" @click="openModel1(record, 1)"> 停用账户 </a-button>
                </a-space>
              </template>
            </InquiryTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="未实名">
            <InquiryTable ref="table2" :queryParam="queryParam" activeKey="2">
              <template #action="{ record }">
                <a-space>
                  <!-- <a-button type="primary" size="small" @click="edit(record)" disabled> 修改联系方式 </a-button> -->
                  <a-button size="small" type="primary" @click="updatePassword(record)"> 重置密码 </a-button>
                  <!-- <a-button type="primary" ghost size="small" @click="openModel1(record, 2)" disabled>
                    {{ record.albp0090 == '1' ? '停用账户' : '启用账户' }}
                  </a-button> -->
                </a-space>
              </template>
            </InquiryTable>
          </a-tab-pane>
          <a-tab-pane key="3" tab="已停用">
            <InquiryTable ref="table3" :queryParam="queryParam" activeKey="3">
              <template #action="{ record }">
                <a-space>
                  <!-- <a-button type="primary" size="small" @click="edit(record)" disabled> 修改联系方式 </a-button> -->
                  <!-- :disabled="level == '全国' || level == '省'" -->
                  <a-button type="primary" ghost size="small" @click="openModel1(record, 3)"> 启用账户 </a-button>
                </a-space>
              </template>
            </InquiryTable>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
    <a-modal v-model:visible="model1.visible" title="停用账户" :confirmLoading="model1.confirmLoading" @ok="handUdt(model1.item, 1)">
      <p>志愿者被停用后所有志愿服务将被停止，账户将不能登录，是否确认停用</p>
    </a-modal>
    <InquiryDrawer :visible="drawerData.visible" :item="drawerData.item" @child="onClose"></InquiryDrawer>
    <updatePasswordModal :visible="updatePass.visible" :item="updatePass.item" :type="updatePass.type" @child="onClose3"></updatePasswordModal>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import { LocalGetUserInfo, LocalSetVolunteerInfo } from '@/utils/localStorage.js'
import ScreenChooseForm from './ScreenChooseForm'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import moment from 'moment'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import { redDate, checktime2, checkCardNo, getLevel } from '@/utils/publicMethods/common'
import { useRouter } from 'vue-router'
import {
  nvsiAlbp0039, //服务类别
} from '@/utils/codevalue'
import InquiryDrawer from './components/InquiryDrawer'
import InquiryTable from './components/InquiryTable'
import updatePasswordModal from '@/pages/volunteerTeamManagement/modal/updatePasswordModal.vue'
import apis from '@/server/request'
export default defineComponent({
  components: { InquiryTable, ScreenChooseForm, InquiryDrawer, DownOutlined, UpOutlined, updatePasswordModal },
  setup() {
    const activeKey = ref('1')
    const table1 = ref()
    const table2 = ref()
    const table3 = ref()
    const areaid = ref() //当前查询数据所用区划
    const level = ref() //当前查询数据所用区划级别 0全国 1省 2市 3区
    const userInfo = ref(LocalGetUserInfo())
    const advanced = ref(false)
    const router = useRouter()
    const isLoading = ref(false)
    const queryParam = reactive({
      areaid: [], //服务区域
      albp0003: '', // 姓名
      albp0005: '', //身份证号
      albp0006: '', //性别
      albp0017: '', //学历
      albp0007: '', //政治面貌
      albp0021: '', //服务类别
      albp0018: '', //从业状况
      albp0004: '', //证件类型
      albp0089: '', //有无时长
      albp0026: '', //星级
      albp0090: '', //停用/启动
      minage: '', //年龄区间 最小
      maxage: '', //年龄区间 最大
      mintime: '', //时长区间 最小
      maxtime: '', //时长区间 最大
      registmindate: null, //注册时间 最小
      registmaxdate: null, //注册时间 最大
    })

    const optionsList = reactive({
      albp0006List: [
        { label: '不限', value: '' },
        { label: '男', value: '1' },
        { label: '女', value: '2' },
      ], //性别
      albp0017List: [], //学历
      albp0007List: [], //政治面貌
      albp0021List: [], //服务类别
      albp0018List: [], //从业状况
      albp0004List: [], //证件类型
      albp0089List: [
        { label: '不限', value: '' },
        { label: '无时长', value: '0' },
        { label: '有时长', value: '1' },
      ], //时长
      albp0026List: [], //星级
      albp0090List: [
        { label: '不限', value: '' },
        { label: '停用', value: '0' },
        { label: '启用', value: '1' },
      ], //停用启用
    })
    const searchFormRef = ref()
    const VolunteerInquiryTable = ref()
    const model1 = reactive({
      //启用停用弹窗参数
      visible: false,
      item: {},
      confirmLoading: false,
    })

    const drawerData = reactive({
      //修改按钮弹窗参数
      visible: false,
      item: {},
    })

    const updatePass = reactive({
      //修改密码弹窗参数
      type: 'volunteer',
      visible: false,
      item: {},
    })

    onMounted(() => {
      areaid.value = userInfo.value.areaid
      level.value = getLevel(areaid.value)
      getOptions()
    })

    const getOptions = async () => {
      const co = { codevalue: '不限', codeid: '' }
      const [resAlbp0017List, resAlbp0007List, resAlbp0021List, resAlbp0018List, resAlbp0004List, resAlbp0026List] = await Promise.all([
        //学历
        apis.getCodeValue('nvsi_albp0017', 'getCodeValueOnLeap', { tableName: 'nvsi_albp0017' }),
        // 政治面貌
        apis.getCodeValue('nvsi_albp0007', 'getCodeValueOnLeap', { tableName: 'nvsi_albp0007' }),
        // 服务类别
        apis.getCodeValue('lbe05', 'getAllCodeFortis', { codeTypeName: 'lbe05', areaid: userInfo.value.areaid }),
        // 从业状况
        apis.getCodeValue('nvsi_albp0018', 'getCodeValueOnLeap', { tableName: 'nvsi_albp0018' }),
        // 证件类型
        apis.getCodeValue('nvsi_albp0004', 'getCodeValueOnLeap', { tableName: 'nvsi_albp0004' }),
        // 星级
        apis.getCodeValue('nvsi_albp0026', 'getCodeValueOnLeap', { tableName: 'nvsi_albp0026' }),
      ])
      if (resAlbp0017List.code == 0) {
        optionsList.albp0017List = [co, ...resAlbp0017List.data]
      }
      if (resAlbp0007List.code == 0) {
        optionsList.albp0007List = [co, ...resAlbp0007List.data]
      }
      if (resAlbp0021List.code == 0) {
        optionsList.albp0021List = [co, ...resAlbp0021List.data]
      }
      if (resAlbp0018List.code == 0) {
        optionsList.albp0018List = [co, ...resAlbp0018List.data]
      }
      if (resAlbp0004List.code == 0) {
        optionsList.albp0004List = [co, ...resAlbp0004List.data]
      }
      if (resAlbp0026List.code == 0) {
        optionsList.albp0026List = [co, ...resAlbp0026List.data]
      }
    }

    const updatePassword = (record) => {
      //重置密码按钮
      updatePass.item = record
      updatePass.visible = true
    }

    const onClose3 = (bool) => {
      if (bool) {
        activeKey.value == 1 ? table1.value.getList(true) : activeKey.value == 2 ? table2.value.getList(true) : table3.value.getList(true)
      }
      updatePass.visible = false
    }

    const edit = (record) => {
      //修改按钮
      drawerData.item = record
      drawerData.visible = true
    }

    const onClose = (bool, activeKey) => {
      //关闭修改弹窗表单
      if (bool) {
        //为true 说明有数据变化 需刷新列表
        activeKey == 1 ? table1.value.getList(true) : activeKey == 2 ? table2.value.getList(true) : table3.value.getList(true)
      }
      drawerData.visible = false
    }

    const showExpand = () => {
      advanced.value = !advanced.value
      nextTick(() => {
        activeKey.value == 1 ? table1.value.getheight() : activeKey.value == 2 ? table2.value.getheight() : table3.value.getheight()
      })
    }

    watch(
      () => activeKey.value,
      (activeKey) => {
        nextTick(() => {
          activeKey == 1 ? table1.value.getheight() : activeKey == 2 ? table2.value.getheight() : table3.value.getheight()
        })
      }
    )

    const disabledDate = (current) => {
      //时间不能选今天之前
      return current && current > moment(redDate(moment(new Date()).format('YYYY-MM-DD'), 1)).endOf('day')
    }
    const refresh = () => {
      //查询按钮
      if (queryParam.areaid && queryParam.areaid.length > 0 && getLevel(queryParam.areaid[queryParam.areaid.length - 1]) == '省') {
        message.warning('服务区域只能选择市、区级')
        return
      }
      searchFormRef.value.validate().then(() => {
        table1.value.getList(true)
        table2.value ? table2.value.getList(true) : ''
        table3.value ? table3.value.getList(true) : ''
        areaid.value =
          queryParam.areaid.length > 0
            ? queryParam.areaid[queryParam.areaid.length - 1]
            : userInfo.value.areaLevel == '0'
            ? '100000000000000000'
            : userInfo.value.areaid
        level.value = getLevel(areaid.value)
      })
    }

    const resetForm = () => {
      //重置
      if (queryParam.areaid && queryParam.areaid.length > 0 && getLevel(queryParam.areaid[queryParam.areaid.length - 1]) == '省') {
        message.warning('服务区域只能选择市、区级')
        return
      }
      searchFormRef.value.resetFields()
      queryParam.minage = ''
      queryParam.maxage = ''
      queryParam.mintime = ''
      queryParam.maxtime = ''
      table1.value.getList(true)
      table2.value ? table2.value.getList(true) : ''
      table3.value ? table3.value.getList(true) : ''
      areaid.value =
        queryParam.areaid.length > 0
          ? queryParam.areaid[queryParam.areaid.length - 1]
          : userInfo.value.areaLevel == '0'
          ? '100000000000000000'
          : userInfo.value.areaid
      level.value = getLevel(areaid.value)
    }

    const openModel1 = (record, activeKey) => {
      //停用启用按钮
      if (record.albp0090 == 1) {
        //停用按钮
        model1.item = record
        model1.confirmLoading = false
        model1.visible = true
      } else {
        handUdt(record, activeKey)
      }
    }

    const handUdt = (record, activeKey) => {
      //停用启用按钮弹窗确定按钮
      let bean = {
        areaid: queryParam.areaid[queryParam.areaid.length - 1],
        albp0005: record.albp0005,
        albp0029: record.albp0029,
        state: record.albp0090 == 0 ? 1 : 0, //0停用 1启用
      }
      model1.confirmLoading = true
      rpcPost('updateVolunState', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success(record.albp0090 == 0 ? '启用成功' : '停用成功')
          model1.confirmLoading = false
          model1.visible = false
          if (activeKey == 1) {
            table1.value.getList('delete')
            table3.value ? table3.value.getList(false) : ''
          } else {
            table3.value.getList('delete')
            table1.value.getList(false)
          }
        } else {
          message.warning(record.albp0090 == 0 ? '启用失败' : '停用失败')
        }
      })
    }

    // const checkAreaid = async (rule, value) => {
    //   //服务区域校验
    //   if (queryParam.areaid && queryParam.areaid.length > 0 && getLevel(queryParam.areaid[queryParam.areaid.length - 1]) == '省') {
    //     return Promise.reject('服务区域最多选到市级')
    //   } else {
    //     return Promise.resolve()
    //   }
    // }

    const checkage = async (rule, value) => {
      //人数区间校验
      if (queryParam.minage && queryParam.maxage && queryParam.maxage - queryParam.minage < 0) {
        return Promise.reject('最大年龄不能小于最小年龄')
      } else {
        return Promise.resolve()
      }
    }
    const checktime = async (rule, value) => {
      //人数区间校验
      if (queryParam.mintime && queryParam.maxtime && queryParam.maxtime - queryParam.mintime < 0) {
        return Promise.reject('最大时长不能小于最小时长')
      } else {
        return Promise.resolve()
      }
    }
    const checkmaxDay = async (rule, value) => {
      //队伍注册时间校验
      if (
        queryParam.registmindate &&
        queryParam.registmaxdate &&
        checktime2(moment(new Date(queryParam.registmaxdate)).format('YYYY-MM-DD'), moment(new Date(queryParam.registmindate)).format('YYYY-MM-DD'))
      ) {
        return Promise.reject('最晚注册时间不能早于注册最早时间')
      } else {
        return Promise.resolve()
      }
    }

    const checkalbp0005 = async (rule, value) => {
      //身份证号码校验
      if (value && !checkCardNo(value)) {
        return Promise.reject('请输入正确的身份证号码')
      } else {
        return Promise.resolve()
      }
    }

    const rules = reactive({
      // albp0005: [{ required: false, validator: checkalbp0005 }], //身份证号码
      age: [{ required: false, validator: checkage }], //年龄区间
      timeLength: [{ required: false, validator: checktime }], //时长区间
      registmaxdate: [{ required: false, validator: checkmaxDay }], //注册时间最大
    })
    const toVolInfo = (record) => {
      LocalSetVolunteerInfo(record)

      router.push({ path: '/volunteerCmsDetails' })
    }
    return {
      userInfo,
      level,
      activeKey,
      table1,
      table2,
      table3,
      model1,
      advanced,
      drawerData,
      optionsList,
      searchFormRef,
      VolunteerInquiryTable,
      // 查询参数
      queryParam,
      resetForm,
      disabledDate,
      refresh,
      rules,
      handUdt,
      openModel1,
      onClose,
      edit,
      showExpand,
      toVolInfo,
      updatePass,
      updatePassword,
      onClose3,
    }
  },
})
</script>
<style scoped></style>

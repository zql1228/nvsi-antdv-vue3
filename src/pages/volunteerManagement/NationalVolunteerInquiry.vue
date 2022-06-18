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
              <!-- <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="学历" name="albp0017">
                  <a-select v-model:value="queryParam.albp0017">
                    <a-select-option v-for="item in optionsList.albp0017List" :key="item.codeid" :value="item.codeid">{{
                      item.codevalue
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->
              <!-- <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="政治面貌" name="albp0007">
                  <a-select v-model:value="queryParam.albp0007">
                    <a-select-option v-for="item in optionsList.albp0007List" :key="item.codeid" :value="item.codeid">{{
                      item.codevalue
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->
              <!-- <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="服务类别" name="albp0021">
                  <a-select v-model:value="queryParam.albp0021">
                    <a-select-option v-for="item in optionsList.albp0021List" :key="item.codeid" :value="item.codeid">{{
                      item.codevalue
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->
              <!-- <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="从业状况" name="albp0018">
                  <a-select v-model:value="queryParam.albp0018">
                    <a-select-option v-for="item in optionsList.albp0018List" :key="item.codeid" :value="item.codeid">{{
                      item.codevalue
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="证件类型" name="albp0004">
                  <a-select v-model:value="queryParam.albp0004">
                    <a-select-option v-for="item in optionsList.albp0004List" :key="item.codeid" :value="item.codeid">{{
                      item.codevalue
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <!-- <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="有无时长" name="albp0089">
                  <a-select v-model:value="queryParam.albp0089" :options="optionsList.albp0089List"> </a-select>
                </a-form-item>
              </a-col> -->
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
              <a-col :md="6" :sm="24" v-show="advanced">
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
              </a-col>
              <!-- <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="时长区间" name="timeLength">
                  <a-row class="my_input js-input-width" type="flex" style="flex-wrap:nowrap">
                    <a-col>
                      <a-input
                        style="display: inline-block;"
                        v-model:value="queryParam.mintime"
                        onkeyup="value= value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''"
                      />
                    </a-col>
                    <a-col>
                      <img style="position:relative;top:6px;" src="@/assets/img/workBenchImg/date.png" alt="" />
                    </a-col>
                    <a-col>
                      <a-input
                        style="display: inline-block;"
                        v-model:value="queryParam.maxtime"
                        onkeyup="value= value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''"
                      />
                    </a-col>
                  </a-row>
                </a-form-item>
              </a-col> -->
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item name="registmindate" label="注册时间">
                  <a-date-picker
                    :disabled-date="disabledDate"
                    v-model:value="queryParam.registmindate"
                    style="width:100%;"
                    placeholder="最早注册日期"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item name="registmaxdate" label="注册时间">
                  <a-date-picker
                    :disabled-date="disabledDate"
                    v-model:value="queryParam.registmaxdate"
                    style="width:100%;"
                    placeholder="最晚注册日期"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="(!advanced && 6) || 24" :sm="24">
                <a-form-item>
                  <a-space>
                    <a-button type="primary" @click="refresh">
                      查询
                    </a-button>
                    <a-button @click="resetForm">
                      重置
                    </a-button>
                    <a @click="showExpand" style="margin-left: 8px">
                      {{ advanced ? '收起筛选' : '展开筛选' }}
                      <UpOutlined v-if="advanced" />
                      <DownOutlined v-if="!advanced" />
                    </a>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </template>
      <template #table>
        <a-tabs type="card" v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="正常">
            <NationalInquiryTable ref="table1" :queryParam="queryParam" activeKey="1">
              <template #action="{record}">
                <a-space>
                  <a-button type="primary" size="small" @click="edit(record)">
                    修改联系方式
                  </a-button>
                  <a-button type="primary" ghost size="small" @click="openModel1(record, 1)">
                    停用账户
                  </a-button>
                </a-space>
              </template>
            </NationalInquiryTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="未实名">
            <NationalInquiryTable ref="table2" :queryParam="queryParam" activeKey="2">
              <template #action="{record}">
                <a-space>
                  <a-button type="primary" size="small" @click="edit(record)" disabled>
                    修改手机号
                  </a-button>
                  <a-button type="primary" ghost size="small" @click="openModel1(record, 2)" disabled>
                    {{ record.albp0090 == '1' ? '停用账户' : '启用账户' }}
                  </a-button>
                </a-space>
              </template>
            </NationalInquiryTable>
          </a-tab-pane>
          <a-tab-pane key="3" tab="已停用">
            <NationalInquiryTable ref="table3" :queryParam="queryParam" activeKey="3">
              <template #action="{record}">
                <a-space>
                  <a-button type="primary" size="small" @click="edit(record)" disabled>
                    修改联系方式
                  </a-button>
                  <a-button type="primary" ghost size="small" @click="openModel1(record, 3)">
                    启用账户
                  </a-button>
                </a-space>
              </template>
            </NationalInquiryTable>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
    <a-modal v-model:visible="model1.visible" title="停用账户" :confirmLoading="model1.confirmLoading" @ok="handUdt(model1.item, 1)">
      <p>志愿者被停用后所有志愿服务都将被停止，账户将不能登录，并自动退出所有已加入的项目与队伍，是否确认停用</p>
    </a-modal>
    <InquiryDrawer :visible="drawerData.visible" :item="drawerData.item" @child="onClose"></InquiryDrawer>
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
import { redDate, checktime2, checkCardNo } from '@/utils/publicMethods/common'
import { useRouter } from 'vue-router'
import {
  nvsiAlbp0039, //服务类别
} from '@/utils/codevalue'
import InquiryDrawer from './components/InquiryDrawer'
import NationalInquiryTable from './components/NationalInquiryTable'
export default defineComponent({
  components: { NationalInquiryTable, ScreenChooseForm, InquiryDrawer, DownOutlined, UpOutlined },
  setup() {
    const activeKey = ref('1')
    const table1 = ref()
    const table2 = ref()
    const table3 = ref()
    const userInfo = ref(LocalGetUserInfo())
    const advanced = ref(false)
    const router = useRouter()
    const queryParam = reactive({
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
      albp0017List: [
        // { label: '不限', value: '' },
        // { label: '博士研究生', value: '11' },
        // { label: '硕士研究生', value: '14' },
        // { label: '大学本科', value: '20' },
        // { label: '大学专科和专科学校', value: '30' },
        // { label: '中等专业学校或中等技术学校', value: '40' },
        // { label: '技工学校', value: '50' },
        // { label: '高中', value: '60' },
        // { label: '初中', value: '70' },
        // { label: '小学', value: '80' },
        // { label: '幼儿园', value: '90' },
        // { label: '学龄前', value: '91' },
        // { label: '特殊教育', value: '98' },
        // { label: '文盲或半文盲', value: '00' },
        // { label: '未说明情况', value: '99' },
      ], //学历
      albp0007List: [
        // { label: '不限', value: '' },
        // { label: '中国共产党党员', value: '01' },
        // { label: '中国共产党预备党员', value: '02' },
        // { label: '中国共产主义青年团团员', value: '03' },
        // { label: '中国国民党革命委员会会员', value: '04' },
        // { label: '中国民主同盟盟员', value: '05' },
        // { label: '中国民主建国会会员', value: '06' },
        // { label: '中国民主促进会会员', value: '07' },
        // { label: '中国农工民主党党员', value: '08' },
        // { label: '中国致公党党员', value: '09' },
        // { label: '九三学社社员', value: '10' },
        // { label: '台湾民主自治同盟盟员', value: '11' },
        // { label: '无党派民主人士', value: '12' },
        // { label: '群众', value: '13' },
        // { label: '未说明情况', value: '20' },
      ], //政治面貌
      albp0021List: [], //服务类别
      albp0018List: [
        // { label: '不限', value: '' },
        // { label: '国家公务员', value: '11' },
        // { label: '专业技术人员', value: '13' },
        // { label: '职员', value: '17' },
        // { label: '企业管理人员', value: '21' },
        // { label: '工人', value: '24' },
        // { label: '农民', value: '27' },
        // { label: '学生', value: '31' },
        // { label: '现役军人', value: '37' },
        // { label: '自由职业', value: '51' },
        // { label: '个体经营者', value: '54' },
        // { label: '无业人员', value: '70' },
        // { label: '退(离)休人员', value: '80' },
        // { label: '其它', value: '90' },
      ], //从业状况
      albp0004List: [
        // { label: '不限', value: '' },
        // { label: '内地居民身份证', value: '01' },
        // { label: '香港居民身份证', value: '02' },
        // { label: '澳门居民身份证', value: '03' },
        // { label: '台湾居民身份证', value: '04' },
        // { label: '护照', value: '05' },
        // { label: '军官证', value: '06' },
        // { label: '士兵证', value: '07' },
        // { label: '其它有效国籍旅行证件', value: '99' },
      ], //证件类型
      albp0089List: [
        { label: '不限', value: '' },
        { label: '无时长', value: '0' },
        { label: '有时长', value: '1' },
      ], //时长
      albp0026List: [
        // { label: '不限', value: '' },
        // { label: '一星志愿者', value: '1' },
        // { label: '二星志愿者', value: '2' },
        // { label: '三星志愿者', value: '3' },
        // { label: '四星志愿者', value: '4' },
        // { label: '五星志愿者', value: '5' },
      ], //星级
      albp0090List: [
        { label: '不限', value: '' },
        { label: '停用', value: '0' },
        { label: '启用', value: '1' },
      ], //停用启用
    })
    // optionsList.albp0021List = JSON.parse(JSON.stringify(nvsiAlbp0039))
    // optionsList.albp0021List.unshift({ label: '不限', value: '' })
    const searchFormRef = ref()
    const num = ref(1)
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

    onMounted(() => {
      getOptions()
    })

    const getOptions = async () => {
      optionsList.albp0017List = await rpcPost('getCodeValueOnLeap', { bean: { tableName: 'nvsi_albp0017' } }) //学历
      optionsList.albp0017List = optionsList.albp0017List.data
      optionsList.albp0017List.unshift({ codevalue: '不限', codeid: '' })

      optionsList.albp0007List = await rpcPost('getCodeValueOnLeap', { bean: { tableName: 'nvsi_albp0007' } }) //政治面貌
      optionsList.albp0007List = optionsList.albp0007List.data
      optionsList.albp0007List.unshift({ codevalue: '不限', codeid: '' })

      optionsList.albp0021List = await rpcPost('getCodeValueOnLeap', { bean: { tableName: 'nvsi_albp0039' } }) //服务类别
      optionsList.albp0021List = optionsList.albp0021List.data
      optionsList.albp0021List.unshift({ codevalue: '不限', codeid: '' })

      optionsList.albp0018List = await rpcPost('getCodeValueOnLeap', { bean: { tableName: 'nvsi_albp0018' } }) //从业状况
      optionsList.albp0018List = optionsList.albp0018List.data
      optionsList.albp0018List.unshift({ codevalue: '不限', codeid: '' })

      optionsList.albp0004List = await rpcPost('getCodeValueOnLeap', { bean: { tableName: 'nvsi_albp0004' } }) //证件类型
      optionsList.albp0004List = optionsList.albp0004List.data
      optionsList.albp0004List.unshift({ codevalue: '不限', codeid: '' })

      optionsList.albp0026List = await rpcPost('getCodeValueOnLeap', { bean: { tableName: 'nvsi_albp0026' } }) //星级
      optionsList.albp0026List = optionsList.albp0026List.data
      optionsList.albp0026List.unshift({ codevalue: '不限', codeid: '' })
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
      searchFormRef.value.validate().then(() => {
        activeKey.value == 1 ? table1.value.getList(true) : activeKey.value == 2 ? table2.value.getList(true) : table3.value.getList(true)
      })
    }

    const resetForm = () => {
      //重置
      searchFormRef.value.resetFields()
      queryParam.minage = ''
      queryParam.maxage = ''
      queryParam.mintime = ''
      queryParam.maxtime = ''
      activeKey.value == 1 ? table1.value.getList(true) : activeKey.value == 2 ? table2.value.getList(true) : table3.value.getList(true)
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
      // console.log(record, 'record')
      router.push({ path: '/volunteerCmsDetails' })
    }
    return {
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
    }
  },
})
</script>
<style scoped></style>

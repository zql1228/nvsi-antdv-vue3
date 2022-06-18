<template>
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
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="性别" name="albp0006">
                <a-select v-model:value="queryParam.albp0006" :options="optionsList.albp0006List" :disabled="selectType == 'sex'"> </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="学历" name="albp0017">
                <a-select v-model:value="queryParam.albp0017">
                  <a-select-option
                    v-for="item in optionsList.albp0017List"
                    :key="item.codeid"
                    :value="item.codeid"
                    :disabled="selectType == 'education'"
                    >{{ item.codevalue }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="政治面貌" name="albp0007">
                <a-select v-model:value="queryParam.albp0007">
                  <a-select-option
                    v-for="item in optionsList.albp0007List"
                    :key="item.codeid"
                    :value="item.codeid"
                    :disabled="selectType == 'politicalstatus'"
                    >{{ item.codevalue }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="服务类别" name="albp0021">
                <a-select v-model:value="queryParam.albp0021">
                  <a-select-option
                    v-for="item in optionsList.albp0021List"
                    :key="item.codeid"
                    :value="item.codeid"
                    :disabled="selectType == 'servicecategory'"
                    >{{ item.codevalue }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="从业状况" name="albp0018">
                <a-select v-model:value="queryParam.albp0018">
                  <a-select-option
                    v-for="item in optionsList.albp0018List"
                    :key="item.codeid"
                    :value="item.codeid"
                    :disabled="selectType == 'workstatus'"
                    >{{ item.codevalue }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="证件类型" name="albp0004">
                <a-select v-model:value="queryParam.albp0004">
                  <a-select-option
                    v-for="item in optionsList.albp0004List"
                    :key="item.codeid"
                    :value="item.codeid"
                    :disabled="selectType == 'credentialtype'"
                    >{{ item.codevalue }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="有无时长" name="albp0089">
                <a-select v-model:value="queryParam.albp0089" :options="optionsList.albp0089List" :disabled="selectType == 'time'"> </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="时长区间" name="timeLength">
                <a-row class="my_input js-input-width" type="flex" style="flex-wrap: nowrap">
                  <a-col>
                    <a-input
                      style="display: inline-block"
                      v-model:value="queryParam.mintime"
                      onkeyup="value= value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''"
                      :disabled="selectType == 'time'"
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
                      :disabled="selectType == 'time'"
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
      <VolunteerStatisticsEach :queryParam="queryParam" :advanced="advanced" ref="VolunteerStatisticsEach" @child="child"></VolunteerStatisticsEach>
    </template>
  </PageFormTableWrapper>
</template>
<script>
import { defineComponent, reactive, ref, onMounted, watch, nextTick } from 'vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import drawChart1 from '../timeManagement/api/echarts.js'
import { rpcPost } from '@/server/conf/index.js'
import VolunteerStatisticsEach from './components/VolunteerStatisticsEach'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { getLevel, redDate } from '@/utils/publicMethods/common.js'
import { message } from 'ant-design-vue'
import moment from 'moment'
import apis from '@/server/request'
export default defineComponent({
  components: { VolunteerStatisticsEach, DownOutlined, UpOutlined },
  setup() {
    const userInfo = ref(LocalGetUserInfo())
    const VolunteerStatisticsEach = ref()
    const advanced = ref(false)
    const searchFormRef = ref()
    const queryParam = reactive({
      areaid: [], //服务区域
      // albp0003: '', // 姓名
      // albp0005: '', //身份证号
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

    const selectType = ref('person')

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

    const child = (selectValue) => {
      // 统计指标变化时调用
      if (selectValue == 'time') {
        //志愿者时长规模
        queryParam.albp0089 = ''
        queryParam.mintime = ''
        queryParam.maxtime = ''
      } else if (selectValue == 'sex') {
        //性别分布
        queryParam.albp0006 = ''
      } else if (selectValue == 'politicalstatus') {
        //政治面貌
        queryParam.albp0007 = ''
      } else if (selectValue == 'education') {
        //学历
        queryParam.albp0017 = ''
      } else if (selectValue == 'age') {
        //年龄
        queryParam.minage = ''
        queryParam.maxage = ''
      } else if (selectValue == 'servicecategory') {
        //服务类别
        queryParam.albp0021 = ''
      } else if (selectValue == 'workstatus') {
        //从业状况
        queryParam.albp0018 = ''
      } else if (selectValue == 'credentialtype') {
        //证件类型
        queryParam.albp0004 = ''
      }
      selectType.value = selectValue
    }

    const refresh = () => {
      //查询
      // if (queryParam.areaid && queryParam.areaid.length > 0 && getLevel(queryParam.areaid[queryParam.areaid.length - 1]) == '省') {
      //   message.warning('服务区域只能选择市级')
      //   return
      // }
      searchFormRef.value
        .validate()
        .then(() => {
          VolunteerStatisticsEach.value.getData()
        })
        .catch((error) => {})
    }

    const resetForm = () => {
      //重置
      // if (queryParam.areaid && queryParam.areaid.length > 0 && getLevel(queryParam.areaid[queryParam.areaid.length - 1]) == '省') {
      //   message.warning('服务区域只能选择市级')
      //   return
      // }
      searchFormRef.value.resetFields()
      queryParam.minage = ''
      queryParam.maxage = ''
      queryParam.mintime = ''
      queryParam.maxtime = ''
      VolunteerStatisticsEach.value.getData()
    }

    const disabledDate = (current) => {
      //时间不能选今天之前
      return current && current > moment(redDate(moment(new Date()).format('YYYY-MM-DD'), 1)).endOf('day')
    }

    const showExpand = () => {
      advanced.value = !advanced.value
      nextTick(() => {
        VolunteerStatisticsEach.value.showExpand()
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

    onMounted(() => {
      getOptions()
    })
    return {
      userInfo,
      selectType,
      VolunteerStatisticsEach,
      advanced,
      searchFormRef,
      queryParam,
      rules,
      optionsList,
      refresh,
      resetForm,
      disabledDate,
      showExpand,
      child,
    }
  },
})
</script>
<style scoped></style>

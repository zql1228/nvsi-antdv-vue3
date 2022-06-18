<template>
  <!-- 时长查询 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form
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
            <a-form-item label="服务区域" name="areaid">
              <macArea placeholder="请选择区域" v-model:value="queryParam.areaid" :allowClear="false"></macArea>
            </a-form-item>
          </a-col>
          <a-col :sm="24" :md="6">
            <a-form-item label="姓名:">
              <a-input placeholder="请输入姓名" v-model:value="queryParam.name" @change="changeName" />
            </a-form-item>
          </a-col>
          <a-col :sm="24" :md="6">
            <a-form-item label="身份证号:">
              <a-input :maxlength="18" placeholder="请输入身份证号" v-model:value="queryParam.cardno" @change="changeCode" />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :sm="24" :md="6">
              <a-form-item label="项目:">
                <a-input placeholder="请输入项目名称" v-model:value="queryParam.albx0002" />
              </a-form-item>
            </a-col>
            <a-col :sm="24" :md="6">
              <a-form-item label="队伍:">
                <a-input placeholder="请输入队伍名称" v-model:value="queryParam.albe0002" />
              </a-form-item>
            </a-col>
            <a-col :sm="24" :md="6">
              <a-form-item label="开始日期:">
                <a-date-picker
                  :allowClear="true"
                  style="width: 100%"
                  v-model:value="queryParam.startValue"
                  :disabledDate="disabledStartDate"
                  format="YYYY-MM-DD"
                  placeholder="开始日期"
                />
              </a-form-item>
            </a-col>
            <a-col :sm="24" :md="6">
              <a-form-item label="结束日期">
                <a-date-picker
                  :allowClear="true"
                  style="width: 100%"
                  v-model:value="queryParam.endValue"
                  :disabled-date="disabledEndDate"
                  format="YYYY-MM-DD"
                  placeholder="结束日期"
                />
              </a-form-item>
            </a-col>
            <a-col :sm="24" :md="6">
              <a-form-item label="时长状态">
                <a-select v-model:value="queryParam.albx0174">
                  <a-select-option v-for="item in codeValue.nvsiAlbx0174" :value="item.value">{{ item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="(!advanced && 6) || 24" :sm="24">
            <a-form-item>
              <div style="white-space: nowrap">
                <a-button type="primary" @click="getList"> 查询 </a-button>
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
    </template>

    <template #table>
      <IATable
        serviceName="durationManagementQueryFortisService"
        :searchParameter="searchFunc"
        ref="inquirytable"
        size="middle"
        :isMc="false"
        :rowKey="(record) => record.id"
        :columns="columns"
      >
        <template #total-title>
          查询合计：总服务时长
          <span> {{ total.timeCount }} </span>
          小时（截止{{ total.today }}）
        </template>
        <template #albp0003="{ text, record }">
          <a href="javascript:void(0)" @click.prevent="toVolInfo(record)">{{ text }}</a>
        </template>
        <template #albx0181="{ text, record }">
          <span :title="record.albx0181 ? record.albx0181.slice(0, 10) + record.albx0181.slice(10, 19) + '~' + record.albx0182.slice(11, 19) : '-'">{{
            record.albx0181 ? record.albx0181.slice(0, 10) + record.albx0181.slice(10, 19) + '~' + record.albx0182.slice(11, 19) : '-'
          }}</span>
        </template>
        <template #albx0172="{ record }"
          ><span :title="record.albx0172 * 1 ? (record.albx0172 * 1).toFixed(2) : '0.00'">
            {{ record.albx0172 * 1 ? (record.albx0172 * 1).toFixed(2) : '0.00' }} </span
          >小时</template
        >
      </IATable>
    </template>
  </PageFormTableWrapper>
</template>
<script>
import { defineComponent, reactive, ref, onMounted, watch, nextTick, toRefs } from 'vue'
import { LocalGetUserInfo, LocalSetVolunteerInfo } from '@/utils/localStorage.js'
import { redDate } from '@/utils/publicMethods/common.js'
import apis from '@/server/request'
import { useRouter } from 'vue-router'
import moment from 'moment'
import { TimeInquiryCom } from './common/tables/table'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { nvsiAlbx0174 } from '@/utils/codevalue'
export default defineComponent({
  components: { DownOutlined, UpOutlined },
  setup() {
    const userInfo = ref(LocalGetUserInfo())
    const router = useRouter()
    const codeValue = reactive({
      nvsiAlbx0174,
    })
    const obj = reactive({
      timeInquiryRef: ref(), //表单
      inquirytable: ref(), //表格刷新
      columns: TimeInquiryCom.columns,
      queryParam: {
        //   // 查询参数
        albx0002: '', //项目名称
        name: '', // 姓名
        cardno: '', //身份证号
        albe0002: '', //所属队伍
        startValue: null,
        endValue: null,
        areaid: [], //区划
        albx0174: '2', // 已生效
      },
      total: {
        //查询合计
        volCount: 0,
        timeCount: 0, // 服务时长
        proCount: 0, // 项目总数
        orgCount: 0, // 队伍总数
        today: '', //合计时长截止日期
      },
      advanced: false, //收起展开
      opens: {
        endOpen: false,
        startOpen: false,
      },
    })

    onMounted(() => {
      let lastDay = redDate(moment(new Date()).format('YYYY-MM-DD'), 1)
      obj.total.today = `${lastDay.slice(0, 4)}年${lastDay.slice(5, 7)}月${lastDay.slice(8, 10)}日`
    })
    const getSum = () => {
      apis
        .StatisticsOnTimeLengthQueryFortisService({
          albx0021: obj.queryParam.areaid.length > 0 ? obj.queryParam.areaid[obj.queryParam.areaid.length - 1] : userInfo.areaid,
        })
        .then((res) => {
          if (res) {
            obj.total.timeCount = res.count_time * 1 ? (res.count_time * 1).toFixed(2) : '0'
          }
        })
    }
    const searchFunc = () => {
      const params = {
        albx0174: obj.queryParam.albx0174,
        albx0002: obj.queryParam.albx0002,
        albe0002: obj.queryParam.albe0002,
        albx0021: obj.queryParam.areaid[obj.queryParam.areaid.length - 1],
        name: obj.queryParam.name ? obj.queryParam.name : obj.queryParam.cardno,
        albx0181: obj.queryParam.startValue ? moment(obj.queryParam.startValue).format('YYYY-MM-DD') + ' 00:00:00' : '',
        albx0182: obj.queryParam.endValue ? moment(obj.queryParam.endValue).format('YYYY-MM-DD') + ' 59:59:59' : '',
      }
      return params
    }
    const showExpand = () => {
      obj.advanced = !obj.advanced
      nextTick(() => {
        obj.inquirytable.value && obj.inquirytable.value.getHeight()
      })
    }
    const resetForm = () => {
      // 重置
      obj.queryParam.albx0002 = '' //项目名称
      obj.queryParam.name = '' // 姓名或省份证号
      obj.queryParam.cardno = ''
      // obj.queryParam.areaid = []
      obj.queryParam.albe0002 = ''
      obj.queryParam.startValue = null
      obj.queryParam.endValue = null
      obj.inquirytable.refresh()
    }
    const getList = () => {
      // if ((obj.queryParam.startValue && !obj.queryParam.endValue) || (!obj.queryParam.startValue && obj.queryParam.endValue)) {
      //   // forTips('startTip', '若要根据时间筛选,开始时间和结束时间都必须选择才能查询')
      // } else {
      getSum()
      // forTips('startTip', '')
      obj.inquirytable.refresh()
      // }
    }
    const disabledStartDate = (startValue) => {
      const endVal = obj.queryParam.endValue
      if (!startValue || !endVal) {
        return startValue.valueOf() > new Date().getTime()
      }
      return startValue.valueOf() > endVal.valueOf() || startValue.valueOf() > new Date().getTime()
    }
    const disabledEndDate = (endValue) => {
      const startValue = obj.queryParam.startValue
      if (!endValue || !startValue) {
        return endValue.valueOf() > new Date().getTime()
      }
      return startValue.valueOf() > endValue.valueOf() || endValue.valueOf() > new Date().getTime()
    }
    const handleOpenChange = (open, val) => {
      if (val == 'start') {
        obj.opens.startOpen = open
        if (!open) {
          obj.queryParam.endValue ? false : (obj.opens.endOpen = true)
        }
      } else {
        obj.opens.endOpen = open
        if (!open) {
          obj.queryParam.startValue ? false : (obj.opens.startOpen = true)
        }
      }
    }
    const changeName = () => {
      // 改变姓名时清空证件号输入框
      obj.queryParam.cardno = ''
    }
    const changeCode = () => {
      // 改变证件号时清空姓名
      obj.queryParam.name = ''
    }
    const toVolInfo = (record) => {
      apis.getcardno({ cardno: record.albp0005 }).then((res) => {
        record.albp0005 = res.cardno
        LocalSetVolunteerInfo(record)
        router.push({ path: '/volunteerCmsDetails' })
      })
    }

    const rules = {
      startValue: [
        {
          required: false,
          // validator: checkStartValue,
          trigger: 'bulr',
        },
      ],
      endValue: [
        {
          required: false,
          // validator: checkEndValue,
          trigger: 'bulr',
        },
      ],
    }
    const num = ref(1)
    watch(
      () => obj.queryParam.areaid,
      () => {
        if (num.value == 1) {
          getSum()
          obj.inquirytable.refresh()
          num.value += 1
        }
      }
    )
    return {
      mode: 'recombination', //  recombination monomer
      codeValue,
      ...toRefs(obj),
      getList,
      showExpand,
      searchFunc,
      resetForm,
      disabledStartDate,
      disabledEndDate,
      changeName,
      changeCode,
      toVolInfo,
    }
  },
})
</script>
<style scoped></style>

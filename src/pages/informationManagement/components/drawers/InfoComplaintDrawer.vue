<template>
  <!-- 投诉详情 -->
  <a-drawer title="投诉详情" placement="right" :visible="visible" :maskClosable="false" @close="onClose" width="600">
    <a-form ref="form_Complaint" :model="formParam" layout="vertical">
      <a-row :gutter="24">
        <a-col :md="12" :sm="24">
          <a-form-item label="投诉人">
            <a-input v-model:value="formParam.albx0356" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="投诉类型">
            <a-input v-model:value="formParam.albx0346Value" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="被投诉对象">
            <a-input v-model:value="formParam.albx0355" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="投诉人手机">
            <a-input v-model:value="formParam.albx0351" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item label="投诉日期">
            <a-input v-model:value="formParam.albx0349" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24" v-show="formParam.albx0346 == '0'">
          <a-form-item label="投诉时长">
            <a @click.prevent="handleViewComTime">查看服务时长明细</a>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item label="投诉内容">
            <a-textarea v-model:value="formParam.albx0344" :disabled="disabled" :auto-size="{ minRows: 6 }" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="FooterBtn">
      <div v-show="currentType == 'notDeal'">
        <a-space>
          <a-button type="primary" style="margin-right: 8px" @click.prevent="headleDeal">标记为已处理</a-button>
          <a-popconfirm :title="'是否确定删除?'" @confirm="headleDelete">
            <a-button>
              删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </div>
      <div v-show="currentType == 'hasBeenDeal'">
        <a-button type="primary" :disabled="true">已经处理</a-button>
      </div>
    </div>
    <a-drawer title="时长记录" :visible="timeVisible" :maskClosable="false" @close="onCloseTime" width="40%">
      <a-form ref="form_Complaint" :model="formParam" layout="vertical">
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="发起申请时间">
              <a-input v-model:value="formTimeParams.albx0180" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="录入时间">
              <a-input v-model:value="formTimeParams.albx0178" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="录入类型">
              <a-input v-model:value="formTimeParams.albx0173Value" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="志愿者姓名">
              <a-input v-model:value="formTimeParams.albp0003" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="志愿者岗位">
              <a-input v-model:value="formTimeParams.albx0072" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="所属项目">
              <a-input v-model:value="formTimeParams.albx0002" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="所属队伍">
              <a-input v-model:value="formTimeParams.albe0002" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="开始时间">
              <a-input v-model:value="formTimeParams.albx0181" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="结束时间">
              <a-input v-model:value="formTimeParams.albx0182" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="服务时长(小时)">
              <a-input v-model:value="formTimeParams.albx0172" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="备注">
              <a-textarea v-model:value="formTimeParams.albp0057" :disabled="disabled" :auto-size="{ minRows: 6 }" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- <div class="time_footer_btnContainer">
        <a-button> 删除时长</a-button>
      </div> -->
    </a-drawer>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'
import apis from '@/server/request'
import EventBus from '@/utils/bus'
import { message } from 'ant-design-vue'
import moment from 'moment'
export default defineComponent({
  setup() {
    let currentRecord = reactive({})
    const currentType = ref('')
    const disabled = ref(true)
    const formParam = reactive({
      albx0346: '', // 投诉类型 0：时长  1：队伍  2：项目  3：人员
      albx0346Value: '',
      albx0349: '', // 投诉时间
      albx0351: '', // 投诉人手机
      albx0355: '', // 被投诉对象
      albx0356: '', // 投诉人
      albx0347: '', // 投诉类型关联的id 项目就是项目id 人员就是人员id
      id: '',
      albx0344: '', // 投诉内容
    })
    const formTimeParams = reactive({
      albx0180: '',
      albx0173Value: '', // 录入类型
      albx0178: '', // 录入时间
      albx0173: '', // albx0173 录入方式   1 团体录入   2 个人申请  4 app打卡
      albp0003: '', // 志愿者姓名
      albx0072: '', // 志愿者岗位
      albe0002: '', // 所属队伍
      albx0002: '', // 所属项目
      albx0181: '', // 开始时间
      albx0182: '', // 结束时间
      albx0172: '', // 服务时长(小时)
      albp0057: '', // 备注
    })
    const setVisible = reactive({
      visible: false,
      timeVisible: false,
      onClose: () => {
        setVisible.visible = false
        currentType.value = ''
        currentRecord = reactive({})
      },
      onCloseTime: () => {
        setVisible.timeVisible = false
        currentRecord = reactive({})
      },
    })

    const refreshComplainTable = () => {
      EventBus.emit('refreshComplaintTable')
    }
    // 标记为已处理
    const headleDeal = async () => {
      const params = {
        id: currentRecord.id,
      }
      const res = await apis.complaintChangeDetails(params)
      if (res.code === 0 || res.code === '0') {
        message.success(res.message)
        refreshComplainTable()
      } else {
        message.warning(res.message)
      }
      setVisible.visible = false
    }
    const headleDelete = async () => {
      const params = []
      params.push({
        id: currentRecord.id,
      })
      const res = await apis.complaintDel(params)
      if (res.code === 0 || res.code === '0') {
        message.success(res.message)
        refreshComplainTable()
      } else {
        message.warning(res.message)
      }
    }
    // 查看时长记录明细
    const handleViewComTime = async () => {
      setVisible.timeVisible = true
      const params = {
        areaid: currentRecord.albx0338,
        id: currentRecord.albx0347,
      }
      console.log(params, 'params...查看时长记录明细')
      const res = await apis.getTimesFortisService(params)
      console.log(res, 'res...查看时长记录明细')
      if (res.code === '0' || res.code === 0) {
        Object.keys(formTimeParams).forEach((key) => {
          formTimeParams[key] = res.data[key]
        })
        switch (res.data.albx0173) {
          case '1':
            formTimeParams.albx0173Value = '团体录入'
            return
          case '2':
            formTimeParams.albx0173Value = '个人申请'
            return
          case '4':
            formTimeParams.albx0173Value = 'app打卡'
            return
        }
      }
    }
    const dealFormParam = () => {
      switch (formParam.albx0346) {
        case '0':
          formParam.albx0346Value = '时长'
        case '1':
          formParam.albx0346Value = '队伍'
        case '2':
          formParam.albx0346Value = '项目'
        case '3':
          formParam.albx0346Value = '人员'
      }
      formParam.albx0349 = moment(formParam.albx0349).format('YYYY-MM-DD HH:mm:ss')
    }
    onBeforeUnmount(() => {
      EventBus.off('handleViewComplaint')
    })
    onMounted(() => {
      EventBusListener()
    })
    const EventBusListener = () => {
      EventBus.on('handleViewComplaint', ({ record, type }) => {
        setVisible.visible = true
        currentRecord = record
        currentType.value = type
        Object.keys(formParam).forEach((key) => {
          formParam[key] = currentRecord[key]
        })
        dealFormParam()
      })
    }
    return {
      ...toRefs(setVisible),
      formParam,
      formTimeParams,
      disabled,
      currentType,
      headleDeal,
      headleDelete,
      handleViewComTime,
    }
  },
})
</script>

<style scoped lang="less">
.FooterBtn {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  z-index: 1;
}
.time_footer_btnContainer {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  display: flex;
  padding: 10px 16px;
  border-top: 1px solid #e9e9e9;
  flex-direction: row-reverse;
}
</style>

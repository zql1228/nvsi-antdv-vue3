<template>
  <!-- 培训通知 -->
  <a-drawer title="培训详情" placement="right" :visible="visible" @close="onClose" width="800">
    <a-form ref="form_train" :model="formParam" layout="vertical" :rules="rules" class="nv-form" :style="{ padding: ' 0 24px' }">
      <a-row :gutter="24">
        <a-col :md="12" :sm="24">
          <a-form-item label="培训主题">
            <a-input placeholder="请输入培训主题" v-model:value="formParam.albx0282" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="培训开始时间" name="albx0284">
            <a-date-picker
              style="width: 100%"
              v-model:value="formParam.albx0284"
              :disabled-date="disabledStartDate"
              format="YYYY-MM-DD"
              placeholder="培训开始时间"
              @change="changeStartDate"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="12" :sm="24">
          <a-form-item label="培训结束时间" name="albx0285">
            <a-date-picker
              style="width: 100%"
              v-model:value="formParam.albx0285"
              :disabled-date="disabledEndDate"
              format="YYYY-MM-DD"
              placeholder="培训结束时间"
              @change="changeEndDate"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="培训区域" name="areaid">
            <AreaFormItem placeholder="请选择区域" v-model:value="formParam.areaid" :showLevel="3" style="margin: 8px" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="详细地址" name="albx0287" extra="请点击右边的地图图标在地图上选择项目详细地址" class="btnFormItem">
            <a-input disabled v-model:value="formParam.albx0287" placeholder="详细地址" style="width: 85%"> </a-input>
            <a-button @click="toggleMap">地图选择</a-button>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="12" :sm="24">
          <a-form-item label="培训类型" name="albx0291">
            <a-select v-model:value="formParam.albx0291" placeholder="请选择培训类型">
              <a-select-option :value="item.value" v-for="item in codeValue.nvsiAlbx0291">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="培训方式" name="albx0292">
            <a-select v-model:value="formParam.albx0292" placeholder="请选择培训类型">
              <a-select-option :value="item.value" v-for="item in codeValue.nvsiAlbx0292">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="12" :sm="24">
          <a-form-item label="培训学时(小时)" name="albx0288">
            <a-input placeholder="请输入培训学时" v-model:value="formParam.albx0288" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="培训组织者" name="albx0293">
            <a-input placeholder="请输入培训组织者" v-model:value="formParam.albx0293" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="12" :sm="24">
          <a-form-item label="培训联系人" name="albx0289">
            <a-input placeholder="请输入培训联系人" v-model:value="formParam.albx0289" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="联系人电话" name="albx0296">
            <a-input placeholder="请输入联系人电话" v-model:value="formParam.albx0296" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="培训内容">
            <a-textarea placeholder="请输入培训内容" v-model:value="formParam.albx0283" :auto-size="{ minRows: 4 }" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="FooterBtn">
      <a-space>
        <a-button style="margin-right: 8px" @click.prevent="headleConfirmUpdate(false)">取消</a-button>
        <a-button type="primary" @click.prevent="headleConfirmUpdate(true)">保存</a-button>
      </a-space>
    </div>
  </a-drawer>
  <baidu-map v-model:visible="mapVisible" @resuleHandel="handleMapSubmit"> </baidu-map>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, onBeforeUnmount, toRefs } from 'vue'
import EventBus from '@/utils/bus'
import { useInfoTrainDrawerHook } from './useRulesHook'
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
import { nvsiAlbx0291, nvsiAlbx0292 } from '@/utils/codevalue'
export default defineComponent({
  setup() {
    const codeValue = reactive({
      nvsiAlbx0291,
      nvsiAlbx0292,
    })
    const userInfo = reactive(LocalGetUserInfo())
    const visible = ref(false)
    const currentState = ref('')
    const rules = useInfoTrainDrawerHook()
    const mapData = ref()
    const formParam = reactive({
      albx0282: '', // 培训主题
      // 培训开始时间
      albx0284: '',
      // 培训结束时间
      albx0285: '',
      // 培训区域
      albx0286: '',
      areaid: [],
      // 详细地址
      albx0287: '',
      albx0291: '', //培训类型
      albx0292: '', //培训方式
      albx0288: '', //培训学时
      albx0293: '', //培训组织者
      albx0289: '', //培训联系人
      albx0296: '', //联系人电话
      albx0283: '', //培训内容
      albx0298: '', //	是	经度
      albx0299: '', //	是	纬度
    })
    const form_train = ref()
    const mapVisible = ref(false)
    const currentRecordId = ref('')

    const toggleMap = () => {
      mapVisible.value = true
    }
    const onClose = () => {
      visible.value = false
      init()
    }
    const init = () => {
      form_train.value.resetFields()
      currentState.value = ''
      currentRecordId.value = ''
      // Object.keys(formParam).forEach((key) => {
      //   formParam[key] = ''
      // })
    }
    onBeforeUnmount(() => {
      EventBus.off('handleAddTrain')
      EventBus.off('handleEditTrain')
    })
    onMounted(() => {
      EventBusListener()
    })
    const EventBusListener = () => {
      EventBus.on('handleAddTrain', () => {
        currentState.value = 'add'
        formParam.areaid.push(userInfo.areaid)
        visible.value = true
      })
      EventBus.on('handleEditTrain', (record) => {
        currentState.value = 'edit'
        visible.value = true
        Object.keys(formParam).forEach((key) => {
          if (record[key]) {
            if (record[key] == 'albx0284') {
              formParam[key] = moment(new Date(record[key]))
            }
            if (record[key] == 'albx0283') {
              formParam[key] = moment(new Date(record[key]))
            }
            if (record[key] == 'albx0286') {
              formParam[key] = record[key]
              formParam.areaid.push(record[key])
            }

            formParam[key] = record[key]
          }
        })
        currentRecordId.value = record.id
      })
    }
    const changeStartDate = (date, dateString) => {
      formParam.albx0284 = date
    }
    const changeEndDate = (date, dateString) => {
      formParam.albx0285 = date
    }
    const disabledStartDate = (startTime) => {
      const endTime = formParam.albx0285
      if (!startTime || !endTime) {
        return false
      }
      return startTime.valueOf() >= endTime.valueOf()
    }
    const disabledEndDate = (endTime) => {
      const startTime = formParam.albx0284
      if (!startTime || !endTime) {
        return false
      }
      return startTime.valueOf() >= endTime.valueOf()
    }

    const headleConfirmUpdate = (flag) => {
      if (!flag) {
        init()
      } else {
        form_train.value
          .validate()
          .then(async () => {
            const params = {
              albx0282: '测试添加培训', // 培训主题
              albx0286: '', // 培训区域
              albx0287: '', // 地址
              albx0291: '线上', //培训类型
              albx0292: '网课', //培训方式
              albx0288: '32', //培训学时
              albx0293: '测试leader', //培训组织者
              albx0289: '测试联系人', //培训联系人
              albx0296: '13211231932', //联系人电话
              albx0283: '测试培训内容', //培训内容
              albx0298: '', //	是	经度
              albx0299: '', //	是	纬度
            }
            Object.keys(params).forEach((key) => {
              params[key] = formParam[key]
            })
            params.albx0284 = moment(formParam.albx0284._d).format('YYYY-MM-DD')
            params.albx0285 = moment(formParam.albx0285._d).format('YYYY-MM-DD')
            params.albx0295 = userInfo.team.groupid
            params.albx0286 = formParam.areaid[formParam.areaid.length - 1]
            let res
            if (currentState.value == 'add') {
              console.log(params, 'add_train...params')
              res = await apis.addTeamTrainingNoticeFortis(params)
            }
            if (currentState.value == 'edit') {
              params.lbx16id = currentRecordId.value
              console.log(params, 'update_train...params')
              res = await apis.updateTeamTrainingNoticeFortis(params)
            }
            console.log(res, 'add_train...res')
            if (res.code == '0') {
              // 刷新表
              EventBus.emit('refreshTrainTable')
              message.success(res.message)
            } else {
              message.warning(res.message)
            }
          })
          .catch((e) => {
            message.warning('请先完善培训信息')
          })
          .finally(() => {
            // init()
          })
      }
    }

    const handleMapSubmit = ({ val, e }) => {
      // mapVisible.value = !mapVisible.value
      mapData.value = e
      formParam.albx0287 = val
      formParam.albx0298 = mapData.value.point.lng.toFixed(3) // 经度
      formParam.albx0299 = mapData.value.point.lat.toFixed(3) // 纬度
    }
    return {
      codeValue,
      visible,
      mapVisible,
      disabledStartDate,
      disabledEndDate,
      currentState,
      formParam,
      rules,
      form_train,
      toggleMap,
      onClose,
      changeStartDate,
      changeEndDate,
      headleConfirmUpdate,
      handleMapSubmit,
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
.mapFormItem {
  :deep(.ant-form-item-control-input-content) {
    display: flex;
    align-items: center;
  }
}
.btnFormItem :deep(.ant-form-item-control-input-content) {
  display: flex;
}
</style>

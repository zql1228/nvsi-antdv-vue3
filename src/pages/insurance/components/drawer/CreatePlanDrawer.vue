<template>
  <a-drawer title="创建计划" placement="right" :visible="visible" :maskClosable="false" @close="onClose" width="900">
    <!--  layout="vertical" -->
    <!-- horizontal -->
    <a-form
      ref="createInsPlanRef"
      class="nv-form"
      :label-col="{
        sm: { span: 5 },
      }"
      :wrapper-col="{
        sm: { span: 19 },
      }"
      layout="vertical"
      :model="createInsPlanParam"
      :rules="createInsPlanRules"
    >
      <a-Card title="" style="width:100%">
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="计划名称" name="planname" style="width:70%">
              <a-input v-model:value="createInsPlanParam.planname" :readonly="formDisabled" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="计划描述" name="plandesc" style="width:70%">
              <a-input v-model:value="createInsPlanParam.plandesc" :readonly="formDisabled" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-Card>
      <a-Card title="用户定向" style="width:100%;margin-top:10px">
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="性别" name="sex">
              <a-radio-group v-model:value="createInsPlanParam.sex" button-style="solid" :disabled="formDisabled">
                <a-radio-button v-for="item in codeValue.nvsiInsSex" :value="item.value" class="a_radio_button">
                  {{ item.label }}
                </a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="年龄" name="age">
              <a-radio-group v-model:value="createInsPlanParam.age" button-style="solid" :disabled="formDisabled">
                <a-radio-button v-for="item in codeValue.nvsiInsAge" :value="item.value" class="a_radio_button">
                  {{ item.label }}
                </a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="服务区域" name="insArea">
              <a-radio-group v-model:value="createInsPlanParam.insArea" button-style="solid" :disabled="formDisabled">
                <a-radio-button value="0" class="a_radio_button">
                  不限
                </a-radio-button>
                <a-radio-button value="1" class="a_radio_button" style="width:120px">
                  按行政区划分
                </a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24" v-show="createInsPlanParam.insArea !== '0'">
            <a-form-item label="选择区域" name="areaid" style="width:100%">
              <AreaDevide
                :disabled="formDisabled"
                placeholder="请选择服务区域"
                v-if="editType === 'add'"
                style="width:100%"
                :showAll="true"
                :type="false"
                v-model:value="createInsPlanParam.areaid"
                ref="serAreaRef"
              ></AreaDevide>
              <a-input v-show="editType == 'view'" disabled v-model:value="createInsPlanParam.areaidname"> </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="从业状况" name="employment">
              <a-radio-group v-model:value="createInsPlanParam.employment" button-style="solid" :disabled="formDisabled">
                <a-radio-button v-for="item in codeValue.nvsiInsWork" :value="item.value" class="a_radio_button" style="width:135px">
                  {{ item.label }}
                </a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-form-item label="服务类别" name="servicetype">
            <a-checkbox-group v-model:value="createInsPlanParam.servicetype" @change="servicetypeChange" :disabled="formDisabled">
              <a-row>
                <a-col :span="4" v-for="item in codeValue.nvsiInserverType" :key="item.label">
                  <a-checkbox
                    :value="item.value"
                    :disabled="createInsPlanParam.servicetype.includes('0') && createInsPlanParam.servicetype.indexOf(item.value) == -1"
                    >{{ item.label }}</a-checkbox
                  >
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
        </a-row>
      </a-Card>
      <a-Card title="活动定向" style="width:100%;margin-top:10px">
        <a-row :gutter="24">
          <a-form-item label="活动类型" name="activitytype">
            <a-checkbox-group v-model:value="createInsPlanParam.activitytype" @change="activitytypeChange" :disabled="formDisabled">
              <a-row>
                <a-col :span="4" v-for="item in codeValue.nvsiInserverType" :key="item.label">
                  <a-checkbox
                    :value="item.value"
                    :disabled="createInsPlanParam.activitytype.includes('0') && createInsPlanParam.activitytype.indexOf(item.value) == -1"
                    >{{ item.label }}</a-checkbox
                  >
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="活动时间" name="activitytime">
              <a-radio-group v-model:value="createInsPlanParam.activitytime" button-style="solid" :disabled="formDisabled">
                <a-radio-button v-for="item in codeValue.nvsiInsActime" :value="item.value" class="a_radio_button">
                  {{ item.label }}
                </a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="活动地点" name="activityaddr">
              <a-radio-group v-model:value="createInsPlanParam.activityaddr" button-style="solid" :disabled="formDisabled">
                <a-radio-button value="0" class="a_radio_button">
                  不限
                </a-radio-button>
                <a-radio-button value="1" class="a_radio_button" style="width:120px">
                  按行政区划分
                </a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24" v-show="createInsPlanParam.activityaddr !== '0'">
            <a-form-item label="选择地点" name="activityaddId" style="width:100%">
              <AreaDevide
                v-if="editType === 'add'"
                :disabled="formDisabled"
                placeholder="请选择活动地点"
                style="width:100%"
                :showAll="true"
                :type="false"
                v-model:value="createInsPlanParam.activityaddId"
                ref="actAreaRef"
              ></AreaDevide>
              <a-input v-show="editType == 'view'" disabled v-model:value="createInsPlanParam.activityaddrname"> </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="活动人数" name="activitypeople">
              <a-radio-group v-model:value="createInsPlanParam.activitypeople" button-style="solid" :disabled="formDisabled">
                <a-radio-button v-for="item in codeValue.nvsiInsPerNum" :value="item.value" class="a_radio_button">
                  {{ item.label }}
                </a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-Card>
    </a-form>

    <div class="footer_btn_container">
      <a-button style="margin-right: 8px" @click="handleCancer">取消</a-button>
      <a-button type="primary" @click="addInsPushPlan">创建计划</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount, watch, nextTick } from 'vue'
import { getCodeValue, getCreateInsPlanParam, getCreateInsPlanRules } from '../../Hooks/useInsurTableHook'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
export default defineComponent({
  emits: ['drawerClose'],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    editType: {
      type: String,
      default: 'none',
    },
    viewRecord: {
      type: Object,
    },
  },
  emits: ['refreshPropellingPlanTable', 'drawerClose'],
  setup(props, { emit }) {
    const serAreaRef = ref()
    const actAreaRef = ref()
    const createInsPlanRef = ref()
    const formDisabled = ref(false)
    const codeValue = getCodeValue()
    const createInsPlanParam = getCreateInsPlanParam()
    const createInsPlanRules = getCreateInsPlanRules(createInsPlanParam)
    const onClose = () => {
      emit('drawerClose')
      createInsPlanRef.value.resetFields()
    }
    const handleCancer = () => {
      onClose()
    }
    const addInsPushPlan = () => {
      // validate,getFieldsValue
      createInsPlanRef.value
        .validate()
        .then(async (values) => {
          const {
            planname,
            plandesc,
            sex,
            age,
            insArea,
            employment,
            areaid,
            servicetype,
            activitytype,
            activitytime,
            activityaddr,
            activityaddId,
            activitypeople,
          } = values
          const params = {
            planname,
            plandesc,
            sex: sex == '0' ? '' : sex,
            age: age == '0' ? '' : age,
            areaid: insArea == '0' ? '' : areaid[areaid.length - 1],
            employment: employment == '0' ? '' : employment,
            servicetype: servicetype[0] == '0' ? '' : servicetype.join(','),
            activitytype: activitytype[0] == '0' ? '' : activitytype.join(','),
            activitytime: activitytime == '0' ? '' : activitytime,
            activityaddr: activityaddr == '0' ? '' : activityaddId[activityaddId.length - 1],
            activitypeople: activitypeople == '0' ? '' : activitypeople,
          }
          const res = await apis.insertPushPlan(params)
          if (res.code == '0') {
            emit('refreshPropellingPlanTable')
            onClose()
            message.success(res.message)
          } else {
            message.warning(res.message)
          }
        })
        .catch((e) => {
          message.warning(e.errorFields[0].errors[0])
        })
    }
    const servicetypeChange = (e) => {
      if (e.includes('0')) {
        createInsPlanParam.servicetype = ['0']
      }
    }
    const activitytypeChange = (e) => {
      if (e.includes('0')) {
        createInsPlanParam.activitytype = ['0']
      }
    }
    const setFormParams = () => {
      const { viewRecord } = props
      console.log(viewRecord, 'viewRecord')
      const {
        planname,
        plandesc,
        sex,
        age,
        areaid,
        employment,
        servicetype,
        activitytype,
        activitytime,
        activityaddr,
        activitypeople,
        areaidname,
        activityaddrname,
      } = viewRecord
      createInsPlanParam['planname'] = planname
      createInsPlanParam['plandesc'] = plandesc
      createInsPlanParam['sex'] = sex ? sex : '0'
      createInsPlanParam['age'] = age ? age : '0'
      createInsPlanParam['insArea'] = areaid ? '1' : '0'
      createInsPlanParam['areaid'] = areaid ? [areaid] : []
      createInsPlanParam['employment'] = employment

      createInsPlanParam['areaidname'] = areaidname
      createInsPlanParam['activityaddrname'] = activityaddrname
      createInsPlanParam['servicetype'] = !servicetype ? ['0'] : servicetype.split(',')
      createInsPlanParam['activitytype'] = !activitytype ? ['0'] : activitytype.split(',')
      createInsPlanParam['activitytime'] = activitytime ? activitytime : '0'
      createInsPlanParam['activityaddr'] = activityaddr ? '1' : '0'
      createInsPlanParam['activityaddId'] = activityaddr ? [activityaddr] : []
      createInsPlanParam['activitypeople'] = activitypeople ? activitypeople : '0'
    }
    const initFormParams = () => {
      createInsPlanParam['planname'] = '' // 计划名称
      createInsPlanParam['plandesc'] = '' // 计划描述
      createInsPlanParam['sex'] = '0' //性别
      createInsPlanParam['age'] = '0' // 年龄
      createInsPlanParam['insArea'] = '0' // 服务区域类型
      createInsPlanParam['areaid'] = [] // 服务区域
      createInsPlanParam['areaidname'] = ''
      createInsPlanParam['employment'] = '' //	从业状况
      createInsPlanParam['planname'] = '' // 计划名称
      createInsPlanParam['planname'] = '' // 计划描述
      createInsPlanParam['servicetype'] = [] //	服务类别
      createInsPlanParam['activitytype'] = [] //	活动类型
      createInsPlanParam['activitytime'] = '0' //	活动时间
      createInsPlanParam['activityaddId'] = [] //活动区域id
      createInsPlanParam['activityaddr'] = '0' //	活动地点
      createInsPlanParam['activityaddrname'] = '' // 计划描述
      createInsPlanParam['activitypeople'] = '' // 活动人数
    }
    watch(
      () => props.editType,
      () => {
        if (props.editType == 'add') {
          formDisabled.value = false
          initFormParams()
        }
        if (props.editType == 'view') {
          formDisabled.value = true
          setFormParams()
        }
      }
    )
    watch(
      () => createInsPlanParam.insArea,
      () => {
        if (props.editType == 'add' && createInsPlanParam.insArea !== '0') {
          nextTick(() => {
            serAreaRef.value.defaultInitArea(['100000000000000000'])
          })
        }
      },
      {
        immediate: true,
      }
    )
    watch(
      () => createInsPlanParam.activityaddr,
      () => {
        if (props.editType == 'add' && createInsPlanParam.activityaddr !== '0') {
          nextTick(() => {
            actAreaRef.value.defaultInitArea(['100000000000000000'])
          })
        }
      },
      {
        immediate: true,
      }
    )
    return {
      ...toRefs(props),
      serAreaRef,
      actAreaRef,
      createInsPlanRef,
      codeValue,
      createInsPlanParam,
      createInsPlanRules,
      formDisabled,
      servicetypeChange,
      activitytypeChange,
      onClose,
      handleCancer,
      addInsPushPlan,
    }
  },
})
</script>

<style scoped lang="less">
.footer_btn_container {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  text-align: right;
  padding: 10px 16px;
  border-top: 1px solid #e9e9e9;
  z-index: 1;
}
.ant-form-item {
  :deep(.ant-form-item-control) {
    max-width: 100%;
  }
}
.a_radio_button {
  width: 90px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.a_select {
  :deep(.ant-select-selector) {
    height: 40px;
  }
  :deep(.ant-select-selection-item) {
    line-height: 40px;
  }
}
</style>

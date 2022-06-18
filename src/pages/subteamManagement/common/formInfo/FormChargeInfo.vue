<template>
  <a-form ref="form_conTactInfo" :model="formParam" :rules="rules" layout="vertical" class="nv-form" :style="{ padding: ' 0 24px' }">
    <a-card title="联系人信息" :bordered="false" style="width: 100%; padding: 0px">
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <a-form-item label="联系人姓名" name="albe0018" class="cus-a-form-item">
            <a-input
              placeholder="联系人姓名"
              v-model:value="formParam.albe0018"
              :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
            />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="联系人手机" name="albe0019">
            <a-input
              placeholder="联系人手机"
              v-model:value="formParam.albe0019"
              :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
            >
              <template #addonAfter>
                <!-- v-model:checked="isPhoneOpen" -->
                <a-switch
                  checked-children="公开"
                  un-checked-children="私密"
                  v-model:checked="isOpenPhone.isPhoneOpen"
                  :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
                />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="固定电话" name="albe0020">
            <a-input
              placeholder="固定电话"
              v-model:value="formParam.albe0020"
              :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
            >
              <template #addonAfter>
                <a-switch
                  checked-children="公开"
                  un-checked-children="私密"
                  v-model:checked="isOpenPhone.isTelOpen"
                  :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
                />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <a-form-item label="联系人邮箱" name="albe0049">
            <a-input
              placeholder="联系人邮箱"
              v-model:value="formParam.albe0049"
              :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
            />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="联系人QQ" name="albe0021">
            <a-input
              placeholder="联系人QQ"
              v-model:value="formParam.albe0021"
              :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-card title="负责人信息" :bordered="false" style="width: 100%; padding: 0px">
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <a-form-item label="负责人姓名" name="albe0022" class="cus-a-form-item">
            <a-input
              placeholder="负责人姓名"
              v-model:value="formParam.albe0022"
              :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
            />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="负责人手机" name="albe0024">
            <a-input
              placeholder="负责人手机"
              v-model:value="formParam.albe0024"
              :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
            />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="身份证号" name="albe0023">
            <a-input
              v-if="updateState == 'change'"
              placeholder="身份证号"
              v-model:value="formParam.albe0023"
              :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
            />
            <a-input
              v-else
              placeholder="身份证号"
              v-model:value="formParam.albe0023value"
              :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
  </a-form>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch } from 'vue'
import VueTypes from 'vue-types'
import { uploadHandle, checkFileType } from '@/utils/upload'
import { message } from 'ant-design-vue/es'
import { TeamUpdateOrChargeInfoHook } from '../../Hooks/useRulesHook'
import { PlusOutlined } from '@ant-design/icons-vue'
import apis from '@/server/request'
export default defineComponent({
  props: {
    updateState: VueTypes.string.isRequired,
    queryTeamParam: VueTypes.object.isRequired,
  },
  setup(props) {
    const formParam = reactive({
      albe0018: '', //联系人姓名
      albe0019: '', // 联系人手机
      albe0047: '', // 手机是否公开
      albe0021: '', // 联系人QQ
      albe0020: '', // 固定电话
      albe0048: '', // 固定电话是否公开
      albe0049: '', // 联系人邮箱
      albe0022: '', // 负责人姓名
      albe0024: '', // 负责人手机
      albe0023: '', // 身份证号
      albe0023value: '', // 密文身份证
    })
    const teamInfo = ref({})
    const isOpenPhone = reactive({
      isPhoneOpen: true,
      isTelOpen: true,
    })
    const { FormChargeInfoRules } = TeamUpdateOrChargeInfoHook()
    const rules = FormChargeInfoRules(formParam)
    const form_conTactInfo = ref()

    const setFormParams = () => {
      formParam['albe0018'] = teamInfo.value['albe0018'] || null
      formParam['albe0019'] = teamInfo.value['albe0019'] || null
      formParam['albe0021'] = teamInfo.value['albe0021'] || null
      formParam['albe0020'] = teamInfo.value['albe0020'] || null
      formParam['albe0049'] = teamInfo.value['albe0049'] || null
      formParam['albe0022'] = teamInfo.value['albe0022'] || null
      formParam['albe0024'] = teamInfo.value['albe0024'] || null
      formParam['albe0023'] = teamInfo.value['albe0023'] || null
      formParam['albe0023value'] = teamInfo.value['albe0023value'] || null
      isOpenPhone.isPhoneOpen = teamInfo.value['albe0047'] == '1' ? true : false
      isOpenPhone.isTelOpen = teamInfo.value['albe0048'] == '1' ? true : false
    }
    const getTeamInfo = async () => {
      const { queryTeamParam } = props
      const params = {
        id: queryTeamParam.teamId,
        areaid: queryTeamParam.areaId,
      }
      const res = await apis.getTeamInfoFortis(params)
      if (res.code == '0') {
        teamInfo.value = res.data
        setFormParams()
      }
    }
    watch(
      () => props.queryTeamParam,
      async () => {
        if (Object.values(props.queryTeamParam).filter((item) => Boolean(item)).length > 0) {
          getTeamInfo()
        }
      },
      {
        immediate: true,
        deep: true,
      }
    )
    watch(
      () => props.updateState,
      async () => {
        if (props.updateState === 'none') {
          if (Object.values(props.queryTeamParam).filter((item) => Boolean(item)).length > 0) {
            getTeamInfo()
          }
        }
      },
      {
        immediate: true,
      }
    )
    return {
      ...toRefs(props),
      formParam,
      isOpenPhone,
      rules,
      form_conTactInfo,
    }
  },
})
</script>

<style scoped lang="less"></style>

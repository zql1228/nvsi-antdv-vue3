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
                  <macArea placeholder="请选择区域" v-model:value="queryParam.areaid" :islevel="false"></macArea>
                  <!-- <AreaFormItem placeholder="请选择区域" v-model:value="queryParam.areaid" :showLevel="3" /> -->
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="姓名" name="albp0003">
                  <a-input placeholder="请输入姓名" v-model:value="queryParam.albp0003" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="证件号" name="albp0005">
                  <a-input placeholder="请输入证件号" v-model:value="queryParam.albp0005" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item>
                  <a-space>
                    <a-button type="primary" @click="refresh"> 查询 </a-button>
                    <a-button @click="resetForm"> 重置 </a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </template>
      <template #table>
        <AuditTable ref="table" :queryParam="queryParam">
          <template #action="{ record }">
            <a-space>
              <a-button type="primary" size="small" @click="audit(record)"> 认证 </a-button>
            </a-space>
          </template>
        </AuditTable>
      </template>
    </PageFormTableWrapper>
    <AuditModel :visible="model1.visible" :item="model1.item" @child="onClose"></AuditModel>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import { LocalGetUserInfo, LocalSetVolunteerInfo } from '@/utils/localStorage.js'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import moment from 'moment'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import { redDate, checktime2, checkCardNo } from '@/utils/publicMethods/common'
import { useRouter } from 'vue-router'
import {
  nvsiAlbp0039, //服务类别
} from '@/utils/codevalue'
import AuditModel from './components/AuditModel'
import AuditTable from './components/AuditTable'
export default defineComponent({
  components: { AuditTable, AuditModel, DownOutlined, UpOutlined },
  setup() {
    const table = ref()
    const userInfo = ref(LocalGetUserInfo())
    const router = useRouter()
    const queryParam = reactive({
      areaid: [], //服务区域
      albp0003: '', // 姓名
      albp0005: '', //身份证号
    })

    const searchFormRef = ref()
    const num = ref(1)
    const model1 = reactive({
      //实名认证审核弹窗参数
      visible: false,
      item: {},
    })

    const onClose = (bool) => {
      //关闭修改弹窗表单
      if (bool) {
        //为true 说明有数据变化 需刷新列表
        table.value.getList('delete')
      }
      model1.visible = false
    }

    watch(
      () => queryParam.areaid,
      (areaid) => {
        if (num.value == 1) {
          table.value.getList(true)
          num.value += 1
        }
      }
    )

    const refresh = () => {
      //查询按钮
      searchFormRef.value.validate().then(() => {
        table.value.getList(true)
      })
    }

    const resetForm = () => {
      //重置
      searchFormRef.value.resetFields()
      table.value.getList(true)
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
    })
    const toVolInfo = (record) => {
      LocalSetVolunteerInfo(record)

      router.push({ path: '/volunteerCmsDetails' })
    }

    const audit = (record) => {
      //认证按钮
      model1.item = record
      model1.visible = true
    }
    return {
      rules,
      table,
      userInfo,
      router,
      queryParam,
      searchFormRef,
      num,
      model1,
      audit,
      onClose,
      refresh,
      resetForm,
    }
  },
})
</script>
<style scoped></style>

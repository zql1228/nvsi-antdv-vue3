<template>
  <!-- 账号申诉 -->
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
                <a-form-item label="姓名" name="albp1002">
                  <a-input placeholder="请输入姓名" v-model:value="queryParam.albp1002" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="证件号" name="albp1003">
                  <a-input placeholder="请输入证件号码" v-model:value="queryParam.albp1003" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item>
                  <a-space>
                    <a-button type="primary" @click="refresh">
                      查询
                    </a-button>
                    <a-button @click="resetForm">
                      重置
                    </a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </template>
      <template #table>
        <AccountsAllegedlyTable ref="table" :queryParam="queryParam">
          <template #action="{record}">
            <a-space>
              <a-button type="primary" size="small" @click="audit(record)">
                审核
              </a-button>
            </a-space>
          </template>
        </AccountsAllegedlyTable>
      </template>
    </PageFormTableWrapper>
    <AccountsAllegedlyModel :visible="model1.visible" :item="model1.item" @child="onClose"></AccountsAllegedlyModel>
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
import AccountsAllegedlyModel from './components/AccountsAllegedlyModel.vue'
import AccountsAllegedlyTable from './components/AccountsAllegedlyTable'
export default defineComponent({
  components: { AccountsAllegedlyTable, AccountsAllegedlyModel, DownOutlined, UpOutlined },
  setup() {
    const table = ref()
    const userInfo = ref(LocalGetUserInfo())
    const router = useRouter()
    const queryParam = reactive({
      areaid: [], //服务区域
      albp1002: '', // 姓名
      albp1003: '', //身份证号
    })

    const searchFormRef = ref()
    const num = ref(1)
    const model1 = reactive({
      //实名认证审核弹窗参数
      visible: false,
      item: {},
    })

    const onClose = (bool) => {
      //关闭审核弹窗
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
      // albp1003: [{ required: false, validator: checkalbp0005 }], //身份证号码
    })
    const toVolInfo = (record) => {
      LocalSetVolunteerInfo(record)
      // console.log(record, 'record')
      router.push({ path: '/volunteerCmsDetails' })
    }

    const audit = (record) => {
      //认证按钮
      model1.item = JSON.parse(JSON.stringify(record))
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

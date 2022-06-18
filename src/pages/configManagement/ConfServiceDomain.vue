<template>
  <!-- 服务领域配置 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form ref="searchFormRef" :model="queryParam">
        <a-row :gutter="24">
          <a-col :md="5" :sm="24">
            <a-form-item label="服务领域">
              <a-input v-model:value="queryParam.doMain" placeholder="请输入服务领域" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="searchForm">
                  查询
                </a-button>
                <a-button @click="resetForm">
                  重置
                </a-button>
                <a-button type="primary" @click="showAddServiceDoMainModal">
                  新增
                </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <template #table>
      <IATable
        serviceName="getServiceFieldListFortis"
        :searchParameter="searchFunc"
        ref="serviceDomainTable"
        size="middle"
        :rowKey="(record) => record.id"
        :columns="columns"
        :showHeader="false"
      >
        <template #action="{record}">
          <a-space>
            <a-button type="primary" size="small" @click="handleUpdateService(record, 'updateName')" :disabled="record.albe0114 == 0 ? true : false">
              修改名称
            </a-button>
            <a-button
              size="small"
              v-if="record.albe0117 !== '1'"
              @click="handleUpdateService(record, 'enabled')"
              :disabled="record.albe0114 == 0 ? true : false"
            >
              启用
            </a-button>
            <a-button size="small" v-else @click="handleUpdateService(record, 'disabled')" :disabled="record.albe0114 == 0 ? true : false">
              停用
            </a-button>
          </a-space>
        </template>
      </IATable>
      <a-modal v-model:visible="dialogVisible" title="请输入服务领域名称" @ok="handleSubmit('ok')">
        <a-input v-model:value="currentRecord.albe0112"></a-input>
        <template #footer>
          <a-button key="back" @click="handleSubmit('center')">取消</a-button>
          <a-button key="submit" type="primary" :loading="btnLoading" @click="handleSubmit('ok')">确定</a-button>
        </template>
      </a-modal>
      <a-modal v-model:visible="addDomainVisible" title="新增服务领域" @ok="addServiceDoMain" width="600px">
        <a-form ref="addDomainFormRef" :model="addDomainForm" :rules="addDomainFormrules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-row>
            <!-- <a-form-item label="领域编号" name="albe0113" style="width:100%">
              <a-input v-model:value="addDomainForm.albe0113" readonly />
            </a-form-item> -->
            <a-form-item label="领域类型" name="albe0112" style="width:100%">
              <a-input v-model:value="addDomainForm.albe0112" />
            </a-form-item>
            <a-form-item label="描述" name="albe0115" style="width:100%">
              <a-input v-model:value="addDomainForm.albe0115" />
            </a-form-item>
            <!-- <a-form-item label="序号" name="albe0116" style="width:100%">
              <a-input v-model:value="addDomainForm.albe0116" />
            </a-form-item> -->
          </a-row>
        </a-form>
        <template #footer>
          <a-button key="back" @click="centerAddDomain">取消</a-button>
          <a-button key="submit" type="primary" :loading="btnLoading" @click="addServiceDoMain">确定</a-button>
        </template>
      </a-modal>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import { confServiceDomainTable } from './table'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
import { getAddDomainFormRules } from './addFormHook'
import { LocalGetUserInfo } from '@/utils/localStorage.js'

export default defineComponent({
  setup() {
    const columns = reactive(confServiceDomainTable.columns)
    const queryParam = reactive({
      doMain: '',
    })
    const addDomainForm = reactive({
      // albe0113: '', // 领域编号
      albe0112: '', // 领域类型
      albe0115: '', // 描述
      // albe0116: '', //序号
    })

    const addDomainFormrules = getAddDomainFormRules()

    const dialogVisible = ref(false)
    const addDomainVisible = ref(false)
    const btnLoading = ref(false)
    const serviceDomainTable = ref()
    const userInfo = ref(LocalGetUserInfo())
    const addDomainFormRef = ref()
    let currentRecord = reactive({
      albe0112: '',
      albe0113: '',
      albe0116: '',
      albe0117: '',
      beanname: '',
      id: '',
    })
    const searchFunc = () => {
      // 这个表没有参数
      return {
        albe0112: queryParam.doMain,
        areaId: userInfo.value.areaid == '100000000000000000' ? '0' :  userInfo.value.areaid,
      }
    }
    // 查询
    const searchForm = () => {
      refreshTable()
    }
    // 重置
    const resetForm = () => {
      queryParam.doMain = ''
    }

    // table button
    const handleUpdateService = async (record, btnAction) => {
      let albe0117
      if (btnAction == 'updateName') {
        dialogVisible.value = true
        Object.keys(currentRecord).forEach((key) => {
          currentRecord[key] = record[key]
        })
        return
      }
      if (btnAction == 'disabled') {
        albe0117 = '2'
      } else {
        albe0117 = '1'
      }
      //禁用
      const params = {
        id: record.id,
        albe0117,
        areaId: userInfo.value.areaid == '100000000000000000' ? '0' :  userInfo.value.areaid,
      }
      const res = await apis.updateOrAddServiecFieldFortis(params)
      if (record.code === '0' || res.code === 0) {
        refreshTable()
        message.success(res.message)
      } else {
        message.warning('更新失败')
      }
    }

    const handleSubmit = async (sta) => {
      if (sta === 'ok') {
        // 发请求 更新名称
        if (currentRecord.albe0112) {
          const params = {
            id: currentRecord.id,
            albe0112: currentRecord.albe0112,
            areaId: userInfo.value.areaid == '100000000000000000' ? '0' :  userInfo.value.areaid,
          }
          const res = await apis.updateOrAddServiecFieldFortis(params)
          if (res.code === '0' || res.code === 0) {
            dialogVisible.value = false
            message.success(res.message)
          } else {
            message.warning(res.message)
          }
          refreshTable()
        } else {
          message.warning('请先输入领域名称')
        }
      } else {
        dialogVisible.value = false
      }
    }

    const refreshTable = () => {
      serviceDomainTable.value.refresh()
    }
    const showAddServiceDoMainModal = () => {
      addDomainVisible.value = true
    }
    const centerAddDomain = () => {
      addDomainFormRef.value.resetFields()
      addDomainVisible.value = false
    }
    const addServiceDoMain = () => {
      addDomainFormRef.value
        .validate()
        .then(async (values) => {
          const { albe0112, albe0115 } = values
          const params = {
            albe0112,
            albe0115,
            areaId: userInfo.value.areaid == '100000000000000000' ? '0' :  userInfo.value.areaid,
          }
          const res = await apis.updateOrAddServiecFieldFortis(params)
          if (res.code == '0') {
            message.success(res.message)
            addDomainFormRef.value.resetFields()
            refreshTable()
            centerAddDomain()
          } else {
            message.warning(res.message)
          }
        })
        .catch((e) => {
          console.log(e)
          // message.warning(e.errorFields[0].errors[0])
        })
    }

    return {
      queryParam,
      columns,
      addDomainFormrules,
      searchFunc,
      searchForm,
      resetForm,
      serviceDomainTable,
      dialogVisible,
      btnLoading,
      currentRecord,
      handleUpdateService,
      handleSubmit,
      showAddServiceDoMainModal,
      addDomainVisible,
      centerAddDomain,
      addServiceDoMain,
      addDomainForm,
      addDomainFormRef,
    }
  },
})
</script>

<style scoped lang="less"></style>

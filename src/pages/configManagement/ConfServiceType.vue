<template>
  <!-- 服务类型配置 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form ref="searchFormRef" :model="queryParam">
        <a-row :gutter="24">
          <a-col :md="5" :sm="24">
            <a-form-item label="服务类型">
              <a-input v-model:value="queryParam.serType" placeholder="请输入服务类型" />
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
                <a-button type="primary" @click="showAddServiceTypeModal">
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
        serviceName="getServiceTypeListFortis"
        :searchParameter="searchFunc"
        ref="serviceTypeTableRef"
        size="middle"
        :rowKey="(record) => record.id"
        :columns="columns"
        :showHeader="false"
      >
        <template #action="{record}">
          <a-space>
            <a-button type="primary" size="small" @click="handleUpdateService(record, 'updateName')" :disabled="record.albe0124 == 0 ? true : false">
              修改名称
            </a-button>
            <a-button
              size="small"
              v-if="record.albe0126 !== '1'"
              @click="handleUpdateService(record, 'enabled')"
              :disabled="record.albe0124 == 0 ? true : false"
            >
              启用
            </a-button>
            <a-button size="small" v-else @click="handleUpdateService(record, 'disabled')" :disabled="record.albe0124 == 0 ? true : false">
              停用
            </a-button>
          </a-space>
        </template>
      </IATable>
      <a-modal v-model:visible="dialogVisible" title="请输入服务类型名称" @ok="handleSubmit('ok')">
        <a-input v-model:value="currentRecord.albe0122" type="text" />
        <template #footer>
          <a-button key="back" @click="handleSubmit('center')">取消</a-button>
          <a-button key="submit" type="primary" :loading="btnLoading" @click="handleSubmit('ok')">确定</a-button>
        </template>
      </a-modal>
      <a-modal v-model:visible="addSerTypeVisible" title="新增服务类型" @ok="addServiceType" width="600px">
        <a-form ref="addSerTypeFormRef" :model="addSerTypeForm" :rules="addSerTypeFormrules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-row>
            <a-form-item label="服务类型" name="albe0122" style="width:100%">
              <a-input v-model:value="addSerTypeForm.albe0122" />
            </a-form-item>
          </a-row>
        </a-form>
        <template #footer>
          <a-button key="back" @click="centerAddSerType">取消</a-button>
          <a-button key="submit" type="primary" :loading="btnLoading" @click="addServiceType">确定</a-button>
        </template>
      </a-modal>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import { confServiceTypeTable } from './table'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { getAddSerTypeFormRules } from './addFormHook'
export default defineComponent({
  setup() {
    const queryParam = reactive({
      serType: '',
    })
    const dialogVisible = ref(false)
    const addSerTypeVisible = ref(false)
    const btnLoading = ref(false)
    let currentRecord = reactive({
      albe0122: '',
      albe0123: '',
      albe0125: '',
      albe0126: '',
      beanname: '',
      id: '',
    })
    const serviceTypeTableRef = ref()
    const userInfo = ref(LocalGetUserInfo())
    const columns = reactive(confServiceTypeTable.columns)
    const addSerTypeFormrules = getAddSerTypeFormRules()
    const addSerTypeFormRef = ref()
    const addSerTypeForm = reactive({
      // 服务类型
      albe0122: '',
    })
    const searchFunc = () => {
      // 没有参数
      return {
        albe0122: queryParam.serType,
        areaid: userInfo.value.areaid == '100000000000000000' ? '0' : userInfo.value.areaid,
      }
    }
    // 查询
    const searchForm = () => {
      refreshTable()
    }
    // 重置
    const resetForm = () => {
      queryParam.serType = ''
    }

    // table button
    const handleUpdateService = async (record, btnAction) => {
      let albe0126
      if (btnAction == 'updateName') {
        dialogVisible.value = true
        Object.keys(currentRecord).forEach((key) => {
          currentRecord[key] = record[key]
        })
        return
      }
      if (btnAction == 'disabled') {
        albe0126 = '2'
      } else {
        albe0126 = '1'
      }
      //禁用
      const params = {
        id: record.id,
        albe0126,
        areaid: userInfo.value.areaid == '100000000000000000' ? '0' : userInfo.value.areaid,
      }
      console.log(params)
      const res = await apis.updateOrAddServiecTypeFortis(params)
      if (record.code == '0' || res.code == 0) {
        refreshTable()
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }

    const handleSubmit = async (sta) => {
      if (sta === 'ok') {
        // 发请求 更新名称
        if (currentRecord.albe0122) {
          const params = {
            id: currentRecord.id,
            albe0122: currentRecord.albe0122,
            areaid: userInfo.value.areaid == '100000000000000000' ? '0' : userInfo.value.areaid,
          }
          console.log(params, 'params')
          const res = await apis.updateOrAddServiecTypeFortis(params)
          if (res.code === '0' || res.code === 0) {
            addSerTypeFormRef.value.resetFields()
            dialogVisible.value = false
            message.success(res.message)
            refreshTable()
          } else {
            message.warning(res.message)
          }
        } else {
          message.warning('请先输入领域名称')
        }
      } else {
        dialogVisible.value = false
      }
    }

    const refreshTable = () => {
      serviceTypeTableRef.value.refresh()
    }
    const showAddServiceTypeModal = () => {
      addSerTypeVisible.value = true
    }
    const centerAddSerType = () => {
      addSerTypeFormRef.value.resetFields()
      addSerTypeVisible.value = false
    }
    const addServiceType = async () => {
      addSerTypeFormRef.value
        .validate()
        .then(async (values) => {
          const { albe0122 } = values
          const params = {
            albe0122,
            areaId: userInfo.value.areaid == '100000000000000000' ? '0' : userInfo.value.areaid,
          }
          const res = await apis.updateOrAddServiecTypeFortis(params)
          if (res.code == '0') {
            message.success(res.message)
            refreshTable()
            addSerTypeFormRef.value.resetFields()
            centerAddSerType()
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
      dialogVisible,
      serviceTypeTableRef,
      btnLoading,
      currentRecord,
      columns,
      searchFunc,
      searchForm,
      resetForm,
      handleUpdateService,
      handleSubmit,
      addSerTypeVisible,
      showAddServiceTypeModal,
      centerAddSerType,
      addServiceType,
      addSerTypeForm,
      addSerTypeFormrules,
      addSerTypeFormRef,
    }
  },
})
</script>

<style scoped lang="less"></style>

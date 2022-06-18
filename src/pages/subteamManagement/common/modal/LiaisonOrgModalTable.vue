<template>
  <a-modal title="选择联络队伍" class="orgModal" :visible="visible" @cancel="handleCancel" width="50vw" :footer="false">
    <div style="width: 100%; height: 45px"><span style="font-size: 20px; color: red">请选择一个联络队伍作为您的联络组织</span></div>
    <a-form :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef" :model="queryParam">
      <a-row :gutter="24">
        <a-col :span="11">
          <a-form-item label="查询范围">
            <a-select placeholder="请选择" v-model:value="queryParam.type">
              <a-select-option value="1">全国性</a-select-option>
              <a-select-option value="0">地方性</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="11">
          <a-form-item label="联络组织名称">
            <a-input v-model:value="queryParam.orgName" placeholder="请输入联络组织名称" />
          </a-form-item>
        </a-col>
        <a-col :span="11">
          <a-form-item label="联络组织编号">
            <a-input v-model:value="queryParam.orgCardNo" placeholder="请输入联络组织编号" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <span>
            <a-button type="primary" @click="searchForm">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetForm">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
    <IATable
      serviceName="getDirecGroupFortis"
      ref="lianOrgTable"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="columns"
      :searchParameter="searchFunc"
    >
      <template #action="{ record }">
        <a-button type="primary" size="small" @click="handleSelectOrg(record)"> 选择 </a-button>
      </template>
    </IATable>
  </a-modal>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, nextTick, watch } from 'vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
const columns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 80,
    align: 'center',
  },
  {
    title: '联络组织名称',
    dataIndex: 'albe0002',
    width: '50%',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '联络组织区域',
    dataIndex: 'albe0012value',
    width: '35%',
    align: 'center',
  },
  {
    title: '联络组织编号',
    dataIndex: 'albe0041',
    width: '20%',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    slots: {
      customRender: 'action',
    },
    width: 180,
  },
]
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const userInfo = reactive(LocalGetUserInfo())
    const lianOrgTable = ref()
    const queryParam = reactive({
      orgName: '', // 联络组织名称
      orgCardNo: '', // 联络组织编号
      type: '0',
    })

    // onMounted(() => {
    //   if (props.visible) {
    //     nextTick(() => {
    //       document.querySelector('.orgModal .ant-modal-footer').style.display = 'none'
    //     })
    //   }
    // })
    // watch(
    //   () => props.visible,
    //   () => {
    //     if (props.visible) {
    //       nextTick(() => {
    //         document.querySelector('.orgModal .ant-modal-footer').style.display = 'none'
    //       })
    //     }
    //   }
    // )
    const handleCancel = () => {
      ctx.emit('handleCancel')
      // 点击右上角的x 或者取消
    }
    const handleSelectOrg = (record) => {
      ctx.emit('handleSelectOrg', record)
    }
    const searchFunc = () => {
      return {
        areaId: userInfo.areaid,
        type: queryParam.type,
        albe0002: queryParam.orgName,
        albe0041: queryParam.orgCardNo,
      }
    }
    // 查询
    const searchForm = () => {
      lianOrgTable.value.refresh()
    }
    // 重置
    const resetForm = () => {
      queryParam.orgName = ''
      queryParam.orgCardNo = ''
      lianOrgTable.value.refresh()
    }
    return {
      ...toRefs(props),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      handleCancel,
      searchFunc,
      columns,
      handleSelectOrg,
      queryParam,
      searchForm,
      resetForm,
      lianOrgTable,
    }
  },
})
</script>

<style scoped lang="less"></style>

<template>
  <!--项目查询 项目人数弹窗 -->
  <a-modal title="项目人员" :visible="props.visible" @cancel="onClose" width="900px" :footer="null">
    <a-form ref="formRef" :label-col="labelCol" :wrapper-col="wrapperCol" :model="queryParam">
      <a-row :gutter="12">
        <a-col :span="8">
          <a-form-item label="姓名">
            <a-input v-model:value="queryParam.albp0003" placeholder="请输入人员姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <span>
            <a-button type="primary" @click="refresh">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetForm">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
    <IATable
      ref="table"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="columns"
      serviceName="getProjectVolListFortis"
      :searchParameter="searchFunc"
    >
    </IATable>
  </a-modal>
</template>
<script>
import { message } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, watch, computed, toRefs, nextTick } from 'vue'
import moment from 'moment'
import { rpcPost } from '@/server/conf/index.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, text) {
    const loading = ref(false)
    const formRef = ref()
    const userInfo = ref(LocalGetUserInfo())
    const queryParam = reactive({
      albp0003: '', //姓名
    })
    const table = ref()

    const refresh = () => {
      //查询按钮
      table.value.refresh(true)
    }

    const resetForm = () => {
      //重置按钮
      queryParam.albp0003 = ''
      formRef.value.resetFields()
      table.value.refresh(true)
    }

    const onClose = (bool) => {
      text.emit('child', bool)
    }
    const searchFunc = () => {
      return {
        areaid: props.item.albx0021,
        proId: props.item.id,
        albx0084: 'B',
        albp0003: queryParam.albp0003 ? queryParam.albp0003 : null,
      }
    }

    watch(
      () => props.visible,
      (value) => {
        if (value) {
          nextTick(() => {
            refresh()
          })
        }
      }
    )

    return {
      table,
      props,
      loading,
      formRef,
      queryParam,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      onClose,
      searchFunc,
      refresh,
      resetForm,
      columns: [
        {
          title: '序号',
          slots: {
            customRender: 'serial',
          },
          width: 80,
          align: 'center',
        },
        {
          title: '姓名',
          dataIndex: 'albp0003',
          width: '20%',
          ellipsis: true,
        },
        {
          title: '岗位',
          dataIndex: 'albx0072',
          width: '20%',
          ellipsis: true,
        },
        {
          title: '区域',
          dataIndex: 'areaname',
          width: '20%',
          ellipsis: true,
        },
        {
          title: '服务时长',
          dataIndex: 'albx0083',
          width: '20%',
          ellipsis: true,
        },
        {
          title: '加入日期',
          dataIndex: 'albx0056',
          width: '20%',
          customRender: (text) => {
            return moment(text.text).format('YYYY-MM-DD')
          },
          slots: {
            customRender: 'albx0056',
          },
          ellipsis: true,
        },
      ],
    }
  },
})
</script>
<style scoped></style>

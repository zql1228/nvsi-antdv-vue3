<!-- 稿件发件箱表格 -->
<template>
  <div>
    <IATable
      serviceName="listManuscriptDepartFront"
      :searchParameter="searchFunc"
      ref="table"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="ManagerManuscriptColumns"
    >
      <template #total-title="{totalData:total}">
        查询合计：
        <span>
          {{ total.totals }}
        </span>
        条
      </template>

      <template #action="record">
        <slot name="action" :record="record"> </slot>
      </template>
    </IATable>
  </div>
</template>

<script>
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { ManagerManuscriptColumns } from '../../columns'
import { getLevel } from '@/utils/publicMethods/common'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue/es'
export default defineComponent({
  props: {
    type: {
      type: Number,
      default: '0',
    },
    queryParam: {
      type: Object,
      default: {},
    },
  },
  components: {},
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())

    const selectedRowKeys = ref([])
    const selectedRows = ref([])
    const table = ref()
    const searchFunc = () => {
      return {
        userid: userInfo.value.userid,
        areaid: userInfo.value.areaid,
        arealevel: userInfo.value.areaLevel, //级别
        type: props.type, //1已发送 0未发送
        beresourcecode: props.queryParam.resourcecode.length > 0 ? props.queryParam.resourcecode[props.queryParam.resourcecode.length - 1] : null, //类型
        title: props.queryParam.title ? props.queryParam.title : null, //标题
      }
    }

    const getList = () => {
      table.value.refresh(true)
    }

    const onSelectChange = (selectedKeys, selectedRows) => {
      selectedRowKeys.value = selectedKeys
    }

    //置顶稿件
    let type
    const switchClick = (text, record) => {
      type = text == 0 ? 4 : 5
      let bean = {
        type: type,
        id: record.id,
        areaid: userInfo.value.areaid,
      }

      rpcPost('updateNewsStatus', { bean })
        .then((res) => {
          if (res && res.code === 0) {
            // message.success('停用成功')
            table.value.refresh(true)
            getList()
          } else {
            // message.warning('停用失败')
          }
        })
        .catch((error) => {
          // message.warning('停用失败')
        })
    }

    return {
      props,
      table,
      searchFunc,
      ManagerManuscriptColumns,
      // 高级搜索 展开/关闭
      selectedRowKeys,
      selectedRows,
      getList,
      onSelectChange,
      switchClick,
    }
  },
})
</script>
<style lang="scss" scoped></style>

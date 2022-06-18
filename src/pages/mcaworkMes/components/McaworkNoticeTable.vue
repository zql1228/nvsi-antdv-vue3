<!-- 通知公告发件箱表格 -->
<template>
  <div>
    <IATable
      serviceName="getAllBulletinNoSendOrSend"
      :searchParameter="searchFunc"
      ref="table"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="McaworkNoticeColumns"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <template #total-title="{totalData:total}">
        查询合计：通知公告条数
        <span>
          {{ total.totals }}
        </span>
        条
      </template>
      <template #urgentlevel="{text:urgentlevel}">
        {{ urgentlevel == 1 ? '紧急' : urgentlevel == 2 ? '普通' : '-' }}
      </template>
      <template #sort="{text:sort}">
        {{ sort == 1 ? '工作通知' : sort == 2 ? '会议通知' : sort == 3 ? '培训通知' : '-' }}
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
import { McaworkNoticeColumns } from '../columns'
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
        sendstatus: props.type, //1已发送 2未发送
        sort: props.queryParam.sort ? props.queryParam.sort : null, //类型
        title: props.queryParam.title ? props.queryParam.title : null, //标题
      }
    }

    const getList = (bool) => {
      table.value.refresh(bool)
    }

    const onSelectChange = (selectedKeys, selectedRows) => {
      selectedRowKeys.value = selectedKeys
    }

    const del = () => {
      //批量删除按钮调用方法
      if (selectedRowKeys.value.length == 0) return message.warning('请先选择要删除的公告')
      let bean = {
        beans: [],
      }
      selectedRowKeys.value.forEach((element) => {
        let obj = { bulletinid: element }
        bean.beans.push(obj)
      })
      rpcPost('deleteManyBulletin', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('已删除')
          getList(false)
        } else {
          message.warning(res.message)
        }
      })
    }

    return {
      props,
      table,
      searchFunc,
      McaworkNoticeColumns,
      // 高级搜索 展开/关闭
      selectedRowKeys,
      selectedRows,
      getList,
      onSelectChange,
      del,
    }
  },
})
</script>
<style lang="scss" scoped></style>

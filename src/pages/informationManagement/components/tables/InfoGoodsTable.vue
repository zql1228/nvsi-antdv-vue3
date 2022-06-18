<template>
  <!-- 物资捐赠表 -->
  <IATable
    serviceName="querySuppliesPageFortis"
    :searchParameter="searchFunc"
    ref="infoGoodsTable"
    :rowKey="(record) => record.id"
    :columns="columns"
    :showHeader="false"
  >
    <template #action="{record}">
      <a-space>
        <a-button type="primary" ghost size="small" @click="handleEditGoods(record)">
          修改
        </a-button>
        <a-popconfirm :title="'确定删除吗?'" @confirm="handleDeleteGoods(record)">
          <a-button size="small">
            删除
          </a-button>
        </a-popconfirm>
      </a-space>
    </template>
  </IATable>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import { InfoGoodsTable } from './table'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import EventBus from '@/utils/bus'
import { message, Modal } from 'ant-design-vue'
import apis from '@/server/request'
export default defineComponent({
  props: {
    tabKey: {
      type: String,
    },
    queryParam: {
      type: Object,
    },
  },
  setup(props) {
    const userInfo = reactive(LocalGetUserInfo())
    const columns = ref(InfoGoodsTable.columns)
    const infoGoodsTable = ref()
    const searchFunc = () => {
      const { tabKey } = props
      return {
        albe1811: userInfo.team.groupid, //	是	队伍id
        albe1812: tabKey, //	是	物资类型（1：一次性物资  2：可持续物资）
        pageNum: '1', //	是	当前页数
        pageSize: '12', //	是	每页数据数
        // 查询参数—— goodsName
        // props.queryParam.commentName,
        albe1802: props.queryParam.goodsName,
      }
    }
    const handleEditGoods = (record) => {
      EventBus.emit('handleEditGoods', record)
    }
    const handleDeleteGoods = async (record) => {
      const res = await apis.deleteSuppliesFortis({ id: record.id })
      if (res.code === '0' || res.code === 0) {
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }
    onMounted(() => {
      EventBus.on('refreshMaterTable', () => {
        infoGoodsTable.value.refresh(true)
      })
    })
    return {
      infoGoodsTable,
      columns,
      searchFunc,
      handleEditGoods,
      handleDeleteGoods,
    }
  },
})
</script>

<style scoped lang="less"></style>

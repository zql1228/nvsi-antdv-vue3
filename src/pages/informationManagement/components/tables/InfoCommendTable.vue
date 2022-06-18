<template>
  <!-- 我的表彰表 -->
  <IATable
    serviceName="recognitionList"
    :searchParameter="searchFunc"
    ref="commentTable"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="columns"
    :showHeader="false"
  >
    <template #action="{record}">
      <a-space>
        <a-button type="primary" size="small" @click="handleDealTable(record, 'publish')" v-if="tabKey == 'notPublish'">
          发布
        </a-button>
        <a-button type="primary" size="small" @click="handleDealTable(record, 'edit')">
          编辑
        </a-button>
        <!-- <a-button type="primary" size="small" @click="handleDealTable(record, 'comList')">
          表彰名录
        </a-button> -->
        <a-popconfirm :title="'是否确定删除?'" @confirm="handleDealTable(record, 'delete')">
          <a-button size="small">
            删除
          </a-button>
        </a-popconfirm>
      </a-space>
    </template>
  </IATable>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch } from 'vue'
import { InfoCommendTable } from './table'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { PublishedProTable } from '@/pages/subteamManagement/common/tables/table'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
import EventBus from '@/utils/bus'
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
    const userInfo = ref(LocalGetUserInfo())
    const columns = ref(InfoCommendTable.columns)
    const commentTable = ref()
    const searchFunc = () => {
      const { tabKey } = props
      return {
        pageNum: 1,
        pageSize: 12,
        albx0354: userInfo.value.team.albe0002,
        type: tabKey == 'published' ? '1' : '0',
        albx0362: props.queryParam.commentType,
        name: props.queryParam.commentName,
      }
    }
    const refreshCommentTable = () => {
      commentTable.value.refresh(true)
    }
    onMounted(() => {
      EventBus.on('refreshCommentTable', () => {
        refreshCommentTable()
      })
    })
    const deleteOrComment = async (record, type) => {
      // （1：发布 2： 删除）
      const params = {
        id: record.id,
        type: type,
      }
      console.log(params, '发布或者删除')
      const res = await apis.recognitionDel(params)
      if (res.code === '0' || res.code === 0) {
        refreshCommentTable()
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }
    // 表彰名录
    const getCommentList = async (record) => {
      EventBus.emit('viewCommentList', record)
    }
    const editCommend = async (record) => {
      EventBus.emit('editCommend', {
        record,
        type: 'edit',
      })
    }
    const handleDealTable = (record, dealTableStatus) => {
      switch (dealTableStatus) {
        case 'delete':
          deleteOrComment(record, '2')
          break
        case 'comList':
          getCommentList(record)
          break
        case 'publish':
          deleteOrComment(record, '1')
          break
        case 'edit':
          editCommend(record)
          break
      }
    }
    return {
      ...toRefs(props),
      columns,
      searchFunc,
      handleDealTable,
      commentTable,
    }
  },
})
</script>

<style scoped lang="less"></style>

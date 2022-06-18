<template>
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form ref="searchFormRef" :model="queryParam">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item label="文件名称">
              <a-input v-model:value="queryParam.filename" placeholder="请输入文件名称(不加后缀名)" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="searchForm"> 查询 </a-button>
                <a-button @click="resetForm"> 重置 </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <template #table>
      <IATable
        serviceName="getCodeFiles"
        :searchParameter="searchFunc"
        ref="fileFindTable"
        size="middle"
        :rowKey="(record) => record.id"
        :columns="columns"
        :showHeader="false"
        :cusPagination="cusPagination"
      >
        <template #action="{ record }">
          <a-space>
            <a-popconfirm :title="'是否确定删除?'" @confirm="headleDelete(record)">
              <a-button> 删除 </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </IATable>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, watch, nextTick, emit, onBeforeMount, onMounted } from 'vue'
import { getFileSourceMapTable } from './table'
import util from '@/utils/util'
import apis from '@/server/request'
export default defineComponent({
  emits: [],
  setup(props, { emit }) {
    const fileFindTable = ref()
    const queryParam = reactive({
      filename: '',
    })
    const cusPagination = reactive({
      pageSize: 500,
      pageNum: 1,
      totals: 0,
      pageCount: 1,
    })
    const columns = getFileSourceMapTable()

    const searchForm = () => {
      refresh()
    }
    const resetForm = () => {
      queryParam.filename = ''
      refresh()
    }
    const searchFunc = () => {
      return {
        filename: queryParam.filename,
      }
    }

    const headleDelete = async (record) => {
      const params = {
        codename: record.name.replaceAll('.json', ''),
      }
      const res = await apis.loadCodeFile(params)
      console.log(res, 'loadCodeFile_res')
      if (res.code == 0) {
        refresh()
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }

    const refresh = () => {
      fileFindTable.value.refresh()
    }
    const initTableData = () => {
      const arr = []
      for (let i = 0; i < 1000; i++) {
        const id = util.randomUUID()
        const fid = util.randomUUID()
        arr.push({
          id,
          name: fid,
          path: '/Leap/Nivs/static/com.longrise/nvsiDF/LeapSource',
          filetime: '2022-05-20-22',
        })
      }
      defaultDataSource.value = arr
    }

    return {
      queryParam,
      searchForm,
      resetForm,
      searchFunc,
      fileFindTable,
      columns,
      cusPagination,
      headleDelete,
    }
  },
})
</script>

<style scoped lang="less"></style>

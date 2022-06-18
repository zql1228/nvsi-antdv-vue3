<template>
  <!-- 推荐队伍 -->
  <div>
    <PageFormTableWrapper>
      <template #searchForm>
        <div class="table-page-search-wrapper">
          <a-form
            ref="searchFormRef"
            :model="queryParam"
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
                <a-form-item label="队伍名称" name="albe0002">
                  <a-input placeholder="请输入队伍名称" v-model:value="queryParam.albe0002" />
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
        <a-tabs type="card" v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="已推荐队伍">
            <RecommendTeamTable ref="table1" :queryParam="queryParam" activeKey="1">
              <template #action="record">
                <a-space>
                  <a-button size="small" type="primary" @click="edit(record.record, 1)">
                    取消推荐
                  </a-button>
                </a-space>
              </template>
            </RecommendTeamTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="未推荐队伍">
            <RecommendTeamTable ref="table2" :queryParam="queryParam" activeKey="2">
              <template #action="record">
                <a-space>
                  <a-button size="small" type="primary" @click="edit(record.record, 2)">
                    推荐队伍
                  </a-button>
                </a-space>
              </template>
            </RecommendTeamTable>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, nextTick, watch } from 'vue'
import RecommendTeamTable from './table/RecommendTeamTable.vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import moment from 'moment'
import {
  nvsiAlbp0039, //服务类别
  nvsiAlbe0003, //队伍类型
} from '@/utils/codevalue'
export default defineComponent({
  components: { RecommendTeamTable },
  setup() {
    const activeKey = ref('1')
    const table1 = ref()
    const table2 = ref()
    const userInfo = ref(LocalGetUserInfo())
    const queryParam = reactive({
      areaid: [], //服务区域
      albe0002: '', // 队伍名称
    })
    const searchFormRef = ref()
    const refresh = () => {
      //查询按钮
      searchFormRef.value.validate().then(() => {
        activeKey.value == 1 ? table1.value.getList(true) : activeKey.value == 2 ? table2.value.getList(true) : table3.value.getList(true)
      })
    }
    const resetForm = () => {
      //重置
      searchFormRef.value.resetFields()
      queryParam.albe0002 = ''
      activeKey.value == 1 ? table1.value.getList(true) : table2.value.getList(true)
    }

    const edit = (record, type) => {
      //推荐 取消推荐 按钮
      let bean = {
        areaId: record.albe0012,
        id: record.id,
        albe0036: type == 1 ? 0 : 1, //1推荐 0不推荐
      }
      rpcPost('teamRecommendFortis', { bean }).then((res) => {
        if (res && res.code == 0) {
          message.success('操作成功')
          if (type == 1) {
            table1.value.getList('delete')
            table2.value ? table2.value.getList(false) : ''
          } else {
            table2.value.getList('delete')
            table1.value.getList(false)
          }
        } else {
          message.warning(res.message)
        }
      })
    }

    return {
      activeKey,
      table1,
      table2,
      userInfo,
      queryParam,
      searchFormRef,
      refresh,
      resetForm,
      edit,
    }
  },
})
</script>

<style scoped lang="less"></style>

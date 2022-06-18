<template>
  <!-- 本级队伍 -->
  <div>
    <!-- :showSearchForm="false" -->
    <PageFormTableWrapper>
      <template #searchForm>
        <a-form ref="searchFormRef" :model="queryParam">
          <a-row :gutter="24">
            <a-col :md="5" :sm="24">
              <a-form-item label="队伍名称">
                <a-input v-model:value="queryParam.teamName" placeholder="请输入队伍名称" />
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-space>
                  <a-button type="primary" size="large" @click="searchFrom"> 查询 </a-button>
                  <a-button @click="resetForm" size="large">重置</a-button>
                </a-space>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <template #table>
        <!-- <SameLevelTeamTable type="3" ref="subTeamTable1Ref" :queryParam="queryParam"></SameLevelTeamTable> -->
        <a-tabs type="card" v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="已启用">
            <SameLevelTeamTable ref="subTeamTable1Ref1" :queryParam="queryParam" activeKey="1">
              <template #action="{ record }">
                <a-space>
                  <a-button size="small" @click="edit(record)"> 修改信息 </a-button>
                  <a-button type="primary" size="small" @click="handleEdit(record, 1, '1')"> 停用队伍 </a-button>
                </a-space>
              </template>
            </SameLevelTeamTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="已停用">
            <SameLevelTeamTable ref="subTeamTable1Ref2" :queryParam="queryParam" activeKey="2">
              <template #action="{ record }">
                <a-space>
                  <a-button size="small" @click="edit(record)"> 修改信息 </a-button>
                  <a-button type="primary" size="small" @click="handleEdit(record, 1, '2')"> 启用队伍 </a-button>
                  <a-button type="primary" size="small" @click="handleEdit(record, 2, '2')"> 启用队伍和项目 </a-button>
                </a-space>
              </template>
            </SameLevelTeamTable>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
    <TeamQueryDrawer :visible="drawerData.visible" :item="drawerData.item" :activeKey="drawerData.activeKey" @child="onClose1"></TeamQueryDrawer>
    <modal
      :visible="modelData.visible"
      :item="modelData.item"
      :title="modelData.title"
      :type="modelData.type"
      :content="modelData.content"
      :activeKey="modelData.activeKey"
      @child="onClose2"
    ></modal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'
import SameLevelTeamTable from './table/SameLevelTeamTable.vue'
import TeamQueryDrawer from './drawer/TeamQueryDrawer'
import modal from './modal/modal'
export default defineComponent({
  components: {
    SameLevelTeamTable,
    TeamQueryDrawer,
    modal,
  },
  setup() {
    const activeKey = ref('1')
    const queryParam = reactive({
      teamName: '',
    })
    const subTeamTable1Ref1 = ref() //已启用队伍
    const subTeamTable1Ref2 = ref() //已停用队伍
    const modelData = reactive({
      //停用启用按钮对话框参数
      visible: false,
      item: {},
      title: '',
      content: '',
      type: 1, //1仅对队伍进行操作 2对队伍和其所属项目进行操作
      activeKey: '1',
    })
    const drawerData = reactive({
      //修改按钮弹窗参数
      visible: false,
      activeKey: '1',
      item: {},
    })
    const handleEdit = (record, type, activeKey) => {
      //停用启用 按钮
      modelData.type = type
      modelData.item = record
      modelData.title = type == 1 && record.albe0026 == 1 ? '停用队伍' : type == 1 && record.albe0026 == 3 ? '仅启用队伍' : '启用队伍和项目'
      modelData.content =
        type == 1 && record.albe0026 == 1
          ? '是否确认停用此队伍，停用后此队伍将不在前台显示，队伍账户无法登录，此队伍所有的项目也将全部停用，是否确认停用'
          : type == 1 && record.albe0026 == 3
          ? '仅启用队伍，则该队伍恢复正常可继续开展志愿服务，已停用的项目仍处于停用状态。请确认是否启用'
          : '启用队伍和项目后，该队伍以及关联的所有被停用的项目将全部启用恢复正常。请确认是否启用'
      modelData.visible = true
      modelData.activeKey = activeKey
    }

    const edit = (record) => {
      //修改按钮
      drawerData.item = record
      drawerData.visible = true
    }

    const onClose1 = (bool, activeKey) => {
      //修改信息弹窗关闭
      if (bool) {
        //为true 说明有数据变化 需刷新列表
        activeKey == 1 ? subTeamTable1Ref1.value.getList(false) : subTeamTable1Ref2.value.getList(false)
      }
      drawerData.visible = false
    }

    const onClose2 = (bool) => {
      //停用启用弹窗关闭
      if (bool) {
        //为true 说明有数据变化 需刷新列表
        if (activeKey.value == 1) {
          subTeamTable1Ref1.value.getList('delete')
          subTeamTable1Ref2.value ? subTeamTable1Ref2.value.getList(false) : ''
        } else {
          subTeamTable1Ref2.value.getList('delete')
          subTeamTable1Ref1.value.getList(false)
        }
      }
      modelData.visible = false
    }
    const searchFrom = () => {
      //查询
      activeKey.value == 1 ? subTeamTable1Ref1.value.getList(true) : subTeamTable1Ref2.value.getList(true)
    }
    const resetForm = () => {
      //重置
      queryParam.teamName = ''
      activeKey.value == 1 ? subTeamTable1Ref1.value.getList(true) : subTeamTable1Ref2.value.getList(true)
    }

    return {
      activeKey,
      queryParam,
      subTeamTable1Ref1,
      subTeamTable1Ref2,
      modelData,
      drawerData,
      searchFrom,
      resetForm,
      handleEdit,
      edit,
      onClose1,
      onClose2,
    }
  },
})
</script>

<style scoped lang="less"></style>

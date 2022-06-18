<template>
  <!-- 表彰名录  -->
  <a-drawer title="表彰名录" placement="right" :visible="visible" :maskClosable="false" @close="onClose" width="800">
    <a-tabs class="teamTabs" :tabBarGutter="8" @change="(e) => (activeTabKey = e)" :activeKey="activeTabKey">
      <a-tab-pane key="commendList">
        <template #tab>
          <span>表彰列表</span>
        </template>
        <a-form ref="commendForm" :model="formParamCommend" layout="vertical">
          <a-row :gutter="24">
            <a-col :md="12" :sm="24">
              <a-form-item label="表彰类型">
                <a-select v-model:value="formParamCommend.commentType">
                  <a-select-option value="1">队伍</a-select-option>
                  <a-select-option value="2">项目</a-select-option>
                  <a-select-option value="3">志愿者</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" v-show="formParamCommend.commentType == '3'">
              <a-form-item label="志愿者类型">
                <a-select v-model:value="formParamCommend.volType">
                  <a-select-option value="1">队伍</a-select-option>
                  <a-select-option value="2">项目</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <!-- 表彰名录列表 -->
        <IATable
          serviceName="commendationDirectoryList"
          :searchParameter="commentListSearchFunc"
          ref="evaluTable"
          size="middle"
          :rowKey="(record) => record.id"
          :columns="commentListColumns"
          :showHeader="false"
        ></IATable>
      </a-tab-pane>
      <a-tab-pane key="addComment">
        <template #tab>
          <span>添加表彰</span>
        </template>
        添加表彰
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'
import EventBus from '@/utils/bus'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'

export default defineComponent({
  setup() {
    const visible = ref(false)
    const activeTabKey = ref('commendList')
    const userInfo = reactive(LocalGetUserInfo())
    const formParamCommend = reactive({
      commentType: '1',
      volType: '1',
    })
    const currentRecord = ref({})
    const onClose = () => {
      visible.value = false
      currentRecord.value = {}
    }
    const commentListSearchFunc = () => {
      const params = {
        id: currentRecord.value.id, // 表彰id
        t: formParamCommend.commentType, // 表彰类型
        ttt: formParamCommend.commentType == '3' ? formParamCommend.volType : '',
        albx0364: userInfo.team.groupid, // 队伍id
      }
      return params
    }
    const EventBusListener = () => {
      EventBus.on('viewCommentList', (record) => {
        currentRecord.value = record
        console.log(currentRecord, 'currentRecord')
        visible.value = true
      })
    }

    onBeforeUnmount(() => {
      EventBus.off('viewCommentList')
    })
    onMounted(() => {
      EventBusListener()
    })
    return {
      visible,
      onClose,
      activeTabKey,
      commentListSearchFunc,
      formParamCommend,
    }
  },
})
</script>

<style scoped lang="less"></style>

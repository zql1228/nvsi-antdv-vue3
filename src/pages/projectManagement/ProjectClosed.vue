<!-- 已结项项目 -->
<template>
  <div>
    <ProjectSearchTable projectType="5" ref="ProjectSearchTable5">
      <template #action="record">
        <a-space>
          <a-popconfirm
            title="每个项目只有一次延期机会，是否前往延期?"
            @confirm="handleDelay(record.record)"
            :disabled="record.record.record.albx0073 === '19' || record.record.record.albx0067 === '1'"
          >
            <!-- :disabled="record.record.record.albx0073 === '19' || record.record.record.albx0067 === '1'" -->
            <a-button type="primary" size="small" :disabled="record.record.record.albx0073 === '19' || record.record.record.albx0067 === '1'">
              延期
            </a-button>
          </a-popconfirm>
          <a-button size="small" @click="openModel(record.record)"> 删除项目 </a-button>
        </a-space>
      </template>
    </ProjectSearchTable>
    <ProjectDelay :visible="visible" :item="item" @child="child"></ProjectDelay>
    <a-modal v-model:visible="modelDate.visible" title="删除项目" :confirmLoading="modelDate.confirmLoading" @ok="handleDelect">
      <p>删除项目会将项目内志愿者踢出项目，无法恢复，是否确认删除项目?</p>
    </a-modal>
  </div>
</template>

<script>
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import { defineComponent, ref, reactive } from 'vue'
import ProjectSearchTable from './components/ProjectSearchTable.vue'
import ProjectDelay from '@/pages/compontentsFrom/ProjectDelay'
export default defineComponent({
  components: { ProjectSearchTable, ProjectDelay },
  setup() {
    const visible = ref(false)
    const item = ref({})
    const ProjectSearchTable5 = ref()
    const modelDate = reactive({
      visible: false,
      confirmLoading: false,
      item: {},
    })
    const openModel = (record) => {
      //删除项目按钮
      if (record.record.albx0061 && record.record.albx0061 > 0) {
        return message.warning('该项目有时长记录，无法删除')
      }
      modelDate.item = record
      modelDate.visible = true
    }
    const handleDelect = () => {
      //删除项目
      let bean = {
        albx0021: modelDate.item.record.albx0021,
        id: modelDate.item.record.id,
      }
      modelDate.confirmLoading = true
      rpcPost('delGroupPublishProjectFortis', { bean }).then((res) => {
        if (res && res.code === 0) {
          modelDate.visible = false
          ProjectSearchTable5.value.getList('delete')
          message.success('删除成功')
        } else {
          message.warning(res.message)
        }
        modelDate.confirmLoading = false
      })
    }
    const handleDelay = (record) => {
      item.value = record.record
      visible.value = true
    }
    const child = (bool) => {
      visible.value = false
      if (bool) {
        // 传值为true时说明数据被操作修改了 需刷新列表
        ProjectSearchTable5.value.getList('delete')
      }
    }
    return {
      modelDate,
      handleDelect,
      handleDelay,
      child,
      ProjectSearchTable5,
      visible,
      item,
      openModel,
    }
  },
})
</script>
<style lang="scss" scoped></style>

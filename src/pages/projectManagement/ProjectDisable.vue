<!-- 已停用项目 -->
<template>
  <div>
    <ProjectSearchTable projectType="7" ref="ProjectSearchTable5"> </ProjectSearchTable>
  </div>
</template>

<script>
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import moment from 'moment'
import { defineComponent, ref, reactive } from 'vue'
import ProjectSearchTable from './components/ProjectSearchTable.vue'
import { useRouter } from 'vue-router'
import { LocalSetProjectInfo } from '@/utils/localStorage.js'
export default defineComponent({
  components: {
    ProjectSearchTable,
  },
  setup() {
    const ProjectSearchTable5 = ref(null)
    const router = useRouter()
    return {
      ProjectSearchTable5,
    }
  },
})
</script>
<style lang="scss" scoped></style>

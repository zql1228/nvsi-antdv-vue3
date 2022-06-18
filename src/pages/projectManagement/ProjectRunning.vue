<!-- 运行中项目 -->
<template>
  <div>
    <ProjectSearchTable projectType="4" ref="ProjectSearchTable4">
      <template #action="record">
        <a-space>
          <a-popconfirm
            :title="record.record.record.albx0070 == 0 ? '是否开启招募' : '是否停止招募'"
            @confirm="handleAdd(record.record)"
            :disabled="
              checktime2(moment(new Date()).format('YYYY-MM-DD'), moment(new Date(record.record.record.albx0006)).format('YYYY-MM-DD')) ||
                checktime(moment(new Date(record.record.record.albx0007)).format('YYYY-MM-DD'))
            "
          >
            <a-button
              type="primary"
              size="small"
              :disabled="
                checktime2(moment(new Date()).format('YYYY-MM-DD'), moment(new Date(record.record.record.albx0006)).format('YYYY-MM-DD')) ||
                  checktime(moment(new Date(record.record.record.albx0007)).format('YYYY-MM-DD'))
              "
            >
              <!-- 当前时间处于招募时间范围内按钮才能点击 -->
              {{ record.record.record.albx0070 == 0 ? '未招募(点击开启)' : '招募中(点击关闭)' }}
            </a-button>
          </a-popconfirm>
          <a-button type="primary" ghost size="small" @click="handleEdit(record.record.record)">
            编辑项目
          </a-button>
          <a-button size="small" @click="openModel(record.record)">
            结束项目
          </a-button>
        </a-space>
      </template>
    </ProjectSearchTable>
    <a-modal v-model:visible="modelDate.visible" title="结束项目" :confirmLoading="modelDate.confirmLoading" @ok="handleSub">
      <p>项目结项后无法恢复，结项后项目无法继续招募志愿者，已有的项目邀请及志愿者加入申请都将直接取消，是否确认结束项目?</p>
    </a-modal>
  </div>
</template>

<script>
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import moment from 'moment'
import { defineComponent, ref, reactive } from 'vue'
import ProjectSearchTable from './components/ProjectSearchTable.vue'
import { checktime, checktime2 } from '@/utils/publicMethods/common'
import { useRouter } from 'vue-router'
import { LocalSetProjectInfo } from '@/utils/localStorage.js'
export default defineComponent({
  components: {
    ProjectSearchTable,
  },
  setup() {
    const ProjectSearchTable4 = ref(null)
    const router = useRouter()
    const modelDate = reactive({
      //删除按钮对话框参数
      visible: false,
      confirmLoading: false,
      item: {},
    })
    const openModel = (record) => {
      //结束项目按钮
      modelDate.item = record
      modelDate.visible = true
    }
    const handleAdd = (record) => {
      //修改项目招募状态
      let bean = {
        albx0021: record.record.albx0021,
        proId: record.record.id,
        type: record.record.albx0070 && record.record.albx0070 == 1 ? 0 : 1, //是否招募（默认1，0：不招募，1：招募）
      }
      rpcPost('groupProjectIsRecruitFortis', { bean })
        .then((res) => {
          if (res && res.code === 0) {
            ProjectSearchTable4.value.getList(false)
            message.success('招募状态修改成功')
          } else {
            message.warning(res.message)
          }
        })
        .catch((res) => {
          message.warning('修改失败')
        })
    }

    const handleEdit = (record) => {
      //编辑项目
      let obj = {
        type: 'modify', //修改
        isRepair: record.albx0024 == 5 ? true : false, //是否是补录项目
        isNotAudit: record.albx0073 == 12 ? true : false, //是否是审核不通过项目
        projectType: 4, //当前编辑项目类别
        projectId: record.id,
        areaId: record.albx0021,
      }
      LocalSetProjectInfo(obj)
      router.push({
        path: '/publishProject',
      })
    }

    const handleSub = () => {
      //项目手动结项
      let bean = {
        albx0021: modelDate.item.record.albx0021,
        proId: modelDate.item.record.id,
      }
      modelDate.confirmLoading = true
      rpcPost('groupProjectKnotFortis', { bean })
        .then((res) => {
          if (res && res.code === 0) {
            modelDate.visible = false
            ProjectSearchTable4.value.getList('delete')
            message.success('结项成功')
          } else {
            message.warning('结项失败')
          }
          modelDate.confirmLoading = false
        })
        .catch((error) => {
          message.warning('结项失败')
        })
    }
    return {
      moment,
      modelDate,
      openModel,
      handleAdd,
      handleSub,
      ProjectSearchTable4,
      checktime,
      checktime2,
      handleEdit,
    }
  },
})
</script>
<style lang="scss" scoped></style>

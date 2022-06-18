<!-- 待启动项目 -->
<template>
  <div>
    <ProjectSearchTable projectType="3" ref="ProjectSearchTable3">
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
          <a-popconfirm :title="'确定删除项目“' + record.record.record.albx0002 + '”吗?'" @confirm="handleDelect(record.record.record)">
            <a-button size="small">
              删除项目
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </ProjectSearchTable>
    <DelProjectModel :visible="del.visible" :item="del.item" :content="del.content" @child="onClose"></DelProjectModel>
  </div>
</template>

<script>
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import { defineComponent, ref, reactive } from 'vue'
import ProjectSearchTable from './components/ProjectSearchTable.vue'
import DelProjectModel from './components/DelProjectModel.vue'
import { useRouter } from 'vue-router'
import moment from 'moment'
import { LocalSetProjectInfo } from '@/utils/localStorage.js'
import { checktime, checktime2 } from '@/utils/publicMethods/common'
export default defineComponent({
  components: {
    ProjectSearchTable,
    DelProjectModel,
  },
  setup() {
    const ProjectSearchTable3 = ref(null)
    const router = useRouter()
    const del = reactive({
      //删除项目按钮参数
      visible: false,
      item: {},
      content: '',
    })
    const handleDelect = (record) => {
      //删除项目
      del.item = record
      del.content = '删除项目会将项目内志愿者踢出项目，无法恢复，是否确认删除项目'
      del.visible = true
    }

    const onClose = (bool) => {
      //关闭删除项目弹窗
      del.visible = false
      bool ? ProjectSearchTable3.value.getList('delete') : ''
    }

    const handleEdit = (record) => {
      //编辑项目
      let obj = {
        type: 'modify', //修改
        isRepair: record.albx0024 == 5 ? true : false, //是否是补录项目
        isNotAudit: record.albx0073 == 12 ? true : false, //是否是审核不通过项目
        isStarted: true, //是否是待启动项目
        projectType: 3,
        projectId: record.id,
        areaId: record.albx0021,
      }
      LocalSetProjectInfo(obj)
      router.push({
        path: '/publishProject',
      })
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
            ProjectSearchTable3.value.getList(false)
            message.success('招募状态修改成功')
          } else {
            message.warning(res.message)
          }
        })
        .catch((res) => {})
    }

    return {
      del,
      onClose,
      ProjectSearchTable3,
      handleDelect,
      handleEdit,
      checktime,
      checktime2,
      handleAdd,
      moment,
    }
  },
})
</script>
<style lang="scss" scoped></style>

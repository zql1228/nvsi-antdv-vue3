<!-- 通知公告收件箱表格 -->
<template>
  <div>
    <IATable
      :serviceName="userInfo.areaLevel == '0' ? 'getBulletinNoReadOrReadOnMinisterial' : 'getAllBulletinNoReadOrReadOnManager'"
      :searchParameter="searchFunc"
      ref="table"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="McaworkNoticeColumns"
    >
      <template #total-title="{totalData:total}">
        查询合计：通知公告条数
        <span>
          {{ total.totals }}
        </span>
        条
      </template>
      <template #urgentlevel="{text:urgentlevel}">
        {{ urgentlevel == 1 ? '紧急' : urgentlevel == 2 ? '普通' : '-' }}
      </template>
      <template #sort="{text:sort}">
        {{ sort == 1 ? '工作通知' : sort == 2 ? '会议通知' : sort == 3 ? '培训通知' : '-' }}
      </template>
      <template #action="record">
        <slot name="action" :record="record"> </slot>
      </template>
    </IATable>
  </div>
</template>

<script>
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { McaworkNoticeColumns } from '../columns'
import { getLevel } from '@/utils/publicMethods/common'
export default defineComponent({
  props: {
    type: {
      type: Number,
      default: '0',
    },
    queryParam: {
      type: Object,
      default: {},
    },
  },
  components: {},
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())

    const selectedRowKeys = ref([])
    const selectedRows = ref([])
    const table = ref()

    const searchFunc = () => {
      if (userInfo.value.areaLevel == '0') {
        //全国账号
        return {
          userid: userInfo.value.userid,
          read: props.type, //1已读 0未读
          sort: props.queryParam.sort ? props.queryParam.sort : null, //类型
          title: props.queryParam.title ? props.queryParam.title : null, //标题
        }
      } else {
        return {
          areaid: userInfo.value.areaid,
          level: userInfo.value.areaLevel,
          userid: userInfo.value.userid,
          read: props.type, //1已读 0未读
          sort: props.queryParam.sort ? props.queryParam.sort : null, //类型
          title: props.queryParam.title ? props.queryParam.title : null, //标题
        }
      }
    }

    const getList = (bool) => {
      table.value.refresh(bool)
    }

    return {
      userInfo,
      props,
      table,
      searchFunc,
      McaworkNoticeColumns,
      // 高级搜索 展开/关闭
      selectedRowKeys,
      selectedRows,
      getList,
    }
  },
})
</script>
<style lang="scss" scoped></style>

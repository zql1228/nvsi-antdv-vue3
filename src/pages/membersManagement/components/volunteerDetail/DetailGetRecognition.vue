<template>
  <!-- 8- 获得表彰 -->

  <IATable
    serviceName="commendFortis"
    :searchParameter="searchFunc"
    ref="volGetRecognitionTableRef"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="columns"
  >
    <template #total-title="{totalData:total}">
      <a-row class="header-bar">
        <div class="header-title table-total">
          查询合计：总数共 <span>{{ total.totals || 0 }}</span> 个。
        </div>
      </a-row>
    </template>
  </IATable>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import { VolGetRecognition } from './table'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
export default defineComponent({
  props: {
    volunteerInfo: {
      type: Object,
    },
    volListRecord: {
      type: Object,
    },
  },
  setup(props) {
    const columns = reactive(VolGetRecognition.columns)
    const volGetRecognitionTableRef = ref()
    const userInfo = reactive(LocalGetUserInfo())
    const searchFunc = () => {
      const { volListRecord } = props
      return {
        volid: volListRecord.albe0133, // 志愿者编号
        groupid: userInfo.userid, // 队伍id
      }
    }

    return {
      columns,
      searchFunc,
      volGetRecognitionTableRef,
    }
  },
})
</script>

<style scoped lang="less"></style>

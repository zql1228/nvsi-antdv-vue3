<template>
  <div>
    <!-- 本来是想写个通用的组件，但是算了， 大家去其他list页面复制吧，这样快，但是不建议这样，看谁有时间写个通用的分页组件吧。 -->
    <a-pagination
      style="text-align: right"
      show-size-changer
      :page-size-options="pageSizeOptions"
      v-model:current="pageNum"
      v-model:pageSize="pagesize"
      v-model:total="totals"
      @showSizeChange="onShowSizeChange"
      @change="changePagenum"
    >
      <template #buildOptionText="props">
        <span>{{ props.value }}条/页</span>
      </template>
    </a-pagination>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, watch, toRefs } from 'vue'

export default defineComponent({
  props: {
    activeKey: {
      //当前列表 1进行中 2已结束
      type: String,
      default: '1',
    },
    current: {
      //当前页
      type: Number,
      default: 1,
    },
    pageSize: {
      //每页数量
      type: Number,
      default: 1,
    },
    total: {
      //总条数
      type: Number,
      default: 0,
    },
  },
  setup(props, context) {
    const page = reactive({
      pageNum: props.current, //当前页
      pagesize: props.pageSize, //每页数量
      totals: props.total, //总条数
    })
    const pageSizeOptions = ref(['10', '20', '30', '40', '50']) //分页参数

    const onShowSizeChange = (current, pageSize) => {
      context.emit('changePagenum', current, pageSize, props.activeKey)
    }

    const changePagenum = (current, pageSize) => {
      context.emit('changePagenum', current, pageSize, props.activeKey)
    }

    watch(props, (newVal) => {
      page.pageNum = newVal.current
      page.pagesize = newVal.pageSize
      page.totals = newVal.total
    })

    return {
      ...toRefs(page),
      onShowSizeChange,
      changePagenum,
      pageSizeOptions,
    }
  },
})
</script>

<style scoped></style>

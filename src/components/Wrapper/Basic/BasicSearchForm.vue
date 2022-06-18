<template>
  <div class="table-page-search-wrapper">
    <a-card :bordered="false" :bodyStyle="searchForm_def">
      <slot></slot>
    </a-card>
  </div>
</template>

<script>
import { defineComponent, ref, inject } from 'vue'
export default defineComponent({
  props: {
    cus_searchTable_Style: {
      type: Object,
    },
  },
  setup(props) {
    // 自定义样式从自己的组件中穿透
    // const searchForm_cus = inject('searchForm_cus')
    const searchForm_def = ref({
      padding: '12px 24px 4px',
      ...props.cus_search_Style,
    })
    return {
      searchForm_def,
    }
  },
})
</script>

<style scoped></style>

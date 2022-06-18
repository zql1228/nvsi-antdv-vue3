<template>
  <a-card :bordered="false" :bodyStyle="cardTableStyle" :style="cardStyle">
    <div style="height: 100%" class="nvis-table">
      <slot name="table"></slot>
      <slot name="pagination"></slot>
    </div>
  </a-card>
</template>

<script>
import { defineComponent, inject, ref, reactive } from 'vue'
import { cardFormSearchStyle } from '@/utils/style.js'
export default defineComponent({
  props: {
    cus_searchTable_Style: {
      type: Object,
    },
  },
  setup(props) {
    // 自定义样式从自己的组件中穿透
    const cardTableStyle = ref({
      paddingTop: '12px',
      paddingBottom: '12px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...props.cus_searchTable_Style,
    })
    const cardStyle = reactive({
      flex: 1,
      overflow: 'hidden',
      ...props.cus_searchTable_Style,
    })
    return {
      cardTableStyle,
      cardFormSearchStyle,
      cardStyle,
    }
  },
})
</script>

<style scoped></style>

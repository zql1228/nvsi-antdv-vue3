<!-- 基本表格 -->
<template>
  <nvsi-header-wrapper>
    <div
      :style="{
        minHeight: 'calc(100vh - 72px - 40px - 48px)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        margin: '24px',
        background: '#FFFFFF',
        borderRadius: '2px',
      }"
    >
      <div style="flex: 1; overflow: hidden">
        <div style="height: 100%" class="nvis-table">
          <slot></slot>
        </div>
      </div>
    </div>
  </nvsi-header-wrapper>
</template>

<script>
import Bus from '@/utils/bus'
import { cardTableStyle } from '@/utils/style'
export default {
  data() {
    return { cardTableStyle }
  },
  mounted: function () {
    // 用$on事件来接收参数
    Bus.$on('areaTreeSelected', this.areaSelected)
  },
  created() {},
  methods: {
    areaSelected({ selectedKeys, info }) {},
  },
}
</script>
<style lang="scss" scoped></style>

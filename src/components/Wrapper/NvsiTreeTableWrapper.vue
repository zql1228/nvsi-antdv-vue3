<!-- 未发布项目 -->
<template>
  <nvsi-header-wrapper>
    <div :style="{ height: 'calc(100vh - 72px - 40px - 48px)', boxSizing: 'border-box', margin: '24px' }">
      <a-row :gutter="24" :style="{ height: '100%' }">
        <a-col :md="4" :sm="24" :style="{ height: '100%' }">
          <!-- 左边 -->
          <slot name="tree"></slot>
        </a-col>
        <a-col
          :md="20"
          :sm="24"
          :style="{
            height: '100%',
            paddingLeft: '12px',
            display: 'flex',
            flexDirection: 'column'
          }"
        >
          <!-- 右边 -->
          <slot name="table-wrapper"></slot>
        </a-col>
      </a-row>
    </div>
  </nvsi-header-wrapper>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped></style>

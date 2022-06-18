<!--  -->
<template>
  <nvsi-header-wrapper>
    <!-- background: '#FFFFFF', -->
    <div
      :style="{
        minHeight: 'calc(100vh - 72px - 40px - 48px)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        margin: '24px',
        borderRadius: '2px',
      }"
    >
      <slot />
    </div>
  </nvsi-header-wrapper>
</template>

<script>
export default {
  data() {
    return {}
  },

  created() {},
}
</script>
<style lang="scss" scoped></style>

<template>
  <div
    class="nvsi-header-wrapper"
    :style="{
      height: 'calc(100vh - 72px - 40px)',
      display: 'flex',
      flexDirection: 'column'
    }"
  >
    <div
      :style="{
        flex: 1,
        overflow: 'auto'
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  created() {}
  // components: {},

  // computed: {},

  // mounted: {},

  // methods: {}
}
</script>
<style lang="scss" scoped></style>

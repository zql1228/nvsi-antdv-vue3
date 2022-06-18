<template>
  <a-drawer title="人员信息" placement="right" :visible="visible" :maskClosable="false" @close="onClose" width="800"></a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['drawerClose'],
  setup(props, { emit }) {
    const onClose = () => {
      emit('drawerClose')
    }
    return {
      ...toRefs(props),
      onClose,
    }
  },
})
</script>

<style scoped lang="less"></style>

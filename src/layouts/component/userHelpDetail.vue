<template>
  <!-- 使用帮助  -->
  <a-drawer placement="right" :visible="props.visible" :maskClosable="false" @close="onClose" width="600">
    <template #title>
      <span class="drawer_title">使用帮助</span>
    </template>
    <a-row :gutter="[0, 12]">
      <a-col :span="24">
        <div class="title">{{ props.item.title ? props.item.title : '' }}</div>
      </a-col>
      <a-col :span="24">
        <div class="img_div">
          <img style="width:100%;height:100%;" :src="props.item.imgUrl ? props.item.imgUrl : ''" />
        </div>
      </a-col>
      <a-col :span="24">
        <div>{{ props.item.detail ? props.item.detail : '' }}</div>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, onBeforeUnmount, toRefs } from 'vue'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, text) {
    const onClose = () => {
      text.emit('child')
    }
    return {
      props,
      onClose,
    }
  },
})
</script>

<style scoped lang="less">
.drawer_title {
  font-size: 22px;
  font-weight: bolder;
}
.title {
  font-size: 18px;
  font-weight: bolder;
  border-bottom: 1px solid#ddd;
}
.img_div {
  width: 100%;
  height: 200px;
}
</style>

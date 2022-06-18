<template>
  <!-- 使用帮助  -->
  <div>
    <a-drawer placement="right" :visible="props.visible" :maskClosable="false" @close="onClose" width="800">
      <template #title>
        <span class="drawer_title">使用帮助</span>
      </template>
      <a-collapse v-model:activeKey="activeKey" expand-icon-position="right" :bordered="false">
        <a-collapse-panel key="1" class="panel">
          <template #header>
            <div class="header">一、时长管理</div>
          </template>
          <div v-for="(item, index) in titleList.list1" :key="index" class="div">
            <a-row>
              <a-col :span="20">
                <span class="title">{{ index + 1 + '.' + item.title }}</span>
              </a-col>
              <a-col :span="4" align="right">
                <a class="btn" @click="viewDetail('list1', index)">查看</a>
              </a-col>
            </a-row>
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="2" class="panel">
          <template #header>
            <div class="header">二、成员管理</div>
          </template>
          <div v-for="(item, index) in titleList.list2" :key="index" class="div">
            <a-row>
              <a-col :span="20">
                <span class="title">{{ index + 1 + '.' + item.title }}</span>
              </a-col>
              <a-col :span="4" align="right">
                <a class="btn" @click="viewDetail('list2', index)">查看</a>
              </a-col>
            </a-row>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </a-drawer>
    <userHelpDetail :visible="detailData.visible" :item="detailData.item" @child="detailData.visible = false"></userHelpDetail>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, onBeforeUnmount, toRefs } from 'vue'
import userHelpDetail from './userHelpDetail'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    userHelpDetail,
  },
  setup(props, text) {
    const activeKey = ref()
    const titleList = reactive({
      list1: [
        { title: '时长录入', imgUrl: '', detail: '暂无' },
        { title: '时长审核', imgUrl: '', detail: '暂无' },
        { title: '时长记录', imgUrl: '', detail: '暂无' },
      ],
      list2: [
        { title: '待审核成员', imgUrl: '', detail: '暂无' },
        { title: '队伍成员', imgUrl: '', detail: '暂无' },
        { title: '项目成员', imgUrl: '', detail: '暂无' },
      ],
    })
    const detailData = reactive({
      visible: false,
      item: {},
    })
    const onClose = () => {
      text.emit('child')
    }
    const viewDetail = (title, index) => {
      //查看按钮
      detailData.item = titleList[title][index]
      detailData.visible = true
    }
    return {
      props,
      activeKey,
      titleList,
      detailData,
      onClose,
      viewDetail,
    }
  },
})
</script>

<style scoped lang="less">
.drawer_title {
  font-size: 22px;
  font-weight: bolder;
}
.header {
  padding-bottom: 16px;
  border-bottom: 1px solid #ddd;
}
.header_icon {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #ddd;
}
.panel {
  font-size: 20px;
  font-weight: bolder;
  border: 0 !important;
  padding: 0;
}
.div {
  margin-left: 48px;
  border-bottom: 1px solid #ddd;
}
.title {
  font-size: 18px;
}
.btn {
  font-size: 16px;
  color: #06a8f0;
}
</style>

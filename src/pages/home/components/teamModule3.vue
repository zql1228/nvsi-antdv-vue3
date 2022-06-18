<template>
  <!--队伍工作台 统计图模块 -->
  <div>
    <a-card
      style="width: 100%"
      :tab-list="tabList"
      :active-tab-key="tabkey"
      @tabChange="(key) => onTabChange(key, 'tabkey')"
      :headStyle="{
        height: '56px',
        border: 0,
        fontSize: '24px',
        color: '#333',
        fontWeight: 'bold',
      }"
      :bodyStyle="{
        background: '#fff',
        height: '0px',
        boxSizing: 'border-box',
        paddingTop: '0px',
        paddingBottom: '0px',
      }"
      :bordered="false"
    >
      <template #disabled><span class="title">综合统计 </span> </template>
    </a-card>
    <div class="div">
      <eachar :active="tabkey"></eachar>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import eachar from './eachar'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
export default defineComponent({
  components: {
    eachar,
  },
  setup() {
    const userInfo = ref()
    const tabList = [
      {
        key: 'disabled',
        //tab: 'tab1',
        slots: { tab: 'disabled' },
      },
      {
        key: 'tab2',
        tab: '新启动项目数',
      },
      {
        key: 'tab3',
        tab: '新增时长',
      },
      {
        key: 'tab4',
        tab: '新增队伍成员',
      },
      {
        key: 'tab5',
        tab: '活跃成员数',
      },
    ]
    const card3List = ['tab2', 'tab3', 'tab4', 'tab5']
    const tabkey = ref('tab2') //柱状图当前tab页key值
    const onTabChange = (key, type) => {
      if (key !== 'disabled') {
        tabkey.value = key
      }
    }
    return {
      userInfo,
      tabList,
      card3List,
      tabkey,
      onTabChange,
    }
  },
})
</script>
<style scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
.div {
  background-color: #fff;
  padding: 12px 24px 0 24px;
  height: 421px;
}
</style>

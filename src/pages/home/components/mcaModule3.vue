<template>
  <!-- 统计图 -->
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
        padding: 0,
        // paddingBottom: '24px',
      }"
      :bordered="false"
    >
      <template #disabled><span class="title">综合统计 </span> </template>
    </a-card>
    <div class="content">
      <a-row>
        <a-col :span="24">
          <eachar :active="tabkey"></eachar>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, watch, nextTick } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import eachar from './eachar2.vue'
export default defineComponent({
  components: {
    eachar,
  },
  setup() {
    const card3 = ref([])
    const tabList = ref([
      {
        key: 'disabled',
        //tab: 'tab1',
        slots: { tab: 'disabled' },
      },
      {
        key: 'tab2',
        tab: '新启动项目',
        active: 1,
      },
      {
        key: 'tab3',
        tab: '新增时长',
        active: 2,
      },
      {
        key: 'tab4',
        tab: '新增志愿者',
        active: 3,
      },
      {
        key: 'tab5',
        tab: '活跃志愿者',
        active: 4,
      },
    ])
    const card3List = ['tab2', 'tab3', 'tab4', 'tab5']
    const tabkey = ref('tab2') //柱状图当前tab页key值

    const onTabChange = (key, type) => {
      if (key !== 'disabled') {
        tabkey.value = key
      }
    }

    return {
      card3,
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
.content {
  background-color: #fff;
  padding: 12px 24px 0 24px;
  height: 421px;
}
</style>

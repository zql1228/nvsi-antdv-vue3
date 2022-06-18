<!-- 管理部门 账户管理→用户信息 -->
<template>
  <div style="margin:12px;background:#fff; box-sizing:border-box;overflow:auto" :style="{ height: sHeight + 'px' }" class="timeStatistics_div">
    <a-card
      style="width:100%"
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
        height: bodyHeight + 'px',
        boxSizing: 'border-box',
        paddingTop: '16px',
        paddingBottom: '0px',
      }"
      :bordered="false"
    >
      <template #disabled><span style="font-size:18px;font-weight:bold;color:#333;">统计指标 </span> </template>

      <eachar :active="tabkey"></eachar>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import eachar from './eachar/TimeStatisticsEachar.vue'
export default defineComponent({
  components: { eachar },
  setup(props) {
    const tabList = [
      {
        key: 'disabled',
        //tab: 'tab1',
        slots: { tab: 'disabled' },
      },
      {
        key: 'tab2',
        tab: '服务时长',
      },
      {
        key: 'tab3',
        tab: '活跃志愿者',
      },
      {
        key: 'tab4',
        tab: '活跃项目',
      },
      {
        key: 'tab5',
        tab: '活跃队伍',
      },
    ]
    const card3List = ['tab2', 'tab3', 'tab4', 'tab5']
    const tabkey = ref('tab2') //柱状图当前tab页key值
    const echartRef = ref()
    const h = reactive({
      sHeight: 800,
      bodyHeight: 736,
    })
    const onTabChange = (key, type) => {
      if (key !== 'disabled') {
        tabkey.value = key
      }
    }
    onMounted(() => {
      setTimeout(() => {
        getSh()
      }, 100)
    })

    const getSh = () => {
      //监听窗口改变
      window.addEventListener('resize', getSh)
      nextTick(() => {
        h.sHeight = window.innerHeight - (40 + document.querySelector('header.nv-header').clientHeight + 24)
        h.bodyHeight = h.sHeight - 56
      })
    }
    watch(
      () => tabkey.value,
      () => {}
    )

    return {
      tabList,
      card3List,
      tabkey,
      ...toRefs(h),
      echartRef,
      onTabChange,
      eacharList: [
        {
          id: 'bar1',
          name: '服务时长',
        }, //新启动项目数 柱状图数据
        {
          id: 'bar2',
          name: '活跃志愿者',
        }, //新增时长 柱状图数据
        {
          id: 'bar3',
          name: '活跃项目',
        }, //新增队伍成员 柱状图数据
        {
          id: 'bar4',
          name: '活跃队伍',
        }, //活跃成员数 柱状图数据
      ],
    }
  },
})
</script>
<style lang="scss" scoped></style>

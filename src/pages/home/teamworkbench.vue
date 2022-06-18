<template>
  <!-- 志愿队伍工作台 -->
  <div id="scroll" style="overflow-x: hidden;overflow-y: auto;margin:24px;" :style="{ height: height1 }">
    <a-row :gutter="[24, 0]" style="height:272px;margin-bottom:24px;">
      <!-- 队伍统计 -->
      <a-col :span="17">
        <teamModule1></teamModule1>
      </a-col>
      <!-- 待办事项 -->
      <a-col :span="7">
        <teamModule2></teamModule2>
      </a-col>
    </a-row>
    <!-- 下方 -->
    <a-row :gutter="[24, 0]">
      <!-- 统计图 -->
      <a-col :span="17">
        <teamModule3></teamModule3>
      </a-col>
      <!-- 通知公告 -->
      <a-col :span="7">
        <teamModule4></teamModule4>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import teamModule1 from './components/teamModule1'
import teamModule2 from './components/teamModule2'
import teamModule3 from './components/teamModule3'
import teamModule4 from './components/teamModule4'
export default defineComponent({
  components: {
    teamModule1,
    teamModule2,
    teamModule3,
    teamModule4,
  },
  setup() {
    const height1 = ref() //最外层div高度
    onMounted(() => {
      getheight()
    })

    const getheight = () => {
      //监听窗口改变
      window.addEventListener('resize', getheight)
      nextTick(() => {
        const height = document.documentElement.clientHeight
        height1.value = height - 157 + 'px'
      })
    }
    return {
      height1,
    }
  },
})
</script>
<style scoped>
#scroll::-webkit-scrollbar {
  width: 0px;
  background: gray;
}
</style>

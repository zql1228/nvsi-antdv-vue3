<template>
  <!-- 管理部门工作台 -->
  <div id="div_scroll" style="overflow-x: hidden;overflow-y: auto;margin:24px;" :style="{ height: height1 }">
    <a-row :gutter="[24, 0]" style="height:272px;margin-bottom:24px;">
      <!-- 队伍统计 -->
      <a-col :span="17">
        <mcaModule1></mcaModule1>
      </a-col>
      <!-- 待办事项 -->
      <a-col :span="7">
        <mcaModule2></mcaModule2>
      </a-col>
    </a-row>
    <!-- 下方 -->
    <a-row :gutter="[24, 0]">
      <!-- 统计图 -->
      <a-col :span="17">
        <mcaModule3></mcaModule3>
      </a-col>
      <!-- 通知公告 -->
      <a-col :span="7">
        <mcaModule4></mcaModule4>
      </a-col>
    </a-row>
    <mcModel :visible="visible" @child="onClose"></mcModel>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, watch, nextTick } from 'vue'
import mcaModule1 from './components/mcaModule1'
import mcaModule2 from './components/mcaModule2'
import mcaModule3 from './components/mcaModule3'
import mcaModule4 from './components/mcaModule4'
import mcModel from './components/mcModel' //机构信息完善弹窗
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { rpcPost } from '@/server/conf/index.js'
export default defineComponent({
  components: {
    mcaModule1,
    mcaModule2,
    mcaModule3,
    mcaModule4,
    mcModel,
  },
  setup() {
    const userInfo = ref(LocalGetUserInfo())
    const visible = ref(false) //机构完善信息 弹窗
    const height1 = ref() //最外层div高度
    const getheight = () => {
      //监听窗口改变
      window.addEventListener('resize', getheight)
      nextTick(() => {
        const height = document.documentElement.clientHeight
        height1.value = height - 157 + 'px'
      })
    }

    const onClose = () => {
      //关闭机构信息完善弹窗
      visible.value = false
    }

    onMounted(() => {
      getheight()
      if (userInfo.value.userflag) {
        rpcPost('selectlbe03', { baen: { userflag: userInfo.value.userflag } }).then((res) => {
          //查询当前登录的机构是否信息完善
          if (res && res.code === 0 && res.data == 1) {
            //data 0机构信息未完善 1机构信息已完善
            visible.value = true
          }
        })
      }
    })

    return {
      height1,
      visible,
      onClose,
    }
  },
})
</script>
<style scoped>
#div_scroll::-webkit-scrollbar {
  width: 0px;
  background: gray;
}
</style>

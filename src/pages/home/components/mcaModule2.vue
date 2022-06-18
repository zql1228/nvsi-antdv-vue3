<template>
  <!-- 待办事项 -->
  <a-card
    :title="card2Title"
    :headStyle="{
      height: '56px',
      border: 0,
      fontSize: '18px',
      color: '#333',
      fontWeight: 'bold',
    }"
    :bodyStyle="{
      background: '#fff',
      height: '216px',
      boxSizing: 'border-box',
      paddingTop: '16px',
      paddingBottom: '24px',
    }"
    :bordered="false"
  >
    <a-row class="cursor card2_list" v-for="(item, index) in card2" :key="index">
      <a-col :span="24">
        <div v-show="userInfo.positionCNName != '文明办'" @click="goOther(item.router)">
          <a-row>
            <a-col span="20" class="left">
              <div class="left_div"></div>
              <span>{{ item.name }}</span>
            </a-col>
            <a-col span="4" class="right">{{ item.num }}</a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted, watch, nextTick } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
export default defineComponent({
  setup() {
    const router = useRouter()
    const userInfo = ref(LocalGetUserInfo())
    const card2Title = ref('待办事项(0)')
    const card2 = ref([
      {
        name: '志愿队伍审核',
        num: 0,
        router: '/teamSubManagement',
      },
      {
        name: '账号申诉',
        num: 0,
        router: '/accountsAllegedly',
      },
    ])
    onMounted(() => {
      setTimeout(() => {
        userInfo.value.positionCNName != '文明办' ? getData() : ''
      }, 2000)
    })

    const getData = () => {
      //获取待办事项
      let bean3 = {
        areaId: userInfo.value.areaLevel == '0' ? '100000000000000000' : userInfo.value.areaid,
      }
      rpcPost('getAppliList', { bean3 }).then((res) => {
        if (res && res.data) {
          card2.value[0].num = res.data.num
          card2.value[1].num = res.data.volnum
          card2Title.value = '待办事项' + '(' + parseInt(res.data.num * 1 + res.data.volnum * 1) + ')'
        }
      })
    }
    const goOther = (name) => {
      //页面跳转
      if (name) {
        router.push(name)
      }
    }

    return {
      userInfo,
      card2Title,
      card2,
      goOther,
    }
  },
})
</script>
<style scoped>
.cursor {
  cursor: pointer;
}
.card2_list {
  color: #000;
  height: 19px;
  line-height: 19px;
  margin-bottom: 35px;
}
.card2_list:hover {
  color: #dc2b19;
}
.left {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  padding-left: 16px;
}
.left_div {
  width: 4px;
  height: 4px;
  background: #dc2b19;
  border-radius: 2px;
  position: absolute;
  left: 0;
  top: 8px;
}
.right {
  text-align: right;
  font-size: 16px;
  font-weight: bold;
}
</style>

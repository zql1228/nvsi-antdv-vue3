<template>
  <!--队伍工作台 待办事项模块 -->
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
    <a-row
      class="cursor card2_list"
      v-for="(item, index) in card2"
      :key="index"
      v-show="!(index > 1 && (userInfo.positionCNName == '非法人团体/直属队' || userInfo.positionCNName == '志愿队'))"
    >
      <a-col :span="24">
        <div @click="goOther(item.router)">
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
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { rpcPost } from '@/server/conf/index.js'
export default defineComponent({
  setup() {
    const router = useRouter()
    const userInfo = ref(LocalGetUserInfo())
    const card2Title = ref('待办事项(0)')
    const card2 = ref([
      {
        name: '志愿者审核',
        num: 0,
        router: '/auditMembers',
      },
      {
        name: '申请时长审核',
        num: 0,
        router: '/timeAudit',
      },
      {
        name: '志愿项目审核',
        num: 0,
        router: '/projectReleaseReview',
      },
      {
        name: '志愿队伍审核',
        num: 0,
        router: '/teamRegReview',
      },
    ])

    onMounted(() => {
      setTimeout(() => {
        getData()
      }, 2000)
    })

    const getData = () => {
      userInfo.value = LocalGetUserInfo()
      //获取待办事项
      let bean3 = {
        teamId: userInfo.value.team.groupid,
        areaid: userInfo.value.areaLevel == '0' ? '100000000000000000' : userInfo.value.areaid,
      }
      rpcPost('selToDoCountFortis', { bean3 }).then((res) => {
        if (res && res.data) {
          card2.value[0].num = res.data.vol
          card2.value[1].num = res.data.time
          card2.value[2].num = res.data.pro
          card2.value[3].num = res.data.team
          let count = res.data.vol + res.data.time + res.data.pro + res.data.team
          card2Title.value = '待办事项' + '(' + count + ')'
        }
      })
    }

    const goOther = (name) => {
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

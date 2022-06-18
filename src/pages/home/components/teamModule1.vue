<template>
  <!--队伍工作台 队伍统计模块 -->
  <a-card
    title="队伍统计"
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
    <a-row :gutter="[24, 0]" class="content">
      <a-col :span="8" v-for="(item, index) in card1" :key="index">
        <a-row>
          <a-col :span="24" :style="item.bg1">
            <a-row class="content_top" :style="item.bg2">
              <a-col :span="12" class="center">
                <div
                  class="img_div"
                  :style="{
                    width: index == 0 ? '64.5px' : index == 1 ? '50.45px' : '78.45px',
                  }"
                >
                  <img class="img" :src="item.img" alt="" />
                </div>
              </a-col>
              <a-col :span="12" class="title">
                <span class="title_span">{{ item.name }}</span>
              </a-col>
            </a-row>
            <a-row class="content_bottom" type="flex" justify="space-around" align="middle">
              <a-col :span="12" class="center">
                <div class="content_bottom_left">
                  <span>{{ item.text1 }}</span>
                  <div class="content_bottom_left_div">
                    {{ index == 0 ? item.runningpronum : index == 1 ? item.albe0056 : item.albe0069 }}
                  </div>
                </div>
              </a-col>
              <a-col :span="12" class="center">
                <div class="content_bottom_right">
                  <span>{{ index == 0 ? item.text2 : '' }}</span>
                  <div class="content_bottom_right_div">
                    {{ index == 0 ? item.pronum : '' }}
                  </div>
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
export default defineComponent({
  setup() {
    const userInfo = ref()
    const card1 = ref([
      {
        name: '服务项目',
        text1: '运行中(个)',
        text2: '总数(个)',
        img: require('@/assets/img/workBenchImg/img1.png'),
        bg1: 'background-color:#F4F9FF;',
        bg2: 'background-image: linear-gradient(to right,#DDEEFF,#E6F2FF);',
        runningpronum: 0,
        pronum: 0,
      },
      {
        name: '队伍成员',
        text1: '总数(个)',
        img: require('@/assets/img/workBenchImg/img2.png'),
        bg1: 'background-color:#FFFAFA;',
        bg2: 'background-image: linear-gradient(to right,#FFEAEA,#FDF0F0);',
        albe0056: 0,
      },
      {
        name: '服务时长',
        text1: '服务时长(小时)',
        img: require('@/assets/img/workBenchImg/img3.png'),
        bg1: 'background-color:#FFFAF4;',
        bg2: 'background-image: linear-gradient(to right,#FFF1E2,#FFFAF4);',
        albe0069: 0,
      },
    ])

    onMounted(() => {
      setTimeout(() => {
        getData()
      }, 2000)
    })

    const getData = () => {
      userInfo.value = LocalGetUserInfo()
      //获取队伍统计
      let bean = {
        id: userInfo.value.team.groupid,
        areaid: userInfo.value.areaLevel == '0' ? '100000000000000000' : userInfo.value.areaid,
      }
      rpcPost('getTeamStatistic', { bean })
        .then((res) => {
          if (res && res.data) {
            card1.value[0].runningpronum = res.data.runningpronum
            card1.value[0].pronum = res.data.pronum
            card1.value[1].albe0056 = res.data.albe0056
            card1.value[2].albe0069 = res.data.albe0069
          }
        })
        .catch((error) => {})
        .finally(() => {})
    }

    return {
      userInfo,
      card1,
    }
  },
})
</script>
<style scoped>
.content {
  height: 176px;
  background: #fff;
}
.content_top {
  height: 80px;
  border-bottom-left-radius: 42px;
}
.center {
  text-align: center;
}
.img_div {
  display: inline-block;
  text-align: left;
  line-height: 80px;
}
.img {
  width: 48px;
  height: 48px;
}
.title {
  height: 80px;
  line-height: 80px;
  font-size: 16px;
}
.title_span {
  position: relative;
  right: 32px;
}
.content_bottom {
  height: 96px;
}
.content_bottom_left {
  display: inline-block;
  text-align: left;
}
.content_bottom_left_div {
  text-align: left;
  font-size: 28px;
  font-weight: bold;
}
.content_bottom_right {
  display: inline-block;
  text-align: left;
}
.content_bottom_right_div {
  text-align: left;
  font-size: 28px;
  font-weight: bold;
}
</style>

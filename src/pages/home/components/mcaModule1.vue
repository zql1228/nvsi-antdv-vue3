<template>
  <!--管理部门工作台 队伍统计模块 -->
  <a-card
    style="width: 100%"
    :tab-list="tabList"
    :active-tab-key="noTitleKey"
    @tabChange="(key) => onTabChange(key, 'noTitleKey')"
    :headStyle="{
      height: '56px',
      border: 0,
      fontSize: '24px',
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
    <template #disabled>
      <span class="title"> 志愿统计</span>
    </template>
    <a-row :gutter="[24, 0]" class="content" v-for="(item, index) in tabList" :key="index" v-show="noTitleKey === item.key">
      <a-col :span="8" v-for="(item2, index2) in item.cardDt" :key="index2">
        <a-row v-if="item.key !== 'disabled'">
          <a-col :span="24" :style="item2.bg1">
            <a-row class="bg2" :style="item2.bg2">
              <a-col :span="24" class="center">
                <div class="relactive_left">
                  <div class="img_div">
                    <img class="img" :src="item2.img" alt="" />
                  </div>
                  <div class="f_16">{{ item2.name }}</div>
                </div>
              </a-col>
            </a-row>
            <a-row class="content_bottom" type="flex" justify="space-around" align="middle">
              <a-col :span="24" class="center">
                <div class="text_f">
                  <span class="num">{{ item2.num }}</span>
                  <span class="unit">{{ item2.unit }}</span>
                </div>
              </a-col>
              <a-col :span="12" class="center" v-if="index == 1 && index2 == 0">
                <span>昨日新增&nbsp;&nbsp;</span>
                <span class="c_red">{{ item2.num1 }}</span>
              </a-col>
              <a-col :span="12" class="center" v-if="index == 1 && index2 == 0">
                <span>本月新增&nbsp;&nbsp;</span>
                <span class="c_red">{{ item2.num2 }}</span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <!-- <a-row :gutter="[24, 0]" class="content" v-for="(item, index) in tabListNoTitle" :key="index" v-show="noTitleKey === item.key">
      <a-col :span="8" v-for="(item2, index2) in card1[index]" :key="index2">
        <a-row v-if="item.key !== 'disabled'">
          <a-col :span="24" :style="item2.bg1">
            <a-row class="bg2" :style="item2.bg2">
              <a-col :span="24" class="center">
                <div class="relactive_left">
                  <div class="img_div">
                    <img class="img" :src="item2.img" alt="" />
                  </div>
                  <div class="f_16">{{ item2.name }}</div>
                </div>
              </a-col>
            </a-row>
            <a-row class="content_bottom" type="flex" justify="space-around" align="middle">
              <a-col :span="24" class="center">
                <div class="text_f">
                  <span class="num">{{ item2.num }}</span>
                  <span class="unit">{{ item2.unit }}</span>
                </div>
              </a-col>
              <a-col :span="12" class="center" v-if="index == 1 && index2 == 0">
                <span>昨日新增&nbsp;&nbsp;</span>
                <span class="c_red">{{ item2.num1 }}</span>
              </a-col>
              <a-col :span="12" class="center" v-if="index == 1 && index2 == 0">
                <span>本月新增&nbsp;&nbsp;</span>
                <span class="c_red">{{ item2.num2 }}</span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
    </a-row> -->
  </a-card>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, watch, nextTick } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { redDate } from '@/utils/publicMethods/common'
import moment from 'moment'
export default defineComponent({
  setup() {
    const userInfo = ref()

    const tabList = ref([
      {
        key: 'disabled',
        slots: { tab: 'disabled' },
      },
      {
        key: 'article',
        tab: '志愿者',
        cardDt: [
          {
            name: '总数',
            img: require('@/assets/img/workBenchImg/img2.png'),
            bg1: 'background-color:#FFFAFA;',
            bg2: 'background-image: linear-gradient(to right,#FFEAEA,#FDF0F0);',
            unit: '(人)',
            num: 0,
            num1: 0,
            num2: 0,
          },
          {
            name: '存在时长',
            img: require('@/assets/img/workBenchImg/img8.png'),
            bg1: 'background-color:#F4F9FF;',
            bg2: 'background-image: linear-gradient(to right,#DDEEFF,#E6F2FF);',
            unit: '(人)',
            num: 0,
          },
          {
            name: '服务时长',
            img: require('@/assets/img/workBenchImg/img3.png'),
            bg1: 'background-color:#FFFAF4;',
            bg2: 'background-image: linear-gradient(to right,#FFF1E2,#FFFAF4);',
            unit: '(小时)',
            num: 0,
          },
        ],
      },
      {
        key: 'app',
        tab: '志愿项目',
        cardDt: [
          {
            name: '运行中',
            img: require('@/assets/img/workBenchImg/img1.png'),
            bg1: 'background-color:#F4F9FF;',
            bg2: 'background-image: linear-gradient(to right,#DDEEFF,#E6F2FF);',
            unit: '(个)',
            num: 0,
          },
          {
            name: '待启动',
            img: require('@/assets/img/workBenchImg/img7.png'),
            bg1: 'background-color:#FFFAF4;',
            bg2: 'background-image: linear-gradient(to right,#FFF1E2,#FFFAF4);',
            unit: '(个)',
            num: 0,
          },
          {
            name: '总数',
            img: require('@/assets/img/workBenchImg/img6.png'),
            bg1: 'background-color:#F5FFF4;',
            bg2: 'background-image: linear-gradient(to right,#D5FFD2,#F5FFF4);',
            unit: '(个)',
            num: 0,
          },
        ],
      },
      {
        key: 'project',
        tab: '志愿队伍',
        cardDt: [
          {
            name: '昨日新增',
            img: require('@/assets/img/workBenchImg/img4.png'),
            bg1: 'background-color:#F4FBFF;',
            bg2: 'background-image: linear-gradient(to right,#DDF1FF,#E6F2FF);',
            unit: '(个)',
            num: 0,
          },
          {
            name: '本月新增',
            img: require('@/assets/img/workBenchImg/img5.png'),
            bg1: 'background-color:#FFFAFA;',
            bg2: 'background-image: linear-gradient(to right,#FFEAEA,#FDF0F0);',
            unit: '(个)',
            num: 0,
          },
          {
            name: '总数',
            img: require('@/assets/img/workBenchImg/img3.png'),
            bg1: 'background-color:#FFFAF4;',
            bg2: 'background-image: linear-gradient(to right,#FFF1E2,#FFFAF4);',
            unit: '(个)',
            num: 0,
          },
        ],
      },
    ])
    const tabListNoTitle = [
      {
        key: 'disabled',
        //tab: '志愿统计'
        slots: { tab: 'disabled' },
      },
      {
        key: 'article',
        tab: '志愿者',
      },
      {
        key: 'app',
        tab: '志愿项目',
      },
      {
        key: 'project',
        tab: '志愿队伍',
      },
    ]
    const noTitleKey = ref('article') //志愿统计当前tab页key值
    const card1 = ref([
      [],
      [
        {
          name: '总数',
          img: require('@/assets/img/workBenchImg/img2.png'),
          bg1: 'background-color:#FFFAFA;',
          bg2: 'background-image: linear-gradient(to right,#FFEAEA,#FDF0F0);',
          unit: '(人)',
          num: 0,
          num1: 0,
          num2: 0,
        },
        {
          name: '存在时长',
          img: require('@/assets/img/workBenchImg/img8.png'),
          bg1: 'background-color:#F4F9FF;',
          bg2: 'background-image: linear-gradient(to right,#DDEEFF,#E6F2FF);',
          unit: '(人)',
          num: 0,
        },
        {
          name: '服务时长',
          img: require('@/assets/img/workBenchImg/img3.png'),
          bg1: 'background-color:#FFFAF4;',
          bg2: 'background-image: linear-gradient(to right,#FFF1E2,#FFFAF4);',
          unit: '(小时)',
          num: 0,
        },
      ],
      [
        {
          name: '运行中',
          img: require('@/assets/img/workBenchImg/img1.png'),
          bg1: 'background-color:#F4F9FF;',
          bg2: 'background-image: linear-gradient(to right,#DDEEFF,#E6F2FF);',
          unit: '(个)',
          num: 0,
        },
        {
          name: '待启动',
          img: require('@/assets/img/workBenchImg/img7.png'),
          bg1: 'background-color:#FFFAF4;',
          bg2: 'background-image: linear-gradient(to right,#FFF1E2,#FFFAF4);',
          unit: '(个)',
          num: 0,
        },
        {
          name: '总数',
          img: require('@/assets/img/workBenchImg/img6.png'),
          bg1: 'background-color:#F5FFF4;',
          bg2: 'background-image: linear-gradient(to right,#D5FFD2,#F5FFF4);',
          unit: '(个)',
          num: 0,
        },
      ],
      [
        {
          name: '昨日新增',
          img: require('@/assets/img/workBenchImg/img4.png'),
          bg1: 'background-color:#F4FBFF;',
          bg2: 'background-image: linear-gradient(to right,#DDF1FF,#E6F2FF);',
          unit: '(个)',
          num: 0,
        },
        {
          name: '本月新增',
          img: require('@/assets/img/workBenchImg/img5.png'),
          bg1: 'background-color:#FFFAFA;',
          bg2: 'background-image: linear-gradient(to right,#FFEAEA,#FDF0F0);',
          unit: '(个)',
          num: 0,
        },
        {
          name: '总数',
          img: require('@/assets/img/workBenchImg/img3.png'),
          bg1: 'background-color:#FFFAF4;',
          bg2: 'background-image: linear-gradient(to right,#FFF1E2,#FFFAF4);',
          unit: '(个)',
          num: 0,
        },
      ],
    ])

    onMounted(() => {
      setTimeout(() => {
        getData()
      }, 2000)
    })
    const onTabChange = (key, type) => {
      if (key !== 'disabled') {
        noTitleKey.value = key
      }
    }

    const getData = () => {
      userInfo.value = LocalGetUserInfo()
      //获取志愿统计
      let bean = {
        areaId: userInfo.value.areaLevel == '0' ? '000000000000000000' : userInfo.value.areaid,
        level: userInfo.value.areaLevel, //0,1,2,3全国省市区
        time: moment(new Date()).format('YYYY-MM-DD'), //当天日期
        time1: moment(redDate(moment(new Date()).format('YYYY-MM-DD'), 1)).format('YYYY-MM-DD'), //昨天日期
      }
      console.log(bean)
      rpcPost('countAdministrationProjectNumFortis', { bean })
        .then((res) => {
          console.log(res, 'res')
          if (res.code == 0 && res.data) {
            const data1 = res.data[0]
            const {
              count_person,
              day_person_count,
              month_person_count,
              work_time_count,
              count_time,
              run_project,
              pend_project,
              count_project,
              day_org_count,
              month_org_count,
              count_org,
            } = data1

            // 志愿者
            tabList.value[1].cardDt[0].num = count_person // 总数
            tabList.value[1].cardDt[0].num1 = day_person_count // 昨日新增
            tabList.value[1].cardDt[0].num2 = month_person_count // 本月新增
            tabList.value[1].cardDt[1].num = work_time_count // 本月新增
            tabList.value[1].cardDt[2].num = count_time // 服务时长

            // 志愿项目
            tabList.value[2].cardDt[0].num = run_project
            tabList.value[2].cardDt[1].num = pend_project
            tabList.value[2].cardDt[2].num = count_project

            // 志愿队伍
            tabList.value[3].cardDt[0].num = day_org_count
            tabList.value[3].cardDt[1].num = month_org_count
            tabList.value[3].cardDt[2].num = count_org
          }
        })
        .catch((error) => {})
        .finally(() => {})
    }

    return {
      userInfo,
      tabList,
      // tabListNoTitle,
      noTitleKey,
      card1,
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
  height: 176px;
  background: #fff;
}
.bg2 {
  height: 80px;
  border-bottom-left-radius: 42px;
}
.center {
  text-align: center;
}
.relactive_left {
  position: relative;
  right: 24px;
}
.img_div {
  display: inline-block;
  text-align: left;
  line-height: 80px;
  margin-right: 15px;
}
.img {
  width: 48px;
  height: 48px;
}
.content_bottom {
  height: 96px;
}
.text_f {
  color: #000;
}
.f_16 {
  display: inline-block;
  font-size: 16px;
}
.num {
  font-size: 30px;
  font-weight: bold;
  margin-right: 5px;
}
.unit {
  font-size: 14px;
  position: relative;
  top: -5px;
}
.c_red {
  font-weight: bold;
  color: #dc2b19;
}
</style>

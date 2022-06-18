<template>
  <!-- 队伍工作台eachar图 -->
  <div>
    <a-row :gutter="[0, 19]">
      <a-col :span="24" class="row1">
        <a-row class="row1_content">
          <a-col :md="17" :sm="24">
            <div ref="form">
              <a-select ref="select" v-model:value="selectValue" class="date_select">
                <a-select-option value="1">按天统计</a-select-option>
                <a-select-option value="2">按月统计</a-select-option>
                <a-select-option value="3">按年统计</a-select-option>
              </a-select>
              <div v-show="selectValue == 1" class="date_div">
                <a-date-picker
                  class="date"
                  v-model:value="dataList.day.startValue"
                  :disabled-date="disabledStartDate"
                  format="YYYY-MM-DD"
                  placeholder="开始日期"
                  @openChange="handleStartOpenChange"
                  @change="updateTime3"
                />
                <img class="img" src="@/assets/img/workBenchImg/date.png" alt="" />
                <a-date-picker
                  class="date"
                  v-model:value="dataList.day.endValue"
                  :disabled-date="disabledEndDate"
                  format="YYYY-MM-DD"
                  placeholder="结束日期"
                  :open="dataList.day.endOpen"
                  @openChange="handleEndOpenChange"
                />
              </div>
              <div v-show="selectValue == 2" class="date_div">
                <a-month-picker
                  class="date"
                  v-model:value="dataList.month.startValue"
                  :disabled-date="disabledStartMonth"
                  format="YYYY-MM"
                  placeholder="开始日期"
                  @openChange="handleStartOpenChange"
                />
                <img class="img" src="@/assets/img/workBenchImg/date.png" alt="" />
                <a-month-picker
                  class="date"
                  v-model:value="dataList.month.endValue"
                  :disabled-date="disabledEndMonth"
                  format="YYYY-MM"
                  placeholder="结束日期"
                  :open="dataList.month.endOpen"
                  @openChange="handleEndOpenChange"
                />
              </div>
              <div v-show="selectValue == 3" class="date_div">
                <a-date-picker
                  placeholder="开始日期"
                  mode="year"
                  format="YYYY"
                  v-model:value="dataList.year.startValue"
                  @openChange="handleStartOpenChange"
                  @panelChange="updateTime1"
                />
                <img class="img" src="@/assets/img/workBenchImg/date.png" alt="" />
                <a-date-picker
                  placeholder="结束日期"
                  mode="year"
                  format="YYYY"
                  v-model:value="dataList.year.endValue"
                  :open="dataList.year.endOpen"
                  @openChange="handleEndOpenChange"
                  @panelChange="updateTime2"
                />
              </div>
              <div class="inlin_b">
                <a-button
                  class="mr_8"
                  @click="getData(props.active)"
                  :loading="loading"
                  :disabled="
                    (!(selectValue == '1' && dataList.day.startValue && dataList.day.endValue) &&
                      !(selectValue == '2' && dataList.month.startValue && dataList.month.endValue) &&
                      !(selectValue == '3' && dataList.year.startValue && dataList.year.endValue)) ||
                    loading3 == true
                  "
                  >查询</a-button
                >
                <a-button @click="reset" :loading="loading3" :disabled="loading == true">重置</a-button>
              </div>
            </div>
          </a-col>
          <a-col :md="7" :sm="24">
            <div class="download_div">
              <a-button @click="exportUplod" :disabled="loading == true || loading3 == true"> 下载图表 </a-button>
              <a-button class="ml_8" @click="exportUplo2" :loading="loading2" :disabled="loading == true || loading3 == true">
                导出excel表格
              </a-button>
              <a ref="download" download v-show="false" href="#"></a>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="row2">
      <a-col :span="24" class="position_r">
        <span class="row2_left"
          >{{
            props.active == 'tab2' ? '新启动项目数' : props.active == 'tab3' ? '新增时长' : props.active == 'tab4' ? '新增队伍成员' : '活跃成员数'
          }}：<span style="color: #d92f2f">{{ number }}</span
          >&nbsp;{{ props.active == 'tab3' ? '小时' : '个' }}</span
        >
        <span class="row2_right">{单位：{{ props.active == 'tab3' ? '小时' : '个' }} }</span>
      </a-col>
    </a-row>
    <a-spin :spinning="spinning">
      <div ref="myRef" id="teamWorkEachar" :style="{ height: height }"></div>
    </a-spin>
  </div>
</template>
<script>
import { redDate, loadEcharts, addDays, checktime2, redDateYear } from '@/utils/publicMethods/common.js'
import * as echarts from 'echarts'
import { rpcPost } from '@/server/conf/index.js'
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { message } from 'ant-design-vue'
export default defineComponent({
  props: {
    active: {
      type: String,
      default: 'tab2',
    },
  },
  setup(props) {
    const selectValue = ref('1') //1日 2月 3年
    const height = ref() //eachar统计图高度
    const form = ref() //查询条件模块元素对象
    const number = ref(0) //总数
    const dataList = reactive({
      //时间
      day: {
        startValue: moment(new Date(redDate(moment(new Date()).format('YYYY-MM-DD'), 6))),
        endValue: moment(new Date(moment(new Date()).format('YYYY-MM-DD'))),
        endOpen: false,
      },
      month: {
        startValue: null,
        endValue: null,
        endOpen: false,
      },
      year: {
        startValue: null,
        endValue: null,
        endOpen: false,
      },
    })
    const userInfo = ref()
    const loading = ref(false)
    const loading2 = ref(false)
    const loading3 = ref(false)
    const spinning = ref(false)
    const myChart = ref()
    const myRef = ref()
    const param = reactive({
      tab2: {
        x: [],
        y: [],
        num: '0',
      },
      tab3: {
        x: [],
        y: [],
        num: '0',
      },
      tab4: {
        x: [],
        y: [],
        num: '0',
      },
      tab5: {
        x: [],
        y: [],
        num: '0',
      },
    })
    const download = ref() //用于下载excel图表的a标签
    const list = reactive({
      tab2: [],
      tab3: [],
      tab4: [],
      tab5: [],
    }) //当前统计图 后台返回的数据列表

    watch(
      () => props.active,
      (active) => {
        drawBar(active)
      }
    )

    const eacharHeight = () => {
      //计算eachar图形高度
      if (form.value && form.value.clientHeight) {
        height.value = 429 - 24 - form.value.clientHeight - 40 - 20 + 'px'
      }
    }

    const resetHandleDraw = (e) => {
      if (e.type == 'resize') {
        eacharHeight()
        drawBar(props.active)
      }
    }

    const mountedMsgEvent = () => {
      window.addEventListener('resize', resetHandleDraw, true)
    }
    onBeforeUnmount(() => {
      window.removeEventListener('resize', resetHandleDraw, true)
    })

    onMounted(() => {
      // dataList.day.startValue = moment(new Date(redDate(moment(new Date()).format('YYYY-MM-DD'), 6)))
      // dataList.day.endValue = moment(new Date(moment(new Date()).format('YYYY-MM-DD')))
      setTimeout(() => {
        eacharHeight()
        userInfo.value = LocalGetUserInfo()
        getData('tab2')
        getData('tab3')
        getData('tab4')
        getData('tab5')
      }, 2000)
      mountedMsgEvent()
    })

    const leftPx = () => {
      //根据返回数据的最大数量计算y轴左侧距离
      let arr = JSON.parse(JSON.stringify(param[props.active].y))
      arr.sort((a, b) => {
        return b - a
      })
      let left = arr.length == 0 ? 9 : (arr[0] + '').length < 3 ? 24 : (arr[0] + '').length * 9
      return parseInt(left * 1 + 9)
    }

    const drawBar = (active) => {
      nextTick(() => {
        loading.value = false
        loading3.value = false
        spinning.value = false
        if (myChart.value) {
          myChart.value.dispose() //销毁
        }
        number.value = param[active].num
        if (!myRef.value) {
          return
        }
        myChart.value = echarts.init(myRef.value)
        let option = {
          tooltip: {},
          xAxis: {
            type: 'category',
            data: param[active].x,
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              show: true,
              color: '#8FA2AE',
              align: 'center',
              margin: selectValue.value == 1 ? 30 : selectValue.value == 2 ? 25 : 20,
              interval: 0,
              formatter: function (value) {
                selectValue.value == 1 ? value : selectValue.value == 2 ? moment(value).format('YYYY-MM') : moment(value).format('YYYY')
                return value
              },
              rotate: 60,
              fontSize: 9,
            },
          },
          grid: {
            top: 24,
            bottom: 70,
            left: leftPx(),
            right: 0,
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: true,
            },
          },
          series: [
            {
              name: active == 'tab2' ? '新启动项目数' : active == 'tab3' ? '新增时长' : active == 'tab4' ? '新增队伍成员' : '活跃成员数', // 系列名称
              type: 'bar', // 系列图表类型 'bar'：柱状/条形图
              barWidth: 16, //柱子的粗细
              data: param[active].y, // 系列中的数据内容
              itemStyle: {
                color: '#50AEB6',
                borderRadius: [8],
              },
              tooltip: {
                backgroundColor: '#F6F6F6',
                borderWidth: 0,
                textStyle: {
                  color: '#000',
                  fontSize: '14px',
                },
                formatter: function (param) {
                  let unit = active == 'tab3' ? '小时' : '个'
                  return [
                    param.name + '<br />',
                    '<span style="display:inline-block;margin-right:5px;margin-bottom:2px;border-radius:6px;width:6px;height:6px;background-color:#50AEB6"></span>' +
                      param.seriesName +
                      ':&nbsp;&nbsp;' +
                      param.data +
                      '&nbsp;' +
                      unit,
                  ].join('')
                },
              },
            },
          ],
        }
        myChart.value.setOption(option)
      })
    }
    const getData = (active) => {
      //查询按钮
      if (selectValue.value == 3) {
        //如果按年份查
        if (dataList.year.startValue > dataList.year.endValue) {
          //判断开始日期是否早于结束日期
          message.warning('开始日期不能比结束日期晚')
          return
        } else if (dataList.year.endValue.format('YYYY') > new Date().getFullYear()) {
          //不能查询当年之后的年份数据
          message.warning('查询年份不能超过今年')
          return
        } else if (dataList.year.endValue.format('YYYY') - dataList.year.startValue.format('YYYY') >= 12) {
          //最多同时查12年的数据
          message.warning('年份跨度最多12年')
          return
        }
      }
      spinning.value = true
      loading.value = true
      active === 'tab2' ? getPro() : active === 'tab3' ? getaTime() : active === 'tab4' ? getaTeam() : getMembers()
    }
    const reset = () => {
      //重置按钮
      selectValue.value = '1'
      dataList.day.startValue = moment(new Date(redDate(moment(new Date()).format('YYYY-MM-DD'), 6)))
      dataList.day.endValue = moment(new Date(moment(new Date()).format('YYYY-MM-DD')))
      loading3.value = true
      spinning.value = true
      props.active === 'tab2' ? getPro() : props.active === 'tab3' ? getaTime() : props.active === 'tab4' ? getaTeam() : getMembers()
    }
    const getPro = () => {
      // 查询新启动项目数
      let bean = {
        type: selectValue.value, //天1 月2 年3
        startTime:
          selectValue.value == 1
            ? dataList.day.startValue.format('YYYY-MM-DD')
            : selectValue.value == 2
            ? dataList.month.startValue.format('YYYY-MM')
            : dataList.year.startValue.format('YYYY'),
        endTime:
          selectValue.value == 1
            ? dataList.day.endValue.format('YYYY-MM-DD')
            : selectValue.value == 2
            ? dataList.month.endValue.format('YYYY-MM')
            : dataList.year.endValue.format('YYYY'),
        areaId: userInfo.value.areaLevel == '0' ? '100000000000000000' : userInfo.value.areaid,
        teamId: userInfo.value.team.groupid,
      }
      rpcPost('teamPictureFortis', { bean }).then((res) => {
        param.tab2.x = []
        param.tab2.y = []
        param.tab2.num = 0
        if (res && res.data) {
          list.tab2 = res.data
          res.data.forEach((element) => {
            let time =
              selectValue.value == 1
                ? moment(new Date(element.date)).format('YYYY-MM-DD')
                : selectValue.value == 2
                ? moment(new Date(element.date)).format('YYYY-MM')
                : moment(new Date(element.date)).format('YYYY')
            param.tab2.x.push(time)
            param.tab2.num += parseInt(element.num)
            param.tab2.y.push(element.num)
          })
        }
        if (props.active == 'tab2') {
          drawBar('tab2')
        }
      })
    }
    const getaTime = () => {
      // 查询新增时长数据
      let bean = {
        ttt: selectValue.value, //天1 月2 年3
        start:
          selectValue.value == 1
            ? dataList.day.startValue.format('YYYY-MM-DD HH:mm:ss')
            : selectValue.value == 2
            ? dataList.month.startValue.format('YYYY-MM-DD HH:mm:ss')
            : dataList.year.startValue.format('YYYY-MM-DD HH:mm:ss'),
        end:
          selectValue.value == 1
            ? dataList.day.endValue.format('YYYY-MM-DD HH:mm:ss')
            : selectValue.value == 2
            ? dataList.month.endValue.format('YYYY-MM-DD HH:mm:ss')
            : dataList.year.endValue.format('YYYY-MM-DD HH:mm:ss'),
        areaid: userInfo.value.areaLevel == '0' ? '100000000000000000' : userInfo.value.areaid,
        id: userInfo.value.team.groupid,
      }
      rpcPost('workBenchTimeFortisService', { bean }).then((res) => {
        if (res && res.data) {
          list.tab3 = res.data
          param.tab3.x = []
          param.tab3.y = []
          param.tab3.num = 0
          res.data.forEach((element) => {
            let time =
              selectValue.value == 1
                ? moment(new Date(element.time)).format('YYYY-MM-DD')
                : selectValue.value == 2
                ? moment(new Date(element.time)).format('YYYY-MM')
                : moment(new Date(element.time)).format('YYYY')
            param.tab3.x.push(time)
            param.tab3.num += parseInt(element.number)
            param.tab3.y.push(element.number)
          })
        }
        if (props.active == 'tab3') {
          drawBar('tab3')
        }
      })
    }
    const getaTeam = () => {
      // 查询新增队伍成员数据
      let bean = {
        type: selectValue.value, //天1 月2 年3
        startTime:
          selectValue.value == 1
            ? dataList.day.startValue.format('YYYY-MM-DD')
            : selectValue.value == 2
            ? dataList.month.startValue.format('YYYY-MM')
            : dataList.year.startValue.format('YYYY'),
        endTime:
          selectValue.value == 1
            ? dataList.day.endValue.format('YYYY-MM-DD')
            : selectValue.value == 2
            ? dataList.month.endValue.format('YYYY-MM')
            : dataList.year.endValue.format('YYYY'),
        id: userInfo.value.team.groupid,
        areaId: userInfo.value.areaLevel == '0' ? '100000000000000000' : userInfo.value.areaid,
      }
      rpcPost('getTeamNewVolNumFortis', { bean }).then((res) => {
        if (res && res.data) {
          list.tab4 = res.data
          param.tab4.x = []
          param.tab4.y = []
          param.tab4.num = 0
          res.data.forEach((element) => {
            let time =
              selectValue.value == 1
                ? moment(new Date(element.date)).format('YYYY-MM-DD')
                : selectValue.value == 2
                ? moment(new Date(element.date)).format('YYYY-MM')
                : moment(new Date(element.date)).format('YYYY')
            param.tab4.x.push(time)
            param.tab4.num += parseInt(element.num)
            param.tab4.y.push(element.num)
          })
        }
      })
      if (props.active == 'tab4') {
        drawBar('tab4')
      }
    }
    const getMembers = () => {
      // 查询活跃成员数数据
      let bean = {
        ttt: selectValue.value, //天1 月2 年3
        start:
          selectValue.value == 1
            ? dataList.day.startValue.format('YYYY-MM-DD HH:mm:ss')
            : selectValue.value == 2
            ? dataList.month.startValue.format('YYYY-MM-DD HH:mm:ss')
            : dataList.year.startValue.format('YYYY-MM-DD HH:mm:ss'),
        end:
          selectValue.value == 1
            ? dataList.day.endValue.format('YYYY-MM-DD HH:mm:ss')
            : selectValue.value == 2
            ? dataList.month.endValue.format('YYYY-MM-DD HH:mm:ss')
            : dataList.year.endValue.format('YYYY-MM-DD HH:mm:ss'),
        areaid: userInfo.value.areaLevel == '0' ? '100000000000000000' : userInfo.value.areaid,
        id: userInfo.value.team.groupid,
      }
      rpcPost('workBenchPersonFortisService', { bean }).then((res) => {
        if (res && res.data) {
          list.tab5 = res.data
          param.tab5.x = []
          param.tab5.y = []
          param.tab5.num = 0
          res.data.forEach((element) => {
            let time =
              selectValue.value == 1
                ? moment(new Date(element.time)).format('YYYY-MM-DD')
                : selectValue.value == 2
                ? moment(new Date(element.time)).format('YYYY-MM')
                : moment(new Date(element.time)).format('YYYY')
            param.tab5.x.push(time)
            param.tab5.num += parseInt(element.number)
            param.tab5.y.push(element.number)
          })
        }
        if (props.active == 'tab5') {
          drawBar('tab5')
        }
      })
    }
    const disabledStartDate = (startValue) => {
      //按天选 开始时间选择范围 当天之前的可以选
      if (!startValue || !dataList.day.endValue) {
        return startValue.valueOf() > moment(new Date(moment(new Date()).format('YYYY-MM-DD'))).endOf('day')
      }
      return (
        startValue.valueOf() > dataList.day.endValue || startValue.valueOf() > moment(new Date(moment(new Date()).format('YYYY-MM-DD'))).endOf('day')
      )
    }
    const disabledEndDate = (endValue) => {
      //按天选 结束时间选择范围 今天和之前并且与开始日期最大间隔30天
      if (!endValue || !dataList.day.startValue) {
        return endValue.valueOf() > moment(new Date(moment(new Date()).format('YYYY-MM-DD'))).endOf('day')
      }
      return (
        dataList.day.startValue > endValue.valueOf() ||
        endValue.valueOf() > moment(new Date(moment(new Date()).format('YYYY-MM-DD'))).endOf('day') ||
        endValue.valueOf() > moment(new Date(addDays(moment(new Date(dataList.day.startValue)).format('YYYY-MM-DD'), 29))).endOf('day')
      )
    }

    const disabledStartMonth = (startValue) => {
      //按月选 开始时间选择范围 当月及之前的可以选
      if (!startValue || !dataList.month.endValue) {
        return startValue.valueOf() > moment().endOf('day')
      }
      return startValue.valueOf() > dataList.month.endValue || startValue.valueOf() > moment().endOf('day')
    }
    const disabledEndMonth = (endValue) => {
      //按月选 结束时间选择范围
      if (!endValue || !dataList.month.startValue) {
        return endValue.valueOf() > moment().endOf('day')
      }
      return (
        dataList.month.startValue > endValue.valueOf() ||
        endValue.valueOf() > moment().endOf('day') ||
        endValue.valueOf() > moment(new Date(redDateYear(moment(new Date(dataList.month.startValue)).format('YYYY-MM-DD'), 23))).endOf('day')
      )
    }
    const handleStartOpenChange = (open) => {
      if (!open) {
        selectValue.value == '1'
          ? (dataList.day.endOpen = true)
          : selectValue.value == '2'
          ? (dataList.month.endOpen = true)
          : (dataList.year.endOpen = true)
      }
    }
    const handleEndOpenChange = (open) => {
      selectValue.value == '1'
        ? (dataList.day.endOpen = open)
        : selectValue.value == '2'
        ? (dataList.month.endOpen = open)
        : (dataList.year.endOpen = open)
    }

    const updateTime1 = (val) => {
      //年份日期选择  开始日期年份值改变
      dataList.year.startValue = val
    }

    const updateTime2 = (val) => {
      //年份日期选择 结束日期年份值改变
      dataList.year.endValue = val
    }

    const updateTime3 = (val) => {
      //按天查 开始日期变化时,清空结束日期让用户重新选择结束日期
      dataList.day.startValue = val
      dataList.day.endValue = null
    }

    const exportUplod = () => {
      //下载图表按钮
      loadEcharts('teamWorkEachar')
    }

    const exportUplo2 = () => {
      //导出excel表格
      let arr = []
      if (props.active == 'tab2' || props.active == 'tab4') {
        list[props.active].forEach((element) => {
          let obj = {
            time: element.date,
            number: element.num,
          }
          arr.push(obj)
        })
      } else {
        arr = list[props.active]
      }
      let bean = {
        beans: JSON.parse(JSON.stringify(arr)), //当前显示的图形数据
        type: props.active == 'tab2' ? 1 : props.active == 'tab3' ? 2 : props.active == 'tab4' ? 3 : 4, //统计类型
        ttt: selectValue.value == 1 ? '天' : selectValue.value == 2 ? '月' : '年', //1天/2月/3年
        teamname: userInfo.value.team.albe0002, //队伍名称
        selecttypevalue:
          props.active == 'tab2' ? '新启动项目数' : props.active == 'tab3' ? '新增时长' : props.active == 'tab4' ? '新增队伍成员' : '活跃成员数', //y轴系列名
      }
      bean.beans.push({ time: '合计', number: param[props.active].num })
      loading2.value = true
      rpcPost('drawExcelService', bean).then((res) => {
        if (res && res.code === 0 && res.data) {
          download.value.href = res.data
          download.value.click()
        } else {
          message.warning('导出失败')
        }
        loading2.value = false
      })
    }
    return {
      loading,
      loading2,
      loading3,
      spinning,
      height,
      form,
      selectValue,
      dataList,
      props,
      myRef,
      number,
      download,
      userInfo,
      getData,
      reset,
      handleStartOpenChange,
      handleEndOpenChange,
      disabledStartDate,
      disabledEndDate,
      disabledStartMonth,
      disabledEndMonth,
      updateTime1,
      updateTime2,
      updateTime3,
      exportUplod,
      exportUplo2,
    }
  },
})
</script>
<style scoped>
.row1 {
  position: relative;
}
.row1_content {
  padding-left: 10px;
}
.date_select {
  width: 100px;
  margin: 8px 8px 8px 0;
}
.date_div {
  display: inline-block;
  position: relative;
  top: -1px;
  margin: 8px 8px 8px 0;
}
.date {
  position: relative;
  top: 1px;
}
.img {
  position: relative;
  top: -2px;
}
.inlin_b {
  display: inline-block;
}
.mr_8 {
  margin-right: 8px;
}
.download_div {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 8px;
}
.ml_8 {
  margin-left: 8px;
}
.row2 {
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  margin-bottom: 20px;
}
.position_r {
  position: relative;
}
.row2_left {
  font-size: 16px;
  color: #000;
  font-weight: bold;
}
.row2_right {
  position: absolute;
  right: 0;
}
</style>

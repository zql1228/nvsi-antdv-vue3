<template>
  <div>
    <a-row :gutter="[0, 19]">
      <a-col :span="24" style="postition: relative">
        <span style="padding-left: 10px; font-size: 16px; font-weight: bold; color: #000">统计指标：</span>
        <a-select v-model:value="queryParam.type" :options="options" @select="search" style="width: 200px"></a-select>
        <div style="display: inline-block; position: absolute; right: 0; top: 0px">
          <a-button @click="exportUplod" :disabled="loading == true"> 下载图表 </a-button>
          <a-button style="margin-left: 8px" @click="downloadExcle" :disabled="loading == true"> 导出excel表格 </a-button>
          <a ref="download" download v-show="false" href="#"></a>
        </div>
      </a-col>
    </a-row>
    <a-row style="height: 40px; line-height: 40px; padding-left: 10px; margin-bottom: 20px">
      <a-col :span="24" style="postition: relative">
        <div style="font-size: 16px; color: #000">
          合计：队伍数<span style="color: #d92f2f">{{ number }}</span> 个
          <span v-show="queryParam.type == 2">(此项为多选，故数量与其它统计指标并不一致)</span>
        </div>
      </a-col>
    </a-row>
    <a-spin :spinning="spinning">
      <div id="TeamStatisticsEachar" ref="myRef" :style="{ height: height }"></div>
    </a-spin>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, nextTick, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { loadEcharts } from '@/utils/publicMethods/common.js'
import { rpcPost } from '@/server/conf/index.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { teamStatisticsChart } from './table'
import {
  nvsiAlbp0039, //服务类别
  nvsiAlbe0003, //队伍类型
} from '@/utils/codevalue'
import moment from 'moment'
export default defineComponent({
  props: {
    queryParam: {
      type: Object,
      default: {},
    },
    advanced: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, text) {
    const spinning = ref(false)
    const optionsList = reactive({
      albe0017List: nvsiAlbp0039,
      albe0003List: nvsiAlbe0003,
    })
    const number = ref(0) //总数
    const download = ref() //下载图表的a标签
    const userInfo = ref(LocalGetUserInfo())
    const list = ref() //后端返回的当前统计图的列表数据
    const x = ref([]) //统计图横坐标数据
    const y = ref([]) //统计图纵坐标数据
    const query = ref() //当前统计图使用查询条件
    const loading = ref(false) //数据查询中为true 查询结束为fasle
    const queryParam = reactive({
      type: '1',
    })
    const options = ref([
      { label: '队伍数量统计', value: '1' },
      { label: '服务类别', value: '2' },
      { label: '队伍类型', value: '3' },
      { label: '队伍时长规模', value: '4' },
      { label: '人数规模', value: '5' },
    ])
    const myRef = ref()
    const myChart = ref()
    const height = ref()

    const leftPx = () => {
      //根据返回数据的最大数量计算y轴左侧距离
      let arr = JSON.parse(JSON.stringify(y.value))
      arr.sort((a, b) => {
        return b - a
      })
      let left = arr[0].toString().length < 3 ? 28 : arr[0].toString().length * 14
      return parseInt(left * 1 + 14)
    }

    const drawBar = () => {
      nextTick(() => {
        loading.value = false
        spinning.value = false
        if (myChart.value != null && myChart.value != '' && myChart.value != undefined) {
          myChart.value.dispose() //销毁
        }
        if (!myRef.value) {
          return
        }
        myChart.value = echarts.init(myRef.value)
        let option = {
          tooltip: {},
          xAxis: {
            type: 'category',
            data: x.value,
            triggerEvent: true,
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              show: true,
              color: '#8FA2AE',
              align: 'center',
              margin: queryParam.type == 1 ? 50 : queryParam.type == 2 ? 35 : 20,
              interval: 0,
              formatter: function (value) {
                if (queryParam.type == 1 && value.length > 6 && value.length < 13) {
                  value = value.substring(0, 6) + '\n' + value.substring(6)
                } else if (queryParam.type == 1 && value.length > 12) {
                  value = value.substring(0, 6) + '\n' + value.substring(6, 12) + '..'
                }
                return value
              },
              rotate: queryParam.type == 1 || queryParam.type == 2 ? 45 : 0,
              fontSize: 14,
            },
          },
          grid: {
            top: 24,
            bottom: queryParam.type == 1 ? 85 : 70,
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
              name: '队伍数量', // 系列名称
              type: 'bar', // 系列图表类型 'bar'：柱状/条形图
              barWidth: 16, //柱子的粗细
              data: y.value, // 系列中的数据内容
              itemStyle: {
                color: '#3D9EFF',
                barBorderRadius: 8,
              },
              tooltip: {
                backgroundColor: '#F6F6F6',
                borderWidth: 0,
                textStyle: {
                  color: '#000',
                  fontSize: '14px',
                },
                formatter: function (param) {
                  return [
                    param.name + '<br />',
                    '<span style="display:inline-block;margin-right:5px;margin-bottom:2px;border-radius:6px;width:6px;height:6px;background-color:#1890FF"></span>' +
                      param.seriesName +
                      ':&nbsp;&nbsp;' +
                      param.data +
                      '&nbsp;个',
                  ].join('')
                },
              },
            },
          ],
        }
        myChart.value.setOption(option)
      })
    }
    const getData = () => {
      // 查询统计图数据
      let bean = {
        // props.queryParam.areaid.length > 0 && props.queryParam.areaid[props.queryParam.areaid.length - 1] != '100000000000000000'
        //     ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
        //     : props.queryParam.areaid.length > 0 && props.queryParam.areaid[props.queryParam.areaid.length - 1] == '100000000000000000'
        //     ? '000000000000000000'
        //     : userInfo.value.areaLevel == '0'
        //     ? '000000000000000000'
        //     : userInfo.value.areaid,//有全国
        areaid:
          props.queryParam.areaid.length > 0
            ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
            : userInfo.value.areaLevel == '0'
            ? '110000000000000000'
            : userInfo.value.areaid, //无全国
        type: queryParam.type ? queryParam.type : null,
        albe0002: props.queryParam.albx0002 ? props.queryParam.albx0002 : null,
        albe0041: props.queryParam.albe0041 ? props.queryParam.albe0041 : null,
        albe0017: props.queryParam.albe0017 && queryParam.type != 2 ? props.queryParam.albe0017 : null,
        albe0003: props.queryParam.albe0003 && queryParam.type != 3 ? props.queryParam.albe0003 : null,
        albe0026: props.queryParam.albe0026 ? props.queryParam.albe0026 : null,
        albe0069: props.queryParam.albe0069 && queryParam.type != 4 ? props.queryParam.albe0069 : null,
        albe0056Start: props.queryParam.albe0056Start && queryParam.type != 5 ? props.queryParam.albe0056Start : null,
        albe0056End: props.queryParam.albe0056End && queryParam.type != 5 ? props.queryParam.albe0056End : null,
        albe0069Start: props.queryParam.albe0069Start && queryParam.type != 4 ? props.queryParam.albe0069Start : null,
        albe0069End: props.queryParam.albe0069End && queryParam.type != 4 ? props.queryParam.albe0069End : null,
        albe0046Start: props.queryParam.albe0046Start ? moment(new Date(props.queryParam.albe0046Start)).format('YYYY-MM-DD') : null,
        albe0046End: props.queryParam.albe0046End ? moment(new Date(props.queryParam.albe0046End)).format('YYYY-MM-DD') : null,
      }
      query.value = bean //将查询条件保存 导出表格要用
      loading.value = true
      spinning.value = true
      console.log(bean)
      rpcPost('getTeamQueryState', { bean }).then((res) => {
        x.value = []
        y.value = []
        number.value = 0
        if (res && res.code === 0 && res.data) {
          list.value = res.data.list
          res.data.list.forEach((element) => {
            x.value.push(element.name)
            number.value += parseInt(element.count)
            y.value.push(element.count)
          })
        }
        drawBar()
      })
    }

    const search = () => {
      //切换统计指标
      text.emit('child', queryParam.type)
      getData()
    }

    const resetHandleDraw = (e) => {
      if (e.type == 'resize') {
        getHeight()
        drawBar()
      }
    }
    onBeforeUnmount(() => {
      window.removeEventListener('resize', resetHandleDraw, true)
    })
    const mountedMsgEvent = () => {
      window.addEventListener('resize', resetHandleDraw, true)
    }

    const showExpand = () => {
      //展开收起筛选条件时 调用  重新计算图形高度
      getHeight()
      drawBar()
    }

    const getHeight = () => {
      //计算图形高度
      const height1 = document.documentElement.clientHeight
      let a = height1 - 112 - 24 - 160 - 12 - 24 - 32 - 40
      props.advanced ? (height.value = a - 144 + 'px') : (height.value = a + 'px')
    }

    onMounted(() => {
      getHeight()
      mountedMsgEvent()
      getData()
    })

    const downloadExcle = (active) => {
      //导出表格 按钮 JSON.parse
      let bean = {
        areaid: query.value.areaid == '000000000000000000' ? '100000000000000000' : query.value.areaid, //服务区域
        total: number.value, //查询列表查出来的总条数
        list: list.value, //查询出来的项目列表
        type: 2, //1,2,3（志愿者、队伍、项目）
        servicetype: query.value.albe0017 ? query.value.albe0017 : null, //服务类别
        grouptype: query.value.albe0003 ? query.value.albe0003 : null, //队伍类型
        startgrouopeople: query.value.albe0056Start ? query.value.albe0056Start : null, //队伍人数 最小
        endgrouopeople: query.value.albe0056End ? query.value.albe0056End : null, //队伍人数 最大
        startservicetime: query.value.albe0069Start ? query.value.albe0069Start : null, //最小时长
        endservicetime: query.value.albe0069End ? query.value.albe0069End : null, //最大时长
        startregistertime: query.value.albe0046Start ? query.value.albe0046Start : null, //注册时间 最小
        endregistertime: query.value.albe0046End ? query.value.albe0046End : null, //注册时间 最大
      }
      if (bean.servicetype) {
        optionsList.albe0017List.forEach((element) => {
          element.value == bean.servicetype ? (bean.servicetype = element.label) : ''
        })
      }
      if (bean.grouptype) {
        optionsList.albe0003List.forEach((element) => {
          element.value == bean.grouptype ? (bean.grouptype = element.label) : ''
        })
      }
      rpcPost('VolStaticExcelExportFortis', { bean }).then((res) => {
        if (res && res.code === 0 && res.data) {
          download.value.href = res.data
          download.value.click()
        }
      })
    }

    const exportUplod = () => {
      //下载图表按钮
      loadEcharts('TeamStatisticsEachar')
    }
    return {
      spinning,
      loading,
      myRef,
      height,
      number,
      queryParam,
      list,
      download,
      options,
      search,
      showExpand,
      downloadExcle,
      exportUplod,
      getData,
    }
  },
})
</script>

<style scoped lang="less">
.teamChart div {
  width: 100%;
  height: 100%;
}
</style>

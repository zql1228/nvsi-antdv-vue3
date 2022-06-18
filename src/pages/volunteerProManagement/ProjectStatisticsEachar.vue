<template>
  <!-- 管理部门 项目管理 项目统计图 -->
  <div>
    <a-row :gutter="[0, 19]">
      <a-col :span="24" style="postition: relative">
        <span style="padding-left: 10px; font-size: 16px; font-weight: bold; color: #000">统计指标：</span>
        <a-select v-model:value="queryParam.selectValue" :options="options" @select="search"></a-select>
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
          合计：项目数<span style="color: #d92f2f">{{ number }}</span> 个
          <span v-show="queryParam.selectValue == 5 || queryParam.selectValue == 3">(此项为多选，故数量与其它统计指标并不一致)</span>
        </div>
      </a-col>
    </a-row>
    <a-spin :spinning="spinning">
      <div id="projectEachar" ref="myRef" :style="{ height: height }"></div>
    </a-spin>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import { rpcPost } from '@/server/conf/index.js'
import { loadEcharts, getLevel, sortCode } from '@/utils/publicMethods/common.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import moment from 'moment'
import { nvsiAlbx0009, nvsiAlbx0014, nvsiAlbx0024 } from '@/utils/codevalue'
import apis from '@/server/request'
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
    const number = ref(0) //总数
    const userInfo = ref(LocalGetUserInfo())
    const list = ref() //后端返回的当前统计图的列表数据
    const x = ref([]) //统计图横坐标数据
    const y = ref([]) //统计图纵坐标数据
    const myRef = ref() //eachar父元素ref
    const myChart = ref()
    const areaid = ref()
    const download = ref() //下载图表的a标签
    const loading = ref(false) //数据查询中为true 查询结束为fasle
    const spinning = ref(false)
    const queryParam = reactive({
      selectValue: '1',
    })

    const timer = ref()
    const options = ref([
      { label: '项目数量统计', value: '1' },
      { label: '项目时长统计', value: '2' },
      { label: '服务类别统计', value: '3' },
      { label: '项目人数统计', value: '4' },
      { label: '服务对象统计', value: '5' },
      { label: '招募范围统计', value: '6' },
      { label: '项目状态统计', value: '7' },
    ])
    const optionsList = reactive({
      albx0072List: [
        { label: '待启动', value: '3' },
        { label: '运行中', value: '4' },
        { label: '已结项', value: '5' },
        { label: '补录', value: '6' },
        { label: '无效', value: '7' },
      ], //项目状态
      albx0024List: nvsiAlbx0024, //招募范围
      albx0009List: [], //服务类别
      albx0014List: [], //服务对象
    })
    const query = ref() //查询出当前统计图数据所传给后端的参数  导出表格时需要用到
    const height = ref() //eachar图形高度
    const getOptions = async () => {
      //服务类别
      optionsList.albx0009List = await apis.getCodeValue('lbe05', 'getAllCodeFortis', { codeTypeName: 'lbe05', areaid: userInfo.value.areaid })
      optionsList.albx0009List = optionsList.albx0009List.data
      optionsList.albx0009List = sortCode(optionsList.albx0009List)
      optionsList.albx0009List = [{ codevalue: '不限', codeid: '' }, ...optionsList.albx0009List]
      //服务对象
      optionsList.albx0014List = await apis.getCodeValue('nvsi_albx0014', 'getAllCodeFortis', { codeTypeName: 'nvsi_albx0014' })
      optionsList.albx0014List = optionsList.albx0014List.data
      optionsList.albx0014List = [{ codevalue: '不限', codeid: '' }, ...optionsList.albx0014List]
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
      getOptions()
      getHeight()
      getData()
      mountedMsgEvent()
    })

    const search = () => {
      //切换统计指标
      text.emit('child', queryParam.selectValue)
      getData()
    }

    const leftPx = () => {
      //根据返回数据的最大数量计算y轴左侧距离
      let arr = JSON.parse(JSON.stringify(y.value))
      arr.sort((a, b) => {
        return b - a
      })
      let left = arr.length == 0 ? 14 : arr[0].toString().length < 3 ? 28 : arr[0].toString().length * 14
      return parseInt(left * 1 + 14)
    }
    const bmPx = () => {
      //根据返回x轴数据的最长文本计算x轴文本显示的内容区域大小
      let bottom = 0
      if (queryParam.selectValue == 1 || queryParam.selectValue == 3 || queryParam.selectValue == 5) {
        let arr = JSON.parse(JSON.stringify(x.value))
        arr.sort((a, b) => {
          return b.length - a.length
        })
        let textPx = arr[0].length * 14 //横坐标最长文本所需px
        bottom = 70 + Math.sin((45 * Math.PI) / 180) * textPx //下外边距=Math.sin(倾斜角度 * Math.PI/180)*斜长
      } else {
        bottom = 70
      }
      return Math.ceil(bottom) //向上取整
    }

    const drawBar = () => {
      nextTick(() => {
        spinning.value = false
        loading.value = false
        if (myChart.value) {
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
              margin: queryParam.selectValue == 1 ? 50 : queryParam.selectValue == 3 || queryParam.selectValue == 5 ? 35 : 20,
              interval: 0,
              verticalAlign: 'middle',
              formatter: function (value) {
                if (queryParam.selectValue == 1 && value.length > 6 && value.length < 13) {
                  value = value.substring(0, 6) + '\n' + value.substring(6)
                } else if (queryParam.selectValue == 1 && value.length > 12) {
                  value = value.substring(0, 6) + '\n' + value.substring(6, 13) + '..'
                }
                return value
              },
              rotate: queryParam.selectValue == 1 || queryParam.selectValue == 3 || queryParam.selectValue == 5 ? 45 : 0,
              fontSize: 14,
            },
          },
          grid: {
            top: 24,
            bottom: queryParam.selectValue == 1 ? 85 : 70,
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
              name: '项目数量', // 系列名称
              type: 'bar', // 系列图表类型 'bar'：柱状/条形图
              barWidth: 16, //柱子的粗细
              data: y.value, // 系列中的数据内容
              itemStyle: {
                color: '#50AEB6',
                borderRadius: 8,
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
                    '<span style="display:inline-block;margin-right:5px;margin-bottom:2px;border-radius:6px;width:6px;height:6px;background-color:#50AEB6"></span>' +
                      param.seriesName +
                      '：' +
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
      let areaid =
        props.queryParam.areaid.length > 0
          ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
          : userInfo.value.areaLevel == 0
          ? '110000000000000000'
          : userInfo.value.areaid
      let level = getLevel(areaid)
      let areaid2 = level == '全国' || level == '省' ? areaid : level == '市' ? areaid.slice(0, 4) : areaid.slice(0, 6)
      let bean = {
        areaId:
          props.queryParam.areaid.length > 0
            ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
            : userInfo.value.areaLevel == 0
            ? '110000000000000000'
            : userInfo.value.areaid,
        axaa0002: level == '市' ? areaid2 : null,
        axaa0003: level == '区' ? areaid2 : null,
        selectType: queryParam.selectValue,
        albx0072: props.queryParam.albx0072 && queryParam.selectValue != 7 ? props.queryParam.albx0072 : null,
        albx0024: props.queryParam.albx0024 && queryParam.selectValue != 6 ? props.queryParam.albx0024 : null,
        albx0009: props.queryParam.albx0009 && queryParam.selectValue != 3 ? props.queryParam.albx0009 : null,
        albx0014: props.queryParam.albx0014 && queryParam.selectValue != 5 ? props.queryParam.albx0014 : null,
        albx0061: props.queryParam.albx0061 && queryParam.selectValue != 2 ? props.queryParam.albx0061 : null,
        albx0073: props.queryParam.albx0073 ? props.queryParam.albx0073 : null,
        minPerson: props.queryParam.minPerson && queryParam.selectValue != 4 ? props.queryParam.minPerson : null,
        maxPerson: props.queryParam.maxPerson && queryParam.selectValue != 4 ? props.queryParam.maxPerson : null,
        minTime: props.queryParam.minTime && queryParam.selectValue != 2 ? props.queryParam.minTime : null,
        maxTime: props.queryParam.maxTime && queryParam.selectValue != 2 ? props.queryParam.maxTime : null,
        minDay: props.queryParam.minDay ? moment(new Date(props.queryParam.minDay)).format('YYYY-MM-DD') : null,
        maxDay: props.queryParam.maxDay ? moment(new Date(props.queryParam.maxDay)).format('YYYY-MM-DD') : null,
      }
      query.value = JSON.parse(JSON.stringify(bean)) //将查询条件保存 导出表格要用
      loading.value = true
      spinning.value = true
      console.log(bean, 'bean')
      rpcPost('selManagementDepartmentChartFortis', { bean }).then((res) => {
        x.value = []
        y.value = []
        number.value = 0
        if (res && res.code === 0 && res.data) {
          const par = { bean: { uuid: res.data } }
          console.log(par, 'par')

          timer.value = setInterval(() => {
            rpcPost('getManagementDepartmentChartFortis', par).then((resp) => {
              if (resp.code == 0 && resp.data !== null) {
                queryParam.selectValue == 1 ? resp.data.list.unshift(resp.data.list1) : ''
                list.value = res.data.list
                resp.data.list.forEach((element) => {
                  x.value.push(element.name)
                  number.value += element.count
                  y.value.push(element.count)
                })
                console.log(y.value)
                drawBar()
                clearInterval(timer.value)
              }
            })
          }, 5000)
        }
      })
    }

    onBeforeUnmount(() => {
      clearInterval(timer)
    })

    const downloadExcle = (active) => {
      //delete query.value.areaId
      //导出表格 按钮 JSON.parse
      let bean = {
        areaid: query.value.areaId, //服务区域
        total: number.value, //查询列表查出来的总条数
        list: list.value, //查询出来的项目列表
        type: 3, //1,2,3（志愿者、队伍、项目）
        projectstatus: query.value.albx0072 ? query.value.albx0072 : null, //项目状态
        recruitmentscope: query.value.albx0024 ? query.value.albx0024 : null, //招募范围
        servicetype: query.value.albx0009 ? query.value.albx0009 : null, //服务类别
        servicepeople: query.value.albx0014 ? query.value.albx0014 : null, //服务对象
        startprojectpeople: query.value.minPerson ? query.value.minPerson : null, //项目人数最小值
        endprojectpeople: query.value.maxPerson ? query.value.maxPerson : null, //项目人数最大值
        startservicetime: query.value.minTime ? query.value.minTime : null, //服务时长开始时间
        endservicetime: query.value.maxTime ? query.value.maxTime : null, //服务时长结束时间
        projectbegintime: query.value.minDay ? query.value.minDay : null, //项目开始时间
        projectendtime: query.value.maxDay ? query.value.maxDay : null, //项目结束时间
      }
      if (bean.projectstatus) {
        optionsList.albx0072List.forEach((element) => {
          element.value == bean.projectstatus ? (bean.projectstatus = element.label) : ''
        })
      }
      if (bean.recruitmentscope) {
        optionsList.albx0024List.forEach((element) => {
          element.value == bean.recruitmentscope ? (bean.recruitmentscope = element.label) : ''
        })
      }
      if (bean.servicetype) {
        optionsList.albx0009List.forEach((element) => {
          element.value == bean.servicetype ? (bean.servicetype = element.label) : ''
        })
      }
      if (bean.servicepeople) {
        optionsList.albx0014List.forEach((element) => {
          element.value == bean.servicepeople ? (bean.servicepeople = element.label) : ''
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
      loadEcharts('projectEachar')
    }

    return {
      spinning,
      loading,
      queryParam,
      height,
      number,
      download,
      userInfo,
      options,
      myRef,
      x,
      y,
      getData,
      showExpand,
      search,
      downloadExcle,
      exportUplod,
    }
  },
})
</script>
<style scoped></style>

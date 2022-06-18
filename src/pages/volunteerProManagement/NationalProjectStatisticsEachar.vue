<template>
  <!-- 管理部门 项目管理 全国项目统计图 -->
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
          <span v-show="queryParam.selectValue == 7 || queryParam.selectValue == 3">(此项为多选，故数量与其它统计指标并不一致)</span>
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
    const options = ref([
      { label: '项目数量统计', value: '1' },
      { label: '项目时长统计', value: '2' },
      { label: '服务类别统计', value: '7' },
      { label: '项目人数统计', value: '4' },
      { label: '服务对象统计', value: '3' },
      { label: '招募范围统计', value: '5' },
      { label: '项目状态统计', value: '6' },
    ])
    const optionsList = reactive({
      albx0072List: [
        { label: '不限', value: '' },
        { label: '待发布项目', value: '1' },
        { label: '待审核项目', value: '2' },
        { label: '待启动项目', value: '3' },
        { label: '运行中项目', value: '4' },
        { label: '已结项项目', value: '5' },
        { label: '补录项目', value: '6' },
        { label: '停用项目', value: '7' },
        { label: '无效项目', value: '9' },
      ], //项目状态
      albx0024List: [
        { label: '不限', value: '' },
        { label: '公开招募', value: '1' },
        { label: '指定志愿团体招募', value: '2' },
        { label: '指定免审密码招募', value: '3' },
        { label: '不公开招募', value: '4' },
        { label: '时间补录招募', value: '5' },
        { label: '仅招募实名志愿者', value: '6' },
      ], //招募范围
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
    onBeforeUnmount(() => {
      window.removeEventListener('resize', () => {})
    })
    const mountedMsgEvent = () => {
      window.addEventListener('resize', function () {
        if (myChart.value != null && myChart.value != '' && myChart.value != undefined) {
          myChart.value.dispose() //销毁
        }
        const height1 = document.documentElement.clientHeight
        let a = height1 - 112 - 24 - 160 - 12 - 24 - 32 - 40
        props.advanced ? (height.value = a - 144 + 'px') : (height.value = a + 'px')
        myChart.value.resize()
        drawBar()
      })
    }
    const showExpand = () => {
      //展开收起筛选条件时 调用  重新计算图形高度
      if (myChart.value != null && myChart.value != '' && myChart.value != undefined) {
        myChart.value.dispose() //销毁
      }
      const height1 = document.documentElement.clientHeight
      let a = height1 - 112 - 24 - 160 - 12 - 24 - 32 - 40
      props.advanced ? (height.value = a - 144 + 'px') : (height.value = a + 'px')
      myChart.value.resize()
      drawBar()
    }
    onMounted(() => {
      getOptions()
      userInfo.value = LocalGetUserInfo()
      const height1 = document.documentElement.clientHeight
      height.value = height1 - 112 - 24 - 160 - 12 - 24 - 32 - 40 + 'px'
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
      let left = arr.length == 0 ? 14 : arr.length > 0 ? (arr[0].toString().length < 3 ? 28 : arr[0].toString().length * 14) : 14
      return parseInt(left * 1 + 14)
    }

    const drawBar = () => {
      nextTick(() => {
        spinning.value = false
        loading.value = false
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
              margin: queryParam.selectValue == 1 ? 50 : queryParam.selectValue == 7 || queryParam.selectValue == 3 ? 35 : 20,
              interval: 0,
              verticalAlign: 'middle',
              formatter: function (value) {
                if ((queryParam.selectValue == 1 || queryParam.selectValue == 6) && value.length > 6 && value.length < 13) {
                  value = value.substring(0, 6) + '\n' + value.substring(6)
                } else if ((queryParam.selectValue == 1 || queryParam.selectValue == 6) && value.length > 12) {
                  value = value.substring(0, 6) + '\n' + value.substring(6, 13) + '..'
                }
                return value
              },
              rotate: queryParam.selectValue == 1 ? 70 : queryParam.selectValue == 7 || queryParam.selectValue == 3 ? 45 : 0,
              fontSize: 14,
            },
          },
          grid: {
            top: 24,
            bottom: queryParam.selectValue == 1 ? 90 : 70,
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
      let bean = {
        areaId: '000000000000000000',
        type: 2,
        selectType: queryParam.selectValue,
        albx0015: props.queryParam.albx0072 && queryParam.selectValue != 7 ? props.queryParam.albx0072 : null,
        albx0024: props.queryParam.albx0024 && queryParam.selectValue != 6 ? props.queryParam.albx0024 : null,
        albx0009: props.queryParam.albx0009 && queryParam.selectValue != 3 ? props.queryParam.albx0009 : null,
        albx0014: props.queryParam.albx0014 && queryParam.selectValue != 5 ? props.queryParam.albx0014 : null,
        // albx0061: props.queryParam.albx0061 && queryParam.selectValue != 2 ? props.queryParam.albx0061 : null,
        // albx0073: props.queryParam.albx0073 ? props.queryParam.albx0073 : null,
        pronummin: props.queryParam.minPerson && queryParam.selectValue != 4 ? props.queryParam.minPerson : null,
        pronummax: props.queryParam.maxPerson && queryParam.selectValue != 4 ? props.queryParam.maxPerson : null,
        startservicetime: props.queryParam.minTime && queryParam.selectValue != 2 ? props.queryParam.minTime : null,
        endservicetime: props.queryParam.maxTime && queryParam.selectValue != 2 ? props.queryParam.maxTime : null,
        projectbegintime: props.queryParam.minDay ? moment(new Date(props.queryParam.minDay)).format('YYYY-MM-DD') : null,
        projectendtime1: props.queryParam.maxDay ? moment(new Date(props.queryParam.maxDay)).format('YYYY-MM-DD') : null,
      }
      if (queryParam.selectValue == 5) {
        bean.fieldname = 'albx0024'
        bean.tablename = 'nvsi_albx0024'
      }
      if (queryParam.selectValue == 6) {
        bean.fieldname = 'albx0015'
        // bean.fieldname = '未完善,待审核,停用,补录,招募待启动,招募中,招募已结束,手动结项,自动结项,暂停,作废'
        bean.tablename = 'nvsi_albx0015'
      }
      query.value = JSON.parse(JSON.stringify(bean)) //将查询条件保存 导出表格要用
      loading.value = true
      spinning.value = true

      rpcPost('selManagementDepartmentChartNationalFortis', { bean }).then((res) => {
        x.value = []
        y.value = []
        number.value = 0
        if (res && res.code === 0 && res.data) {
          list.value = res.data
          res.data.forEach((element) => {
            x.value.push(element.name)
            number.value += element.count
            y.value.push(element.count)
          })
        }
        drawBar()
      })
    }

    const downloadExcle = (active) => {
      //delete query.value.areaId
      //导出表格 按钮 JSON.parse
      let bean = {
        areaid: '100000000000000000', //服务区域
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

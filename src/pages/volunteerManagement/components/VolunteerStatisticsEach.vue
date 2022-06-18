<template>
  <!-- 管理部门 项目管理 全国项目统计图 -->
  <div>
    <a-row :gutter="[0, 19]">
      <a-col :span="24" style="postition: relative">
        <span style="padding-left: 10px; font-size: 16px; font-weight: bold; color: #000">统计指标：</span>
        <a-select v-model:value="queryParam.selectValue" :options="options" @select="search" style="width: 200px"></a-select>
        <!-- <div style="display:inline-block;position: absolute;right: 0;top: 0px">
          <a-button @click="exportUplod" :disabled="loading == true">
            下载图表
          </a-button>
          <a-button style="margin-left:8px;" @click="downloadExcle" :disabled="loading == true">
            导出excel表格
          </a-button>
          <a ref="download" download v-show="false" href="#"></a>
        </div> -->
      </a-col>
    </a-row>
    <a-row style="height: 40px; line-height: 40px; padding-left: 10px; margin-bottom: 20px">
      <a-col :span="24" style="postition: relative">
        <div style="font-size: 16px; color: #000">
          合计：志愿者数<span style="color: #d92f2f">{{ number }}</span> 人
          <span v-show="queryParam.selectValue == 'servicecategory'">(此项为多选，故数量与其它统计指标并不一致)</span>
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
import { loadEcharts, getLevel } from '@/utils/publicMethods/common.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import moment from 'moment'
import { nvsiAlbx0009, nvsiAlbx0014, nvsiAlbx0024 } from '@/utils/codevalue'
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
    const userInfo = ref()

    const timer = ref() // 定时器轮询
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
      selectValue: 'time',
    })
    const options = ref([
      // { label: '人数分布', value: 'person' },
      { label: '志愿者时长规模', value: 'time' },
      { label: '性别分布', value: 'sex' },
      { label: '政治面貌', value: 'politicalstatus' },
      { label: '学历', value: 'education' },
      { label: '年龄', value: 'age' },
      { label: '个人特长', value: 'personalspecialty' },
      { label: '服务类别', value: 'servicecategory' },
      { label: '从业状况', value: 'workstatus' },
      { label: '证件类型', value: 'credentialtype' },
    ])
    const query = ref() //查询出当前统计图数据所传给后端的参数  导出表格时需要用到
    const height = ref() //eachar图形高度
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
      userInfo.value = LocalGetUserInfo()
      getHeight()
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
              margin:
                queryParam.selectValue == 'person' || queryParam.selectValue == 'politicalstatus' || queryParam.selectValue == 'education'
                  ? 50
                  : queryParam.selectValue == 'servicecategory'
                  ? 40
                  : queryParam.selectValue == 'personalspecialty'
                  ? 35
                  : 20,
              interval: 0,
              verticalAlign: 'middle',
              formatter: function (value) {
                if (
                  (queryParam.selectValue == 'person' || queryParam.selectValue == 'politicalstatus' || queryParam.selectValue == 'education') &&
                  value.length > 6 &&
                  value.length < 13
                ) {
                  value = value.substring(0, 6) + '\n' + value.substring(6)
                } else if (
                  (queryParam.selectValue == 'person' || queryParam.selectValue == 'politicalstatus' || queryParam.selectValue == 'education') &&
                  value.length > 12
                ) {
                  value = value.substring(0, 6) + '\n' + value.substring(6, 13) + '..'
                }
                return value
              },
              rotate:
                queryParam.selectValue == 'person' || queryParam.selectValue == 'politicalstatus' || queryParam.selectValue == 'education'
                  ? 70
                  : queryParam.selectValue == 'personalspecialty' || queryParam.selectValue == 'servicecategory'
                  ? 45
                  : 0,
              fontSize: 14,
            },
          },
          grid: {
            top: 24,
            bottom:
              queryParam.selectValue == 'person' || queryParam.selectValue == 'politicalstatus' || queryParam.selectValue == 'education' ? 90 : 70,
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
                      '&nbsp;人',
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
      // let areaid =
      //   props.queryParam.areaid.length > 0
      //     ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
      //     : userInfo.value.areaLevel == '0'
      //     ? '000000000000000000'
      //     : userInfo.value.areaid//有全国
      timer.value && clearInterval(timer.value)
      let areaid =
        props.queryParam.areaid.length > 0
          ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
          : userInfo.value.areaLevel == '0'
          ? '110101000000000000'
          : userInfo.value.areaid //无全国
      let leave = getLevel(areaid)
      let bean = {}
      // if (leave == '全国' || leave == '省') {
      if (leave == '全国') {
        bean = {
          //老接口传参
          areaid: leave == '全国' ? '000000000000000000' : areaid,
          type: 2, //1列表 2图表
          // pageNow: 1, //当前
          albp0006: queryParam.selectValue != 'sex' && props.queryParam.albp0006 ? props.queryParam.albp0006 : null, //性别
          albp0017: queryParam.selectValue != 'education' && props.queryParam.albp0017 ? props.queryParam.albp0017 : null, //学历
          albp0007: queryParam.selectValue != 'politicalstatus' && props.queryParam.albp0007 ? props.queryParam.albp0007 : null, //政治面貌
          albp0021: queryParam.selectValue != 'servicecategory' && props.queryParam.albp0021 ? props.queryParam.albp0021 : null, //服务类别
          albp0018: queryParam.selectValue != 'workstatus' && props.queryParam.albp0018 ? props.queryParam.albp0018 : null, //从业状况
          albp0004: queryParam.selectValue != 'credentialtype' && props.queryParam.albp0004 ? props.queryParam.albp0004 : null, //证件类型
          hasservicetime: queryParam.selectValue != 'time' && props.queryParam.albp0089 ? props.queryParam.albp0089 : null, //有无时长
          albp0090: props.queryParam.albp0090 ? props.queryParam.albp0090 : null, //停用/启动
          startage: queryParam.selectValue != 'age' && props.queryParam.minage ? props.queryParam.minage : null, //年龄区间 最小
          endage: queryParam.selectValue != 'age' && props.queryParam.maxage ? props.queryParam.maxage : null, //年龄区间 最大
          startservicetime: queryParam.selectValue != 'time' && props.queryParam.mintime ? props.queryParam.mintime : null, //时长区间 最小
          endservicetime: queryParam.selectValue != 'time' && props.queryParam.maxtime ? props.queryParam.maxtime : null, //时长区间 最大
          startregistertime: props.queryParam.registmindate ? moment(new Date(props.queryParam.registmindate)).format('YYYY-MM-DD') : null, //注册时间 最小
          endregistertime: props.queryParam.registmaxdate ? moment(new Date(props.queryParam.registmaxdate)).format('YYYY-MM-DD') : null, //注册时间 最大
        }
        switch (queryParam.selectValue) {
          case 'person': //人数分布
            bean.selectType = 1
            break
          case 'time': //服务时长
            bean.selectType = 2
            break
          case 'sex': //性别
            bean.selectType = 7
            bean.fieldname = 'albp0006'
            bean.tablename = 'nvsi_albp0006'
            break
          case 'politicalstatus': //政治面貌
            bean.selectType = 8
            bean.fieldname = 'albp0007'
            bean.tablename = 'nvsi_albp0007'
            break
          case 'education': //学历
            bean.selectType = 9
            bean.fieldname = 'albp0017'
            bean.tablename = 'nvsi_albp0017'
            break
          case 'age': //年龄
            bean.selectType = 3
            break
          case 'personalspecialty': //特长
            bean.selectType = 5
            break
          case 'servicecategory': //服务类别
            bean.selectType = 6
            break
          case 'workstatus': //从业状况
            bean.selectType = 10
            bean.fieldname = 'albp0018'
            bean.tablename = 'nvsi_albp0018'
            break
          case 'credentialtype': //证件类型
            bean.selectType = 11
            bean.fieldname = 'albp0004'
            bean.tablename = 'nvsi_albp0004'
            break
        }
      } else {
        //新接口传参
        bean = {
          areaId: areaid,
          pid: userInfo.value.id,
          type: queryParam.selectValue, //统计指标
          albp0006: queryParam.selectValue != 'sex' && props.queryParam.albp0006 ? props.queryParam.albp0006 : null, //性别
          albp0017: queryParam.selectValue != 'education' && props.queryParam.albp0017 ? props.queryParam.albp0017 : null, //学历
          albp0007: queryParam.selectValue != 'politicalstatus' && props.queryParam.albp0007 ? props.queryParam.albp0007 : null, //政治面貌
          albp0021: queryParam.selectValue != 'servicecategory' && props.queryParam.albp0021 ? props.queryParam.albp0021 : null, //服务类别
          albp0018: queryParam.selectValue != 'workstatus' && props.queryParam.albp0018 ? props.queryParam.albp0018 : null, //从业状况
          albp0004: queryParam.selectValue != 'credentialtype' && props.queryParam.albp0004 ? props.queryParam.albp0004 : null, //证件类型
          albp0089: queryParam.selectValue != 'time' && props.queryParam.albp0089 ? props.queryParam.albp0089 : null, //有无时长
          albp0026: props.queryParam.albp0026 ? props.queryParam.albp0026 : null, //星级
          albp0090: props.queryParam.albp0090 ? props.queryParam.albp0090 : null, //停用/启动
          minage: queryParam.selectValue != 'age' && props.queryParam.minage ? props.queryParam.minage : null, //年龄区间 最小
          maxage: queryParam.selectValue != 'age' && props.queryParam.maxage ? props.queryParam.maxage : null, //年龄区间 最大
          mintime: queryParam.selectValue != 'time' && props.queryParam.mintime ? props.queryParam.mintime : null, //时长区间 最小
          maxtime: queryParam.selectValue != 'time' && props.queryParam.maxtime ? props.queryParam.maxtime : null, //时长区间 最大
          registmindate: props.queryParam.registmindate ? moment(new Date(props.queryParam.registmindate)).format('YYYY-MM-DD') : null, //注册时间 最小
          registmaxdate: props.queryParam.registmaxdate ? moment(new Date(props.queryParam.registmaxdate)).format('YYYY-MM-DD') : null, //注册时间 最大
        }
      }
      query.value = JSON.parse(JSON.stringify(bean)) //将查询条件保存 导出表格要用
      loading.value = true
      spinning.value = true

      // let methods = leave == '全国' || leave == '省' ? 'VolStaticQuerySearchOnLeap' : 'queryVolunteerstatisticalanalysis'
      let methods = leave == '全国' ? 'VolStaticQuerySearchOnLeap' : 'queryVolunteerstatisticalanalysis'
      console.log(bean, 'bean...志愿者统计')
      console.log(methods, 'methods')
      // let methods = 'queryVolunteerstatisticalanalysis'
      if (methods == 'queryVolunteerstatisticalanalysis') {
        rpcPost(methods, { bean }).then((resp) => {
          if (resp && resp.code === 0 && resp.data) {
            const par = { bean: { uuid: resp.data } }

            console.log('par', par)
            timer.value = setInterval(() => {
              rpcPost('getVolunteerstatisticalanalysis', par).then((res) => {
                if (res.code == 0 && res.data.length >= 0) {
                  x.value = []
                  y.value = []
                  number.value = 0
                  if (res && res.code === 0 && res.data) {
                    if (queryParam.selectValue == 'person' && (leave == '区' || leave == '市')) {
                      let obj = res.data[res.data.length - 1]
                      res.data.pop()
                      res.data.unshift(obj)
                    }
                    list.value = res.data
                    res.data.forEach((element) => {
                      let name = element.column ? element.column : element.name
                      let num = element.num ? element.num * 1 : element.count * 1
                      x.value.push(name)
                      number.value += num
                      y.value.push(num)
                    })
                    drawBar()
                    timer.value && clearInterval(timer.value)
                  }
                }
              })
            }, 3000)
          }
        })
      } else {
        rpcPost(methods, { bean }).then((res) => {
          x.value = []
          y.value = []
          number.value = 0
          if (res && res.code === 0 && res.data) {
            if (queryParam.selectValue == 'person' && (leave == '区' || leave == '市')) {
              let obj = res.data[res.data.length - 1]
              res.data.pop()
              res.data.unshift(obj)
            }
            list.value = res.data
            res.data.forEach((element) => {
              let name = element.column ? element.column : element.name
              let num = element.num ? element.num * 1 : element.count * 1
              x.value.push(name)
              number.value += num
              y.value.push(num)
            })
          }
          drawBar()
        })
      }
    }

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

    const isStart = ref(true)

    watch(
      //第一次查数据时要等服务区域组件加载完成
      () => props.queryParam.areaid,
      (areaid) => {
        if (isStart.value) {
          isStart.value = false
          getData()
        }
      }
    )

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

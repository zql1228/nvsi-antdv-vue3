import * as echarts from 'echarts'
const drawChart1 = function (id, xdata, ydata, selectvalue) {
  // 人数分布
  // 基于准备好的dom，初始化echarts实例
  // var div1=document.getElementById('echartsTable1')
  // console.log(div1.parentNode.clientWidth)
  // let width=div1.parentNode.clientWidth
  // var myChart1 = echarts.init(div1);
  // myChart1.resize({width:width});
  var yData = ydata // [1, 2, 3, 5, 15, 2, 16, 20, 8, 4, 2, 19] // ydata
  var xData = xdata

  var name
  // 指定图表的配置项和数据
  // 人数分布
  if (selectvalue === 1) {
    name = '时长'
  } else if (selectvalue === 2) {
    name = '志愿者人数'
  } else if (selectvalue === 3) {
    name = '项目数'
  } else {
    name = '队伍数'
  }
  var option1 = {
    title: {
      show: false,
      text: '志愿者人数分布图',
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#bdd3ed',
      borderWidth: 1,
      textStyle: {
        fontSize: 14,
        color: '#333',
      },
      formatter:
        "{b}: <br>  <span style='display:inline-block;margin-right:5px;border-radius:50%;width:6px;height:6px;left:5px;background-color:#1890FF'></span>{a}：{c} ",
    },
    grid: {
      top: 20,
      left: 110,
      right: 5,
      bottom: 70,
    },
    toolbox: {
      show: false,
    },
    xAxis: [
      {
        type: 'category',
        data: xData,
        axisLabel: {
          rotate: 30,
          interval: (i, v) => true,
          borderWidth: 0,
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#E6E9F1',
          },
        },
        axisTick: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        max: function (i) {
          return i.max * 1.5
        },
        axisLabel: {
          textStyle: {
            color: '#333',
            fontSize: 14,
          },
        },
        splitLine: {
          show: false,
        },
        splitArea: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#E6E9F1',
          },
        },
        axisTick: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: name,
        type: 'bar',
        data: yData,
        barWidth: 12,
        itemStyle: {
          normal: {
            color: '#6EBAFF',
            borderRadius: [0],
          },
        },
      },
    ],
  }
  // 使用刚指定的配置项和数据显示图表。
  var myChart1
  setTimeout(() => {
    myChart1 = echarts.getInstanceByDom(document.getElementById(id))
    if (myChart1 == null) {
      myChart1 = echarts.init(document.getElementById(id))
    }

    myChart1.setOption(option1)
  }, 500)
  window.addEventListener('resize', function () {
    myChart1.resize()
  })
}
export default drawChart1

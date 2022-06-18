<template>
  <div class="home">
    <div class="part-wrapper">
      <div class="part-left">
        <ul class="part-ul">
          <li class="part-li" v-for="(part, index) in parts" :key="index">
            <img :src="part.src" alt="" />
            <span>{{ part.title }}</span>
          </li>
        </ul>
        <div class="kj-wrapper flex f-d-c a-i">
          <span class="kj-add"></span>
          <span>快捷设置</span>
        </div>
      </div>
      <div class="part-right">
        <p>早安，祝您开心每一天</p>
        <p>{{ nowTime }}</p>
      </div>
    </div>
    <div class="m-24 content">
      <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card title="总销售额" total="￥126,560">
            <a-tooltip title="指标说明" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <trend flag="up" style="margin-right: 16px;">
                <span slot="term">周同比</span>
                12%
              </trend>
              <trend flag="down">
                <span slot="term">日同比</span>
                11%
              </trend>
            </div>
            <template slot="footer">日均销售额<span>￥ 234.56</span></template>
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card title="访问量" :total="8846 | NumberFormat">
            <a-tooltip title="指标说明" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <mini-area />
            </div>
            <template slot="footer"
              >日访问量<span> {{ '1234' | NumberFormat }}</span></template
            >
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card title="支付笔数" :total="6560 | NumberFormat">
            <a-tooltip title="指标说明" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <mini-bar />
            </div>
            <template slot="footer">转化率 <span>60%</span></template>
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card title="运营活动效果" total="78%">
            <a-tooltip title="指标说明" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <mini-progress
                color="rgb(19, 194, 194)"
                :target="80"
                :percentage="78"
                height="8px"
              />
            </div>
            <template slot="footer">
              <trend flag="down" style="margin-right: 16px;">
                <span slot="term">同周比</span>
                12%
              </trend>
              <trend flag="up">
                <span slot="term">日环比</span>
                80%
              </trend>
            </template>
          </chart-card>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :sm="24" :md="12" :style="{ marginBottom: '24px' }">
          <div class="white tab-wrapper">
            <h1 class="title">通知公告</h1>
            <a-tabs default-active-key="1">
              <a-tab-pane key="1" tab="未阅通知">
                <ul class="ul-wrapper">
                  <li
                    class="li-part"
                    v-for="(notice, index) in noticeList"
                    :key="index"
                  >
                    <span>{{ notice.urgency }}</span>
                    <span>[{{ notice.noticeType | filterNoticeType }}]</span>
                    <span>{{ notice.noticeName }}</span>
                    <span>{{ notice.createTime }}</span>
                  </li>
                </ul>
              </a-tab-pane>
              <a-tab-pane key="2" tab="已阅通知" force-render>
                <ul class="ul-wrapper">
                  <li
                    class="li-part"
                    v-for="(notice, index) in noticeList"
                    :key="index"
                  >
                    <span>{{ notice.urgency }}</span>
                    <span>{{ [notice.noticeType] | filterNoticeType }}</span>
                    <span>{{ notice.noticeName }}</span>
                    <span>{{ notice.createTime }}</span>
                  </li>
                </ul>
              </a-tab-pane>

              <div slot="tabBarExtraContent">
                <span style="cursor: pointer">
                  <a-icon
                    type="sync"
                    :spin="refreshFlag"
                    :style="{ color: '#BFBFBF' }"
                  />
                  <span class="fresh" @click="fresh">刷新</span>
                </span>
                <span class="more">更多</span>
              </div>
            </a-tabs>
          </div>
        </a-col>

        <a-col :sm="24" :md="12" :style="{ marginBottom: '24px' }">
          <div class="white tab-wrapper">
            <h1 class="title">内部邮件</h1>
            <a-tabs default-active-key="1">
              <a-tab-pane key="1" tab="未阅邮件">
                <ul class="ul-wrapper">
                  <li
                    class="li-part"
                    v-for="(notice, index) in noticeList"
                    :key="index"
                  >
                    <span>{{ notice.urgency }}</span>
                    <span>[内部邮件]</span>
                    <span>{{ notice.noticeName }}</span>
                    <span>{{ notice.createTime }}</span>
                  </li>
                </ul>
              </a-tab-pane>
              <a-tab-pane key="2" tab="已阅邮件" force-render>
                <ul class="ul-wrapper">
                  <li
                    class="li-part"
                    v-for="(notice, index) in noticeList"
                    :key="index"
                  >
                    <span>{{ notice.urgency }}</span>
                    <span>[内部邮件]</span>
                    <span>{{ notice.noticeName }}</span>
                    <span>{{ notice.createTime }}</span>
                  </li>
                </ul>
              </a-tab-pane>

              <div slot="tabBarExtraContent">
                <span style="cursor: pointer">
                  <a-icon
                    type="sync"
                    :spin="refreshFlag"
                    :style="{ color: '#BFBFBF' }"
                  />
                  <span class="fresh" @click="fresh">刷新</span>
                </span>
                <span class="more">更多</span>
              </div>
            </a-tabs>
          </div>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :sm="24" :md="12" :style="{ marginBottom: '24px' }">
          <div class="chart-wrapper">
            <div class="top">
              <h3>在籍情况统计</h3>
              <a-select
                :defaultValue="defaultBatch"
                style="width: 120px"
                @change="handleBatchChange"
              >
                <a-select-option
                  v-for="(batch, index) in batchList"
                  :value="batch.key"
                  :key="index"
                >
                  {{ batch.label }}
                </a-select-option>
              </a-select>
            </div>
            <div id="registered" class="inner-chart"></div>
          </div>
        </a-col>

        <a-col :sm="24" :md="12" :style="{ marginBottom: '24px' }">
          <div class="chart-wrapper">
            <div class="top">
              <h3>当前学期招生统计</h3>
              <a-select
                :defaultValue="defaultBatch"
                style="width: 120px"
                @change="handleEnrollmentChange"
              >
                <a-select-option
                  v-for="(batch, index) in batchList"
                  :value="batch.key"
                  :key="index"
                >
                  {{ batch.label }}
                </a-select-option>
              </a-select>
            </div>
            <div id="enrollment" class="inner-chart" style="width: 100%"></div>
          </div>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :sm="24" :md="24">
          <div class="white tab-wrapper">
            <h1 class="title">待复审</h1>
            <a-tabs default-active-key="1">
              <a-tab-pane key="1" tab="未缴费">
                <ul class="ul-wrapper">
                  <li
                    class="li-part"
                    v-for="(notice, index) in noticeList"
                    :key="index"
                  >
                    <span>{{ notice.urgency }}</span>
                    <span>[内部邮件]</span>
                    <span>{{ notice.noticeName }}</span>
                    <span>{{ notice.createTime }}</span>
                  </li>
                </ul>
              </a-tab-pane>
              <a-tab-pane key="2" tab="已缴费" force-render>
                <ul class="ul-wrapper">
                  <li
                    class="li-part"
                    v-for="(notice, index) in noticeList"
                    :key="index"
                  >
                    <span>{{ notice.urgency }}</span>
                    <span>[内部邮件]</span>
                    <span>{{ notice.noticeName }}</span>
                    <span>{{ notice.createTime }}</span>
                  </li>
                </ul>
              </a-tab-pane>

              <div slot="tabBarExtraContent">
                <span style="cursor: pointer">
                  <a-icon
                    type="sync"
                    :spin="refreshFlag"
                    :style="{ color: '#BFBFBF' }"
                  />
                  <span class="fresh" @click="fresh">刷新</span>
                </span>
                <span class="more">更多</span>
              </div>
            </a-tabs>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import Moment from 'moment'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea,
} from '@/components'
export default {
  data() {
    return {
      parts: [
        {
          src: require('../../assets/bg1.png'),
          title: '招生确认',
        },
        {
          src: require('../../assets/bg2.png'),
          title: '上报国开',
        },
        {
          src: require('../../assets/bg3.png'),
          title: '国开录取',
        },
        {
          src: require('../../assets/bg4.png'),
          title: '报名综合查询',
        },
        {
          src: require('../../assets/bg1.png'),
          title: '学费查询',
        },
        {
          src: require('../../assets/bg2.png'),
          title: '官网后台',
        },
      ],
      noticeList: [],
      batchList: [
        {
          label: '2020春',
          key: '202001',
        },
        {
          label: '2020秋',
          key: '202003',
        },
        {
          label: '2021春',
          key: '202101',
        },
        {
          label: '2021秋',
          key: '202103',
        },
      ],
      defaultBatch: '202001',
      refreshFlag: false,
      nowDate: new Date(),
    }
  },

  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea,
  },

  mounted() {
    for (let m = 0; m < 6; m++) {
      this.noticeList.push({
        noticeType: '1',
        urgency: '平件',
        noticeName: '2021学期关于招生的计划安排' + m + 1,
        createTime: Moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
      })
    }

    let data = [
      { value: 1048, name: '保险专业' },
      { value: 735, name: '金融管理专业' },
      { value: 580, name: '市场营销' },
      { value: 484, name: '金融学' },
    ]

    this.drawChart(data)
    this.handleEnrollmentChange()
    this.getList()
  },

  computed: {
    nowTime() {
      let nowDate = new Date()
      let weeks = [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
      ]
      let wk = nowDate.getDay()
      return `${nowDate.getFullYear()}年${nowDate.getMonth() +
        1}月${nowDate.getDate()}日  ${weeks[wk]}`
    },
  },

  filters: {
    filterNoticeType(val) {
      let noticeType = ''
      switch (val) {
        case '1':
          noticeType = '通知公告'
          break
      }

      return noticeType
    },
    NumberFormat(val) {
      if (!val) {
        return '0'
      }
      const intPartFormat = val
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
      return intPartFormat
    },
  },

  methods: {
    fresh() {
      this.refreshFlag = true
      setTimeout(() => {
        this.refreshFlag = false
      }, 1000)
    },

    getList() {
      var par = new SearchParameters()
      par.setName('bjzjusertable')
      this.$request('BJZJ_commonSearchs', { par: par }).then((res) => {
        console.log(res)
      })
    },

    drawChart(data) {
      let myChart = this.$echarts.init(
        document.getElementById('registered'),
        null,
        { width: 600 }
      )
      let total = 0
      for (let i = 0; i < data.length; i++) {
        total += data[i].value
      }
      let option = {
        title: {
          zlevel: 0,
          text: ['{title|在籍总人数（人）}', '{value|' + total + '}'].join(
            '\n'
          ),
          textStyle: {
            rich: {
              title: {
                color: 'rgba(0, 0, 0, 0.45)',
                fontSize: 14,
                fontWeight: 400,
                padding: [0, 0, 10, 0],
              },
              value: {
                color: 'rgba(0, 0, 0, 0.85)',
                fontSize: 30,
                fontWeight: 400,
                lineHeight: 40,
              },
            },
          },
          left: 130,
          textAlign: 'center',
          top: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          top: 'middle',
          right: 50,
          formatter: function(name) {
            var arr = [],
              dx = 0
            for (let i = 0; i < data.length; i++) {
              if (data[i].name == name) {
                dx = i
              }
            }

            arr.push(
              `{name|${name}}`,
              `{pre|${((data[dx].value / total) * 100).toFixed(2)}%}`,
              `{value|${data[dx].value}}`
            )
            return arr.join('')
          },
          textStyle: {
            color: '#333333',
            rich: {
              name: {
                width: 80,
              },
              pre: {
                width: 55,
                color: ' rgba(0, 0, 0, 0.45)',
                padding: [0, 5, 0, 10],
              },
              value: {
                width: 60,
              },
            },
          },
        },
        color: ['#5487DF', '#82C4CA', '#EC808D', '#FFC770'],
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: true,
            left: '-56%',
            label: {
              show: false,
              position: 'center',
            },
            // emphasis: {
            //     label: {
            //         show: true,
            //         fontSize: "40",
            //         fontWeight: "bold",
            //     },
            // },
            // labelLine: {
            //     show: false,
            // },
            data: data,
          },
        ],
      }
      option && myChart.setOption(option)
    },

    drawLineChart(data) {
      let myChart = this.$echarts.init(
        document.getElementById('enrollment'),
        null
      )
      let option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: [
            '报名人数',
            '初审通过',
            '复审通过',
            '缴费人数',
            '未缴费',
            '国开录取',
          ],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['保险专业', '金融管理学', '市场营销', '金融学', '专业'],
        },
        yAxis: {
          type: 'value',
        },
        series: data,
      }

      option && myChart.setOption(option)
    },

    handleBatchChange(obj) {
      this.defaultBatch = obj
      let arr = [
        { value: Math.ceil(Math.random() * 1000), name: '保险专业' },
        { value: Math.ceil(Math.random() * 1000), name: '金融管理专业' },
        { value: Math.ceil(Math.random() * 1000), name: '市场营销' },
        { value: Math.ceil(Math.random() * 1000), name: '金融学' },
      ]
      this.drawChart(arr)
    },

    handleEnrollmentChange(obj) {
      let arr = [
        {
          name: '报名人数',
          smooth: true,
          type: 'line',
          data: [],
        },
        {
          name: '初审通过',
          type: 'line',
          smooth: true,
          data: [],
        },
        {
          name: '复审通过',
          smooth: true,
          type: 'line',
          data: [],
        },
        {
          name: '缴费人数',
          smooth: true,
          type: 'line',
          data: [],
        },
        {
          name: '未缴费',
          smooth: true,
          type: 'line',
          data: [],
        },

        {
          name: '国开录取',
          type: 'line',
          smooth: true,
          data: [],
        },
      ]
      for (let n = 0; n < arr.length; n++) {
        for (let m = 0; m < 7; m++) {
          arr[n].data.push(Math.ceil(Math.random() * 1000))
        }
      }
      this.drawLineChart(arr)
    },
  },
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';

.home {
  .part-wrapper {
    background: #ffffff;
    box-shadow: 0px 0px 1rem rgba(214, 214, 214, 0.1);
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
    .part-left {
      padding-left: 0.35rem;
      padding: 1.15rem 0 1.45rem;
      font-size: 0.8rem;
      color: #666666;
      display: flex;
      .part-ul {
        display: flex;
        margin: 0;
        .part-li {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 1rem;
        }
      }

      .kj-wrapper {
        margin-left: 1.4rem;
        margin-top: 0.3rem;
        .kj-add {
          display: inline-block;
          width: 2.9rem;
          height: 2.9rem;
          cursor: pointer;
          margin-bottom: 0.6rem;
          background: url(../../assets/kjadd.png) no-repeat center;
          background-size: 100% 100%;
        }
      }
    }

    .part-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 30.94rem;
      background: url(../../assets/bg.png);
      text-align: center;
      p {
        &:first-child {
          font-size: 1rem;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
        }
        &:last-child {
          font-size: 0.7rem;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
  }

  .content {
    .ant-row {
      margin: 0;
      .tab-wrapper {
        position: relative;
        padding-bottom: 1.2rem;

        .title {
          position: absolute;
          left: 1.2rem;

          top: 0.4rem;
          color: #333333;
          font-size: 0.9rem;
        }
        .ul-wrapper {
          .li-part {
            padding: 0 1.2rem;
            line-height: 2.7rem;
            width: 100%;
            display: flex;
            align-items: center;
            cursor: pointer;
            position: relative;
            &:hover {
              background-color: @table-row-hover-bg;
            }
            span {
              font-size: 0.7rem;
              font-weight: 400;
              color: #666666;
              &:first-child {
                display: inline-block;
                line-height: 0.9rem;
                color: #fff;
                padding: 0 6px;
                font-size: 0.6rem;
                background-color: #0183fc;
                border-radius: 3px;
                margin-right: 0.8rem;
              }
              &:nth-child(2) {
                margin-right: 1.2rem;
              }

              &:last-child {
                font-size: 0.6rem;
                color: #999999;
                position: absolute;
                right: 1.2rem;
              }
            }
          }
        }

        .ant-tabs-extra-content {
          margin-right: 1.2rem;
        }

        .fresh {
          font-size: 0.6rem;
          font-weight: 400;
          color: #bfbfbf;
          margin-left: 0.5rem;
          margin-right: 0.9rem;
        }

        .more {
          font-size: 0.6rem;
          font-weight: 400;
          color: #bfbfbf;
        }
      }

      .chart-wrapper {
        background-color: #fff;
        .top {
          display: flex;
          justify-content: space-between;
          line-height: 2.8rem;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #f7f7f7;
          padding: 0 1.2rem;
          h3 {
            font-size: 0.9rem;
            font-weight: bold;
            color: #333333;
          }
        }
        .inner-chart {
          height: 300px;
        }
      }

      .ant-tabs-nav-wrap {
        margin-left: 6rem;
      }
    }
  }
}
</style>

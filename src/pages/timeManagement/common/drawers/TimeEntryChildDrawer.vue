<template>
  <a-drawer
    :style="loading ? { pointerEvents: 'none' } : {}"
    title="时长录入"
    width="1060px"
    :visible="visible"
    @close.prevent="closeChildrenDrawer"
    :bodyStyle="{ overflow: 'auto', height: '100%' }"
  >
    <!-- <a-spin :spinning="loading" wrapperClassName="a_spining"> -->
    <div class="div-border-bottom">
      <div class="select-pro">当前选择项目：{{ item.proitem.albx0002 ? item.proitem.albx0002 : '' }}</div>
      <div class="select-pro">当前选择岗位：{{ item.record[0].albx0072 ? item.record[0].albx0072 : '' }}</div>
      <a-row type="flex" justify="space-between">
        <a-col>当前选择志愿者：{{ item.record.length }}人</a-col>
        <a-col>当前选择总时长：{{ obj.sumtime }}小时</a-col>
      </a-row>
    </div>
    <a-form>
      <a-form-item label="备注:">
        <a-textarea placeholder="如：2019-6-12上午8:00-9:00慰问养老院" :maxLength="500" v-model:value="obj.remarks" />
      </a-form-item>
    </a-form>
    <div>提示：输入你需要录入的时间段，一次最多可添加10条</div>
    <a-row style="margin-bottom: 10px">
      <a-col :md="8" :sm="24">开始时间</a-col>
      <a-col :md="8" :sm="24">结束时间</a-col>
      <a-col :md="6" :sm="20">服务时长（小时）</a-col>
      <a-col :md="2" :sm="4"></a-col>
    </a-row>
    <a-row type="flex" justify="space-between" style="margin-bottom: 10px" v-for="(dateitem, index) of dateList" :key="index">
      <a-col :md="8" :sm="24">
        <a-date-picker
          v-model:value="dateitem.startValue"
          :defaultPickerValue="moment(item.proitem.albx0004, 'YYYY-MM-DD HH:mm:ss')"
          format="YYYY-MM-DD HH:mm:ss"
          :disabled-date="(startValue) => disabledStartDate(startValue, index)"
          :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
          :showToday="false"
          :disabled-time="disabledDateTime"
          :placeholder="item.proitem.albx0004 ? item.proitem.albx0004.slice(0, -2) : ''"
          @change="(data, dataString) => changeDate(data, dataString, index)"
          @ok="confirmselectDate(index)"
          @blur="confirmselectDate(index)"
        />
      </a-col>
      <a-col :md="8" :sm="24">
        <!-- item.proitem.albx0005.slice(0, -2)  -->
        <a-date-picker
          v-model:value="dateitem.endValue"
          :defaultPickerValue="moment(item.proitem.albx0005, 'YYYY-MM-DD HH:mm:ss')"
          format="YYYY-MM-DD HH:mm:ss"
          :disabled-date="(endValue) => disabledEndDate(endValue, index)"
          :showToday="false"
          :showTime="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }"
          :placeholder="item.proitem.albx0005 ? moment(item.proitem.albx0005).format('YYYY-MM-DD HH:mm:ss') : ''"
          @change="(data, dataString) => changeDate(data, dataString, index)"
          :disabled-time="disabledDateTime"
          @ok="confirmselectDate(index)"
          @blur="confirmselectDate(index)"
        />
      </a-col>
      <a-col :md="6" :sm="20">
        <a-input disabled v-model:value="dateitem.servicetime" />
      </a-col>
      <a-col :md="2" :sm="4" style="text-align: center">
        <MinusCircleOutlined @click="reduceCount(index)" />
      </a-col>
      <a-col :span="24"><span :id="'tip' + (index + 1)"></span></a-col>
    </a-row>
    <a-row v-show="dateList.length < 10"><PlusCircleOutlined @click="addCount" /></a-row>
    <div
      :style="{
        position: 'absolute',
        bottom: '20px',
        width: '100%',
        padding: '10px 16px',
        textAlign: 'right',
        left: 0,
        background: '#fff',
        borderTop: '1px solid #e9e9e9',
      }"
    >
      <a-button style="margin-right: 16px" type="primary" ghost @click="closeChildrenDrawer">重新选择志愿者</a-button>
      <a-button type="primary" :disabled="obj.isdisabled" @click="addDuration">添加时长</a-button>
    </div>
    <!-- </a-spin> -->
  </a-drawer>
</template>
<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch, nextTick, h } from 'vue'
import apis from '@/server/request'
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons-vue'
import moment from 'moment'
import { message, Modal } from 'ant-design-vue'
import { forTips } from '@/pages/membersManagement/components/tables/hasSelected.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    PlusCircleOutlined,
    MinusCircleOutlined,
  },
  setup(props, { emit }) {
    const userInfo = ref(LocalGetUserInfo())

    const loading = ref(false)
    const obj = reactive({
      sumtime: 0,
      remarks: '',
      isdisabled: true,
    })
    let dateList = ref([
      // 选择的服务时长集合
      {
        startValue: null,
        endValue: null,
        servicetime: '0.00',
        isdisabled: true,
      },
    ])
    const addCount = () => {
      // 添加录入时长的条数
      if (dateList.value[dateList.value.length - 1].isdisabled === false) {
        dateList.value.push({
          startValue: null,
          endValue: null,
          servicetime: '0.00',
          isdisabled: true,
        })
        obj.isdisabled = true
      } else {
        forTips('tip' + (dateList.value.length - 1 + 1), '请先将已有输入框内容选择完成后，再进行添加')
      }
    }
    const reduceCount = (val) => {
      // 减少录入时长的条数
      if (dateList.value.length > 1) {
        dateList.value.forEach((el, index) => {
          if (val === index) {
            dateList.value.splice(index, 1)
          }
        })
        let result = dateList.value.every((e) => {
          return e.isdisabled == false
        })
        result ? (obj.isdisabled = false) : (obj.isdisabled = true)
      }
    }
    const disabledStartDate = (startValue, index) => {
      let endValue
      let beginValue = moment(props.item.proitem.albx0004)
      if (dateList.value[index].endValue) {
        endValue = dateList.value[index].endValue
      } else {
        endValue = moment(new Date(props.item.proitem.albx0005))
      }
      if (!startValue) {
        return false
      }

      return startValue.valueOf() > endValue.valueOf() || startValue.valueOf() < beginValue.valueOf()
    }
    const disabledEndDate = (endValue, index) => {
      var beginValue
      const endTime = moment(props.item.proitem.albx0005.slice(0, 10) + ' 23:59:59')
      if (dateList.value[index].startValue) {
        beginValue = dateList.value[index].startValue
      } else {
        beginValue = moment(props.item.proitem.albx0004)
      }
      if (!endValue) {
        return false
      }
      const flag = endValue.valueOf() > endTime.valueOf() || endValue.valueOf() < beginValue.valueOf()
      return flag
    }
    const ranges = []
    const range = (start, end) => {
      // 日期
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    }
    const disabledDateTime = (dates) => {
      // 时分秒不可选
      const starthours = new Date(props.item.proitem.albx0004).getHours() // 0~23
      const startminutes = new Date(props.item.proitem.albx0004).getMinutes() // 0~59
      const startseconds = new Date(props.item.proitem.albx0004).getSeconds() // 0~59
      const endhours = new Date(props.item.proitem.albx0005).getHours() // 0~23
      const endminutes = new Date(props.item.proitem.albx0005).getMinutes() // 0~59
      const endseconds = new Date(props.item.proitem.albx0005).getSeconds() // 0~59
      // 只能选择项目时间范围内的时间
      if (dates.format().slice(0, 10) == props.item.proitem.albx0004.slice(0, 10)) {
        return {
          disabledHours: () => range(0, starthours == 0 ? starthours : starthours - 1),
          disabledMinutes: () => range(0, startminutes == 0 ? startminutes : startminutes - 1),
          disabledSeconds: () => range(0, startseconds == 0 ? startseconds : startseconds - 1),
        }
      }
      if (dates.format().slice(0, 10) == props.item.proitem.albx0005.slice(0, 10)) {
        return {
          disabledHours: () => range(endhours == 0 ? endhours : endhours + 1, 23),
          disabledMinutes: () => range(endminutes == 0 ? endminutes : endminutes + 1, 59),
          disabledSeconds: () => range(endseconds == 0 ? endseconds : endseconds + 1, 59),
        }
      }
    }
    const changeDate = (date, dataString, index) => {}
    const changeDate2 = (date, dataString, index) => {}
    const confirmselectDate = (index) => {
      let stime = dateList.value[index].startValue
      let etime = dateList.value[index].endValue
      if (stime && etime) {
        if (stime.format('YYYY-MM-DD') == etime.format('YYYY-MM-DD')) {
          if (etime.valueOf() < stime.valueOf()) {
            forTips('tip' + (index + 1), '开始时间不能晚于结束时间')
            obj.isdisabled = true
            return
          } else {
            var servicetime = (etime.valueOf() - stime.valueOf()) / 1000 / 60 / 60

            if (servicetime == 0 || parseFloat(servicetime).toFixed(2) == '0.00') {
              forTips('tip' + (index + 1), '服务时长不能为0小时')
              return
            } else if (etime.valueOf() > moment(new Date()).valueOf()) {
              forTips('tip' + (index + 1), '不能录入当前时间之后的时间，请重新选择')
              obj.isdisabled = true
            } else {
              dateList.value[index].servicetime = servicetime.toFixed(2)
              if (dateList.value.length < 2) {
                dateList.value[index].isdisabled = obj.isdisabled = false
                obj.sumtime = (dateList.value[index].servicetime * props.item.record.length).toFixed(2)
                // console.log('servicetime', obj)
                forTips('tip' + (index + 1), '')
              } else {
                dateList.value.forEach((item, i) => {
                  if (i != index) {
                    //开始时间小于等于结束时间，结束时间大于等于开始时间
                    if (etime.valueOf() >= item.startValue.valueOf() && stime.valueOf() <= item.endValue.valueOf()) {
                      obj.isdisabled = true
                      forTips('tip' + (index + 1), '此时间段与你其他已选择时间段有重合，请重新选择')
                    } else {
                      dateList.value[index].isdisabled = obj.isdisabled = false
                      let sumtime2 = 0
                      dateList.value.forEach((el) => {
                        sumtime2 += el.servicetime * 1
                      })
                      obj.sumtime = (sumtime2 * props.item.record.length).toFixed(2)
                      forTips('tip' + (index + 1), '')
                    }
                  }
                })
              }
            }
          }
        } else {
          forTips('tip' + (index + 1), '单条服务时长范围不能跨天，请重新选择')
        }
      }
    }
    const beforeAddTime = (volList) => {
      //
      let param = []
      volList.forEach((item) => {
        dateList.value.forEach((el) => {
          param.push({
            albx0021: props.item.proitem.albx0021, // '110000000000000000', // 区划
            albx0176: props.item.proitem.id, // , // 项目id
            albx0177: userInfo.value.team.groupid, // 队伍ID
            albx0062: userInfo.value.team.albe0002, // 队伍名称
            name: item.albp0003, // 志愿者名称
            albx0175: item.albx0053, //志愿者编号
            cardno: item.albp0005, // 志愿者身份证albp0005
            bz: obj.remarks ? obj.remarks : '无',
            type: '1', // 后台录入
            start: el.startValue.format('YYYY-MM-DD HH:mm:ss'),
            end: el.endValue.format('YYYY-MM-DD HH:mm:ss'),
            albx0172: el.servicetime,
          })
        })
      })

      apis
        .addTimeFortisService(param)
        .then((res) => {
          if (res) {
            message.success(res)
            closeChildrenDrawer(true)
          } else {
            message.warning('添加失败')
            closeChildrenDrawer(false)
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          loading.value = false
        })
    }

    const addDuration = () => {
      loading.value = true
      //点击添加时
      obj.isdisabled = true
      //添加前调用判断是否签到未签退
      const bean = [] //查询未签退的入参
      const noAdd = [] //未签退需要提示的人
      let addarr = [...props.item.record] //做未签退判断后添加的入参
      props.item.record.forEach((item) => {
        bean.push({
          areaid: props.item.proitem.albx0021, //项目区划
          albx0175: item.albx0053, //志愿者编号
          name: item.albp0003, // 志愿者名称
          cardno: item.albp0005, // 志愿者身份证albp0005
          albx0176: props.item.proitem.id, // , // 项目id
          albx0177: userInfo.value.team.groupid, // 队伍ID
          albx0062: userInfo.value.team.albe0002, // 队伍名称
        })
      })

      apis
        .addTimeBeforeFortisService(bean)
        .then((res) => {
          if (res.length < 1) {
            beforeAddTime(props.item.record)
          } else {
            props.item.record.forEach((item, i) => {
              if (res[i].albx0181 && res[i].albx0182) {
                //未签退
                dateList.value.forEach((time) => {
                  if (
                    time.startValue.valueOf() <= moment(res[i].albx0182.slice(0, 19)).valueOf() &&
                    time.endValue.valueOf() >= moment(res[i].albx0181.slice(0, 19)).valueOf()
                  ) {
                    let s = res[i].albx0181.slice(0, 19)
                    let e = res[i].albx0182.slice(0, 19)

                    noAdd.push(h('p', {}, `${item.albp0003}志愿者在${s}~${e}时间段未签退,暂不能录入该时间段的时长`))
                    addarr.splice(i, 1)
                  }
                })
              }
            })
            if (noAdd.length > 0) {
              // message.warning((() => h('div', {}, noAdd))())
              Modal.info({
                title: () => h('div', {}, noAdd),
                width: 750,
              })
            }
            if (addarr.length > 0) {
              beforeAddTime(addarr)
            }
          }
        })
        .finally(() => {
          loading.value = false
        })
    }
    const closeChildrenDrawer = (val) => {
      //关闭当前抽屉
      emit('closeChildrenDrawer', val)
    }
    onMounted(() => {
      console.log(props, 'props')
    })
    watch(
      () => props.visible,
      (visible) => {
        nextTick(() => {
          if (visible) {
            obj.sumtime = 0
            obj.remarks = ''
            obj.isdisabled = true
            forTips('tip1', '')
            dateList.value = [
              {
                startValue: null,
                endValue: null,
                servicetime: '0.00',
                isdisabled: true,
              },
            ]
          }
        })
      }
    )
    return {
      ...toRefs(props),
      obj,
      moment,
      dateList,
      closeChildrenDrawer,
      addCount,
      reduceCount,
      changeDate,
      changeDate2,
      disabledStartDate,
      disabledEndDate,
      disabledDateTime,
      confirmselectDate,
      addDuration,
      loading,
    }
  },
})
</script>

<style scoped lang="less">
.a_spining {
  height: 100%;
  // :deep(.ant-spin-container) {
  //   height: 85%;
  // }
}
</style>

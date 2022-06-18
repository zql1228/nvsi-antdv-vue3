<template>
  <!-- 1- 基本信息 -->
  <a-form ref="volInfo" :model="formParam" layout="vertical" class="nv-form" :style="{ padding: ' 0 24px' }">
    <a-card title="基本信息">
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <a-form-item label="姓名">
            <a-input v-model:value="formParam.albp0003" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="用户名">
            <a-input v-model:value="formParam.albp0052" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="服务区域">
            <a-input v-model:value="formParam.albp0025" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <!-- <a-col :md="8" :sm="24">
          <a-form-item label="志愿者编号">
            <a-input v-model:value="formParam.albp0029" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col> -->
      </a-row>
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <a-form-item label="证件类型">
            <a-select v-model:value="formParam.albp0004" placeholder="请选择" :disabled="disabled" class="a_select">
              <a-select-option :value="item.value" v-for="item in codeValue.nvsiAlbp0004">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="证件号码">
            <a-input v-model:value="formParam.albp0005" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="注册时间">
            <a-input v-model:value="formParam.albp0034" placeholder="" :disabled="disabled" />
            <!-- <a-date-picker v-model:value="formParam.albp0034" :disabled="disabled" /> -->
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <a-form-item label="注册地">
            <a-input v-model:value="formParam.albp0061" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="居住区域">
            <a-input v-model:value="formParam.albp0047" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="详细地址">
            <a-input v-model:value="formParam.albp0013" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <a-form-item label="性别">
            <a-select v-model:value="formParam.albp0006" placeholder="请选择" :disabled="disabled" class="a_select">
              <a-select-option :value="item.value" v-for="item in codeValue.nvsiAlbp0006">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="年龄">
            <a-input v-model:value="formParam.age" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="最高学历">
            <a-select v-model:value="formParam.albp0017" placeholder="请选择" :disabled="disabled" class="a_select">
              <a-select-option :value="item.value" v-for="item in codeValue.nvsiAlbp0017">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <a-form-item label="政治面貌">
            <!-- albp0007 -->
            <a-select v-model:value="formParam.albp0007" placeholder="请选择" :disabled="disabled" class="a_select">
              <a-select-option :value="item.value" v-for="item in codeValue.nvsiAlbp0007">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="国籍">
            <a-select v-model:value="formParam.albp0002" placeholder="请选择" :disabled="disabled" class="a_select">
              <a-select-option :value="item.value" v-for="item in codeValue.nvsiAlbp0002">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="民族">
            <!-- albp0008 -->
            <a-select v-model:value="formParam.albp0008" placeholder="请选择" :disabled="disabled" class="a_select">
              <a-select-option :value="item.value" v-for="item in codeValue.nvsiAlbp0008">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <a-form-item label="从业情况">
            <a-select v-model:value="formParam.albp0018" placeholder="请选择" :disabled="disabled" class="a_select">
              <a-select-option :value="item.value" v-for="item in codeValue.nvsiAlbp0018">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="微信">
            <a-input v-model:value="formParam.albp0015" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="QQ">
            <a-input v-model:value="formParam.albp0012" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <a-form-item label="手机号码">
            <a-input v-model:value="formParam.albp0010" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="固定电话">
            <a-input v-model:value="formParam.albp00011" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="电子邮箱">
            <a-input v-model:value="formParam.albp0081" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <a-form-item label="服务类别">
            <a-input v-model:value="formParam.albp0021" placeholder="" :disabled="disabled" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="服务领域">
            <div v-if="Array.isArray(formParam.albp0022) && formParam.albp0022.length > 0">
              <a-tag v-for="item in formParam.albp0022" class="a_tag">{{ item }}</a-tag>
            </div>
            <div v-else>
              <a-tag>暂无</a-tag>
            </div>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="个人特长">
            <div v-if="Array.isArray(formParam.albp0039) && formParam.albp0039.length > 0">
              <a-tag v-for="item in formParam.albp0039" class="a_tag">{{ item }}</a-tag>
            </div>
            <div v-else>
              <a-tag>暂无</a-tag>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24"> </a-row>
    </a-card>
    <a-card title="可参与服务时间" style="margin-top: 10px; padding-bottom: 50px">
      <div class="tableContainer">
        <div class="tableHeader">
          <div class="title">星期一</div>
          <div class="title">星期二</div>
          <div class="title">星期三</div>
          <div class="title">星期四</div>
          <div class="title">星期五</div>
          <div class="title">星期六</div>
          <div class="title">星期日</div>
          <div class="title">节假日</div>
        </div>
        <div class="tableBody">
          <div v-for="(day, index) in weekList" :key="index" class="bodyRow">
            <div v-for="(time, j) in day" :key="j" :class="time.flag == false ? 'bodyCol' : 'bodyCol time-selected'">{{ time.time }}</div>
          </div>
        </div>
      </div>
    </a-card>
  </a-form>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch } from 'vue'
// 服务对象代码表
import { getCodeValue, getAgeByBirthday, getProtectCardNo, getSertimeList } from './useVolDetailsHook'
import moment from 'moment'
import { LocalGetVolunteerInfo, LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
export default defineComponent({
  setup(props) {
    const disabled = ref(true)
    const codeValue = getCodeValue()
    const weekList = getSertimeList()
    const volunteerInfo = ref()
    const volListRecord = reactive(LocalGetVolunteerInfo())
    const userInfo = ref(LocalGetUserInfo())
    let formParam = reactive({
      albp0003: '', // 姓名
      albp0029: '', // 志愿者编号
      albp0052: '', // 用户名
      albp0004: '', // 证件类型
      albp0034: '', // 注册日期
      albp0005: '', // 证件号码
      albp0025: '', // 服务区域名
      albp0047: '', // 居住区域名
      albp0013: '', // 详细地址
      albp0006: '', // 性别
      age: '', // 年龄
      albp0010: '', // 手机号码
      albp0061: '', // 注册区域
      albp0007: '', // 政治面貌
      albp0002: '', // 国籍
      albp0008: '', // 民族
      albp0017: '', // 学历
      albp00010: '', // 手机号码
      albp00011: '', // 固定电话
      albp0018: '', // 从业状况
      albp0015: '', // 微信
      albp0012: '', // QQ
      albp0081: '', // 邮箱
      albp0021: '', // 服务类别
      albp0022: [], // 领域类别—— 服务领域
      albp0039: [], // 个人特长
      albp0035: '', // 可支配服务时长
    })
    const setFormParams = () => {
      Object.keys(formParam).forEach((key) => {
        if (key == 'albp0034') {
          formParam['albp0034'] = moment(volunteerInfo.value[key]).format('YYYY-MM-DD')
        } else {
          volunteerInfo.value[key] ? (formParam[key] = volunteerInfo.value[key]) : ''
          // formParam[key] = volunteerInfo.value[key] || ''
        }
      })

      // 身份证脱敏
      volunteerInfo.value['albp0005'] ? (formParam['albp0005'] = getProtectCardNo(volunteerInfo.value['albp0005'])) : ''

      // 从出生日期获取年龄
      volunteerInfo.value['albp0014'] ? (formParam['age'] = getAgeByBirthday(volunteerInfo.value['albp0014'])) : ''
      // 从业情况
      formParam['albp0018'] ? (formParam['albp0018'] = formParam['albp0018'].trim()) : ''

      // 国籍
      formParam['albp0002'] ? (formParam['albp0002'] = formParam['albp0002'].trim()) : ''

      // albp0021 查找服务类别 重新set数据
      if (formParam['albp0021']) {
        formParam['albp0021'] = formParam['albp0021']
          .split(',')
          .map((code) => {
            return codeValue.serverTypeList.find(({ codeid }) => codeid == code).codevalue
          })
          .join('，')
      }
      // 服务领域
      if (formParam['albp0022'] && formParam['albp0022'] !== '暂无' && formParam['albp0022'].length > 0) {
        formParam['albp0022'] = formParam['albp0022'].split(',').map((code) => {
          return codeValue.serverDoMainList.find(({ value }) => value == code).label
        })
      }
      // 个人特长
      if (formParam['albp0039'] && formParam['albp0039'] !== '暂无' && formParam['albp0039'].length > 0) {
        // formParam['albp0039'] = []
        formParam['albp0039'] = formParam['albp0039'].split(',').map((code) => {
          return codeValue.nvsiAlbp0039.find(({ value }) => value == code).label
        })
      }
      // 可支配服务时长
      if (formParam['albp0035'] && formParam['albp0035'] !== '暂无' && formParam['albp0035'].length > 0) {
        formParam['albp0035'] = formParam['albp0035'].split(',')
        weekList.forEach((dayArr) => {
          dayArr.forEach((time) => {
            // 先清空flag
            time.flag = false
          })
        })
        weekList.forEach((dayArr) => {
          dayArr.forEach((time) => {
            formParam['albp0035'].forEach((value) => {
              if (value == time.value) {
                time.flag = true
              }
            })
          })
        })
      }
      Object.keys(formParam).forEach((key) => {
        if (!formParam[key]) {
          formParam[key] = '暂无'
        }
      })
    }

    const getVolunteerInfo = async () => {
      const params = {
        cardno: volListRecord.albp0005,
      }
      const res = await apis.getVolunteerInfo(params)
      console.log(res, 'res++++deee')
      if (Object.keys(res).length > 0) {
        volunteerInfo.value = res
        setFormParams()
        console.log(volunteerInfo, 'volunteerInfo')
      }
    }

    // const getCodeValueByServer = async () => {
    //   Promise.all([apis.getServiceTypeListFortis(), apis.getServiceFieldListFortis()])
    //     .then((codeArr) => {
    //       // 服务类型和服务领域
    //       const [res1, res2] = codeArr
    //       if (res1.code == '0' && res1.data.length) {
    //         res1.data.forEach((item) => {
    //           codeValue.serverTypeList.push({
    //             label: item.albe0122,
    //             value: item.albe0123,
    //           })
    //         })
    //       }
    //       if (res2.code == '0' && res2.data.length) {
    //         res2.data.forEach((item) => {
    //           codeValue.serverDoMainList.push({
    //             label: item.albe0112,
    //             value: item.albe0113,
    //           })
    //         })
    //       }
    //       console.log(codeArr, 'codeArr')
    //     })
    //     .catch((e) => {
    //       console.log(e, 'eee')
    //     })
    // }
    const getCodeValueByServer = async () => {
      const [serverTypeList_res] = await Promise.all([
        // 服务类别
        apis.getCodeValue('lbe05', 'getAllCodeFortis', { codeTypeName: 'lbe05', areaid: userInfo.value.areaid }),
      ])
      if (serverTypeList_res.code == 0) {
        codeValue.serverTypeList = serverTypeList_res.data
      }
    }
    onMounted(async () => {
      await getCodeValueByServer()
      await getVolunteerInfo()
    })

    return {
      moment,
      formParam,
      disabled,
      codeValue,
      weekList,
    }
  },
})
</script>

<style scoped lang="less">
.a_select {
  height: 40px;
  :deep(.ant-select-selector) {
    height: 40px;
    span:nth-child(2) {
      line-height: 40px;
    }
  }
}
.a_tag {
  margin-top: 10px;
}
.tableHeader {
  display: flex;
  flex-direction: row;
}
.title {
  width: 15%;
  height: 40px;
  border-top: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(241, 237, 237, 0.7);
  font-size: 16px;
  font-weight: 600;
}
.title:last-child {
  border-right: 1px solid #d9d9d9;
}
.tableBody {
  display: flex;
  flex-direction: row;
}
.bodyRow {
  width: 15%;
}
.bodyCol {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-top: none;
  border-left: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
}
.bodyRow:last-child .bodyCol {
  border-right: 1px solid #d9d9d9;
}
.time-selected {
  background-color: rgb(252, 236, 237);
}
</style>

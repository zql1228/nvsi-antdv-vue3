<template>
  <div class="table-page-search-wrapper">
    <a-form
      ref="searchFormRef"
      :label-col="{
        xs: { span: 24 },
        sm: { span: 6 },
      }"
      :wrapper-col="{
        xs: { span: 24 },
        sm: { span: 18 },
      }"
    >
      <a-row :gutter="24">
        <a-col :md="6" :sm="24">
          <a-form-item label="服务区域" name="areaid">
            <AreaFormItem placeholder="请选择区域" v-model:value="areaid" :showLevel="3" @change="onAreaChange" />
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="姓名" name="albp0003">
            <a-input v-model:value="albp0003" placeholder="" />
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="身份证号" name="albp0005">
            <a-input v-model:value="albp0005" placeholder="" />
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="性别">
            <a-select v-model:value="albp0006" @blur="changeval({ name: 'sex' })">
              <a-select-option v-for="(item, index) in sexOpt" :key="index" :value="item.value">
                <span v-text="item.label"></span>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="学历">
            <a-select v-model:value="queryParam.albp0017" @blur="changeval({ name: 'study' })">
              <a-select-option value="all">不限</a-select-option>
              <a-select-option v-for="(item, index) in studyOpt" :key="index" :value="item.value">
                <span v-text="item.label"></span>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="政治面貌">
            <a-select v-model:value="queryParam.albp0007" @blur="changeval({ name: 'polity' })">
              <a-select-option value="all">不限</a-select-option>
              <a-select-option v-for="(item, index) in polityOpt" :key="index" :value="item.value">
                <span v-text="item.label"></span>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="服务类别">
            <a-select v-model:value="queryParam.albp0021" @blur="changeval({ name: 'servicetype' })">
              <a-select-option value="all">不限</a-select-option>
              <a-select-option v-for="(item, index) in serviceOpt" :key="index" :value="item.value">
                <span v-text="item.label"></span>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="从业状况">
            <a-select v-model:value="queryParam.albp0018" @blur="changeval({ name: 'work' })">
              <a-select-option value="all">不限</a-select-option>
              <a-select-option v-for="(item, index) in workOpt" :key="index" :value="item.value">
                <span v-text="item.label"> </span>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="证件类型">
            <a-select v-model:value="queryParam.albp0004" @blur="changeval({ name: 'cardtype' })">
              <a-select-option value="all">不限</a-select-option>
              <a-select-option v-for="(item, index) in cardtypeOpt" :key="index" :value="item.value">
                <span v-text="item.label"></span>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :md="6" :sm="24" id="hastime">
          <a-form-item label="有无时长">
            <a-select v-model:value="queryParam.albp0089">
              <a-select-option value="all">不限</a-select-option>
              <a-select-option v-for="(item, index) in hastimeOpt" :key="index" :value="item.value">
                <span v-text="item.label"></span>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="星级">
            <a-select v-model:value="queryParam.albp0026">
              <a-select-option value="all">不限</a-select-option>
              <a-select-option v-for="(item, index) in hastimeOpt" :key="index" :value="item.value">
                <span v-text="item.label"> </span>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="停用/启用">
            <a-select v-model:value="queryParam.albp0090">
              <a-select-option value="all">不限</a-select-option>
              <a-select-option v-for="(item, index) in stateOpt" :key="index" :value="item.value">
                <span v-text="item.label"></span>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="年龄区间">
            <a-row type="flex" style="flex-wrap:nowrap">
              <a-col>
                <a-input @blur="changeval({ name: 'age' })" placeholder="不限" v-model:value="queryParam.minage" />
              </a-col>
              <a-col style="width:12px"> - </a-col>
              <a-col>
                <a-input @blur="changeval({ name: 'age' })" placeholder="不限" v-model:value="queryParam.maxage" />
              </a-col>
            </a-row>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24" id="servicetime">
          <a-form-item label="时长区间">
            <a-row type="flex" style="flex-wrap:nowrap">
              <a-col> <a-input @blur="changeval({ name: 'servicetime' })" placeholder="不限" v-model:value="queryParam.mintime"/></a-col>
              <a-col style="width:12px"> - </a-col>
              <a-col> <a-input @blur="changeval({ name: 'servicetime' })" placeholder="不限" v-model:value="queryParam.maxtime"/></a-col>
            </a-row>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24" style="height:60px;">
          <a-form-item label="注册时间">
            <div>
              <span>
                <a-date-picker
                  style="width:46%;"
                  v-model:value="queryParam.registmindate"
                  format="YYYY-MM-DD"
                  placeholder="开始日期"
                  :disabled-date="disabledStartDate"
                  @change="changeStartTime"
              /></span>
              <span>-</span>
              <span>
                <a-date-picker
                  style="width:46%"
                  v-model:value="queryParam.registmaxdate"
                  format="YYYY-MM-DD"
                  placeholder="结束日期"
                  :disabled-date="disabledEndDate"
                  @change="changeEndTime"
                />
              </span>
            </div>
          </a-form-item>
        </a-col>
        <a-col :md="(!advanced && 6) || 24" :sm="24">
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="getSearch">
                查询
              </a-button>
              <a-button @click="resetForm">
                重置
              </a-button>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import {
  nvsiAlbp0006, // 性别
  nvsiAlbp0017, // 本科
  nvsiAlbp0007, // 政治面貌
  nvsiAlbp0018, // 从业状况
  nvsiAlbp0004, // 证件类型
  nvsiAlbx0115, // 有 无
  nvsiAlbe0117, // 启用，停用
} from '@/utils/codevalue'
import { project } from '@/utils/codevalue/modules/project'
export default defineComponent({
  components: { DownOutlined, UpOutlined },
  setup() {
    const formOption = reactive({
      sexOpt: nvsiAlbp0006, //性别
      studyOpt: nvsiAlbp0017, // 学历
      polityOpt: nvsiAlbp0007, // 政治面貌
      serviceOpt: project.test, // 服务类别
      workOpt: nvsiAlbp0018, // 从业状况
      cardtypeOpt: nvsiAlbp0004, // 证件类型
      hastimeOpt: nvsiAlbx0115, // 有无服务时长
      stateOpt: nvsiAlbe0117, // 启用，停用
    })
    const areaid = ref()
    const queryParam = reactive({
      albp0003: '', //姓名
      albp0005: '', //身份证号
      albp0020: '', //服务区域
      albp0006: '', // 性别
      albp0017: '', // 学历
      albp0007: '', // 政治面貌
      albp0021: '', // 服务类别
      albp0018: '', // 从业状况
      albp0004: '', // 证件类型
      albp0089: '', // 有时长用户
      albp0026: '', // 星级
      albp0090: '', // 停用启用
      mintime: '', // 服务时长区间(开始)
      maxtime: '', // 服务时长区间(结束)
      minage: '', // 年龄区间(开始)
      maxage: '', // 年龄区间(结束)
      registmindate: '',
      registmaxdate: '', // 注册时间
    })
    const advanced = ref(false)
    const searchFormRef = ref()
    const showExpand = () => {
      advanced.value = !advanced.value
    }
    const disabledStartDate = (startValue) => {
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    }
    const disabledEndDate = (endValue) => {
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    }
    const changeStartTime = (value, dateString) => {
      // 日期切换
      // console.log(value, dateString);
      const s = dateString
      if (this.endValue) {
        var atime = new Date(s).getTime()
        var btime = new Date(this.endValue).getTime()
        if (atime > btime) {
          this.startValue = this.endValue
          this.endValue = s
        } else {
          this.startValue = s
        }
      } else {
        this.startValue = s
      }
    }

    const changeEndTime = (value, dateString) => {
      // 日期切换
      //	console.log(value, dateString);
      const e = dateString
      if (this.startValue) {
        var atime = new Date(this.startValue).getTime()
        var btime = new Date(e).getTime()
        if (atime > btime) {
          this.endValue = this.startValue
          this.startValue = e
        } else {
          this.endValue = e
        }
      } else {
        this.endValue = e
      }
    }
    const onAreaChange = (e) => {
      // 服务区域下拉选择
      queryParam.albx0021 = e[e.length - 1]
    }

    const resetform = () => {
      // 重置
      searchFormRef.value.resetFields()
    }
    const getSearch = () => {
      // 查询
    }
    const changeval = ({ name }) => {
      console.log(name)
    }
    return {
      ...toRefs(formOption),
      areaid,
      queryParam,
      searchFormRef,
      onAreaChange,
      disabledStartDate,
      disabledEndDate,
      changeStartTime,
      changeEndTime,
      advanced,
      resetform,
      getSearch,
      showExpand,
      changeval,
    }
  },
})
</script>

<style scoped lang="less"></style>

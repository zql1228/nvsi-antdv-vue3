<template>
  <!-- 队伍查询 -->
  <div>
    <PageFormTableWrapper>
      <template #searchForm>
        <div class="table-page-search-wrapper">
          <a-form
            ref="searchFormRef"
            :model="queryParam"
            :rules="rules"
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
                <a-form-item label="队伍名称" name="albe0002">
                  <a-input placeholder="请输入队伍名称" v-model:value="queryParam.albe0002" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="队伍编号" name="albe0041">
                  <a-input placeholder="请输入队伍编号" v-model:value="queryParam.albe0041" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="服务类别" name="albe0017">
                  <a-select v-model:value="queryParam.albe0017">
                    <a-select-option v-for="(item, index) in optionsList.albe0017List" :key="index" :value="item.codeid">{{
                      item.codevalue
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="队伍类型" name="albe0003">
                  <a-select v-model:value="queryParam.albe0003" :options="optionsList.albe0003List"> </a-select>
                </a-form-item>
              </a-col>
              <!-- <a-col :md="6" :sm="24">
                  <a-form-item label="停用/启动" name="albe0026">
                    <a-select v-model:value="queryParam.albe0026" :options="optionsList.albe0026List"> </a-select>
                  </a-form-item>
                </a-col> -->
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="有无时长" name="albe0069">
                  <a-select v-model:value="queryParam.albe0069" :options="optionsList.albe0069List"> </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="队伍人数" name="albe0056">
                  <a-row class="my_input js-input-width" type="flex" style="flex-wrap: nowrap">
                    <a-col>
                      <a-input
                        v-model:value="queryParam.albe0056Start"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        onafterpaste="value=value.replace(/[^\d]/g,'')"
                      />
                    </a-col>
                    <a-col>
                      <img style="position: relative; top: 6px" src="@/assets/img/workBenchImg/date.png" alt="" />
                    </a-col>
                    <a-col>
                      <a-input
                        v-model:value="queryParam.albe0056End"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        onafterpaste="value=value.replace(/[^\d]/g,'')"
                      />
                    </a-col>
                  </a-row>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item label="时长区间" name="albe0069">
                  <a-row class="my_input js-input-width" type="flex" style="flex-wrap: nowrap">
                    <a-col>
                      <a-input
                        style="display: inline-block"
                        v-model:value="queryParam.albe0069Start"
                        onkeyup="value= value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''"
                      />
                    </a-col>
                    <a-col>
                      <img style="position: relative; top: 6px" src="@/assets/img/workBenchImg/date.png" alt="" />
                    </a-col>
                    <a-col>
                      <a-input
                        style="display: inline-block"
                        v-model:value="queryParam.albe0069End"
                        onkeyup="value= value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''"
                      />
                    </a-col>
                  </a-row>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item name="albe0046Start" label="注册时间">
                  <a-date-picker
                    :disabled-date="disabledDate"
                    v-model:value="queryParam.albe0046Start"
                    style="width: 100%"
                    placeholder="最早注册日期"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-show="advanced">
                <a-form-item name="albe0046End" label="注册时间">
                  <a-date-picker
                    :disabled-date="disabledDate"
                    v-model:value="queryParam.albe0046End"
                    style="width: 100%"
                    placeholder="最晚注册日期"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="(!advanced && 6) || 24" :sm="24">
                <a-form-item>
                  <a-space>
                    <a-button type="primary" @click="refresh"> 查询 </a-button>
                    <a-button @click="resetForm"> 重置 </a-button>
                    <a @click="showExpand" style="margin-left: 8px">
                      {{ advanced ? '收起筛选' : '展开筛选' }}
                      <UpOutlined v-if="advanced" />
                      <DownOutlined v-if="!advanced" />
                    </a>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </template>
      <template #table>
        <a-tabs type="card" v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="正常">
            <NationalTeamQueryTable ref="table1" :queryParam="queryParam" activeKey="1">
              <template #action="record">
                <a-space>
                  <a-button size="small" @click="edit(record.record)" disabled> 修改信息 </a-button>
                  <a-button type="primary" size="small" @click="handleEdit(record.record, 0)" disabled>
                    {{ record.record.albe0026 == 1 ? '停用队伍' : record.record.albe0026 == 3 ? '启用队伍' : '状态不符' }}
                  </a-button>
                  <!-- :disabled="record.record.albe0026 != 1 && record.record.albe0026 != 3" -->
                </a-space>
              </template>
            </NationalTeamQueryTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="未审核">
            <NationalTeamQueryTable ref="table2" :queryParam="queryParam" activeKey="2">
              <template #action="record">
                <a-space>
                  <a-button size="small" @click="edit(record.record)" disabled> 修改信息 </a-button>
                  <a-button type="primary" size="small" @click="handleEdit(record.record)" disabled>
                    {{ record.record.albe0026 == 1 ? '停用队伍' : record.record.albe0026 == 3 ? '启用队伍' : '状态不符' }}
                  </a-button>
                </a-space>
              </template>
            </NationalTeamQueryTable>
          </a-tab-pane>
          <a-tab-pane key="3" tab="已停用">
            <NationalTeamQueryTable ref="table3" :queryParam="queryParam" activeKey="3">
              <template #action="record">
                <a-space>
                  <!-- <a-button size="small" @click="edit(record.record)" disabled>
                    修改信息
                  </a-button> -->
                  <a-button type="primary" size="small" @click="handleEdit(record.record, 1)" disabled>
                    {{ record.record.albe0026 == 1 ? '停用队伍' : record.record.albe0026 == 3 ? '仅启用队伍' : '状态不符' }}
                  </a-button>
                  <!-- :disabled="record.record.albe0026 != 1 && record.record.albe0026 != 3" -->
                  <a-button type="primary" size="small" @click="handleEdit(record.record, 2)" disabled>
                    {{ record.record.albe0026 == 1 ? '停用队伍' : record.record.albe0026 == 3 ? '启用队伍和项目' : '状态不符' }}
                  </a-button>
                  <!-- :disabled="record.record.albe0026 != 1 && record.record.albe0026 != 3" -->
                </a-space>
              </template>
            </NationalTeamQueryTable>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
    <TeamQueryDrawer :visible="drawerData.visible" :item="drawerData.item" :activeKey="activeKey" @child="onClose1"></TeamQueryDrawer>
    <modal
      :visible="modelData.visible"
      :item="modelData.item"
      :title="modelData.title"
      :content="modelData.content"
      :activeKey="activeKey"
      :type="modelData.type"
      @child="onClose2"
    ></modal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, nextTick, watch } from 'vue'
import NationalTeamQueryTable from './table/NationalTeamQueryTable.vue'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import TeamQueryDrawer from './drawer/TeamQueryDrawer'
import modal from './modal/modal'
import { redDate, checktime2, addDays } from '@/utils/publicMethods/common'
import moment from 'moment'
import {
  nvsiAlbp0039, //服务类别
  nvsiAlbe0003, //队伍类型
} from '@/utils/codevalue'
export default defineComponent({
  components: { DownOutlined, UpOutlined, NationalTeamQueryTable, modal, TeamQueryDrawer },
  setup() {
    const activeKey = ref('1')
    const table1 = ref()
    const table2 = ref()
    const table3 = ref()
    const userInfo = ref(LocalGetUserInfo())
    const advanced = ref(false)
    const queryParam = reactive({
      areaid: [], //服务区域
      albe0002: '', // 队伍名称
      albe0041: '', //队伍编号
      albe0017: '', //服务类别
      albe0003: '', //队伍类型
      // albe0026: '', //停用/启用
      albe0069: '', //有无时长
      albe0056Start: '', //队伍人数 最小
      albe0056End: '', //队伍人数 最大
      albe0069Start: '', //时长区间 时长最小
      albe0069End: '', //时长区间 时长最大
      albe0046Start: null, //最小日期
      albe0046End: null, //最大日期
    })
    const optionsList = reactive({
      albe0017List: [],
      albe0003List: [],
      albe0026List: [
        { label: '不限', value: '' },
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ], //停用启用
      albe0069List: [
        { label: '不限', value: '' },
        { label: '无时长', value: '0' },
        { label: '有时长', value: '1' },
      ], //时长
    })
    optionsList.albe0003List = JSON.parse(JSON.stringify(nvsiAlbe0003))
    optionsList.albe0003List.unshift({ label: '不限', value: '' })
    const searchFormRef = ref()
    const TeamQuerytable = ref()
    const drawerData = reactive({
      //修改按钮弹窗参数
      visible: false,
      item: {},
    })

    const modelData = reactive({
      //停用启用按钮对话框参数
      visible: false,
      item: {},
      title: '',
      content: '',
      type: 1, //1仅对队伍进行操作 2对队伍和其所属项目进行操作
    })

    onMounted(() => {
      getServiceTypeListFortis()
    })

    const getServiceTypeListFortis = async () => {
      const res = await apis.getCodeValue('lbe05', 'getAllCodeFortis', { codeTypeName: 'lbe05', areaid: userInfo.value.areaid })
      if (res.code == 0) {
        optionsList.albe0017List = [{ codevalue: '不限', codeid: '' }, ...res.data]
      }
    }

    const disabledDate = (current) => {
      //时间不能选今天之前
      return current && current >= moment(moment(new Date()).format('YYYY-MM-DD')).endOf('day')
    }

    const handleEdit = (record, type) => {
      //停用启用 按钮
      modelData.type = type
      modelData.item = record
      modelData.title = type == 0 ? '停用队伍' : type == 1 ? '仅启用队伍' : '启用队伍和项目'
      modelData.content =
        type == 0
          ? '是否确认停用此队伍，停用后次队伍将不在前台显示，队伍账户无法登录，此队伍所有的项目也将全部停用，是否确认停用'
          : type == 1
          ? '仅启用队伍，则该队伍恢复正常可继续开展志愿服务，已停用的项目仍处于停用状态。请确认是否启用'
          : '启用队伍和项目后，该队伍以及关联的所有被停用的项目将全部启用恢复正常。请确认是否启用'
      modelData.visible = true
    }

    const edit = (record) => {
      //修改按钮
      drawerData.item = record
      drawerData.visible = true
    }
    const onClose1 = (bool, activeKey) => {
      drawerData.visible = false
      if (bool) {
        //为true 说明有数据变化 需刷新列表
        activeKey == 1 ? table1.value.getList(false) : activeKey == 2 ? table2.value.getList(false) : table3.value.getList(false)
      }
    }

    const onClose2 = (bool) => {
      modelData.visible = false
      if (bool) {
        //为true 说明有数据变化 需刷新列表
        if (activeKey.value == 1) {
          table1.value.getList('delete')
          table3.value ? table3.value.getList(false) : ''
        } else {
          table3.value.getList('delete')
          table1.value.getList(false)
        }
      }
    }

    const refresh = () => {
      //查询按钮
      searchFormRef.value.validate().then(() => {
        activeKey.value == 1 ? table1.value.getList(true) : activeKey.value == 2 ? table2.value.getList(true) : table3.value.getList(true)
      })
    }

    const resetForm = () => {
      //重置
      searchFormRef.value.resetFields()
      queryParam.albe0056Start = ''
      queryParam.albe0056End = ''
      queryParam.albe0069Start = ''
      queryParam.albe0069End = ''
      activeKey.value == 1 ? table1.value.getList(true) : activeKey.value == 2 ? table2.value.getList(true) : table3.value.getList(true)
    }

    const showExpand = () => {
      //展开或收起筛选区域 调用表格高度自适应方法
      advanced.value = !advanced.value
      nextTick(() => {
        activeKey.value == 1 ? table1.value.getheight() : activeKey.value == 2 ? table2.value.getheight() : table3.value.getheight()
      })
    }

    watch(
      () => activeKey.value,
      (activeKey) => {
        nextTick(() => {
          activeKey == 1 ? table1.value.getheight() : activeKey == 2 ? table2.value.getheight() : table3.value.getheight()
        })
      }
    )

    const checkperson = async (rule, value) => {
      //人数区间校验
      if (queryParam.albe0056Start && queryParam.albe0056End && queryParam.albe0056End - queryParam.albe0056Start < 0) {
        return Promise.reject('最大人数不能小于最小人数')
      } else {
        return Promise.resolve()
      }
    }
    const checktime = async (rule, value) => {
      //人数区间校验
      if (queryParam.albe0069Start && queryParam.albe0069End && queryParam.albe0069End - queryParam.albe0069Start < 0) {
        return Promise.reject('最大时长不能小于最小时长')
      } else {
        return Promise.resolve()
      }
    }
    const checkmaxDay = async (rule, value) => {
      //队伍注册时间校验
      if (
        queryParam.albe0046Start &&
        queryParam.albe0046End &&
        checktime2(moment(new Date(queryParam.albe0046End)).format('YYYY-MM-DD'), moment(new Date(queryParam.albe0046Start)).format('YYYY-MM-DD'))
      ) {
        return Promise.reject('最晚注册时间不能早于注册最早时间')
      } else {
        return Promise.resolve()
      }
    }

    const rules = reactive({
      albe0056: [{ required: false, validator: checkperson }], //人数区间
      albe0069: [{ required: false, validator: checktime }], //时长区间
      albe0046End: [{ required: false, validator: checkmaxDay }], //注册时间
    })

    return {
      drawerData,
      modelData,
      activeKey,
      table1,
      table2,
      table3,
      optionsList,
      searchFormRef,
      TeamQuerytable,
      advanced,
      // 查询参数
      queryParam,
      resetForm,
      disabledDate,
      refresh,
      rules,
      showExpand,
      onClose1,
      onClose2,
      edit,
      handleEdit,
    }
  },
})
</script>

<style scoped lang="less"></style>

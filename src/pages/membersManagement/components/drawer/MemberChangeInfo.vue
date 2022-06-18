<template>
  <a-drawer
    title="修改队伍成员信息"
    :headerStyle="{ fontWeight: 800 }"
    :bodyStyle="{ padding: '12px' }"
    placement="right"
    :visible="visible"
    :maskClosable="false"
    @close="onClose(false)"
    width="800px"
  >
    <a-radio-group style="width: 100%; text-align: center" v-model:value="radioTab" button-style="solid">
      <a-radio-button value="1" style="width: 50%; text-align: center" @click="changeTab(1)"> 修改信息 </a-radio-button>
      <a-radio-button value="2" style="width: 50%; text-align: center" @click="changeTab(2)"> 操作记录 </a-radio-button>
    </a-radio-group>
    <div style="border-bottom: 1px solid #ccc"></div>
    <div v-show="radioTab == 1" style="margin-top: 10px">
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="志愿者姓名">
              <span>{{ memberRecord.albp0003 ? memberRecord.albp0003 : '' }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="原手机号码">
              <span>{{ memberRecord.albp0010 ? memberRecord.albp0010 : '' }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="修改手机号码">
              <a-input type="tel" :maxLength="11" style="width: 40%" v-model:value="phone" @blur="onBlur" />
              <div id="phoneTip"></div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-row :gutter="24"> </a-row>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          borderTop: '1px solid #e6e6e6',
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }"
      >
        <a-row type="flex" justify="space-around">
          <a-col>
            <a-button @click="onClose(false)">取消</a-button>
          </a-col>
          <a-col>
            <a-button type="primary" @click="confirmPhone">确认修改</a-button>
          </a-col>
        </a-row>
      </div>
    </div>
    <div v-show="radioTab == 2">
      <a-table :pagination="false" :columns="columns" :data-source="operationRecord" :rowKey="(record) => record.id">
        <template #action="{ record }">
          <a-button type="primary" @click="showChildrenDrawer(record)">详情</a-button>
          <a-drawer title="操作记录详情" width="30%" :maskClosable="false" :visible="childrenDrawer" @close="childClose">
            <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
              <a-row>
                <a-col :span="24">
                  <a-form-item label="手机号码">
                    <a-input style="width: 200px" disabled v-model:value="operationChildRecord.albe2504" />
                  </a-form-item>
                </a-col>
                <a-col :offset="6" :span="12"><DownOutlined /></a-col>
                <a-col :offset="5" :span="19">
                  <a-form-item>
                    <a-input style="width: 200px" disabled v-model:value="operationChildRecord.albe2505" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-drawer>
        </template>
      </a-table>
      <!-- <div
        :style="{
          position: 'absolute',
          bottom: '0',
          width: '100%',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderTop: '1px solid #e6e6e6',
          borderRadius: '0 0 4px 4px',
        }"
      >
        <a-pagination v-model:current="pagination.current" v-model:pageSize="pagination.pageSize" :total="pagination.total" :showTotal="pagination.showTotal" @change="changePagination" />
      </div> -->
    </div>
  </a-drawer>
</template>
<script>
import VueTypes from 'vue-types'
import { Modal, message } from 'ant-design-vue'
import { defineComponent, reactive, ref, toRefs, watch, nextTick } from 'vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
import { changInfoCom } from '../tables/table'
import { checkPhone, forTips } from '../tables/hasSelected'
import { DownOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  name: 'MemberChangeInfo',
  props: { visible: VueTypes.bool.required, memberRecord: {} },
  components: { DownOutlined },
  setup(props, { emit }) {
    const userInfo = ref(LocalGetUserInfo())
    const radioTab = ref('1')
    const columns = ref(changInfoCom.columns)
    const operationRecord = ref()
    const selectedRowKeys = ref([])
    const phone = ref()
    const childrenDrawer = ref(false)
    const operationChildRecord = reactive({
      albe2504: '',
      albe2504: '',
    })
    const count = ref(1)
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      showTotal: (total, range) => `共${total}条，当前显示${range[0]}~${range[1]}`,
    })
    const onClose = (val) => {
      phone.value = ''
      emit('addInfo', val)
    }
    const showChildrenDrawer = (record) => {
      // console.log(record, '滑出操作记录详情record')
      apis.getOperationRecordInfoFortis({ id: record.id }).then((res) => {
        // console.log(res, '滑出操作记录详情返回')
        if (res.code == 0 && res.data) {
          operationChildRecord.albe2504 = res.data.albe2504.phone
          operationChildRecord.albe2505 = res.data.albe2505.phone
          childrenDrawer.value = true
        }
      })
    }
    const changeTab = (tab) => {
      // 修改信息 操作记录切换
      radioTab.value = tab
    }
    const onBlur = () => {
      if (checkPhone(phone.value)) {
        return true
      } else {
        return false
      }
    }
    const confirmPhone = () => {
      // 点击确认修改
      if (count.value == 1) {
        count.value++
        if (checkPhone(phone.value)) {
          const params = {
            id: props.memberRecord.id,
            albp0005: props.memberRecord.albp0005, // 志愿者身份证号
            fullName: userInfo.value.fullName, // 当前登陆队伍的用户名
            userid: userInfo.value.team.groupid, // 当前登录队伍的id
            oldPhone: props.memberRecord.albp0010,
            newPhone: phone.value,
          }
          console.log(params, '修改手机号入参')
          apis.updateTeamVolPhoneFortis(params).then((res) => {
            console.log(res, '修改手机号返回')
            if (res == '成功') {
              message.success('修改成功')
              onClose(true)
            } else {
              message.error('修改失败')
              onClose(false)
            }
          })
        }
      }
    }
    const getRecord = () => {
      const params = {
        pageSize: 10,
        pageNum: 1,
        id: props.memberRecord.id, // 志愿者id
      }
      //console.log(params, '操作记录查询入参')
      apis.queryOperationRecordFortis(params).then((res) => {
        //console.log(res, '操作记录查询返回')
        if (res) {
          operationRecord.value = res
          // pagination.totla = res.totalCount
        }
      })
    }
    const childClose = () => {
      operationChildRecord.albe2504 = ''
      operationChildRecord.albe2505 = ''
      childrenDrawer.value = false
    }
    const changePagination = (pageNumber) => {
      pagination.current = pageNumber
      onSearch(1)
    }
    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          nextTick(() => {
            radioTab.value = '1'
            phone.value = ''
            count.value = 1
            getRecord()
          })
        } else {
          phone.value = ''
          forTips('phoneTip', '')
        }
      }
    )
    return {
      radioTab,
      phone,
      selectedRowKeys,
      // 操作记录
      operationRecord,
      operationChildRecord,
      ...toRefs(props),
      columns,
      confirmPhone,
      onClose,
      childClose,
      changeTab,
      onBlur,
      showChildrenDrawer,
      childrenDrawer,
      pagination,
      changePagination,
    }
  },
})
</script>

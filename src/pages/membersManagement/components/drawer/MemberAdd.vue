<!-- 批量添加成员 -->
<template>
  <a-drawer
    title="添加队伍成员"
    :headerStyle="{ fontWeight: 800 }"
    :bodyStyle="{
      padding: '12px',
    }"
    placement="right"
    :visible="visible"
    :maskClosable="false"
    @close="onClose(false)"
    width="800px"
  >
    <a-spin :spinning="spinning">
      <div class="memberadd_from">
        <BasicSearchForm>
          <a-form
            ref="searchFormRef"
            :rules="{
              volcardno: [{ validator: validatePass, trigger: 'blur' }],
            }"
            :model="queryParam"
            :label-col="{
              xs: { span: 24 },
              sm: { span: 6 },
            }"
            :wrapper-col="{
              xs: { span: 24 },
              sm: { span: 18 },
            }"
          >
            <div style="color: #d92f2f">批量添加：可陆续输入身份证查询并勾选志愿者</div>
            <a-row :gutter="24">
              <a-col :md="12" :sm="24">
                <a-form-item label="身份证号码" name="volcardno">
                  <a-input
                    placeholder="请输入身份证号搜索"
                    v-model:value="queryParam.volcardno"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'').slice(0,18)"
                  />
                  <!-- @change="changeCard(queryParam.volcardno)" -->
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item>
                  <a-space>
                    <a-button type="primary" @click="searchVol"> 查询 </a-button>
                    <a-button @click="resetForm"> 重置 </a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </BasicSearchForm>
        <div class="table-page-search-wrapper">
          <a-row type="flex" justify="space-between" style="margin: 10px 0">
            <a-col :span="4">
              <span style="font-size: 16px"> 已选择: {{ selectedRowKeys.length }} / 50人 </span>
            </a-col>
          </a-row>
        </div>
      </div>
      <a-table
        :pagination="pagination"
        :columns="columns"
        ref="addTable"
        :data-source="dataSource"
        :rowKey="(record) => record.albp0005"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :scroll="{ y: addHeight }"
      >
        <template #serial="{ index }">
          {{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}
        </template>
      </a-table>
    </a-spin>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button type="primary" :disabled="isdisabled" @click="addDuration"> 开始添加 </a-button>
    </div>
  </a-drawer>
</template>

<script>
import VueTypes from 'vue-types'
import { MinusCircleOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive, ref, toRefs, watch, onMounted, nextTick } from 'vue'
import apis from '@/server/request'
import { checkCardNo } from '@/utils/publicMethods/common'
import { message, Modal } from 'ant-design-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { addMemberCom } from '../tables/table'
// props, { attrs, emit, slots, expose }
export default defineComponent({
  name: 'MemberAdd',
  components: { MinusCircleOutlined },
  props: { visible: VueTypes.bool.required },
  setup(props, { emit }) {
    const state = reactive({
      loading: false,
      queryParam: { volcardno: '' },
    })
    const dataSource = ref([])
    dataSource.value = []
    const userInfo = ref(LocalGetUserInfo())
    const columns = ref(addMemberCom.columns)
    const searchFormRef = ref()
    const selectedRowKeys = ref()
    selectedRowKeys.value = []
    const selectedRows = ref()
    selectedRows.value = []
    const isdisabled = ref(true)
    const addTable = ref()
    const addHeight = ref(500)
    const spinning = ref(false)
    let pagination = reactive({
      pageSize: 10,
      current: 1,
      total: 0,
      showLessItems: true,
      showTotal: (total) => `共${total}条`,
      onChange: (pageNumber) => {
        addTable.value.pagination.current = pageNumber
      },
    })
    const searchVol = () => {
      searchFormRef.value
        .validate()
        .then(() => {
          const bean = {
            id: userInfo.value.team.groupid,
            areaId: userInfo.value.areaid,
            idCard: state.queryParam.volcardno,
          }
          apis.getAndCheckTeamNumberFortis(bean).then((res) => {
            // console.log(res)
            if (res.code == 0 && res.data) {
              if (dataSource.value.length == 0) {
                dataSource.value.push({ albp0003: res.data.albp0003, albp0005: res.data.albp0005 })
                pagination.total = dataSource.value.length
              } else {
                if (
                  dataSource.value.every((e) => {
                    return e.albp0005 != res.data.albp0005
                  })
                ) {
                  dataSource.value.unshift({ albp0003: res.data.albp0003, albp0005: res.data.albp0005 })
                  pagination.total = dataSource.value.length
                } else {
                  message.warning('下方列表中已存在该志愿者')
                }
              }
            } else {
              message.warning(res.message)
            }
          })
        })
        .catch((e) => {})
    }
    const onSelectChange = (RowKeys, Rows) => {
      selectedRowKeys.value = RowKeys
      selectedRows.value = Rows
      selectedRows.value.length > 0 ? (isdisabled.value = false) : (isdisabled.value = true)
    }
    const onClose = (val) => {
      emit('addInfo', val)
    }
    // 开始添加
    const addDuration = () => {
      isdisabled.value = true
      spinning.value = true
      const params = {
        id: userInfo.value.team.groupid,
        areaid: userInfo.value.areaid,
        entityBeans: [],
      }
      if (selectedRows.value.length > 50) {
        Modal.info({ title: '一次最多可以添加50条' })
        return
      }
      selectedRows.value.forEach((item) => {
        params.entityBeans.push({
          id: item.id,
          albp0029: item.albp0029,
          cardno: item.albp0005,
        })
      })
      apis
        .addManyTeamMember(params)
        .then((res) => {
          if (res) {
            if (res.existlist.length > 0 && res.invitelist.length > 0) {
              message.warning(`${res.existlist.join('、')}已存在队伍中,${res.invitelist.join('、')}正在审核中，不能加入`)
            } else if (res.existlist.length > 0) {
              message.warning(res.existlist.join('、') + '已存在队伍中')
            } else if (res.invitelist.length > 0) {
              message.warning(res.invitelist.join('、') + '正在审核中，不能加入')
            } else {
              message.success('添加成功')
            }
            onClose(true)
          } else {
            message.error('添加失败!')
          }
        })
        .finally(() => {
          spinning.value = false
        })
    }
    let validatePass = async (rule, value) => {
      if (!value) {
        return Promise.reject('身份证号不能为空')
      } else {
        if (checkCardNo(value)) {
          return Promise.resolve()
        } else {
          return Promise.reject('身份证号格式输入不正确')
        }
      }
    }
    const resetForm = () => {
      searchFormRef.value.resetFields()
    }
    onMounted(() => {
      // addHeight.value =
      //   937 - (document.getElementById('memberadd_from').clientHeight + document.getElementById('memberadd_div').clientHeight + 55 + 53)
    })

    const setAddHeight = () => {
      setTimeout(() => {
        addHeight.value =
          window.innerHeight -
          (document.querySelector('.memberadd_from').clientHeight + 24 + document.querySelector('.ant-drawer-header').clientHeight + 53 * 2 + 64)
      }, 100)
    }
    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          nextTick(() => {
            props.visible && setAddHeight()
          })
        } else {
          dataSource.value = []
          pagination.current = 1
          pagination.total = 0
          selectedRowKeys.value = []
          selectedRows.value = []
          state.queryParam.volcardno = ''
          isdisabled.value = true
          searchFormRef.value.clearValidate()
        }
      }
    )
    return {
      ...toRefs(state),
      searchFormRef,
      addTable,
      addHeight,
      spinning,
      resetForm,
      searchVol,
      isdisabled,
      dataSource,
      columns,
      onClose,
      addDuration,
      selectedRowKeys,
      onSelectChange,
      validatePass,
      pagination,
    }
  },
})
</script>
<style lang="less" scoped>
.ant-table td {
  white-space: nowrap;
}
</style>

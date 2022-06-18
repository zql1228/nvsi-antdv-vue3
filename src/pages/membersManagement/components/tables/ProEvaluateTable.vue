<template>
  <div>
    <IATable
      serviceName="projectEvaluationListFortis"
      :searchParameter="searchVol"
      size="middle"
      ref="Evaluationtable"
      :rowKey="(record) => record.id"
      :columns="columns"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    >
      <template #total-title="{totalData}">
        查询合计：
        <span v-if="tabKey == '1'">未评价</span>
        <span v-else>已评价</span>
        <span>
          {{ totalData.totals }}
        </span>
        人。
      </template>
      <template #name="{text,record}">
        <a href="javascript:void(0)" @click="toVolInfo(record)">{{ text }}</a>
      </template>
      <template #albp0006="{text}">
        {{ text == 0 ? '女' : '男' }}
      </template>
      <template #action="{record}">
        <a-space>
          <a-button size="small" type="primary" v-show="tabKey == '1'" @click="showEvalution(record)">
            填写评价
          </a-button>
          <a-button size="small" type="primary" v-show="tabKey == '2'" @click="showUpdateEvalution(record)">
            修改评价
          </a-button>
          <a-button size="small" type="primary" v-show="tabKey == '2'" ghost @click="deleteEvalution(record)">
            删除评价
          </a-button>
        </a-space>
      </template>
    </IATable>
    <EvaluteDrawer :visible="evaluatevisible" :item="evaluateitem" @closeDrawer="closeEvaluteDrawer"></EvaluteDrawer>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch } from 'vue'
import { proMenberCom } from './table.js'
import { LocalSetVolunteerInfo } from '@/utils/localStorage.js'
import { Modal, message } from 'ant-design-vue'
import apis from '@/server/request'
import EvaluteDrawer from '../drawer/EvaluteDrawer'
export default defineComponent({
  props: {
    tabKey: {
      type: String,
    },
    item: { type: Object },
    queryParam: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    EvaluteDrawer,
  },
  setup(props) {
    const columns = ref(proMenberCom.columns3)
    const Evaluationtable = ref()
    const visibles = reactive({
      evaluatevisible: false,
      evaluateitem: {},
    })

    const queryParam = reactive({
      //邀请队伍外成员加入队伍的查询条件
      station: '',
      albx0072: '',
      albp0003: '',
    })
    const selectedRowKeys = ref()
    selectedRowKeys.value = []
    const selectedRows = ref()
    selectedRows.vlaue = []
    const searchVol = () => {
      // console.log(props, '============================')
      const params = {
        pageNum: 1,
        pageSize: 12,
        areaid: props.item.albx0021, //项目区划
        proId: props.item.id, //项目
        albx0052: queryParam.station ? queryParam.station : props.item.selectStationList[0].id,
        type: props.tabKey,
        volname: queryParam.albp0003,
      }
      return params
    }
    const getList = (obj) => {
      queryParam.albp0003 = obj.albp0003
      queryParam.station = obj.station.value
      queryParam.albx0072 = obj.albx0072
      Evaluationtable.value.refresh()
    }
    const deleteEvalution = (record) => {
      //删除评价
      if (record) {
        Modal.confirm({
          title: '是否确认删除此条评价',
          cancelText: '取消',
          okText: '确认',
          onOk: () => {
            apis.delEvaluationVolFortis({ proId: props.item.id, areaid: props.item.albx0021, list: [{ albp0029: record.albx0053 }] }).then((res) => {
              if (res) {
                message.success(res)
                Evaluationtable.value.refresh()
              }
            })
          },
        })
      } else {
        if (selectedRowKeys.value.length > 0) {
          Modal.confirm({
            title: '是否确认删除此条评价',
            cancelText: '取消',
            okText: '确认',
            onOk: () => {
              let list = []
              selectedRows.value.forEach((e) => {
                list.push({ albp0029: e.albx0053 })
              })
              apis.delEvaluationVolFortis({ proId: props.item.id, areaid: props.item.albx0021, list: list }).then((res) => {
                if (res) {
                  message.success(res)
                  Evaluationtable.value.refresh()
                }
              })
            },
          })
        } else {
          Modal.warning({
            title: '请勾选你需要批量删除评价的志愿者，点击志愿者名称左侧按钮即可勾选',
            okText: '关闭',
          })
        }
      }
    }
    const onSelectChange = (selectedKeys, Rows) => {
      selectedRowKeys.value = selectedKeys
      selectedRows.value = Rows
    }
    const showEvalution = (record) => {
      //打开填写评价抽屉
      if (record && record.albx0083) {
        if (record.albx0083 * 1 == 0) {
          Modal.info({
            title: '此志愿者无项目时长，无法评价',
            okText: '确定',
          })
        } else {
          visibles.evaluateitem = record
          visibles.evaluateitem.item = props.item
          visibles.evaluateitem.isshow = 2
          visibles.evaluateitem.tabKey = props.tabKey
          visibles.evaluatevisible = true
        }
      } else {
        if (selectedRowKeys.value.length > 0) {
          if (
            selectedRows.value.some((e) => {
              return e.albx0083 * 1 == 0
            })
          ) {
            Modal.info({
              title: '选择的志愿者中有志愿者无项目时长，无法评价',
              okText: '确定',
            })
          } else {
            visibles.evaluateitem.record = selectedRows.value
            visibles.evaluateitem.item = props.item
            visibles.evaluateitem.isshow = 1
            visibles.evaluateitem.tabKey = props.tabKey
            visibles.evaluatevisible = true
          }
        } else {
          Modal.warning({
            title: '请勾选你需要批量同意的志愿者，点击志愿者名称左侧按钮即可勾选',
            okText: '关闭',
          })
        }
      }
    }
    //修改评价
    const showUpdateEvalution = (record) => {
      apis
        .projectEvaluationDetailsFortis({
          proId: props.item.id, ///项目id
          albp0029: record.albx0053, //志愿者编号
        })
        .then((res) => {
          console.log(res, '修改评价详情/////////////')
          if (res) {
            visibles.evaluateitem = res
            visibles.evaluateitem.item = props.item
            visibles.evaluateitem.isshow = 2
            visibles.evaluateitem.tabKey = props.tabKey
            visibles.evaluatevisible = true
          }
        })
    }
    const toVolInfo = (record) => {
      LocalSetVolunteerInfo(record)
      setTimeout(() => {
        router.push({ path: '/volunteerDetails' })
      }, 1000)
    }
    watch(
      () => props.tabKey,
      () => {}
    )
    const closeEvaluteDrawer = (bool) => {
      //关闭填写评价
      visibles.evaluatevisible = false
      selectedRowKeys.value = []
      selectedRows.value = []
      if (bool) {
        Evaluationtable.value.refresh()
      }
    }
    return {
      columns,
      ...toRefs(props),
      searchVol,
      getList,
      queryParam,
      ...toRefs(visibles),
      onSelectChange,
      Evaluationtable,
      selectedRowKeys,
      deleteEvalution,
      showEvalution,
      showUpdateEvalution,
      closeEvaluteDrawer,
      toVolInfo,
    }
  },
})
</script>

<style scoped lang="less"></style>

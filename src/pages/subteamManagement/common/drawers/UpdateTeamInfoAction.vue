<template>
  <!-- 操作记录详情--drawer -->
  <IATable
    serviceName="queryOperationRecordFortis"
    :searchParameter="searchFunc"
    ref="teamActionTable"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="columns"
  >
    <template #action="{ record }">
      <a-space>
        <a-button type="primary" size="small" @click="getViewUpdateDatails(record)"> 详情 </a-button>
      </a-space>
    </template>
  </IATable>
  <a-drawer title="操作记录详情" :maskClosable="false" :visible="actionVisible" @close="onClose" width="600" class="drawerContent" placement="right">
    <div>
      <a-row :gutter="24" v-for="(item, index) in fieldValueArr" v-show="item.oldValue !== item.newValue" :class="index == 1 ? '' : 'aRowList'">
        <span class="filedTitle">{{ item.name }}</span>
        <a-col :md="24" :sm="24" style="margin-top: 10px"
          ><span>修改前：</span> <a-input type="text" :value="item.oldValue" disabled></a-input
        ></a-col>
        <a-col :md="24" :sm="24" style="margin-top: 10px"><span>修改后：</span><a-input type="text" :value="item.newValue" disabled></a-input></a-col>
      </a-row>
    </div>
    <a-row>
      <a-col :md="24" :sm="24">
        <div style="font-size: 19px; font-weight: 600; margin-top: 30px">
          <span>附件</span>
        </div>
        <div v-show="actionDetails.albe2508" style="margin-top: 10px; border-bottom: 1px solid #000">
          <div style="width: 100%; display: flex; justify-content: space-between">
            <div style="width: 90%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ actionDetails.albe2508.name }}</div>
            <a @click.prevent="downloadImg">下载</a>
            <a ref="download" download v-show="false" href="#"></a>
          </div>
          <!-- <img style="width:150px;height:150px" :src="actionDetails.imageUrl" alt="修改证明" /> -->
        </div>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch } from 'vue'
import moment from 'moment'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
import { isJSON } from '@/utils/util'
const columns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 50,
    align: 'center',
  },
  {
    title: '修改人',
    dataIndex: 'albe2501',
    key: 'albe2501',
    ellipsis: true,
  },
  {
    title: '修改时间',
    dataIndex: 'albe2502',
    key: 'albe2502',
    customRender: ({ text }) => {
      return text
      // return moment(text).format('YYYY-MM-DD')
    },
    slots: { customRender: 'albe2502' },
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    slots: {
      customRender: 'action',
    },
    width: 180,
  },
]

export default defineComponent({
  props: {
    teamId: {
      type: String,
    },
  },
  setup(props) {
    const actionVisible = ref(false)
    const teamActionTable = ref()
    const actionDetails = reactive({
      oldValue: {},
      newValue: {},
      albe2508: '',
      imageUrl: '',
    })
    const fieldValueArr = reactive([
      {
        name: '队伍名称',
        filed: 'albe0002',
        oldValue: '',
        newValue: '',
      },
      {
        name: '联系人姓名',
        filed: 'albe0018',
        oldValue: '',
        newValue: '',
      },
      {
        name: '联系人手机',
        filed: 'albe0019',
        oldValue: '',
        newValue: '',
      },
      {
        name: '负责人姓名',
        filed: 'albe0022',
        oldValue: '',
        newValue: '',
      },
      {
        name: '负责人手机',
        filed: 'albe0024',
        oldValue: '',
        newValue: '',
      },
      {
        name: '联系人邮箱',
        filed: 'albe0049',
        oldValue: '',
        newValue: '',
      },
    ])
    const download = ref()

    const searchFunc = () => {
      const { teamId } = props
      return {
        id: teamId,
      }
    }
    watch(
      () => props.teamId,
      () => {
        teamActionTable.value.refresh(true)
      }
    )
    const onClose = () => {
      actionVisible.value = false
      actionDetails.oldValue = {}
      actionDetails.newValue = {}
      actionDetails.albe2508 = ''
      actionDetails.imageUrl = ''
    }
    const downloadImg = async () => {
      if (actionDetails.albe2508) {
        const res = await apis.downloadFortisLogic(actionDetails.albe2508)
        if (res.code == '0') {
          download.value.href = res.data
          download.value.click()
        } else {
          message.warning(res.message)
        }
      }
    }
    const dealUpdateDoc = () => {
      if (actionDetails.albe2508) {
        apis
          .downloadFortisLogic(actionDetails.albe2508)
          .then((res) => {
            if (res.code == '0') {
              actionDetails.imageUrl = res.data
            } else {
              message.warning(res.message)
            }
          })
          .catch((e) => {
            console.log(e, '修改证明下载失败')
   
          })
      }
    }
    const dealActionValue = () => {
      // 暂时这么处理 比对字段
      fieldValueArr.forEach((item) => {
        item.oldValue = actionDetails.oldValue[item.filed] || ''
        item.newValue = actionDetails.newValue[item.filed] || ''
      })
  
    }
    const getViewUpdateDatails = async (record) => {
      actionVisible.value = true
      const res = await apis.getOperationRecordInfoFortis({ id: record.id })
      if (!res) {
        return
      }
      if (res.code == 0) {
        if (res.data) {
          // albe2504	//旧数据
          // albe2505	// 新数据
          // albe2508	// 修改证明
          actionDetails.oldValue = res.data.albe2504
          actionDetails.newValue = res.data.albe2505
          if (res.data.albe2508) {
            try {
              actionDetails.albe2508 = JSON.parse(res.data.albe2508)
            } catch (e) {
              message.warning('请重新上传修改证明')
            }
          }
          dealActionValue()
          // dealUpdateDoc()
        }
      }
    }
    return {
      moment,
      searchFunc,
      columns,
      fieldValueArr,
      onClose,
      actionVisible,
      getViewUpdateDatails,
      teamActionTable,
      actionDetails,
      download,
      downloadImg,
    }
  },
})
</script>

<style scoped lang="less">
.filedTitle {
  font-size: 16px;
  font-weight: 600;
}
.aRowList {
  margin-top: 30px;
}
.aRowList:first-child {
  margin-top: 0px;
}
</style>

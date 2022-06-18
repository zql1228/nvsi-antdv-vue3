<!-- 管理部门 信息管理→投诉管理 -->
<template>
  <div>
    <!-- recombination monomer -->
    <PageFormTableWrapper>
      <template #searchForm>
        <a-form
          ref="searchFormRef"
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
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="对象搜索" name="albx0355">
                <a-input placeholder="请输入被投诉对象名称" v-model:value="queryParam.albx0355" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="投诉类型" name="albx0346">
                <a-select ref="select" v-model:value="queryParam.albx0346">
                  <a-select-option v-for="item in options" :key="item.codeid" :value="item.codeid">{{ item.codevalue }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="refresh(activeKey)">
                    查询
                  </a-button>
                  <a-button @click="resetForm(activeKey)">
                    重置
                  </a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <template #table>
        <a-tabs type="card" v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="未处理">
            <McaworkComplaintTable ref="McaworkComplaintTable1" :activeKey="1" :queryParam="queryParam"></McaworkComplaintTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="已处理" force-render>
            <McaworkComplaintTable ref="McaworkComplaintTable2" :activeKey="2" :queryParam="queryParam"></McaworkComplaintTable>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
  </div>
</template>

<script>
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import McaworkComplaintTable from './components/McaworkComplaintTable'
import { rpcPost } from '@/server/conf/index.js'
export default defineComponent({
  props: {
    projectType: {
      type: String,
      default: '0',
    },
  },
  components: {
    PlusOutlined,
    // pagination,
    McaworkComplaintTable,
  },
  setup(props) {
    const data = reactive({
      visible: false, //控制重置密码的弹窗
      item: {}, //当前重置密码按钮 列数据
    })
    const activeKey = ref('1') //tab页
    const userInfo = ref(LocalGetUserInfo())
    const searchFormRef = ref(null)
    const queryParam = reactive({
      albx0355: '',
      albx0346: '',
    })
    const McaworkComplaintTable1 = ref()
    const McaworkComplaintTable2 = ref()

    const options = ref([
      // { value: '', label: '不限' },
      // { value: 1, label: '队伍' },
      // { value: 2, label: '项目' },
      // { value: 3, label: '志愿者' },
      // { value: 4, label: '时长' },
    ])

    onMounted(() => {
      getOptions()
    })

    const getOptions = async () => {
      options.value = await rpcPost('getCodeValueOnLeap', { bean: { tableName: 'nvsi_albx0343' } }) //投诉类型
      options.value = options.value.data
      options.value.unshift({ codevalue: '不限', codeid: '' })
    }

    const refresh = (activeKey) => {
      //查询按钮
      activeKey == 1 ? McaworkComplaintTable1.value.getList() : McaworkComplaintTable2.value.getList()
    }

    //重置
    const resetForm = (activeKey) => {
      searchFormRef.value.resetFields()
      activeKey == 1 ? McaworkComplaintTable1.value.getList() : McaworkComplaintTable2.value.getList()
    }

    return {
      activeKey,
      options,
      data,
      moment,
      // 查询条件参数
      queryParam,
      // mode, // recombination monomer
      searchFormRef,
      refresh,
      resetForm,
      McaworkComplaintTable1,
      McaworkComplaintTable2,
    }
  },
})
</script>
<style lang="scss" scoped></style>

<!-- 网站资源配置 -->
<template>
  <div>
    <!-- recombination monomer -->
    <nvsi-page-search-table>
      <template #searchForm>
        <div class="table-page-search-wrapper">
          <a-form :label-col="labelCol" :wrapper-col="wrapperCol" :form="searchForm">
            <a-row :gutter="24">
              <a-col :md="6" :sm="24">
                <a-form-item label="网站">
                  <a-select default-value="1" v-model="queryParam.ProName">
                    <a-select-option value="1">
                      Option 1
                    </a-select-option>
                    <a-select-option value="2">
                      Option 2
                    </a-select-option>
                    <a-select-option value="3">
                      Option 3
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="资源名称">
                  <a-input v-model="queryParam.ProName" placeholder="项目名称" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="显示名称">
                  <a-input v-model="queryParam.ProName" placeholder="项目名称" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item>
                  <a-space>
                    <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                    <a-button @click="() => (this.queryParam = {})">重置</a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </template>

      <template #table>
        <!-- showPagination="true" 加上这个会报错，后面的大佬有时间解决下 -->
        <nvsi-table
          :mode="mode"
          ref="table"
          size="middle"
          :rowKey="record => record.id"
          :columns="columns"
          :data="loadData"
          :loading="loading"
        >
          <template #title>
            <div class="table-header">
              <a-row class="header-bar">
                <a-col :span="4" :offset="20">
                  <div class="header-actions">
                    <a-button type="primary" icon="plus" @click="handleAdd()">
                      新建资源
                    </a-button>
                  </div></a-col
                >
              </a-row>
            </div>
          </template>
          <span slot="serial" slot-scope="text, record, index">
            {{ (pageNo - 1) * pageSize + (index + 1) }}
          </span>
          <template #areanames="text">
            {{ text ? text.join('>') : '-' }}
          </template>
          <span slot="description" slot-scope="text">
            <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
          </span>

          <span slot="action" slot-scope="text, record">
            <slot name="action" :record="record"> </slot>
          </span>
        </nvsi-table>
      </template>
    </nvsi-page-search-table>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      tableHeight: 600,
      loading: false,
      searchForm: this.$form.createForm(this, { name: 'search' }),
      confirmLoading: false,
      userInfo: {},
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' },
          width: 50,
          align: 'center'
        },
        {
          title: '项目名称',
          dataIndex: 'albx0002',
          ellipsis: true
        },
        {
          title: '服务区域',
          ellipsis: true,
          key: 'areanames',
          dataIndex: 'areanames',
          scopedSlots: { customRender: 'areanames' },
          width: '28%'
        },
        {
          title: '项目时间',
          ellipsis: true,
          customRender: (text, record) => {
            return moment(record.albx0004).format('YYYY-MM-DD') + ' ~ ' + moment(record.albx0005).format('YYYY-MM-DD')
          },
          width: '16%'
        },
        {
          title: '时长（小时）',
          dataIndex: 'albx0061',
          needTotal: true,
          width: 100
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: '18%',
          align: 'center'
        }
      ],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询条件参数
      queryParam: {},
      pageNo: 1,
      pageSize: 12,
      totalCount: {
        sumpro: 0,
        sumtime: 0,
        sumvol: 0
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return this.localDataHandle(parameter)
      }
    }
  },

  created() {},

  computed() {},

  mounted() {},

  methods: {
    localDataHandle(parameter) {
      const result = {
        pageNum: 1,
        pageSize: 10,
        data: [],
        totalCount: 0
      }
      return new Promise((resolve, reject) => {
        const params = Object.assign(parameter, this.queryParam)
        params.pageNum = this.pageNo = params.pageNo
        this.pageSize = params.pageSize
        params.groupId = this.userInfo.id
        params.albx0021 = this.userInfo.areaid
        params.type = 1
        this.$rpcPost('getGroupPublishProjectListFortis', { bean: params })
          .then(res => {
            const _data = res.data ? res.data : result
            resolve(_data)
          })
          .catch(e => {
            console.error('unreleasedProject[localDataHandle]: ', e)
            resolve(result)
          })
          .finally(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>
<style lang="less" scoped></style>

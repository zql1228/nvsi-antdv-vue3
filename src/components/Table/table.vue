<template>
  <div class="table-total" v-show="showHeader !== false">
    <a-row class="total-bar">
      <a-col :span="16">
        <div class="total-title">
          <slot name="total-title" :totalData="totalData" :tableData="tableData"></slot>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="total-actions">
          <a-space>
            <slot name="total-action" :totalData="totalData" :tableData="tableData"> </slot>
          </a-space>
        </div>
      </a-col>
    </a-row>
  </div>
  <a-table
    :pagination="false"
    class="ia-table"
    v-bind="$attrs"
    :data-source="tableData"
    :loading="loading"
    :style="getTableScrollStyle()"
    :scroll="{ y: tableScrollHeight }"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
      <slot :name="item" v-bind="data || {}" :pagination="localPagination"></slot>
    </template>
    <template #serial="{ index }">
      {{ (localPagination.pageNum - 1) * localPagination.pageSize + (index + 1) }}
    </template>
  </a-table>
  <!-- 
    defaultPageSize 只能第一次加载，所以不能根据高度计算pageSize
    show-quick-jumper
     -->
  <a-pagination
    v-show="props.paginationNum == 1"
    style="text-align: right"
    :show-total="(total, range) => `共${total}条 当前显示${range[0]}~${range[1]}`"
    v-model:defaultPageSize="localPagination.pagesize"
    v-model:page-size-options="pageSizeOptions"
    v-model:current="localPagination.pageNum"
    v-model:pageSize="localPagination.pagesize"
    show-size-changer
    :total="localPagination.totals"
    @showSizeChange="onShowSizeChange"
    @change="changePagenum"
  >
    <template #buildOptionText="props">
      <span>{{ props.value }}条/页</span>
    </template>
  </a-pagination>
  <ul v-show="props.paginationNum == 2">
    <li>
      <!--统计文本 -->
      共{{ totalData.totals }}条 当前显示{{ tableData.length > 0 ? localPagination.pageSize * (localPagination.pageNum - 1) + 1 : 0 }}~{{
        localPagination.pageSize * (localPagination.pageNum - 1) + tableData.length
      }}
    </li>
    <li class="btn">
      <!--上一页按钮 -->
      <a
        @click="aNum('left')"
        :class="tableData.length == 0 || localPagination.pageNum < 2 ? 'disabled' : ''"
        :style="tableData.length == 0 || localPagination.pageNum < 2 ? 'border:1px solid #d9d9d9;color:#d9d9d9;' : ''"
        ><LeftOutlined
      /></a>
    </li>
    <li class="btnNum">
      <!--当前页 -->
      <a :class="tableData.length == 0 ? 'disabled' : ''" :style="tableData.length == 0 ? 'border:1px solid #d9d9d9;color:#d9d9d9;' : ''">{{
        tableData.length > 0 ? localPagination.pageNum : 0
      }}</a>
    </li>
    <li class="btn">
      <!--下一页按钮 -->
      <a
        @click="aNum('right')"
        :class="tableData.length == 0 || localPagination.pageNum >= localPagination.pageCount ? 'disabled' : ''"
        :style="tableData.length == 0 || localPagination.pageNum >= localPagination.pageCount ? 'border:1px solid #d9d9d9;color:#d9d9d9;' : ''"
      >
        <RightOutlined />
      </a>
    </li>
    <li>
      <!--每页展示的数据量选择器 -->
      <a-select v-model:value="localPagination.pageSize" @change="onShowSizeChange2" class="select">
        <a-select-option v-for="item in pageSizeOptions2" :key="item.num" :value="item.num">{{ item.text }}</a-select-option>
      </a-select>
    </li>
  </ul>
</template>

<script>
import { rpcPost } from './../../server/conf/index.js'
import { calculateTableScrollHeight, getTableScrollStyle } from './../../utils/style.js'

import VueTypes from 'vue-types'
import { message } from 'ant-design-vue'
import util from './../../utils/util'
import { defineComponent, reactive, ref, toRefs, onMounted, nextTick, watch } from 'vue'
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import Cache from '@/utils/Cache'
export default defineComponent({
  name: 'IATable',
  components: { LeftOutlined, RightOutlined },
  props: {
    serviceName: VueTypes.string.isRequired,
    searchParameter: VueTypes.func.isRequired,
    // 是否展示头部总数统计的提示
    showHeader: VueTypes.bool,
    isMc: {
      type: Boolean,
      default: true,
    },
    defaultDataSource: {
      type: Array,
    },
    paginationNum: {
      //1antd的分页组件 2自定义分页组件
      type: String,
      default: '2',
    },
    cusPagination: {
      type: Object,
      default: () => ({
        pageSize: 10,
        pageNum: 1,
        totals: 0,
        pageCount: 0,
      }),
    },
  },
  // props, { attrs, emit, slots, expose }
  setup(props) {
    const cache = new Cache()
    const cusServiceName = ref([
      {
        serviceName: ['inquireVolunteerFortisService', 'recordTimeListFortisLogic'],
        getCusResult: (res) => {
          return res.data
        },
        setCusResult: (res) => {
          state.localPagination.pageCount = res.data.pagecount > 0 ? res.data.pagecount : 0
          state.localPagination.totals = res.data.totalcount > 0 ? res.data.totalcount : 0
          state.totalData['totals'] = res.data.person > 0 ? res.data.person : 0
          state.totalData['person'] = res.data.person > 0 ? res.data.person : 0
          state.localPagination.pageNum = res.data.pageno > 0 ? res.data.pageno : 1
        },
      },
      {
        // durationManagementQueryFortisService
        serviceName: ['timeDetailsFortisService', 'durationManagementQueryFortisService'],
        getCusResult: (res) => {
          return res.data
        },
        setCusResult: (res) => {
          state.localPagination.pageCount = res.data.pagecount ? res.data.pagecount : 0
          state.localPagination.totals = res.data.totalcount ? res.data.totalcount : 0
          state.localPagination.pageNum = res.data.pageno ? res.data.pageno : 1
          state.totalData['totals'] = res.data.totalcount ? res.data.totalcount : 0
        },
      },
      {
        serviceName: ['queryVolunteerInfor'],
        getCusResult: (res) => {
          return res.data
        },
        setCusResult: (res) => {
          state.localPagination['totals'] = res.data.count
        },
      },
    ])

    const leapAgrenAddPar = ref([
      {
        serviceName: 'deptQueryTeamPageFortis',
        addSearch: [
          {
            type: 'sort',
            key: 'findType',
            value: '0',
          },
          {
            type: 'sort',
            key: 'findType',
            value: '1',
          },
        ],
      },
      {
        serviceName: 'managementDepartmentSelProjectFortis',
        addSearch: [
          {
            type: 'sort',
            key: 'findType',
            value: '0',
          },
          {
            type: 'sort',
            key: 'findType',
            value: '1',
          },
        ],
      },
    ])

    const state = reactive({
      loading: false,
      totalData: {},
      tableData: [],
      localPagination: {
        pageSize: 10,
        pageNum: 1,
        totals: 0,
        pageCount: 0,
      },
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      pageSizeOptions2: [
        { num: 10, text: '10条/页' },
        { num: 20, text: '20条/页' },
        { num: 30, text: '30条/页' },
        { num: 40, text: '40条/页' },
        { num: 50, text: '50条/页' },
      ],
      tableScrollHeight: 369,
    })

    const refresh = (bool = false) => {
      if (bool == 'delete') {
        //delete表明当前需要刷新列表的操作会导致当前列表数据量变少时 此时需要判断一下当前页是否只有一条数据 如果只有一条则本次刷新需要去查询上一页的数据
        state.localPagination = Object.assign(getParameter(), {
          pageNum:
            state.tableData.length > 1
              ? state.localPagination.pageNum
              : state.tableData.length <= 1 && state.localPagination.pageNum > 1
              ? state.localPagination.pageNum * 1 - 1
              : 1, //当前页数据条数大于1则继续查询当前页 当前页数据等于1并且页数大于1时则查询上一页  其它情况查询第一页
          pageSize: state.localPagination.pageSize,
        })
        loadData()
        return
      }
      bool &&
        (state.localPagination = Object.assign(getParameter(), {
          pageNum: 1,
          pageSize: state.localPagination.pageSize,
        }))
      loadData()
    }

    const getTableData = () => {
      return state
    }

    const getParameter = () => {
      return props.searchParameter() || {}
    }

    const onShowSizeChange = (current, pageSize) => {
      state.localPagination.pageNum = current
      state.localPagination.pageSize = pageSize
      loadData()
    }

    const onShowSizeChange2 = () => {
      //自定义分页组件切换pageSize时调用
      const pageNumMax = Math.ceil(state.totalData.totals / state.localPagination.pageSize) //计算当前pageSize可选择的最大页数
      state.localPagination.pageNum > pageNumMax ? (state.localPagination.pageNum = pageNumMax) : '' //当前显示页数大于pageNumMax时默认选中pageNumMax
      loadData()
    }

    const changePagenum = (page, pageSize) => {
      const pageCount = state.localPagination.pageCount
      if (page > pageCount) {
        message.error('跳转页超过总页数，请重新输入！')
      } else {
        state.localPagination.pageSize = pageSize
        state.localPagination.pageNum = page
        loadData()
      }
    }

    // 如果数据没有id 手动添加一个
    const addDataSourceId = (dataArr) => {
      if (dataArr.constructor === Array) {
        dataArr.forEach((item) => {
          if (!item.id) {
            item.id = util.randomUUID()
          }
        })
        return dataArr
      } else {
        return dataArr
      }
    }

    // 查询出结果，修改自定义的分页参数以及其他参数
    const initCusServiceParams = (res) => {
      cusServiceName.value.forEach(({ serviceName, setCusResult }) => {
        if (Array.isArray(serviceName)) {
          serviceName.forEach((apiName) => {
            if (props.serviceName === apiName) {
              setCusResult(res)
            }
          })
        } else if (typeof serviceName === 'string') {
          if (props.serviceName === serviceName) {
            setCusResult(res)
          }
        }
      })
    }
    const initAddFindTypePar = (par) => {
      const params = []
      leapAgrenAddPar.value.forEach((item) => {
        if (item.serviceName === props.serviceName) {
          item.addSearch.forEach(({ type, key, value }) => {
            if (type == 'sort') {
              const obj = {
                ...par,
                [key]: value,
              }
              params.push(obj)
            }
          })
        }
      })
      return params
    }
    const loadData = () => {
      state.loading = true
      const par = Object.assign(state.localPagination, getParameter())
      // console.log(`loadData:par:${props.serviceName}`, par)
      const params = initAddFindTypePar(par)
      if (params.length === 0) {
        params.push(par)
      }
      console.log(`loadData:par:${props.serviceName}`, params)
      for (let i = 0; i < params.length; i++) {
        rpcPost(props.serviceName, { bean: params[i] })
          .then((res) => {
            console.log('loadData:res', res)
            if (!res) {
              console.log('tableError', 'RES_NULL')
            } else {
              if (res.code == 0 && res.data) {
                if (res.findType) {
                  if (res.findType == '0') {
                    const data = res.data
                    // state.localPagination.pageCount = res.pageCount
                    // state.localPagination.totals = res.totalCount
                    // state.localPagination.pageNum = res.pageNo

                    // 这里判断下类型， 因为table的数据只能是list
                    if (data) {
                      // console.log(state, 'state')
                      if (data.constructor === Array) {
                        state.tableData = addDataSourceId(data)
                      } else {
                        Object.keys(data).forEach((key) => {
                          const val = data[key]
                          if (val.constructor === Array) {
                            state.tableData = addDataSourceId(val)
                          } else {
                            state.totalData[key] = val
                          }
                        })
                      }
                      // state.totalData['totals'] = res.totalCount
                      initCusServiceParams(res)
                      // console.log(state, 'state')
                    }
                  }
                  if (res.findType == '1') {
                    state.totalData['totals'] = res.totalCount
                    state.localPagination.totals = res.totalCount
                    state.localPagination.pageCount = res.pageCount
                    state.localPagination.pageNum = res.pageNo
                  }
                } else {
                  const data = res.data
                  state.localPagination.pageCount = res.pageCount
                  state.localPagination.totals = res.totalCount
                  state.localPagination.pageNum = res.pageNo

                  // 这里判断下类型， 因为table的数据只能是list
                  if (data) {
                    if (data.constructor === Array) {
                      state.tableData = addDataSourceId(data)
                    } else {
                      Object.keys(data).forEach((key) => {
                        const val = data[key]
                        if (val.constructor === Array) {
                          state.tableData = addDataSourceId(val)
                        } else {
                          state.totalData[key] = val
                        }
                      })
                    }
                    state.totalData['totals'] = res.totalCount
                    initCusServiceParams(res)
                  }
                }
              } else {
                state.tableData = []
                state.localPagination.pageCount = 1
                state.localPagination.totals = 0
                state.localPagination.pageNum = 1
              }
            }
          })
          .catch((e) => {
            // 这里只是暂时显示一下需要的数据
            if (props.defaultDataSource && props.defaultDataSource.length > 0) {
              state.tableData = addDataSourceId(props.defaultDataSource)
            }
            state.loading = false
            console.log('tableError', e)
          })
          .finally(() => {
            state.loading = false
          })
      }
      // state.loading = false
      // rpcPost(props.serviceName, { bean: par })
      //   .then((res) => {
      //     console.log('loadData:res', res)
      //     if (!res) {
      //       console.log('tableError', RES_NULL)
      //     } else {
      //       state.tableData = []
      //       state.totalData['totals'] = 0
      //       if (res.code === 0 || res.code === '0') {
      //         const data = res.data
      //         state.localPagination.pageCount = res.pageCount
      //         state.localPagination.totals = res.totalCount
      //         state.localPagination.pageNum = res.pageNo

      //         // 这里判断下类型， 因为table的数据只能是list
      //         if (data) {
      //           if (data.constructor === Array) {
      //             state.tableData = data
      //           } else {
      //             Object.keys(data).forEach((key) => {
      //               const val = data[key]
      //               if (val.constructor === Array) {
      //                 state.tableData = val
      //               } else {
      //                 state.totalData[key] = val
      //               }
      //             })
      //           }
      //           state.totalData['totals'] = res.totalCount
      //           initCusServiceParams(res)
      //         }

      //         // const key = generateUUID()
      //         // cache.set(key)
      //         // if (res.timeStamp) {
      //         //   //
      //         // }
      //       } else {
      //         console.log('tableError', res)
      //       }
      //     }
      //   })
      //   .catch((e) => {
      //     // 这里只是暂时显示一下需要的数据
      //     if (props.defaultDataSource && props.defaultDataSource.length > 0) {
      //       state.tableData = props.defaultDataSource
      //     }
      //     // message.error(e)
      //     console.log('tableError', e)
      //   })
      //   .finally(() => {
      //     state.loading = false
      //   })

      // 0.0001100110011001
      // 0.0001100110011001
      // 0.0001010001010001010010
      // 0.0011 0011 0011 0011
    }
    const loadDataCount = () => {}
    const aNum = (type) => {
      //第二套分页组件的上一页 下一页 按钮事件
      if (
        (type == 'left' && state.localPagination.pageNum > 1) ||
        (type == 'right' && state.localPagination.pageNum < state.localPagination.pageCount)
      ) {
        type == 'left' ? state.localPagination.pageNum-- : state.localPagination.pageNum++
        loadData()
      }
    }

    const getheight = () => {
      window.addEventListener('resize', getheight) //监听窗口改变
      nextTick(() => {
        const { allHeight } = calculateTableScrollHeight()
        state.tableScrollHeight = allHeight
      })
    }
    onMounted(() => {
      // if (props.cusPagination) {
      //   Object.assign(state.localPagination, props.cusPagination)
      // }
      getheight()
      if (props.isMc) {
        //isMc为false时查询事件在页面那边自己调
        loadData()
        loadDataCount()
      }
    })
    return {
      props,
      ...toRefs(state),
      refresh,
      getTableData,
      getTableScrollStyle,
      onShowSizeChange,
      onShowSizeChange2,
      changePagenum,
      getheight,
      aNum,
      loadData,
    }
  },
})
</script>
<style lang="less" scoped>
ul {
  text-align: right;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum';
}
ul > li {
  vertical-align: middle;
  margin-left: 8px;
  display: inline-block;
}
.btn {
  min-width: 32px;
  height: 32px;
  color: rgba(0, 0, 0, 0.65);
  font-family: Arial;
  line-height: 32px;
  text-align: center;
  vertical-align: middle;
  list-style: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}
.btn a {
  font-weight: 500;
  display: block;
  height: 100%;
  font-size: 12px;
  text-align: center;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  outline: none;
  transition: all 0.3s;
}
.btn a:hover {
  border-color: #d92f2f;
}
.btnNum {
  min-width: 32px;
  height: 32px;
  color: rgba(0, 0, 0, 0.65);
  font-family: Arial;
  line-height: 32px;
  text-align: center;
  vertical-align: middle;
  list-style: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}
.btnNum a {
  color: #d92f2f;
  font-weight: 500;
  display: block;
  height: 100%;
  font-size: 12px;
  text-align: center;
  background-color: #fff;
  border: 1px solid #d92f2f;
  border-radius: 4px;
  outline: none;
  transition: all 0.3s;
}
.disabled {
  cursor: not-allowed;
}
.select {
  vertical-align: middle;
  box-sizing: border-box;
  margin-right: 8px;
}
</style>

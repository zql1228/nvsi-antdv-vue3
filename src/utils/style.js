export const cardTableStyle = {
  paddingTop: '12px',
  paddingBottom: '12px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}

export const cardFormSearchStyle = {
  padding: '24px 24px',
  marginBottom: '0',
}

export const calculateHeight = () => {
  let allHeight = 72 + 40 + 24 + 17 + 24 + 40 + 16
  window.addEventListener('resize', calculateHeight) // 监听窗口改变
  // 计算列表可滚动区域高度
  const searchForm = document.querySelector('.searchForm')
  if (searchForm) {
    allHeight += searchForm.clientHeight + 48
  }
  const headEl = document.getElementsByClassName('ant-table-thead') // 表头高度
  allHeight += headEl[0]?.clientHeight
  const titleEl = document.getElementsByClassName('ant-table-title') // 表标题高度
  allHeight += titleEl[0]?.clientHeight
  const pageSize = allHeight / 54
  return { allHeight, pageSize }
}

const getElementHeight = (el) => {
  return document.getElementsByClassName(el)[0]?.clientHeight
}
export const calculateTableScrollHeight = () => {
  const layoutHeadHeight = 72
  const layoutPadding = 24

  let tabsHeight = 0
  const nvsiTableEle = document.getElementsByClassName('nvis-table')
  if (nvsiTableEle && nvsiTableEle.length > 0) {
    const tabsEle = nvsiTableEle[0].getElementsByClassName('ant-tabs-bar')
    if (tabsEle && tabsEle.length > 0) {
      const tabsMarginBottom = 16
      tabsHeight = tabsEle[0].clientHeight + tabsMarginBottom
    }
  }
  const multitabHeight = getElementHeight('multitab-wrapper') //顶部tab高度
  const tableSearch = getElementHeight('table-page-search-wrapper') //搜索
  let tableHeadHeight = getElementHeight('ant-table-thead') //表头高度
  if (tableHeadHeight) {
    tableHeadHeight += 12
  }
  const tableWrapperPadding = 24
  const tableTotalHeight = getElementHeight('table-total') //合计高度

  const paginationHeight = 40

  // 计算列表可滚动区域高度
  const tableMaxHeight =
    document.getElementsByTagName('body')[0].clientHeight -
    layoutHeadHeight -
    layoutPadding -
    tableWrapperPadding -
    tableTotalHeight -
    tableSearch -
    paginationHeight -
    tabsHeight -
    multitabHeight
  // document.getElementsByTagName('body')[0].clientHeight -72-24-40-64-24
  const allHeight = tableMaxHeight - tableHeadHeight
  // const allHeight = 490
  const pageSize = Math.floor(allHeight / 54)

  window.addEventListener('resize', calculateTableScrollHeight) // 监听窗口改变
  return { allHeight, pageSize, tableMaxHeight }
}

// export const calculateTableScrollHeight = () => {
//   //计算table组件高度tableMaxHeight和表格内容区域高度allHeightallHeight
//   let bodyHeight = document.getElementsByTagName('body')[0].clientHeight //当前窗口大小
//   let layoutHeadHeight = 72 //页面顶部 '全国志愿服务系统'模块高度和导航高度
//   let multitabHeight = document.getElementsByClassName('multitab-wrapper')[0]
//     ? document.getElementsByClassName('multitab-wrapper')[0].clientHeight
//     : 0 //顶部tab高度 页面导航高度
//   let layoutPadding = 24 //内容区域上下内边距padding
//   let tableSearch = document.getElementsByClassName('table-page-search-wrapper')[0]
//     ? document.getElementsByClassName('table-page-search-wrapper')[0].clientHeight
//     : 0 //搜索模块高度
//   let padding = 12 //搜索模块与表格区域间隔
//   let tablePadding = 24 //表格区域上下内边距padding
//   let tabstitle = document.getElementsByClassName('ant-tabs-nav-wrap')[0] ? document.getElementsByClassName('ant-tabs-nav-wrap')[0].clientHeight : 0 //标签页标题高度
//   tabstitle > 0 ? (tabstitle += 40) : '' //如果有标签页则加上标签页的外边距
//   let tableTotalHeight = document.getElementsByClassName('table-total')[0] ? document.getElementsByClassName('table-total')[0].clientHeight : 0 //表格数据总数统计区域高度
//   let paginationHeight = 32 //分页模块高度
//   //表格模块高度=当前窗口高度-页面顶部-页面导航高度-内容区域上下内边距-内容区域上下内边距-搜索模块高度-搜索模块与表格区域间隔-表格区域上下内边距-标签页标题高度-表格数据总数统计区域高度 :style="getTableScrollStyle()"
//   let tableMaxHeight =
//     bodyHeight -
//     layoutHeadHeight -
//     multitabHeight -
//     layoutPadding -
//     tableSearch -
//     padding -
//     tablePadding -
//     tabstitle -
//     tableTotalHeight -
//     paginationHeight
//   let tableHeadHeight = document.getElementsByClassName('ant-table-thead')[0] ? document.getElementsByClassName('ant-table-thead')[0].clientHeight : 0 //表格头(表格第一行)高度
//   //表格滚动区域高度=表格模块高度-表格头高度   :scroll="{ y: tableScrollHeight }"
//   let allHeight = tableMaxHeight - tableHeadHeight
//   console.log(tableMaxHeight)
//   return { allHeight, tableMaxHeight }
// }

export const getTableScrollStyle = () => {
  const { tableMaxHeight } = calculateTableScrollHeight()
  return {
    flex: '1',
    overflow: 'hidden',
    height: `${tableMaxHeight}px`,
  }
}

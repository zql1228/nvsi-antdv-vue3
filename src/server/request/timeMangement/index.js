import { rpcPost } from '../../conf'
export default {
  //时长志愿者审核详情
  timesFortisService(bean) {
    return new Promise((resolve) => {
      rpcPost('timesFortisService', { bean }).then((res) => {
        let dataSource = null
        if (res.code === 0 && res.data) {
          dataSource = res.data
        }
        resolve(dataSource)
      })
    })
  },
  //时长添加
  addTimeFortisService(bean) {
    return new Promise((resolve) => {
      rpcPost('addTimeFortisService', { bean }).then((res) => {
        let dataSource = null
        if (res && res.message) {
          dataSource = res.message
        }
        resolve(dataSource)
      })
    })
  },
  //删除时长
  delTimesFortisService(bean) {
    return new Promise((resolve) => {
      rpcPost('delTimesFortisService', { bean }).then((res) => {
        let dataSource = null
        if (res.message) {
          dataSource = res.message
        }
        resolve(dataSource)
      })
    })
  },
  //删除记录
  deleteTimeFortisService(bean) {
    return new Promise((resolve) => {
      rpcPost('deleteTimeFortisService', { bean }).then((res) => {
        let dataSource = null
        if (res.message) {
          dataSource = res.message
        }
        resolve(dataSource)
      })
    })
  },
  //批量审核同意
  agreedTimesFortisService(bean) {
    return new Promise((resolve) => {
      rpcPost('agreedTimesFortisService', { bean }).then((res) => {
        let dataSource = null
        if (res.message) {
          dataSource = res.message
        }
        resolve(dataSource)
      })
    })
  },
  //批量审核拒绝
  rejectTimesFortisService(bean) {
    return new Promise((resolve) => {
      rpcPost('rejectTimesFortisService', { bean }).then((res) => {
        let dataSource = null
        if (res.message) {
          dataSource = res.message
        }
        resolve(dataSource)
      })
    })
  },
  //查看操作记录明细
  inquireVolunteerFortisService(bean) {
    return new Promise((resolve) => {
      rpcPost('inquireVolunteerFortisService', { bean }).then((res) => {
        let dataSource = null
        if (res.data && res.code === 0) {
          dataSource = res.data
        }
        resolve(dataSource)
      })
    })
  },
  // 导出exxel表格
  drawExcelService(bean) {
    console.log(bean)
    return new Promise((resolve) => {
      rpcPost('drawExcelService', bean).then((res) => {
        // console.log(res)
        let dataSource = null
        if (res.data && res.code === 0) {
          dataSource = res.data
        }
        resolve(dataSource)
      })
    })
  },
  //时长统计查询
  durationManagementTreeViewlistFortisService(bean) {
    return new Promise((resolve) => {
      rpcPost('durationManagementTreeViewlistFortisService', { bean }).then((res) => {
        let dataSource = null
        if (res.data && res.code === 0) {
          dataSource = res.data
        }
        resolve(dataSource)
      })
    })
  },
  //时长统计查询项目数 队伍数 时长 志愿者人数
  StatisticsOnTimeLengthQueryFortisService(bean) {
    return new Promise((resolve) => {
      rpcPost('StatisticsOnTimeLengthQueryFortisService', { bean }).then((res) => {
        let dataSource = null
        if (res.code === 0 && res.data) {
          dataSource = res.data
        }
        resolve(dataSource)
      })
    })
  },
  //时长录入判断是否签到未签退
  addTimeBeforeFortisService(bean) {
    return new Promise((resolve) => {
      rpcPost('addTimeBeforeFortisService', { bean })
        .then((res) => {
          console.log(res, 'res')
          let dataSource = []
          if (res && res.code === 0 && res.data) {
            dataSource = res.data
            resolve(dataSource)
          } else {
            resolve([])
          }
        })
        .catch((e) => {
          console.log(e)
        })
    })
  },
  //时长录入-录入记录
  recordTimeListFortisLogic(bean) {
    return new Promise((resolve) => {
      rpcPost('recordTimeListFortisLogic', { bean }).then((res) => {
        let dataSource = null
        if (res.code === 0 && res.data) {
          dataSource = res.data
        }
        resolve(dataSource)
      })
    })
  },
}

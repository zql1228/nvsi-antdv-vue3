import { rpcPost } from '../../conf'
export default {
  // 查询队伍详情
  getTeamInfoFortis(bean) {
    if (!bean) {
      bean = {
        id: 'a6124ab7ced64a13b806c9418da42d84', //队伍id
        areaId: '110101000000000000', //队伍区划
      }
    }
    return rpcPost('getTeamInfoFortis', { bean })
  },

  //队伍成员
  queryTeamMemberPageFortis(bean) {
    return new Promise((resolve) => {
      rpcPost('queryTeamMemberPageFortis', { bean }).then((res) => {
        let dataSource = null
        if (res.code == 0 && res.data) {
          if (res) {
            dataSource = res
          }
          resolve(dataSource)
        }
      })
    })
  },

  // 查询下级队伍列表
  getTeamPageFortis(bean) {
    if (!bean) {
      bean = {
        id: 'a6124ab7ced64a13b806c9418da42d84', //队伍id
        type: '1', //列表类型（1 注册审核 2 变更审核 3.正式队伍）
        category: '1', //tab类型（1 直属团体 2 下级团体 3 下级组织）
        areaId: '110101000000000000', //	服务区域
        pageNum: '1', //当前页数
        pageSize: '10', //每页条数
      }
    }
    return rpcPost('queryPendingTeamPageFortis', { bean })
  },

  // 组织获取下级队伍列表各类型数
  getTeamPageNumFortis(bean) {
    if (!bean) {
      bean = {
        id: 'a6124ab7ced64a13b806c9418da42d84', //队伍id
        type: '1', // 1 注册审核 2 变更审核 3.正式队伍
        areaId: '110101000000000000', //	服务区域
      }
    }
    return rpcPost('getTeamPageNumFortis', { bean })
  },

  // 上级组织修改下级队伍信息
  updateNextTeamInfoFortis(bean) {
    if (!bean) {
      bean = {
        id: '', //是	队伍id
        userId: '', //是	当前登录队伍用户id
        areaId: '', //是	队伍区划
        albe0002: '', //是	队伍名
        albe0022: '', //是	负责人姓名
        albe0024: '', //是	负责人手机
        albe0018: '', //是	团体联系人
        albe0019: '', //是	联系人手机
        albe0049: '', //是	联系人邮箱
        userFlag: '', //是	当前登录队伍队伍名
      }
    }
    if (!bean.userId) {
      bean.userId = 'a6124ab7ced64a13b806c9418da42d84'
    }
    return rpcPost('orgUpdateNextTeamInfoFortis', { bean })
  },

  // 上级队伍停用/启用下级队伍
  deactivateOrEnalbeTeamFortis(bean) {
    if (!bean) {
      bean = {
        areaid: '', //	是	队伍区划
        albe0026: '', //	是	状态（1 启用 3 停用）
        id: '', //	是	队伍id
        userFlag: '', //	是	当前登录用户名
        userId: '', //	是	当前登录用户id
        albe2509: '', //	否	备注
      }
    }
    return rpcPost('deactivateOrEnalbeTeamFortis', { bean })
  },

  // 查询操作记录详情
  getOperationRecordInfoFortis(bean) {
    if (!bean) {
      bean = {
        id: '', //是	队伍id
      }
    }
    return rpcPost('getOperationRecordInfoFortis', { bean })
  },

  // 上级队伍停用/启用下级队伍
  deactivateOrEnalbeTeamFortis(bean) {
    if (!bean) {
      bean = {
        userId: '', //是	当前登录用户id
        areaid: '', //是	队伍区划
        albe0026: '', //是	状态（1 启用 3 停用）
        id: '', //是	队伍id
        userFlag: '', //是	当前登录用户名
        albe2509: '', //否	备注
      }
    }
    if (!bean.userId) {
      bean.userId = 'a6124ab7ced64a13b806c9418da42d84'
    }
    return rpcPost('deactivateOrEnalbeTeamFortis', { bean })
  },

  // 部门审核团体和组织 组织审核团体
  updateTeamStateFortis(bean) {
    if (!bean) {
      bean = {
        id: '7578feaab00b47aa82d388b69a84e03c', // 队伍id
        ispass: '1', // 是否通过（0 不通过  1 通过）
        areaId: '110101000000000000', // 队伍区划
        option: '允许注册', // 审核意见
        albp0052: 'boluogulao2', // 队伍用户名
        userFlag: '测试组织', // 当前登录用户名
      }
    }
    return rpcPost('updateTeamStateFortis', { bean })
  },

  // 组织挂靠审核下级组织
  updateTeamStateFortis2(bean) {
    if (!bean) {
      bean = {
        id: '7578feaab00b47aa82d388b69a84e03c', // 队伍id
        ispass: '1', // 是否通过（0 不通过  1 通过）
        areaId: '110101000000000000', // 队伍区划
        option: '允许注册', // 审核意见
        userFlag: '测试组织', // 当前登录用户名
      }
    }
    return rpcPost('orgUpdateNextStateFortis', { bean })
  },

  // 队伍发布的待审核项目列表
  getPublishProList(bean) {
    if (!bean) {
      bean = {
        teamId: '', // 团体id
        ProName: '', //项目名称(非必)
        pageNum: '',
        pageSize: '',
        albx7310: '',
      }
    }
    return rpcPost('superiorOrganizationReviewsGroupProjectsFortis', { bean })
  },

  // 项目审核
  updateProStateFortis(bean) {
    if (!bean) {
      bean = {
        proId: '', //是	项目id
        albx0532: '', //	是	是否通过（0：不通过  1：通过）
        areaId: '', //	是	区域id
        albx0004: '', // 项目开始时间
        albx0005: '', // 项目结束时间
        albx0533: '', //	是	审核意见
        userFlag: '', //	是	审核队伍账号
      }
    }
    return rpcPost('updateProStateFortis', { bean })
  },

  // 项目审核的已读标识
  whetherTheItemWasViewedFortis(bean) {
    return rpcPost('whetherTheItemWasViewedFortis', { bean })
  },
  // 更新服务类别名称 ,停用/ 启用
  updateOrAddServiecTypeFortis(bean) {
    return rpcPost('updateOrAddServiecTypeFortis', { bean })
  },

  // 新增更新服务领域名称 ,停用/ 启用
  updateOrAddServiecFieldFortis(bean) {
    return rpcPost('updateOrAddServiecFieldFortis', { bean })
  },

  // 查询操作记录详情
  getOperationRecordInfoFortis(bean) {
    return rpcPost('getOperationRecordInfoFortis', { bean })
  },

  // 上级队伍停用/启用下级项目
  setProjectFortis(bean) {
    if (!bean) {
      bean = {
        areaid: '', //	是	队伍区划
        type: '', //	是	状态（1 停用 2 启用 )
        id: '', //	是	队伍id
        userFlag: '', //	是	当前部门或队伍用户名
      }
    }
    return rpcPost('deactivateOrEnalbeProjectFortis', { bean })
  },

  // 查看项目停用启用记录
  viewProjectFortis(bean) {
    if (!bean) {
      bean = {
        proId: '', //	是	队伍区划
        pageNum: '',
        pageSize: '',
      }
    }
    return rpcPost('getProjectOperationRecordFortis', { bean })
  },
}

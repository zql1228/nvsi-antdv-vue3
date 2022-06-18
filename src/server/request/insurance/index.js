import { rpcPost } from '../../conf'
export default {
  // 创建计划
  insertPushPlan(bean) {
    return rpcPost('insertPushPlan', { bean })
  },

  // 删除计划
  deletePushPlan(bean) {
    return rpcPost('deletePushPlan', { bean })
  },

  // 人员加入白名单
  addVolunteerWhite(bean) {
    return rpcPost('addVolunteerWhite', { bean })
  },

  // 人员移出白名单
  removeVolunteerWhite(bean) {
    return rpcPost('removeVolunteerWhite', { bean })
  },

  queryWhiteVolunteerInfor(bean) {
    return rpcPost('queryWhiteVolunteerInfor', { bean })
  },
  // addActivityWhite（活动加入边名单）

  // removeActivityWhite（活动移除白名单）

  // searchActivityWhite（活动列表查询）
}

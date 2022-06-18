import { rpcPost } from '../../conf'
export default {
  // 发布项目
  groupPubProjectFortis(bean) {
    return rpcPost('groupPubProjectFortis', { bean })
  },
  // 删除项目
  delGroupPublishProjectFortis(bean) {
    return rpcPost('delGroupPublishProjectFortis', { bean })
  },
  //撤回项目
  reProjectToDependFortis(bean) {
    return rpcPost('reProjectToDependFortis', { bean })
  },
  //转补录
  groupProjectChangeStateFortis(bean) {
    return rpcPost('groupProjectChangeStateFortis', { bean })
  },
  //项目手动结项
  groupProjectKnotFortis(bean) {
    return rpcPost('groupProjectKnotFortis', { bean })
  },
  //手动结项项目延期
  groupDeferProjectFortis(bean) {
    return rpcPost('groupDeferProjectFortis', { bean })
  },
  //修改运行中的项目招募状态
  groupProjectIsRecruitFortis(bean) {
    return rpcPost('groupProjectIsRecruitFortis', { bean })
  },
  //项目详情 基本信息
  getGroupProjectDetailsFortis(bean) {
    return rpcPost('getGroupProjectDetailsFortis', { bean })
  },
  //项目详情 基本信息修改
  groupModifyProjectFortis(bean) {
    return rpcPost('groupModifyProjectFortis', { bean })
  },
  //项目详情 岗位信息列表
  groupProjectSelPostFortis(bean) {
    return rpcPost('groupProjectSelPostFortis', { bean })
  },
  //项目 新建岗位
  groupProjectAddPostFortis(bean) {
    return rpcPost('groupProjectAddPostFortis', { bean })
  },
  //项目 修改岗位
  groupProjectUpdatePostFortis(bean) {
    return rpcPost('groupProjectUpdatePostFortis', { bean })
  },
  //项目 删除岗位
  groupProjectDelPostFortis(bean) {
    return rpcPost('groupProjectDelPostFortis', { bean })
  },
  //项目详情 签到地点信息列表
  listProjectSelPlacePostFortis(bean) {
    return rpcPost('listProjectSelPlacePostFortis', { bean })
  },
  //项目 新增打卡地点
  groupProjectAddPlacePostFortis(bean) {
    return rpcPost('groupProjectAddPlacePostFortis', { bean })
  },
  //项目 修改打卡地点
  groupProjectUpdatePlacePostFortis(bean) {
    return rpcPost('groupProjectUpdatePlacePostFortis', { bean })
  },
  //项目 删除打卡地点
  groupProjectDelPlacePostFortis(bean) {
    return rpcPost('groupProjectDelPlacePostFortis', { bean })
  },
}

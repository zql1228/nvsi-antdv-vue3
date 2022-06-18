import { rpcPost } from '../conf'
import sumTeamApi from './subTeamManagement'
import projectApi from '../request/ProjectManagement/projectApi'
import infoApi from './InfoManagement'
import teamWorkApi from '../request/TeamWorkBench/teamWorkApi'
import membersManagementApi from './membersManagement'
import timeMangementApi from './timeMangement'
import toolsApi from './tools'
import insuranceApi from './insurance'
// import websiteManagementApi from '../request/websiteMangment/websiteMangmentApi'
import getCodeValue from './getCodeValue'
const apis = {
  // 招募范围设置
  updateRecruitmentScopeFortis(bean) {
    return rpcPost('updateRecruitmentScopeFortis', { bean })
  },

  // 队伍更新或变更信息
  updateOrChangeTeamFortis(bean) {
    if (!bean) {
      bean = {
        id: '', //	是	队伍id
        type: '', //	是	1 更新队伍信息，2：变更队伍信息
        areaId: '', //	是	区域id
        albp0052: '', //	是	队伍用户名
      }
    }
    return rpcPost('updateOrChangeTeamFortis', { bean })
  },

  // 队伍注销
  teamLogOutFortis(bean) {
    return rpcPost('submitAgainFortis', { bean })
  },

  // 注册审核拒绝后再次提交
  submitAgainFortis(bean) {
    return rpcPost('submitAgainFortis', { bean })
  },

  // 下载文件
  downloadFortisLogic(bean) {
    return rpcPost('downloadFortisLogic', { bean })
  },

  // 自己用的资源文件查找及删除
  loadCodeFile(bean) {
    return rpcPost('loadCodeFile', { bean })
  },
  getCodeValue,
}
Object.assign(apis, sumTeamApi)
Object.assign(apis, projectApi)
Object.assign(apis, infoApi)
Object.assign(apis, teamWorkApi)
Object.assign(apis, membersManagementApi)
Object.assign(apis, timeMangementApi)
Object.assign(apis, toolsApi)
Object.assign(apis, insuranceApi)
// Object.assign(apis,websiteManagementApi)
export default apis

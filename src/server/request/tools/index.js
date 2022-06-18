import { rpcPost } from '../../conf'
//  以下是codeValue代码表
export default {
  // 志愿者服务领域
  getServiceFieldListFortis() {
    return rpcPost('getServiceFieldListFortis', { bean: {} })
  },

  // 验证社会统一信用代码
  checkShzhFortis(bean) {
    return rpcPost('checkShzhFortis', { bean })
  },

  // 校验村居社会统一信用代码
  checkCunJuFortis(bean) {
    return rpcPost('checkCunJuFortis', { bean })
  },

  // 验证队伍名称是否存在
  checkTeamNameFortis(bean) {
    return rpcPost('checkTeamNameFortis', { bean })
  },
}

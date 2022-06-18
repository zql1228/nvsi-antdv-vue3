import { rpcPost, getLsid } from '@/server/conf'
import { LocalSetToken, LocalSetUserInfo, LocalGetUserInfo } from '@/utils/localStorage'
import { message } from 'ant-design-vue'
import encodes from '@/utils/leap/encodes'
import { SYSTEM_NAME } from '@/utils/config'

export const leapLogin = (par) => {
  return new Promise((resolve, reject) => {
    getLsid().then((res) => {
      if (!res) {
        reject(new Error('服务异常！'))
      }
      LocalSetToken(res)
      const pass = encodes(par['password'], res)
      const username = par['userFlag']
      const validCode = par['code']
      rpcPost('app_systemloginWithSystemName', [username, pass, SYSTEM_NAME, null, validCode, null])
        .then((loginRes) => {
          let msg = ''
          if (loginRes.result == -100) {
            msg = '帐号已被锁定'
          }
          if (loginRes.result == -101) {
            msg = 'IP地址登录异常，系统将锁定该IP'
          }
          if (loginRes.result == -6) {
            msg = '验证码错误'
          }
          if (loginRes.result !== 1 && msg) {
            reject(msg)
          } else {
            getModuleAuthoritys()
              .then(async (userRes) => {
                // LocalSetUserInfo(userRes.userinfo)
                const info = await getTeamInfo(userRes.userinfo)
                info.areaid == '100000000000000000' || info.areaid == '000000000000000000' ? (info.areaLevel = 0) : '' //如果账号是全国区划 将级别设置为0
                LocalSetUserInfo(info)
              })
              .finally(() => {
                resolve(loginRes)
              })
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  })
}

export const getModuleAuthoritys = () => {
  let par = {
    n: 'index13',
    g: true,
    r: true,
  }
  return rpcPost('app_getLogicModuleOperations', par)
}

export const getMenuList = () => {
  let _p = [
    null,
    'false',
    1,
    '["clustername", "indexpagemodulestyle", "indexpagemodulemargin", "expendtreenode", "haschild", "resourcetype", "icon", "officon"]',
  ]

  return rpcPost('getAuthorityMenu', _p)
}

export const getTeamInfo = async (userInfo) => {
  let localUserInfo = userInfo
  const bean = {
    userflag: localUserInfo.userflag,
    areaid:
      localUserInfo.areaid == '100000000000000000' || localUserInfo.areaid == '000000000000000000' ? '100000000000000000' : localUserInfo.areaid, //全国的队伍传100000000000000000
  }
  const res = await rpcPost('getGroupInfoByUserFlagFortisLogic', { bean })
  if (res) {
    let teamInfo = res.data
    if (!teamInfo) {
      console.log('队伍信息获取失败！')
      teamInfo = {
        groupid: '',
      }
    }
    if (teamInfo) {
      localUserInfo.team = teamInfo
      // LocalSetUserInfo(localUserInfo)
    }
  }
  // LocalSetUserInfo(localUserInfo)
  return localUserInfo
}

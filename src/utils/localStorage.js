import CryptoJS from 'crypto-js'
import { ACCESS_TOKEN, USERINFO, USER_MENU, USER_ROLE, TEAM_VIEW_INFO, VOLUNTEER_INFO, PROJECT_INFO } from '@/store/mutation-types'
const TOKEN_EXPIRE = 7 * 24 * 60 * 60 * 1000
const USER_ROLE_EXPIRE = 1 * 60 * 60 * 1000

const K = 'bQsV1xwMkzgrJ3PN'

export const localSetItem = (key, val, expire) => {
  let obj = {
    data: val,
    time: Date.now(),
    expire: expire,
  }
  const encryptData = CryptoJS.AES.encrypt(JSON.stringify(obj), K).toString()
  localStorage.setItem(key, encryptData)
}

export const localGetItem = (key) => {
  if (key) {
    let val = localStorage.getItem(key)
    if (!val) {
      return val
    }
    val = CryptoJS.AES.decrypt(val, K)
    if (!val) {
      return val
    }
    val = JSON.parse(val.toString(CryptoJS.enc.Utf8))
    if (val.expire && Date.now() - val.time > val.expire) {
      localStorage.removeItem(key)
      return null
    }
    return val.data
  }
  return null
}

export const localRemoveItem = (key) => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key)
  }
}

export const LocalSetToken = (value) => {
  localSetItem(ACCESS_TOKEN, value, TOKEN_EXPIRE)
}

export const LocalGetToken = () => {
  return localGetItem(ACCESS_TOKEN)
}

export const LocalSetUserInfo = (value) => {
  localSetItem(USERINFO, value, TOKEN_EXPIRE)
}

export const LocalGetUserInfo = () => {
  return localGetItem(USERINFO)
}

export const LocalSetMenu = (value) => {
  localSetItem(USER_MENU, value, TOKEN_EXPIRE)
}

export const LocalGetMenu = () => {
  return localGetItem(USER_MENU)
}

export const LocalSetUserRole = (value) => {
  localSetItem(USER_ROLE, value, USER_ROLE_EXPIRE)
}

export const LocalGetUserRole = () => {
  return localGetItem(USER_ROLE)
}

// 队伍信息查看 点击队伍名字 存的队伍信息
export const LocalSetTeamViewInfo = (value) => {
  localSetItem(TEAM_VIEW_INFO, value, USER_ROLE_EXPIRE)
}

export const LocalGetTeamViewInfo = () => {
  return localGetItem(TEAM_VIEW_INFO)
}

// 志愿者详情
export const LocalSetVolunteerInfo = (value) => {
  localSetItem(VOLUNTEER_INFO, value, USER_ROLE_EXPIRE)
}

export const LocalGetVolunteerInfo = () => {
  return localGetItem(VOLUNTEER_INFO)
}

// 跳转到项目详情页的参数
export const LocalSetProjectInfo = (value) => {
  localSetItem(PROJECT_INFO, value, USER_ROLE_EXPIRE)
}

export const LocalGetProjectInfo = () => {
  return localGetItem(PROJECT_INFO)
}

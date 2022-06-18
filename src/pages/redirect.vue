<template>
  <!-- 没有任何操作，仅作为单点登录中间重定向跳转判断 -->
  <div></div>
</template>
<script>
import { useRoute, useRouter } from 'vue-router'
import { defineComponent, onMounted } from 'vue'
import { getSM4, webLogin } from '@/server/conf/webRequest'
import { getModuleAuthoritys, getTeamInfo } from '@/server/request/LeapServer'
import { LocalSetUserInfo, LocalSetUserRole, LocalSetToken } from '@/utils/localStorage'
export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    /* const autoLogin = () => {
      LocalSetUserRole([]) //清除上次登录的用户的权限，以便重新获取
      getModuleAuthoritys().then(async (userRes) => {
        const info = await getTeamInfo(userRes.userinfo)
        info.areaid == '100000000000000000' || info.areaid == '000000000000000000' ? (info.areaLevel = 0) : '' //如果账号是全国区划 将级别设置为0
        LocalSetUserInfo(info)
        let name = route.params.type
        if (name == 'mcaworkbench' || !info.team.groupid) {
          //管理部门
          router.push('/' + name)
        } else {
          //队伍
          if (info.team.albe0026 && info.team.albe0026 == 1) {
            //审核通过 -工作台
            router.push('/' + name)
          } else {
            //待审核或者不通过 - 队伍资料
            router.push('/teamProfile')
          }
        }
      })
    } */

    const autoLogin = () => {
      LocalSetUserRole([]) //清除上次登录的用户的权限，以便重新获取
      let userinfo = route.query.userinfo
      let Dinfo = getSM4().decrypt(userinfo)
      let username = JSON.parse(Dinfo).username
      let password = JSON.parse(Dinfo).password
      webLogin({ username: username, password: password }).then((res) => {
        let Lsid = res.data.cursessionid
        LocalSetToken(Lsid)
        getModuleAuthoritys().then(async (userRes) => {
          const info = await getTeamInfo(userRes.userinfo)
          info.areaid == '100000000000000000' || info.areaid == '000000000000000000' ? (info.areaLevel = 0) : '' //如果账号是全国区划 将级别设置为0
          LocalSetUserInfo(info)
          let name = route.query.type
          if (name == 'mcaworkbench' || !info.team.groupid) {
            //管理部门
            router.push('/' + name)
          } else {
            //队伍
            if (info.team.albe0026 && info.team.albe0026 == 1) {
              //审核通过 -工作台
              router.push('/' + name)
            } else {
              //待审核或者不通过 - 队伍资料
              router.push('/teamProfile')
            }
          }
        })
      })
    }
    onMounted(() => {
      autoLogin()
    })
  },
})
</script>

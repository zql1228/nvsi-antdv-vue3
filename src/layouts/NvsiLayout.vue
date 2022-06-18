<template>
  <a-layout class="nv-layout">
    <a-layout-header class="header nv-header">
      <div class="layout_header_logo">
        <img src="@/assets/img/nvsi-logo.png" alt="" />
        <span>全国志愿服务信息系统</span>
      </div>
      <!-- :default-selected-keys="['2']"  -->
      <!-- 这里读的是快捷键里面的配置 或者给定一个特殊的标识，然后读里面的页面  -->
      <a-menu theme="dark" mode="horizontal" popupClassName="" :style="{ lineHeight: '72px', float: 'right' }">
        <!-- 正常队伍才有快捷键 -->
        <template v-if="userInfo.team && userInfo.team.groupid && userInfo.team.albe0026 == '1'">
          <!-- 队伍快捷键 -->
          <a-menu-item
            key="1"
            class="nv-top-menu nv-top-logout"
            @click="
              () => {
                router.push('/unreleasedProject')
              }
            "
          >
            <img class="header_icon" src="@/assets/img/headerImg/team1.png" />
            项目发布
          </a-menu-item>
          <a-menu-item
            key="2"
            class="nv-top-menu nv-top-logout"
            @click="
              () => {
                router.push('/timeEntry')
              }
            "
          >
            <img class="header_icon" src="@/assets/img/headerImg/team2.png" />
            时长录入
          </a-menu-item>
          <a-menu-item
            key="3"
            class="nv-top-menu nv-top-logout"
            @click="
              () => {
                router.push('/auditMembers')
              }
            "
          >
            <img class="header_icon" src="@/assets/img/headerImg/team3.png" />
            志愿审核
          </a-menu-item>
          <a-menu-item
            key="4"
            class="nv-top-menu nv-top-logout"
            @click="
              () => {
                router.push('/teamProfile')
              }
            "
          >
            <img class="header_icon" src="@/assets/img/headerImg/team1.png" />
            队伍资料
          </a-menu-item>
        </template>
        <!-- 管理部门 -->
        <template v-if="userInfo.team && !userInfo.team.groupid">
          <a-menu-item
            key="5"
            class="nv-top-menu nv-top-logout"
            @click="
              () => {
                router.push('/volunteerInquiry')
              }
            "
          >
            <img class="header_icon" src="@/assets/img/headerImg/mc1.png" />
            志愿者查询
          </a-menu-item>
          <a-menu-item
            key="6"
            class="nv-top-menu nv-top-logout"
            @click="
              () => {
                router.push('/teamQuery')
              }
            "
          >
            <img class="header_icon" src="@/assets/img/headerImg/mc2.png" />
            队伍查询
          </a-menu-item>
          <a-menu-item
            key="7"
            class="nv-top-menu nv-top-logout"
            @click="
              () => {
                router.push('/projectQuery')
              }
            "
          >
            <img class="header_icon" src="@/assets/img/headerImg/mc3.png" />
            项目查询
          </a-menu-item>
          <a-menu-item
            key="8"
            class="nv-top-menu nv-top-logout"
            @click="
              () => {
                router.push('/mcaworkNotice')
              }
            "
          >
            <img class="header_icon" src="@/assets/img/headerImg/mc4.png" />
            发布公告
          </a-menu-item>
        </template>
        <!-- 志愿保险 -->

        <a-menu-item key="9" class="nv-top-menu nv-top-logout" @click="confirmLogout">
          <logout-outlined />
          退出
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout-sider
        class="nv-sider"
        width="216"
        v-model:collapsed="collapsed"
        collapsible
        :style="{
          background: 'linear-gradient(186deg, #FFF8F7 0%, #FFFFFF 100%)',
        }"
      >
        <!--头像-->
        <div class="nv-sider-header">
          <div
            class="heade-img"
            :style="{
              width: collapsed ? '40px' : '80px',
              height: collapsed ? '40px' : '80px',
              position: 'relative',
            }"
          >
            <img style="width: 100%; height: 100%" :src="headPortraitImg()" alt="" />
            <!-- @click="visible3 = true" -->
            <!-- 设置新密码 -->
            <setting-outlined style="position: absolute; bottom: -3px; right: -7px; color: #d92f2f; font-size: 20px" @click="visible2 = true" />
          </div>
          <div class="header-name" v-show="!collapsed" :title="userInfo.fullName" style="cursor: default">
            {{ userInfo.fullName }}
          </div>
        </div>
        <div
          :style="{
            paddingTop: '12px',
            height: 'calc(100vh - 184px - 72px - 48px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '100%',
            border: 0,
          }"
        >
          <a-menu
            mode="inline"
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            :style="{
              width: '99%',
              border: 0,
            }"
          >
            <template v-for="item in menus" :key="item.name">
              <!-- 这里控制权限 -->
              <template v-if="!item.hidden">
                <template v-if="!item.children">
                  <a-menu-item :key="item.path" @click="menuHandle(item.path)">
                    <user-outlined />
                    <span>{{ item.meta.title }}</span>
                  </a-menu-item>
                </template>
                <template v-else>
                  <sub-menu :key="item.path" :menu-info="item" @menuHandle="menuHandle" />
                </template>
              </template>
            </template>
          </a-menu>
        </div>
      </a-layout-sider>

      <a-layout>
        <a-layout-content style="width: 100%; flex: 1; oveflow: hidden">
          <multi-tab></multi-tab>
          <transition name="page-transition" />
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" :key="route.path" v-if="route.meta.keepAlive" />
            </keep-alive>
            <component :is="Component" :key="route.path" v-if="!route.meta.keepAlive" />
          </router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <!-- 使用帮助 -->
    <useHelp :visible="visible1" @child="visible1 = false"></useHelp>
    <!-- 修改密码 -->
    <ChangePassword :visible="visible2" @child="visible2 = false"></ChangePassword>
    <!-- 修改头像 -->
    <headerImg :visible="visible3" @child="visible3 = false"></headerImg>
  </a-layout>
</template>
<script>
import useHelp from '@/layouts/component/useHelp.vue'
import ChangePassword from '@/layouts/component/ChangePassword.vue'
import headerImg from '@/layouts/component/headerImg.vue'
import SubMenu from '@/layouts/component/SubMenu.vue'
import { useRouter, useRoute } from 'vue-router'
import { defineComponent, reactive, toRefs, watch, onMounted, ref } from 'vue'
import store from '@/store'
import { LocalGetMenu, LocalGetUserInfo } from '@/utils/localStorage'
import { Modal } from 'ant-design-vue'
import { QuestionCircleOutlined, SettingOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    SubMenu,
    useHelp, // 使用帮助
    ChangePassword, // 修改密码
    headerImg, //修改头像
    QuestionCircleOutlined,
    SettingOutlined,
    LogoutOutlined,
    UserOutlined,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      selectedKeys: [],
      openKeys: [],
      menus: [],
      userInfo: {},
    })

    const initMenus = () => {
      const routeName = route.name
      const matched = route.matched

      state.selectedKeys = state.openKeys = []
      state.selectedKeys.push(routeName)
      if (matched && matched.length > 2) {
        state.openKeys = [matched[1].name]
      }
    }
    const getMenus = () => {
      const mainMenu = LocalGetMenu()
      if (mainMenu && mainMenu.children) {
        state.menus = mainMenu.children
      }
    }

    const menuHandle = (arg) => {
      if (arg) {
        router.push({ path: arg })
      }
    }
    const headPortraitImg = () => {
      //头像显示
      if (state.userInfo.team && state.userInfo.team.groupid) {
        return require('@/assets/img/headPortraitImg/team.png')
      } else if (state.userInfo.areaLevel == '0') {
        return require('@/assets/img/headPortraitImg/wholecountry.png')
      } else if (state.userInfo.areaLevel == '1') {
        return require('@/assets/img/headPortraitImg/county.png')
      } else if (state.userInfo.areaLevel == '2') {
        return require('@/assets/img/headPortraitImg/city.png')
      } else {
        return require('@/assets/img/headPortraitImg/area.png')
      }
    }

    watch(
      () => route.fullPath,
      async () => {
        initBreadcrumb()
      }
    )

    /**
     * 初始选中菜单
     */
    const initBreadcrumb = () => {
      const _matched = route.matched
      let _openKeys = []
      _matched.forEach((item) => {
        _openKeys.push(item.path)
      })
      state.openKeys = _openKeys
      state.selectedKeys = _openKeys // [route.path]
    }

    const confirmLogout = () => {
      // 退出清理了localstorage，但是路由表没有清理，所以菜单没有显示
      Modal.confirm({
        title: '提醒',
        content: '确定退出系统吗？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          store.dispatch('Logout').then(() => {
            router.push({ path: '/login' })
          })
        },
        onCancel() {},
      })
    }

    onMounted(() => {
      getMenus()
      initMenus()
      initBreadcrumb()
      state.userInfo = LocalGetUserInfo()
    })

    return {
      route,
      ...toRefs(state),
      menuHandle,
      confirmLogout,
      collapsed: ref(false),
      visible1: ref(false), // 使用帮助
      visible2: ref(false), // 修改密码
      visible3: ref(false), //修改头像
      router,
      headPortraitImg,
    }
  },
})
</script>

<style lang="less">
.header_icon {
  width: 1em;
  height: 1em;
  margin-bottom: 2.5px;
}
</style>

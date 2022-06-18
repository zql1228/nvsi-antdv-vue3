<template>
  <div class="multitab-wrapper">
    <div class="ant-pro-multi-tab">
      <div class="ant-pro-multi-tab-wrapper">
        <a-tabs
          hideAdd
          type="editable-card"
          v-model:activeKey="activeKey"
          :tabBarStyle="{
            background: '#FFF',
            margin: '0',
            paddingLeft: '16px',
            paddingTop: '1px',
          }"
          @edit="onEdit"
        >
          <a-tab-pane v-for="page in pages" :style="{ height: 0 }" :key="page.fullPath" :closable="pages.length > 1">
            <template #tab>
              <a-dropdown trigger="[contextmenu]">
                <span :style="{ userSelect: 'none' }">{{ page.meta.title }}</span>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="closeThat">关闭当前标签</a-menu-item>
                    <a-menu-item key="closeRight">关闭右侧</a-menu-item>
                    <a-menu-item key="closeLeft">关闭左侧</a-menu-item>
                    <a-menu-item key="closeAll">关闭全部</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <div class="clear" @click="clearAll">
      <span>全部清除</span>
      <delete-outlined />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, onMounted, watch } from 'vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { useRoute, useRouter } from 'vue-router'
// props, { attrs, emit, slots, expose }
export default defineComponent({
  name: '',
  components: { DeleteOutlined },
  props: {},
  setup() {
    const state = reactive({
      loading: false,

      fullPathList: [],
      pages: [],
      newTabIndex: 0,
    })
    const activeKey = ref('')
    const route = useRoute()
    const router = useRouter()
    onMounted(() => {
      pushRoute(route)
    })
    const pushRoute = (arg) => {
      const newActiveKey = arg.fullPath
      activeKey.value = newActiveKey
      if (state.fullPathList.indexOf(newActiveKey) < 0) {
        state.pages.push(getRouteInfo(arg))
        state.fullPathList.push(newActiveKey)
      }
    }
    const getRouteInfo = (arg) => {
      arg = toRefs(arg)
      return {
        fullPath: arg.fullPath.value,
        meta: arg.meta.value,
        name: arg.name.value,
        params: arg.params.value,
        path: arg.path.value,
        query: arg.query.value,
      }
    }

    const remove = (targetKey) => {
      state.pages = state.pages.filter((page) => page.fullPath !== targetKey)
      state.fullPathList = state.fullPathList.filter((path) => path !== targetKey)
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!state.fullPathList.includes(activeKey.value)) {
        selectedLastPath()
      }
    }

    const selectedLastPath = () => {
      activeKey.value = state.fullPathList[state.fullPathList.length - 1]
    }
    watch(route, (prevRoute) => {
      pushRoute(prevRoute)
    })
    watch(activeKey, (prevActiveKey) => {
      router.push({ path: prevActiveKey })
    })
    const clearAll = () => {
      const currentIndex = state.fullPathList.indexOf(activeKey.value)
      state.fullPathList.forEach((item, index) => {
        if (index !== currentIndex) {
          remove(item)
        }
      })
    }
    const onEdit = (targetKey) => {
      remove(targetKey)
    }
    return {
      ...toRefs(state),
      onEdit,
      clearAll,
      activeKey,
      remove,
    }
  },
})
</script>
<style lang="less" scoped>
.multitab-wrapper {
  position: relative;
  .ant-pro-multi-tab {
    margin: 0;
    width: 92%;
    :deep(.ant-tabs) {
      .ant-tabs-nav-container {
        background: #f9f9f9;
        box-shadow: 0px 2px 12px rgba(189, 159, 159, 0.18);
      }
      .ant-tabs-bar {
        padding: 0 !important;
        .ant-tabs-tab {
          position: relative;
          padding: 0 24px;
          margin: 0;
          min-width: 160px;
          border: none;
          &::after {
            content: '';
            display: inline-block;
            position: absolute;
            top: 8px;
            right: 0;
            width: 1px;
            height: 24px;
            background: #d0d0d0;
          }
          .ant-tabs-close-x {
            position: absolute;
            right: 17px;
            top: 12px;
          }
        }
      }
    }
  }

  .clear {
    cursor: pointer;
    position: absolute;
    top: 9.5px;
    right: 24px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    .anticon {
      position: relative;
      top: 1px;
      margin-left: 7px;
    }
  }
}
</style>

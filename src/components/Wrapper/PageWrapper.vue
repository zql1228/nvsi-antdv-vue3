<template>
  <div
    class="nvsi-header-wrapper"
    :style="{
      // backgroundColor: '#f5f5f5',
      height: 'calc(100vh - 72px - 40px)',
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <template v-if="breadCrumbList.length">
      <a-breadcrumb class="breadcrum">
        <a-breadcrumb-item class="cursor" @click="menuHandle('/')"
          >首页</a-breadcrumb-item
        >
        <a-breadcrumb-item
          class="cursor"
          v-for="(item, index) in breadCrumbList"
          :key="index"
          @click="menuHandle(item.path)"
          >{{ item.title }}</a-breadcrumb-item
        >
      </a-breadcrumb>
    </template>
    <template v-if="show">
      <a-page-header
        :ghost="false"
        :isHidden="show"
        :style="{
          paddingTop: '0px !important',
          paddingBottom: '8px !important',
        }"
      >
        <!-- 页面自定义添加个性化东西 -->
        <slot name="headerContent"></slot>
      </a-page-header>
    </template>
    <div
      ref="contentRef"
      :style="{
        padding: '12px',
        // background: '#F6F5F5',
        flex: 1,
        overflow: 'hidden',
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { defineComponent, computed, ref, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'PageWrapper',
  inheritAttrs: false,
  props: {
    contentStyle: {
      type: Object,
    },
    show: {
      type: Boolean,
    },
    breadCrumbList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()

    const breadCrumb = ref([])
    breadCrumb.value = route.matched
    breadCrumb.value?.forEach((item) => {
      item['breadcrumbName'] = item.meta?.title
    })
    provide(computed(() => props.fixedHeight))

    const menuHandle = (arg) => {
      if (arg) router.push({ path: arg })
    }

    return {
      breadCrumb,
      route,
      menuHandle,
    }
  },
})
</script>
<style lang="less" scoped>
.ant-page-header,
.ant-page-header-content {
  padding-top: 0px;
}
.breadcrum {
  padding: 7px 0 7px 24px !important;
  line-height: 22px;
  background: #fff;
  margin-top: 1px;
  font-size: 14px;
}
.cursor {
  cursor: pointer;
}
</style>

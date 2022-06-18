<template>
  <a-breadcrumb class="breadcrum">
    <a-breadcrumb-item
      class="cursor"
      v-for="(item, index) in breadCrumb"
      :key="index"
      @click="menuHandle(item.path,item)"
      >{{ item.meta.title }}</a-breadcrumb-item
    >
  </a-breadcrumb>
</template>
<script>
import { defineComponent, watch, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  props: {
    breadCrumb: Array,
    default: [],
  },
  setup(props) {
    const state = reactive({
      list: [],
    })

    watch(
      () => props.breadCrumb,
      async (breadCrumbVal) => {
        state.list = breadCrumbVal
      }
    )

    const router = useRouter()
    const menuHandle = (arg,item) => {
      if(arg && item.components.default.name!='BlankLayout'){
        router.push({ path: arg })
      }
    }

    return {
      ...toRefs(state),
      menuHandle,
    }
  },
})
</script>
<style scoped>
.breadcrum {
  /* height: 50px; */
  padding: 7px 0 7px 24px;
  line-height: 22px;
  background: #fff;
  margin-top: 1px;
  font-size: 14px;
}
.cursor{
  cursor: pointer;
}
</style>

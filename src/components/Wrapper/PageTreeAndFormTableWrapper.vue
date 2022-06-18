<template>
  <PageWrapper>
    <div
      :style="{
        height: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }"
    >
      <a-row :gutter="24" :style="{ height: '100%' }">
        <a-col :md="4" :sm="24" :style="{ height: '100%' }">
          <!-- 左边 -->
          <!--设定高度 以便虚拟滚动  -->

          <div
            style="padding-top: 12px; height: calc(100vh  - 184px); overflow: hidden auto; width: 100%; border: 0px;  background: #fff;"
          >
            <slot name="leftTree"></slot>
          </div>
        </a-col>
        <a-col
          :md="20"
          :sm="24"
          :style="{
            height: '100%',
            paddingLeft: '12px',
            display: 'flex',
            flexDirection: 'column'
          }"
        >
          <!-- 右边 -->
          <BasicSearchForm v-if="showSearchForm !== false">
            <slot name="searchForm"></slot>
          </BasicSearchForm>
          <div style="padding-bottom: 12px" v-if="showSearchForm !== false"></div>
          <BasicSearchTable>
            <template #table>
              <slot name="table"></slot>
            </template>
            <template #pagination>
              <slot name="pagination"></slot>
            </template>
          </BasicSearchTable>
        </a-col>
      </a-row>
    </div>
  </PageWrapper>
</template>

<script>
import {
  defineComponent
} from 'vue'
import VueTypes from 'vue-types'
export default defineComponent({
  props: {
    showSearchForm: VueTypes.bool.def(true),
    showLeftTree: VueTypes.bool.def(false),
  },
  setup() {
    return {}
  },
})
</script>

<style scoped></style>
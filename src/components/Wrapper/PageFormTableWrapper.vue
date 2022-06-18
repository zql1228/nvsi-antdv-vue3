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
      <BasicSearchForm v-if="showSearchForm !== false" :cus_search_Style="cus_search_Style">
        <slot name="searchForm"></slot>
      </BasicSearchForm>
      <div style="padding-bottom: 12px" v-if="showSearchForm !== false || cus_search_Style"></div>
      <BasicSearchTable :cus_search_Style="cus_searchTable_Style">
        <template #table>
          <slot name="table"></slot>
        </template>
        <template #pagination>
          <slot name="pagination"></slot>
        </template>
      </BasicSearchTable>
    </div>
  </PageWrapper>
</template>

<script>
import { defineComponent, toRefs } from 'vue'
import VueTypes from 'vue-types'
export default defineComponent({
  props: {
    showSearchForm: VueTypes.bool,
    cus_search_Style: VueTypes.object,
    cus_searchTable_Style: VueTypes.object,
  },
  setup(props) {
    return {
      ...toRefs(props),
    }
  },
})
</script>

<style scoped></style>

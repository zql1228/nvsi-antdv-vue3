<template>
  <div
    :style="{
      height: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <div class="table-page-search-wrapper">
      <a-card :bordered="false">
        <slot name="searchForm"></slot>
      </a-card>
    </div>
    <a-card
      :bordered="false"
      :bodyStyle="cardTableStyle"
      style="flex: 1;overflow: hidden;"
    >
      <div style="border-top: 1px solid #E9E9E9; padding-bottom: 16px"></div>
      <div style="height: 100%; " class="nvis-table">
        <slot name="table"></slot>
        <slot name="pagination"></slot>
      </div>
    </a-card>

    <!-- <div style="flex: 1;overflow: hidden;">
      <a-card
        :bordered="false"
        :bodyStyle="cardTableStyle"
        style="height: 100%; overflow-y: auto;"
      >
        <slot name="table"></slot>
        <br />
        <slot name="pagination"></slot>
      </a-card>
    </div> -->
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { cardFormSearchStyle, cardTableStyle } from '@/utils/style.js'
export default defineComponent({
  setup() {
    return {
      cardTableStyle,
      cardFormSearchStyle,
    }
  },
})
</script>

<style scoped></style>

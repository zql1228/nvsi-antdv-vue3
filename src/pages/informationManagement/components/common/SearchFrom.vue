<template>
  <a-form-model :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }" :model="searchForm">
    <a-row :gutter="24">
      <a-col :md="6" :sm="24">
        <a-form-item label="姓名">
          <a-input v-model="searchForm.volunteerName" placeholder="请输入志愿者姓名" />
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item label="身份证号">
          <a-input v-model="searchForm.cardId" placeholder="请输入志愿者身份证号" />
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <span class="table-page-search-submitButtons">
          <a-button type="primary">查询</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
        </span>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'

export default defineComponent({
  setup() {
    const searchForm = reactive({
      volunteerName: '',
      cardId: '',
    })
    return {
      searchForm,
    }
  },
})
</script>

<style scoped lang="less"></style>

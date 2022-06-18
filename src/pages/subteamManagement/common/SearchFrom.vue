<template>
  <a-form
    ref="searchFormRef"
    :model="queryParam"
    :label-col="{
      xs: { span: 24 },
      sm: { span: 6 },
    }"
    :wrapper-col="{
      xs: { span: 24 },
      sm: { span: 18 },
    }"
  >
    <a-row :gutter="24">
      <a-col :md="5" :sm="24">
        <a-form-item label="姓名">
          <a-input v-model:value="queryParam.volunteerName" placeholder="" />
        </a-form-item>
      </a-col>
      <a-col :md="5" :sm="24">
        <a-form-item label="身份证号">
          <a-input v-model:value="queryParam.cardNo" placeholder="" />
        </a-form-item>
      </a-col>
      <a-col :md="5" :sm="24">
        <span class="table-page-search-submitButtons">
          <a-space>
            <a-button type="primary" size="large" @click="refresh">
              查询
            </a-button>
            <a-button @click="resetForm" size="large">重置</a-button>
          </a-space>
        </span>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'

export default defineComponent({
  setup() {
    const queryParam = reactive({
      volunteerName: '',
      cardNo: '',
    })
    const resetForm = () => {}
    const refresh = () => {}
    return {
      queryParam,
      resetForm,
      refresh,
    }
  },
})
</script>

<style scoped lang="less"></style>

<template>
  <!-- <BasicSearchForm> -->
  <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }" ref="searchref">
    <a-row>
      <a-col :md="6" :sm="24" v-if="areaLevel == 0">
        <a-form-item label="服务区域">
          <AreaDevNew placeholder="请选择区域" :showAll="true" v-model:value="queryParam.albx0021"></AreaDevNew>
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item label="姓名">
          <a-input placeholder="请输入姓名" v-model:value="queryParam.albp0003" @focus="onFocus(1)" />
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item label="身份证号">
          <a-input placeholder="请输入身份证号" :maxLength="18" v-model:value="queryParam.albp0005" @focus="onFocus(2)" />
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="searchVol(1)">查询</a-button>
            <a-button @click="searchVol(2)">重置</a-button>
          </a-space>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row> </a-row>
  </a-form>
  <!-- </BasicSearchForm> -->
</template>
<script>
import { defineComponent, reactive, toRef, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
export default defineComponent({
  setup(props, { emit }) {
    const userInfo = ref(LocalGetUserInfo())
    const areaLevel = userInfo.value.areaLevel
    const queryParam = reactive({
      albp0003: '',
      albp0005: '',
      albx0021: [],
    })
    const searchref = ref()
    const onFocus = (val) => {
      if (val == 1) {
        queryParam.albp0005 = ''
      } else {
        queryParam.albp0003 = ''
      }
    }
    const init = () => {
      queryParam.albp0003 = ''
      queryParam.albp0005 = ''
      queryParam.albx0021 = []
    }
    onMounted(() => {
      nextTick(() => {
        init()
      })
    })

    const searchVol = (val) => {
      if (val == 2) {
        init()
      }
      emit('searchVol', { queryParam }) //调用父组件方法
    }
    const backQueryparam = () => {
      return queryParam
    }
    watch(
      () => queryParam,
      () => {}
    )
    return {
      queryParam,
      ...toRefs(props),
      onFocus,
      init,
      searchref,
      searchVol,
      backQueryparam,
      areaLevel,
    }
  },
})
</script>
<style scoped>
.m-label .ant-form-item-label > label {
  width: 70px;
}
</style>

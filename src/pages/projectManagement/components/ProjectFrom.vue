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
      <a-col :md="6" :sm="24" v-if="userInfo.areaLevel == '0'">
        <a-form-item label="服务区域">
          <AreaDevide ref="area" :showAll="false" :showLevel="3" :type="false" v-model:value="queryParam.albx0021"></AreaDevide>
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item label="项目名称" name="albx0002">
          <a-input v-model:value="queryParam.albx0002" placeholder="项目名称" />
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="select">
              查询
            </a-button>
            <a-button @click="resetForm">
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted, nextTick } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import { LocalSetProjectInfo } from '@/utils/localStorage.js'

export default defineComponent({
  props: {},
  components: {},
  setup(props, text) {
    const area = ref()
    const userInfo = ref(LocalGetUserInfo())
    const searchFormRef = ref()
    const queryParam = reactive({
      albx0021: [], //区划
      albx0002: '', //项目名称
    })

    onMounted(() => {
      userInfo.value = LocalGetUserInfo()
      if (userInfo.value.areaLevel == '0') {
        //全国账号
        queryParam.albx0021 = ['100000000000000000']
        console.log(area, 'area')
        area.value.defaultInitArea(queryParam.albx0021)
      }
      // nextTick(() => {})
    })
    const select = () => {
      //查询
      text.emit('child', queryParam)
    }
    const resetForm = () => {
      //重置
      searchFormRef.value.resetFields()
      text.emit('child', queryParam)
    }
    return {
      area,
      userInfo,
      searchFormRef,
      queryParam,
      select,
      resetForm,
    }
  },
})
</script>
<style lang="scss" scoped></style>

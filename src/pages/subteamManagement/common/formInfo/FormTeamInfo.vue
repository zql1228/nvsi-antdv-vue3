<template>
  <!-- 队伍信息- 1 -->
  <a-form ref="form_teamInfo" :model="formParam" :rules="rules" layout="vertical" class="nv-form" :style="{ padding: ' 0 24px' }">
    <a-card title="队伍信息" :bordered="false" style="width: 100%; padding: 0px">
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <a-form-item label="队伍名称" name="albe0002">
            <a-input
              placeholder=""
              v-model:value="formParam.albe0002"
              :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              @change="changeTeamName"
            />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="用户名" name="albp0052">
            <a-input placeholder="" v-model:value="formParam.albp0052" disabled />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="队伍联络编号" name="albe0041">
            <a-input placeholder="" v-model:value="formParam.albe0041" disabled />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="8" :sm="24">
          <a-form-item label="服务区域" name="albe0012">
            <!-- 这个区划必有 -->
            <!--  -->
            <AreaDevNew
              placeholder="请选择服务区域"
              style="width: 100%"
              :showAll="false"
              :type="false"
              :showLevel="4"
              v-model:value="albe0012"
              ref="serAreaRef"
              @changeArea="changeArea"
              :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
            ></AreaDevNew>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="成立日期" name="albe0015">
            <a-date-picker
              placeholder="请选择成立日期"
              class="timePicker"
              v-model:value="formParam.albe0015"
              :disabled-date="disabledDate"
              :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
            />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="详细地址" name="albe0013" extra="请点击右边的地图图标在地图上选择项目详细地址" class="formItemMap">
            <a-input disabled v-model:value="formParam.albe0013" placeholder="详细地址"> </a-input>
            <a-button
              v-show="comType !== 'review'"
              @click="toggleMap"
              size="large"
              type="primary"
              :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
            >
              地图选择
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item name="albe0017">
            <template #label>服务类别<span class="nv-tips">（选择此项目的服务类别，最多可选4项）</span></template>
            <a-checkbox-group
              v-model:value="formParam.albe0017"
              :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
            >
              <a-row>
                <a-col :span="4" v-for="item in codeValue.nvsiAlbx0005" :key="item.label">
                  <a-checkbox :value="item.codeid" :disabled="formParam.albe0017.length == 4 && formParam.albe0017.indexOf(item.value) == -1">{{
                    item.codevalue
                  }}</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="12" :sm="24">
          <a-form-item name="albe0042">
            <template #label>队伍提供</template>
            <a-checkbox-group
              style="display: flex"
              v-model:value="formParam.albe0042"
              :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
            >
              <a-col :span="6" v-for="item in codeValue.nvsiAlbe0042" :key="item.label">
                <a-checkbox :value="item.value">{{ item.label }}</a-checkbox>
              </a-col>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item name="albe0043">
            <template #label>队伍需要</template>
            <a-checkbox-group
              style="display: flex"
              v-model:value="formParam.albe0043"
              :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
            >
              <a-col :span="6" v-for="item in codeValue.nvsiAlbe0043" :key="item.label">
                <a-checkbox :value="item.value">{{ item.label }}</a-checkbox>
              </a-col>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="12" :sm="24">
          <a-row>
            <a-form-item name="albe0040" label="队伍网站" style="width: 100%">
              <a-input
                placeholder="请输入队伍网站"
                v-model:value="formParam.albe0040"
                :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
              />
            </a-form-item>
          </a-row>
          <a-row :gutter="24" style="margin: 0">
            <a-form-item name="albe0032" label="队伍简介" style="width: 100%">
              <a-textarea
                placeholder="请输入队伍简介"
                v-model:value="formParam.albe0032"
                :auto-size="{ minRows: 6, maxRows: 12 }"
                :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true"
              />
            </a-form-item>
          </a-row>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item name="albx0020" label="队伍图片">
            <div class="avatar-uploader">
              <div style="width: 100%; height: 200px">
                <img style="width: 100%; height: 100%" :src="'' + imageUrl" :onerror="`this.src='${projectBg}'`" alt="队伍图片" />
              </div>
              <a-upload class="a_upload" style="width: 100%" :customRequest="handleFileUpload" :beforeUpload="beforeUpload" :showUploadList="false">
                <a-button style="width: 100%" :disabled="updateState == 'normalUpdate' ? false : updateState == 'change' ? false : true">
                  <template #icon></template>
                  上传本地图片
                </a-button>
              </a-upload>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
  </a-form>
  <div></div>
  <!--  v-model:visible="mapVisible" -->
  <baidu-map v-model:visible="mapVisible" @resuleHandel="handleMapSubmit" :center="centerPoint"> </baidu-map>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch, onBeforeUnmount } from 'vue'
import VueTypes from 'vue-types'
import moment from 'moment'
import { uploadHandle, checkFileType } from '@/utils/upload'
import projectBg from '@/assets/img/project/project-bg.png'
import { message } from 'ant-design-vue'
import { TeamUpdateOrChargeInfoHook } from '../../Hooks/useRulesHook'
import { getCodeValue } from '../../Hooks/formTeamTypeTwoHook'
import { nvsiAlbe0042, nvsiAlbe0043 } from '@/utils/codevalue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
import { rpcPost } from '@/server/conf'
import EventBus from '@/utils/bus'
import storageUtil from '../../Hooks/storageUtil'
export default defineComponent({
  props: {
    updateState: VueTypes.string.isRequired,
    queryTeamParam: VueTypes.object.isRequired,
    comType: {
      type: String,
    },
  },
  setup(props) {
    const formParam = reactive({
      albp0052: '',
      albe0041: '',
      albe0002: '',
      albe0012: [],
      albe0015: null,
      albe0013: '',
      albe0050: '',
      albe0051: '',
      albe0040: '',
      albe0032: '',
      albe0017: [],
      albe0025: '',
      albe0042: [],
      albe0043: [],
    })

    const form_teamInfo = ref()
    const centerPoint = reactive({
      lat: '',
      lng: '',
    })
    const codeValue = reactive({
      nvsiAlbx0005: [],
      nvsiAlbe0042,
      nvsiAlbe0043,
    })
    const userInfo = reactive(LocalGetUserInfo())
    const teamInfo = ref({})
    const serAreaRef = ref()
    const mapData = ref({})
    const mapVisible = ref(false)
    const toggleMap = () => {
      mapVisible.value = !mapVisible.value
    }
    const handleMapSubmit = ({ val, e }) => {
      if (e.point) {
        mapData.value = e
        formParam.albe0013 = val
        formParam.albe0050 = e.point.lat
        formParam.albe0051 = e.point.lng
      }
    }

    const imageUrl = ref('')
    const handleFileUpload = async (options) => {
      const res = await uploadHandle(options)
      if (res) {
        formParam.albe0025 = res
        rpcPost('downloadFortisLogic', { bean: res }).then((result) => {
          imageUrl.value = result.data
          message.success('上传成功')
        })
      } else {
        message.warning('上传失败')
      }
    }
    const beforeUpload = (file) => {
      const flag = checkFileType(file)
      if (!flag) {
        message.warning('上传文件格式错误，请重新上传')
        return false
      }
      return true
    }
    const setFormParams = () => {
      formParam['albp0052'] = teamInfo.value['albp0052'] || null
      formParam['albe0041'] = teamInfo.value['albe0041'] || null
      formParam['albe0002'] = teamInfo.value['albe0002'] || null
      storageUtil.teamName = teamInfo.value['albe0002'] || ''

      teamInfo.value.albe0015 ? (formParam['albe0015'] = moment(new Date(teamInfo.value.albe0015))) : ''
      formParam['albe0013'] = teamInfo.value['albe0013'] || null
      formParam['albe0050'] = teamInfo.value['albe0050'] || null
      formParam['albe0051'] = teamInfo.value['albe0051'] || null
      formParam['albe0040'] = teamInfo.value['albe0040'] || null
      formParam['albe0032'] = teamInfo.value['albe0032'] || null
      formParam['albe0025'] = teamInfo.value['albe0025'] || null

      teamInfo.value['albe0017'] ? (formParam['albe0017'] = teamInfo.value['albe0017'].split(',')) : ''
      teamInfo.value['albe0042'] ? (formParam['albe0042'] = teamInfo.value['albe0042'].trim().split(',')) : null
      teamInfo.value['albe0043'] ? (formParam['albe0043'] = teamInfo.value['albe0043'].trim().split(',')) : null

      formParam['albe0025'] && downloadTeamImg()
      teamInfo.value['albe0051'] ? (centerPoint.lat = teamInfo.value['albe0051']) : ''
      teamInfo.value['albe0050'] ? (centerPoint.lng = teamInfo.value['albe0050']) : ''

      let area = []
      area.push(teamInfo.value['albe0012'])
      area = area.filter((item) => Boolean(item))
      formParam['albe0012'] = area
      serAreaRef.value.defaultInitArea(area)
    }

    const downloadTeamImg = () => {
      rpcPost('downloadFortisLogic', { bean: teamInfo.value['albe0025'] }).then((result) => {
        imageUrl.value = result.data
      })
    }
    const getTeamInfo = async () => {
      const { queryTeamParam } = props
      const params = {
        id: queryTeamParam.teamId,
        areaid: queryTeamParam.areaId,
      }
      const res = await apis.getTeamInfoFortis(params)
      if (res.code == '0') {
        teamInfo.value = res.data
        setFormParams()
      }
    }
    const getServiceTypeList = async () => {
      const res = await apis.getCodeValue('lbe05', 'getAllCodeFortis', { codeTypeName: 'lbe05', areaid: userInfo.areaid })
      if (res.code == 0) {
        codeValue.nvsiAlbx0005 = res.data
      }
    }

    const changeArea = (area) => {
      EventBus.emit('changeArea', area)
    }
    const { FormTeamInfoRules } = TeamUpdateOrChargeInfoHook()
    const formTeamType = ref()
    let rules = FormTeamInfoRules(formParam, formTeamType, teamInfo)

    let timer = null
    const changeTeamName = (e) => {
      storageUtil.teamName = formParam['albe0002']
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        rules = FormTeamInfoRules(formParam, formTeamType, teamInfo)
      }, 1000)
    }
    const EventBusLintener = () => {
      EventBus.on('changeTeamTypeInfo', ({ formTeamTypeOwnParam }) => {
        formTeamType.value = formTeamTypeOwnParam

        if (formTeamTypeOwnParam.albe0003 == '3') {
        } else {
        }
      })
    }
    const validateForm = () => {
      form_teamInfo.value && form_teamInfo.value.validate()
    }

    const disabledDate = (current) => {
      return current && current >= moment(moment(new Date()).format('YYYY-MM-DD')).endOf('day')
    }

    onBeforeUnmount(() => {
      EventBus.off('changeTeamTypeInfo')
    })
    watch(
      () => props.queryTeamParam,
      async () => {
        if (Object.values(props.queryTeamParam).filter((item) => Boolean(item)).length > 0) {
          await getTeamInfo()
        }
      },
      {
        immediate: true,
        deep: true,
      }
    )
    watch(
      () => props.updateState,
      async () => {
        if (props.updateState === 'none') {
          if (Object.values(props.queryTeamParam).filter((item) => Boolean(item)).length > 0) {
            await getTeamInfo()
            rules = FormTeamInfoRules(formParam, formTeamType, teamInfo)
            validateForm()
          }
        }
      },
      {
        immediate: true,
      }
    )
    onMounted(() => {
      getServiceTypeList()
      EventBusLintener()
      EventBus.emit('changeArea', userInfo.areaid)
    })
    return {
      ...toRefs(props),
      ...toRefs(formParam),
      formParam,
      rules,
      form_teamInfo,
      codeValue,
      mapVisible,
      toggleMap,
      handleMapSubmit,
      projectBg,
      imageUrl,
      handleFileUpload,
      centerPoint,
      beforeUpload,
      teamInfo,
      mapData,
      changeTeamName,
      changeArea,
      serAreaRef,
      disabledDate,
    }
  },
})
</script>

<style scoped lang="less">
.ant-card :deep(.ant-card-head-title) {
  font-weight: 600;
}
.timePicker {
  width: 100%;
}
.formItemMap {
  :deep(.ant-form-item-control-input-content) {
    display: flex;
    align-items: center;
  }
}
.a_upload {
  :deep(.ant-upload) {
    width: 100%;
  }
}
</style>

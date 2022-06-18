<template>
  <a-form
    ref="formTeamTypeOwnRef"
    :model="formTeamTypeOwnParam"
    :rules="formTeamTypeOwnRules"
    layout="vertical"
    class="nv-form"
    :style="{ padding: ' 0 24px' }"
  >
    <a-card title="类型信息" :bordered="false" style="width: 100%; padding: 0px">
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item :label="'队伍类型'" name="albe0003" class="cus-a-form-item">
            <a-radio-group
              v-model:value="formTeamTypeOwnParam.albe0003"
              @change="changeTeamType"
              :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
            >
              <div style="height: 35px">
                <a-radio value="2" class="radioLabel">志愿服务组织</a-radio>
                <span> 在民政部门依法登记成立,以开展志愿服务宗旨的非营利性组织</span>
              </div>
              <div style="height: 35px">
                <a-radio value="3" class="radioLabel">其它开展志愿服务活动的法人组织</a-radio>
                <span> 志愿服务组织以外的,依法开展志愿服务活动的法人组织</span>
              </div>
              <div style="height: 35px">
                <a-radio
                  value="1"
                  class="radioLabel"
                  :disabled="teamInfo.albe0091 == '0' && teamInfo.albe0026 == '0' ? false : teamInfo.albe0003 !== '1' ? true : false"
                  >志愿服务团体</a-radio
                >
                <span> 经社区或单位同意成立的,以开展志愿服务为宗旨,尚未依法登记的团体</span>
              </div>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24" v-show="formTeamTypeOwnParam.albe0003 == '1'">
        <a-row :gutter="24" style="width: 100%">
          <a-col :md="8" :sm="24">
            <a-form-item label="有无直属组织" name="albe0065">
              <a-radio-group
                @change="change0065"
                v-model:value="formTeamTypeOwnParam.albe0065"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              >
                <a-radio v-for="hasOrNo in codeValue.nvsiAlbx0100" :value="hasOrNo.value">{{ hasOrNo.label }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="10" :sm="24" v-show="formTeamTypeOwnParam.albe0065 !== '0'">
            <a-form-item label="直属组织" class="btnFormItem" name="topname">
              <a-input v-model:value="formTeamTypeOwnParam.topname" :disabled="true"></a-input>
              <div style="display: flex; flex-direction: row" v-show="comType !== 'review'">
                <a-button
                  @click="clearSelOrg({ teamType: 1, flag: 'zhishu' })"
                  :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
                  >清除</a-button
                >
                <a-button
                  type="primary"
                  :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
                  @click="selOrgName({ teamType: 1, flag: 'zhishu' })"
                >
                  选择直属组织
                </a-button>
              </div>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="同意其成立的单位（社区）名称" name="albe0057">
              <a-input
                v-model:value="formTeamTypeOwnParam.albe0057"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              />
            </a-form-item>
          </a-col>

          <a-col
            :md="8"
            :sm="24"
            v-show="
              (formTeamTypeOwnParam.albe0065 == '1' && formTeamTypeOwnParam.albe0063 == '0') ||
              (formTeamTypeOwnParam.albe0065 == '1' && !formTeamTypeOwnParam.albe0063)
            "
          >
            <a-form-item label="同意其成立的单位（社区）类型" name="toptype">
              <a-select class="a_select" @change="validateForm" v-model:value="formTeamTypeOwnParam.toptype" :disabled="true">
                <a-select-option :value="opt.value" v-for="(opt, index) in codeValue.nvsiAlbe0005" :key="index">
                  {{ opt.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24" v-show="formTeamTypeOwnParam.albe0065 == '0'" style="width: 100%">
          <a-col :md="8" :sm="24">
            <a-form-item label="有无联络组织" name="albe0063">
              <a-radio-group
                @change="change0063"
                v-model:value="formTeamTypeOwnParam.albe0063"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              >
                <a-radio v-for="hasOrNo in codeValue.nvsiAlbx0100" :value="hasOrNo.value">{{ hasOrNo.label }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" v-show="formTeamTypeOwnParam.albe0063 !== '0'">
            <a-form-item label="联络组织" class="btnFormItem" name="orgname">
              <a-input :style="comType == 'review' ? 'width:73%' : ''" v-model:value="formTeamTypeOwnParam.orgname" :disabled="true"></a-input>
              <div style="display: flex; flex-direction: row" v-show="comType !== 'review'">
                <a-button
                  @click="clearSelOrg({ teamType: 1, flag: 'lianluoOrg' })"
                  :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
                  >清除</a-button
                >
                <a-button
                  type="primary"
                  :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
                  @click="selOrgName({ teamType: 1, flag: 'lianluoOrg' })"
                >
                  选择联络组织
                </a-button>
              </div>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="同意其成立的单位（社区）类型" name="albe0005">
              <a-select
                class="a_select"
                @change="validateForm"
                v-model:value="formTeamTypeOwnParam.albe0005"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              >
                <a-select-option :value="opt.value" v-for="(opt, index) in codeValue.nvsiAlbe0005" :key="index">
                  {{ opt.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" v-show="formTeamTypeOwnParam.albe0063 == '0'">
            <a-form-item label="登记机关" name="albe0009">
              <div v-if="userInfo.areaLevel == 0">
                <a-select class="a_select" v-model:value="formTeamTypeOwnParam.albe0009" disabled>
                  <a-select-option value="100000000000000000"> 民政部</a-select-option>
                </a-select>
              </div>
              <div v-else>
                <AreaDevNew
                  placeholder="请选择登记机关"
                  style="width: 100%"
                  ref="area1Ref"
                  v-model:value="albe0009"
                  :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
                ></AreaDevNew>
              </div>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" v-show="formTeamTypeOwnParam.albe0063 == '0'">
            <a-form-item label="同意其成立的单位（社区）统一社会信用代码" name="albe0061">
              <a-input
                v-model:value="formTeamTypeOwnParam.albe0061"
                @change="validateForm"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" v-show="formTeamTypeOwnParam.albe0063 == '0'">
            <a-form-item label="单位（社区）联系人" name="albe0058">
              <a-input
                v-model:value="formTeamTypeOwnParam.albe0058"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" v-show="formTeamTypeOwnParam.albe0063 == '0'">
            <a-form-item label="单位（社区）联系电话" name="albe0059">
              <a-input
                v-model:value="formTeamTypeOwnParam.albe0059"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-row>

      <!-- 队伍类型为志愿服务组织的时候显示 2 / 3 -->
      <a-row :gutter="24" v-show="formTeamTypeOwnParam.albe0003 == '2' || formTeamTypeOwnParam.albe0003 == '3'">
        <a-row :gutter="24" style="width: 100%">
          <a-col :md="8" :sm="24">
            <a-form-item label="主管单位名称" name="albe0011">
              <a-input
                v-model:value="formTeamTypeOwnParam.albe0011"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="有无联络组织" name="albe0063">
              <a-radio-group
                v-model:value="formTeamTypeOwnParam.albe0063"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              >
                <a-radio v-for="hasOrNo in codeValue.nvsiAlbx0100" :value="hasOrNo.value">{{ hasOrNo.label }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" v-show="formTeamTypeOwnParam.albe0063 !== '0'">
            <a-form-item label="联络组织" class="btnFormItem" name="orgname">
              <a-input :style="comType !== 'review' ? 'width:73%' : ''" v-model:value="formTeamTypeOwnParam.orgname" :disabled="true"></a-input>
              <div style="display: flex; flex-direction: row" v-show="comType !== 'review'">
                <a-button
                  @click="clearSelOrg({ teamType: 2, flag: 'lianluoOrg' })"
                  :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
                  >清除</a-button
                >
                <a-button
                  type="primary"
                  :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
                  @click="selOrgName({ teamType: 2, flag: 'lianluoOrg' })"
                >
                  选择联络组织
                </a-button>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" style="width: 100%">
          <!-- 两队队伍的组织类型展示不一样 -->
          <a-col :md="8" :sm="24" v-if="formTeamTypeOwnParam.albe0003 == '2'">
            <a-form-item label="组织类型" name="albe0005">
              <a-select
                class="a_select"
                v-model:value="formTeamTypeOwnParam.albe0005"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              >
                <a-select-option :value="opt.value" v-for="(opt, index) in codeValue.nvsiAlbe0009" :key="index">
                  {{ opt.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" v-if="formTeamTypeOwnParam.albe0003 == '3'">
            <a-form-item label="组织类型" name="albe0005">
              <a-select
                class="a_select"
                v-model:value="formTeamTypeOwnParam.albe0005"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              >
                <a-select-option :value="opt.value" v-for="(opt, index) in codeValue.nvsiAlbe0005_type2" :key="index">
                  {{ opt.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="登记部门" name="albe0006">
              <a-select
                class="a_select"
                v-model:value="formTeamTypeOwnParam.albe0006"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              >
                <a-select-option :value="opt.value" v-for="(opt, index) in codeValue.nvsiAlbe0006" :key="index">
                  {{ opt.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="登记机关" name="albe0009">
              <div v-if="userInfo.areaLevel == 0">
                <a-select class="a_select" v-model:value="formTeamTypeOwnParam.albe0009" disabled>
                  <a-select-option value="100000000000000000"> 民政部</a-select-option>
                </a-select>
              </div>
              <div v-else>
                <AreaDevNew
                  placeholder="请选择登记机关"
                  style="width: 100%"
                  v-model:value="albe0009"
                  ref="area2Ref"
                  :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
                ></AreaDevNew>
              </div>

              <!-- AreaDevide -->
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" style="width: 100%">
          <a-col :md="8" :sm="24">
            <a-form-item :label="'统一社会信用代码'" name="albe0008">
              <a-input
                placeholder="统一社会信用代码"
                v-model:value="formTeamTypeOwnParam.albe0008"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-row>
    </a-card>

    <a-card title="登记信息" :bordered="false" style="width: 100%; padding: 0px">
      <a-row :gutter="24" v-if="formTeamTypeOwnParam.albe0003 == '1'">
        <a-col :md="12" :sm="24">
          <a-form-item label="注册申请表扫描件" name="albe0044">
            <div v-for="(item, index) in albe0044List" :key="index" justify="first" class="fileList">
              <span style="width: 85%; overflow: hidden; white-space: nowrap">
                {{ item.showname }}
              </span>
              <span>
                <span
                  v-show="comType == 'review' || comType == 'view' || comType == 'change' || comType == 'normalUpdate'"
                  @click.prevent="downloadFortisLogic(albe0044List[0], 'albe0044')"
                  style="cursor: pointer"
                  >下载</span
                >
                <span v-show="updateState == 'change'" @click="delImg('albe0044List')" style="cursor: pointer; margin-left: 10px">删除</span>
                <!-- <a ref="downLoad0044" download v-show="false" href="#"></a> -->
              </span>
            </div>
            <a-upload
              :file-list="albe0044List"
              name="file"
              :showUploadList="false"
              :beforeUpload="beforeUpload_44"
              :customRequest="handleFileUpload_44"
            >
              <a-button
                v-if="albe0044List.length <= 0"
                :style="albe0044List.length > 0 ? 'margin-top:8px;' : ''"
                type="primary"
                style="width: 100px"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              >
                上传
              </a-button>
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="formTeamTypeOwnParam.albe0003 !== '1'">
        <a-col :md="12" :sm="24">
          <a-form-item label="统一社会信用代码证" name="albe0067">
            <div v-for="(item, index) in albe0067List" :key="index" justify="first" class="fileList">
              <span style="width: 85%; overflow: hidden; white-space: nowrap">
                {{ item.showname }}
              </span>
              <span>
                <span
                  v-show="comType == 'review' || comType == 'view' || comType == 'change' || comType == 'normalUpdate'"
                  @click.prevent="downloadFortisLogic(albe0067List[0], 'albe0067')"
                  style="cursor: pointer"
                  >下载</span
                >
                <span v-show="updateState == 'change'" @click="delImg('albe0067List')" style="cursor: pointer; margin-left: 10px">删除</span>
              </span>
            </div>
            <a-upload
              :file-list="albe0067List"
              name="file"
              :showUploadList="false"
              :beforeUpload="beforeUpload_67"
              :customRequest="handleFileUpload_67"
            >
              <a-button
                v-if="albe0067List.length <= 0"
                :style="albe0067List.length > 0 ? 'margin-top:8px;' : ''"
                type="primary"
                style="width: 100px"
                :disabled="updateState == 'normalUpdate' ? true : updateState == 'change' ? false : true"
              >
                上传
              </a-button>
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
      <a ref="download" download v-show="false" href="#"></a>
    </a-card>
  </a-form>
  <LiaisonOrgModalTable :visible="LiaisonOrgVisable" @handleCancel="handleCancel" @handleSelectOrg="handleSelectOrg"> </LiaisonOrgModalTable>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount, watch, computed, inject, nextTick } from 'vue'
import { getCodeValue, getFormRefs, getFormRules } from '../../Hooks/formTeamTypeTwoHook'
import LiaisonOrgModalTable from '../modal/LiaisonOrgModalTable.vue'
import { uploadHandle, checkFileType } from '@/utils/upload'
import apis from '@/server/request'
import { message } from 'ant-design-vue/es'
import VueTypes from 'vue-types'
import EventBus from '@/utils/bus'
import { LocalGetUserInfo } from '@/utils/localStorage.js'

export default defineComponent({
  props: {
    updateState: VueTypes.string.isRequired,
    queryTeamParam: VueTypes.object.isRequired,
    comType: {
      type: String,
    },
  },
  components: {
    LiaisonOrgModalTable,
  },
  setup(props) {
    const userInfo = reactive(LocalGetUserInfo())

    const formTeamTypeOwnParam = reactive({
      albe0003: '',

      albe0065: '',
      albe0066: '',
      topname: '',
      toptype: '',

      albe0063: '',
      albe0004: '',
      orgname: '',

      albe0057: '',
      albe0005: '',
      albe0006: '',
      albe0007: '',
      albe0009: [],
      albe0058: '',
      albe0059: '',
      albe0011: '',
      albe0061: '',
      albe0008: '',
      albe0044: '',
      albe0045: '',
      albe0067: '',
    })
    const formTeamTypeOwnRef = ref()
    const formTeamTypeOwnRules = ref()
    const area1Ref = ref()
    const area2Ref = ref()
    const codeValue = getCodeValue()
    const currentOrgFlag = reactive({
      teamType: '',
      flag: '',
    })
    const orgDialog = reactive({
      LiaisonOrgVisable: false,
      topNameId: '',
      topName: '',
    })
    const teamInfo = ref({})

    const uploadFileList = reactive({
      albe0044List: [],
      albe0045List: [],
      albe0067List: [],
    })
    const download = ref()

    const areaid = ref()
    const { formTeamTypeOwnRulesHook } = getFormRules()

    const clearSelOrg = ({ teamType, flag }) => {
      if (teamType == 1 && flag == 'zhishu') {
        formTeamTypeOwnParam.topname = ''
        formTeamTypeOwnParam.albe0066 = ''
        formTeamTypeOwnParam.toptype = ''
      }
      if (teamType == 1 && flag == 'lianluoOrg') {
        formTeamTypeOwnParam.orgname = ''
        formTeamTypeOwnParam.albe0004 = ''
      }
      if (teamType == 2) {
        formTeamTypeOwnParam.orgname = ''
        formTeamTypeOwnParam.albe0004 = ''
      }
    }
    const selOrgName = ({ teamType, flag }) => {
      currentOrgFlag.teamType = teamType
      currentOrgFlag.flag = flag
      orgDialog.LiaisonOrgVisable = true
    }
    const handleCancel = () => {
      orgDialog.LiaisonOrgVisable = false
    }
    const handleSelectOrg = (record) => {
      formTeamTypeOwnParam['toptype'] = record.albe0005
      if (currentOrgFlag.teamType == 1 && currentOrgFlag.flag == 'zhishu') {
        formTeamTypeOwnParam.albe0066 = record.id
        formTeamTypeOwnParam.topname = record.albe0002
        formTeamTypeOwnParam.albe0004 = ''
        formTeamTypeOwnParam.orgname = ''
        formTeamTypeOwnParam.albe0063 = '0'
        formTeamTypeOwnParam.albe0065 = '1'
      }
      if (currentOrgFlag.teamType == 1 && currentOrgFlag.flag == 'lianluoOrg') {
        formTeamTypeOwnParam.albe0004 = record.id
        formTeamTypeOwnParam.orgname = record.albe0002
        formTeamTypeOwnParam.albe0066 = ''
        formTeamTypeOwnParam.topname = ''
        formTeamTypeOwnParam.albe0065 = '0'
        formTeamTypeOwnParam.albe0063 = '1'
      }
      if (currentOrgFlag.teamType == 2 && currentOrgFlag.flag == 'lianluoOrg') {
        formTeamTypeOwnParam.albe0004 = record.id
        formTeamTypeOwnParam.orgname = record.albe0002
        formTeamTypeOwnParam.albe0066 = ''
        formTeamTypeOwnParam.topname = ''
        formTeamTypeOwnParam.albe0063 = '1'
      }
      orgDialog.topNameId = record.id
      orgDialog.topName = record.albe0002
      orgDialog.LiaisonOrgVisable = false
    }
    const change0065 = (e) => {
      if (e.target.value == '1') {
        if (formTeamTypeOwnParam.albe0063 == '1') {
          formTeamTypeOwnParam.albe0063 = '0'
          formTeamTypeOwnParam.orgname = ''
          formTeamTypeOwnParam.albe0004 = ''
        }
      } else if (e.target.value == '0') {
        formTeamTypeOwnParam.albe0063 = '1'
      }
    }
    const change0063 = (e) => {}

    const beforeUpload_44 = (file) => {
      const flag = checkFileType(file)
      if (!flag) {
        message.warning('上传文件格式错误，请重新上传')
        return false
      }
      return true
    }
    const handleFileUpload_44 = async (options) => {
      const res = await uploadHandle(options)
      if (res) {
        uploadFileList.albe0044List[0] = res
        formTeamTypeOwnParam.albe0044 = res
        message.success('上传成功')
      } else {
        message.warning('上传失败')
      }
    }

    const beforeUpload_45 = (file) => {
      const flag = checkFileType(file)
      if (!flag) {
        message.warning('上传文件格式错误，请重新上传')
        return false
      }
      return true
    }
    const handleFileUpload_45 = async (options) => {
      const res = await uploadHandle(options)
      if (res) {
        uploadFileList.albe0045List[0] = res
        formTeamTypeOwnParam.albe0045 = res
        message.success('上传成功')
      } else {
        message.warning('上传失败')
      }
    }
    const beforeUpload_67 = (file) => {
      const flag = checkFileType(file)
      if (!flag) {
        message.warning('上传文件格式错误，请重新上传')
        return false
      }
      return true
    }
    const handleFileUpload_67 = async (options) => {
      const res = await uploadHandle(options)
      if (res) {
        uploadFileList.albe0067List[0] = res
        formTeamTypeOwnParam.albe0067 = res
        message.success('上传成功')
      } else {
        message.warning('上传失败')
      }
    }
    const delImg = (filelistFlag) => {
      if (filelistFlag == 'albe0044List') {
        formTeamTypeOwnParam.albe0044 = ''
        uploadFileList.albe0044List = []
      }
      if (filelistFlag == 'albe0045List') {
        formTeamTypeOwnParam.albe0045 = ''
        uploadFileList.albe0045List = []
      }
      if (filelistFlag == 'albe0067List') {
        formTeamTypeOwnParam.albe0067 = ''
        uploadFileList.albe0067List = []
      }
    }
    const downloadFortisLogic = async (file, fileFlag) => {
      apis
        .downloadFortisLogic(file)
        .then((res) => {
          if (res.code == '0') {
            download.value.href = res.data
            download.value.click()
          } else {
            message.warning(res.message)
          }
        })
        .catch((e) => {
          message.warning('下载失败')
        })
    }
    const setFormParams = () => {
      formTeamTypeOwnParam['albe0003'] = teamInfo.value['albe0003']
      uploadFileList.albe0044List = []
      uploadFileList.albe0045List = []
      if (formTeamTypeOwnParam['albe0003'] == '1') {
        if (teamInfo.value['albe0066'] && !teamInfo.value['albe0004']) {
          formTeamTypeOwnParam['albe0065'] = teamInfo.value['albe0065']
          formTeamTypeOwnParam['albe0063'] = '0'
          formTeamTypeOwnParam['topname'] = teamInfo.value['topname']
          formTeamTypeOwnParam['albe0066'] = teamInfo.value['albe0066']
          formTeamTypeOwnParam['toptype'] = teamInfo.value['toptype']
        } else if (!teamInfo.value['albe0066'] && teamInfo.value['albe0004']) {
          formTeamTypeOwnParam['albe0065'] = '0'
          formTeamTypeOwnParam['albe0063'] = teamInfo.value['albe0063']
          formTeamTypeOwnParam['albe0004'] = teamInfo.value['albe0004']
          formTeamTypeOwnParam['orgname'] = teamInfo.value['orgname']
          formTeamTypeOwnParam['albe0005'] = teamInfo.value['albe0005']
        } else {
          formTeamTypeOwnParam['albe0065'] = '0'
          formTeamTypeOwnParam['albe0063'] = '0'
          formTeamTypeOwnParam['albe0005'] = teamInfo.value['albe0005']

          formTeamTypeOwnParam['albe0011'] = teamInfo.value['albe0011']
          let area = []
          area.push(teamInfo.value['albe0009'])
          area = area.filter((item) => Boolean(item))
          formTeamTypeOwnParam['albe0009'] = area
          nextTick(() => {
            area1Ref.value && area1Ref.value.defaultInitArea(area)
          })

          formTeamTypeOwnParam['albe0061'] = teamInfo.value['albe0061']
          formTeamTypeOwnParam['albe0058'] = teamInfo.value['albe0058']
          formTeamTypeOwnParam['albe0059'] = teamInfo.value['albe0059']
        }

        if (teamInfo.value['albe0057']) {
          formTeamTypeOwnParam['albe0057'] = teamInfo.value['albe0057']
        } else {
          formTeamTypeOwnParam['albe0057'] = teamInfo.value['albe0011']
        }

        if (teamInfo.value['albe0044']) {
          formTeamTypeOwnParam['albe0044'] = teamInfo.value['albe0044']
          uploadFileList.albe0044List.push(teamInfo.value['albe0044'])
        }
        if (teamInfo.value['albe0045']) {
          formTeamTypeOwnParam['albe0045'] = teamInfo.value['albe0045']
          uploadFileList.albe0045List.push(teamInfo.value['albe0045'])
        }
      } else {
        formTeamTypeOwnParam['albe0011'] = teamInfo.value['albe0011']
        formTeamTypeOwnParam['albe0005'] = teamInfo.value['albe0005']
        formTeamTypeOwnParam['albe0006'] = teamInfo.value['albe0006']

        let area = []
        area.push(teamInfo.value['albe0009'])
        area = area.filter((item) => Boolean(item))
        formTeamTypeOwnParam['albe0009'] = area
        nextTick(() => {
          area2Ref.value && area2Ref.value.defaultInitArea(area)
        })

        formTeamTypeOwnParam['albe0007'] = teamInfo.value['albe0007']
        formTeamTypeOwnParam['albe0008'] = teamInfo.value['albe0008']
        if (teamInfo.value['albe0004']) {
          formTeamTypeOwnParam['albe0063'] = teamInfo.value['albe0063']
          formTeamTypeOwnParam['albe0004'] = teamInfo.value['albe0004']
          formTeamTypeOwnParam['orgname'] = teamInfo.value['orgname']
        } else {
          formTeamTypeOwnParam['albe0063'] = '0'
        }
        if (teamInfo.value['albe0067']) {
          formTeamTypeOwnParam['albe0067'] = teamInfo.value['albe0067']
          uploadFileList.albe0067List = []
          uploadFileList.albe0067List.push(teamInfo.value['albe0067'])
        }
      }

      if (userInfo.areaLevel == 0) {
        formTeamTypeOwnParam['albe0009'] = '100000000000000000'
      }
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
        console.log(teamInfo, 'teamInfo')
        setFormParams()
      }
    }
    const validateForm = () => {
      formTeamTypeOwnRef.value && formTeamTypeOwnRef.value.validate()
    }
    watch(
      () => props.queryTeamParam,
      async () => {
        nextTick(async () => {
          await getTeamInfo()
        })
      },
      {
        immediate: true,
        deep: true,
      }
    )
    watch(
      () => props.updateState,
      async () => {
        if (props.updateState === 'change') {
          watch(
            () => formTeamTypeOwnParam,
            () => {
              formTeamTypeOwnRules.value = formTeamTypeOwnRulesHook(formTeamTypeOwnParam, areaid)
              validateForm()
            },
            {
              immediate: true,
              deep: true,
            }
          )
        }
        if (props.updateState === 'none' || props.comType === 'view') {
          nextTick(async () => {
            await getTeamInfo()
            formTeamTypeOwnRules.value = formTeamTypeOwnRulesHook(formTeamTypeOwnParam, areaid)
            validateForm()
          })
        }
      },
      {
        immediate: true,
      }
    )
    // 切换队伍类型
    const changeTeamType = (e) => {
      formTeamTypeOwnRef.value.resetFields()
      formTeamTypeOwnParam.albe0003 = e.target.value
      uploadFileList.albe0044List = []
      uploadFileList.albe0045List = []
      uploadFileList.albe0067List = []
      formTeamTypeOwnParam.albe0044 = null
      formTeamTypeOwnParam.albe0045 = null
      formTeamTypeOwnParam.albe0066 = null
      nextTick(() => {
        area1Ref.value && area1Ref.value.initArea()
        // area1Ref.value && area1Ref.value.defaultInitArea([])
      })
      nextTick(() => {
        area1Ref.value && area1Ref.value.initArea()
        // area2Ref.value && area2Ref.value.defaultInitArea([])
      })
      // if (e.target.value == '2') {
      //   const al0005Arr = ['13,14,15']
      //   if (!al0005Arr.includes(formTeamTypeOwnParam.albe0005)) {
      //     formTeamTypeOwnParam.albe0005 = ''
      //   }
      // }
    }
    onBeforeUnmount(() => {
      EventBus.off('changeArea')
    })
    onMounted(() => {
      EventBus.on('changeArea', (area) => {
        areaid.value = area
        formTeamTypeOwnRules.value = formTeamTypeOwnRulesHook(formTeamTypeOwnParam, areaid)
      })
      validateForm()
    })

    return {
      ...toRefs(orgDialog),
      ...toRefs(props),
      ...toRefs(formTeamTypeOwnParam),
      teamInfo,
      // fileList,

      formTeamTypeOwnRef,
      formTeamTypeOwnParam,
      formTeamTypeOwnRules,
      codeValue,
      changeTeamType,
      clearSelOrg,
      selOrgName,
      handleCancel,
      handleSelectOrg,
      change0063,
      change0065,
      // 图片上传
      ...toRefs(uploadFileList),
      download,
      // downLoad0044,
      // downLoad0045,
      // downLoad0067,
      beforeUpload_44,
      handleFileUpload_44,
      beforeUpload_45,
      handleFileUpload_45,
      beforeUpload_67,
      handleFileUpload_67,
      delImg,
      downloadFortisLogic,

      area1Ref,
      area2Ref,
      validateForm,
      userInfo,
    }
  },
})
</script>

<style scoped lang="less">
.fileList {
  margin-top: 5px;
  border-bottom: 1px solid;
  width: 70%;
  display: flex;
  justify-content: space-between;
}

.ant-card :deep(.ant-card-head-title) {
  font-weight: 600;
}
.radioLabel {
  font-size: 16px;
  font-weight: 600;
}
.btnFormItem :deep(.ant-form-item-control-input-content) {
  display: flex;
}
.a_select {
  height: 40px;
  :deep(.ant-select-selector) {
    height: 40px;
    span:nth-child(2) {
      line-height: 40px;
    }
  }
}
</style>

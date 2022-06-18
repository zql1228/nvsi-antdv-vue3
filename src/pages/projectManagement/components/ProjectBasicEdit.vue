<template>
  <!-- 发布项目 基本信息tab页 -->
  <div>
    <a-spin :spinning="loading">
      <a-form ref="formRef" :model="formParam" :rules="rules" layout="vertical" class="nv-form" :style="{ padding: ' 0 24px' }">
        <a-card :bordered="false">
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item name="albx0002" label="项目名称(最多50字)">
                <a-input
                  :disabled="
                    query.type == 'view' || (query.type === 'modify' && query.projectType == 3) || (query.type === 'modify' && query.projectType == 4)
                  "
                  v-model:value="formParam.albx0002"
                  placeholder="项目名称"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="" label="项目编号">
                <a-input disabled placeholder="系统自动生成" v-model:value="formParam.albx0013" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="albx0062" label="所属队伍">
                <a-input disabled placeholder="项目所属团体名称" v-model:value="formParam.albx0062" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="16" :sm="24">
              <a-form-item name="albx0024" label="招募范围">
                <a-card :bordered="false" :bodyStyle="{ padding: '0px' }" class="nv-project-scope">
                  <a-radio-group
                    button-style="solid"
                    v-model:value="option.albx0024"
                    @change="onChangeScope"
                    :disabled="query.type == 'view' || query.isRepair"
                  >
                    <div v-for="(item, index) in codeValue.codeNvsiAlbx0024" :key="item.value" v-show="index != 4 || (index == 4 && query.isRepair)">
                      <a-card-grid class="scope-grid">
                        <a-card-grid class="scope-name">
                          <a-radio :value="item.value">
                            {{ item.label }}
                          </a-radio>
                        </a-card-grid>
                        <a-card-grid class="scope-label">
                          <div>
                            {{ item.extra }}
                          </div>
                        </a-card-grid>
                      </a-card-grid>
                    </div>
                  </a-radio-group>
                </a-card>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="albx0020" label="项目封面">
                <div class="avatar-uploader">
                  <div style="width: 100%; height: 241px">
                    <img style="width: 100%; height: 100%" :src="'' + imageUrl" alt="项目封面图片" :onerror="`this.src='${projectBg}'`" />
                  </div>

                  <a-row :gutter="24" style="padding-top: 16px">
                    <a-col :md="12">
                      <a-button block @click="showModal" :disabled="query.type == 'view'"> 选择默认图片 </a-button>
                    </a-col>
                    <a-col :md="12">
                      <a-upload
                        style="width: 100%"
                        :customRequest="handleFileUpload"
                        :beforeUpload="beforeUpload"
                        :showUploadList="false"
                        :disabled="query.type == 'view'"
                      >
                        <!-- :multiple="true" -->
                        <a-button :disabled="query.type == 'view'">
                          <template #icon><PlusOutlined /> </template>
                          上传本地图片
                        </a-button>
                      </a-upload>
                    </a-col>
                  </a-row>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item name="albx0004" label="项目时间">
                <a-range-picker
                  v-model:value="option.projectDate"
                  :disabled-date="disabledDate"
                  :style="{ width: '100%' }"
                  :disabled="
                    query.type == 'view' || (query.type === 'modify' && query.projectType == 3) || (query.type === 'modify' && query.projectType == 4)
                  "
                >
                </a-range-picker>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="albx0021" label="服务区域">
                <!-- <AreaDevNew
                  placeholder="请选择服务区域"
                  style="width: 100%"
                  ref="area"
                  :showAll="false"
                  :type="false"
                  :showLevel="4"
                  v-model:value="option.areaid"
                  :disabled="query.type == 'view'"
                ></AreaDevNew> -->
                <AreaDevNew
                  ref="area"
                  :showAll="false"
                  :showLevel="4"
                  :type="false"
                  v-model:value="option.areaid"
                  :disabled="query.type == 'view'"
                ></AreaDevNew>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                name="albx0003"
                label="详细地址"
                extra="请点击右边的地图图标在地图上选择项目详细地址"
                :wrapperCol="{
                  xs: { span: 24 },
                  sm: { span: 17 },
                }"
              >
                <a-input disabled v-model:value="formParam.albx0003" placeholder="详细地址"> </a-input>
                <a-button @click="toggleMap" style="position: absolute" :disabled="query.type == 'view'">
                  <template #icon>
                    <ZoomInOutlined />
                  </template>
                  在地图上选择
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item name="recruitingDate" label="招募时间">
                <a-range-picker
                  v-model:value="option.recruitingDate"
                  :style="{ width: '100%' }"
                  :disabled-date="disabledDate"
                  :disabled="query.type == 'view'"
                >
                </a-range-picker>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" v-show="option.albx0024 == 2"
              ><a-form-item
                name="albx0022"
                label="可报名队伍编号"
                :wrapperCol="{
                  xs: { span: 24 },
                  sm: { span: 20 },
                }"
              >
                <a-select
                  mode="multiple"
                  v-model:value="formParam.albx0022"
                  :showArrow="false"
                  placeholder="请点击右侧按钮选择队伍"
                  :disabled="query.type == 'view'"
                  :options="option.albx0022List"
                >
                </a-select>
                <a-button type="primary" style="position: absolute; padding: 0 18px" @click="openTeamModel" :disabled="query.type == 'view'"
                  >选择队伍</a-button
                >
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" v-show="option.albx0024 == 3">
              <a-form-item name="albx0017" label="免审密码" extra="免审密码最多6位且只能输入数字">
                <a-input
                  style="height: 40px"
                  v-model:value="formParam.albx0017"
                  placeholder="请输入免审密码"
                  onkeyup="value=value.replace(/[^\d]/g,'')"
                  onafterpaste="value=value.replace(/[^\d]/g,'')"
                  :disabled="query.type == 'view'"
                >
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="24" :sm="24">
              <a-form-item name="albx0014">
                <template #label>服务对象<span class="nv-tips">（选择此项目的服务对象，可多选）</span></template>
                <a-checkbox-group v-model:value="formParam.albx0014" :disabled="query.type == 'view'">
                  <a-row>
                    <a-col :span="4" v-for="item in codeValue.codeNvsiAlbx0014" :key="item.codeid">
                      <a-checkbox :value="item.codeid">{{ item.codevalue }}</a-checkbox>
                    </a-col>
                  </a-row>
                </a-checkbox-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="24" :sm="24">
              <a-form-item name="albx0009">
                <template #label>服务类别<span class="nv-tips">（选择此项目的服务类别，最多可选4项）</span></template>
                <a-checkbox-group v-model:value="formParam.albx0009" :disabled="query.type == 'view'">
                  <a-row>
                    <a-col :span="4" v-for="item in codeValue.codeNvsiAlbx0009" :key="item.codeid">
                      <a-checkbox :value="item.codeid" :disabled="formParam.albx0009.length == 4 && formParam.albx0009.indexOf(item.codeid) == -1">{{
                        item.codevalue
                      }}</a-checkbox>
                    </a-col>
                  </a-row>
                </a-checkbox-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="24" :sm="24">
              <a-form-item name="albx0019">
                <template #label>
                  志愿者保障
                  <span class="nv-tips">（选择此项目可为志愿者提供的保障内容，可多选）</span>
                </template>
                <a-checkbox-group v-model:value="formParam.albx0019" :disabled="query.type == 'view'" style="width: 75%">
                  <a-row>
                    <a-col :span="4" v-for="item in codeValue.codeNvsiAlbx0019" :key="item.codeid">
                      <a-checkbox :value="item.codeid">{{ item.codevalue }}</a-checkbox>
                    </a-col>
                  </a-row>
                </a-checkbox-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item name="albx0025" label="项目联系人">
                <a-input v-model:value="formParam.albx0025" placeholder="联系人姓名" :disabled="query.type == 'view'" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="albx0026" label="联系人手机">
                <a-input v-model:value="formParam.albx0026" placeholder="联系人手机" :disabled="query.type == 'view'">
                  <template #addonAfter>
                    <a-switch checked-children="公开" un-checked-children="私密" v-model:checked="isPhoneOpen" :disabled="query.type == 'view'" />
                  </template>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="albx0028" label="联系人座机">
                <a-input v-model:value="formParam.albx0028" placeholder="联系人座机，如：010-8888888" :disabled="query.type == 'view'">
                  <template #addonAfter>
                    <a-switch checked-children="公开" un-checked-children="私密" v-model:checked="isTelOpen" :disabled="query.type == 'view'" />
                  </template>
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item name="albx0030" label="联系人邮箱">
                <a-input v-model:value="formParam.albx0030" placeholder="联系人邮箱" :disabled="query.type == 'view'" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="albx0033" label="时长要求" extra="最多保留2位小数。志愿者报名此项目时，会判断个人总服务时长，时长未达到要求无法报名">
                <a-input
                  class="my_input"
                  style="padding-top: 0; padding-bottom: 0"
                  v-model:value="formParam.albx0033"
                  suffix="小时"
                  :min="1"
                  :max="1000"
                  :disabled="query.type == 'view'"
                  onkeyup="value= value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24"
              ><a-form-item
                name="albx0023"
                label="不可同时报名项目"
                extra="选择指定项目，当志愿者已经报名了你指定的项目后，则无法报名此项目"
                :wrapperCol="{
                  xs: { span: 24 },
                  sm: { span: 20 },
                }"
                v-show="false"
              >
                <a-select
                  mode="multiple"
                  v-model:value="formParam.albx0023"
                  :showArrow="false"
                  placeholder="请点击右侧按钮选择项目"
                  :disabled="query.type == 'view'"
                >
                  <a-select-option :options="option.albx0023List"></a-select-option>
                </a-select>
                <a-button type="primary" class="select_project_btn" @click="openProjectModel" :disabled="query.type == 'view'">选择项目</a-button>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="24" :sm="24">
              <a-form-item name="albx0018" label="项目介绍">
                <a-textarea
                  v-model:value="formParam.albx0018"
                  placeholder="志愿服务项目描述"
                  :auto-size="{ minRows: 6, maxRows: 10 }"
                  :disabled="query.type == 'view'"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24" v-show="query.isRepair">
            <a-col :md="24" :sm="24">
              <a-form-item name="albx0047" label="项目证明扫描件">
                <a-upload
                  name="requireFile"
                  :showUploadList="false"
                  :customRequest="handleFileUpload2"
                  :beforeUpload="beforeUpload"
                  v-show="!formParam.albx0047"
                  :disabled="query.type == 'view'"
                >
                  <a-button>
                    <template #icon><PlusOutlined /> </template>
                    上传</a-button
                  >
                </a-upload>
                <div v-show="formParam.albx0047" class="ml_10">
                  <a>{{ formParam.albx0047.showname }}</a>
                  <a class="download_btn" @click="download_albx0047">下载</a>
                  <a ref="download" download v-show="false" href="#"></a>
                  <a v-show="query.type != 'view'" @click="del" :style="{ color: query.type == 'view' ? '#ddd' : '#D92F2F' }" class="del_btn">删除</a>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24" v-show="query.isRepair">
            <a-col :md="24" :sm="24">
              <a-form-item name="checked" label="">
                <a-checkbox v-model:checked="checked" :disabled="query.type == 'view'">同意</a-checkbox>
                <span style="color: red">声明:此次注册所提交的申报材料均真实、合法。如有不实之处，愿负相应的法律责任，并承担由此产生的一切后果</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24" v-show="albx0533 != ''">
            <a-col :md="24" :sm="24">
              <a-form-item name="albx0533" label="审核意见">
                <a-textarea v-model:value="albx0533" :auto-size="{ minRows: 6, maxRows: 10 }" disabled />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-form-item :wrapperCol="{ span: 19, offset: 2 }" class="submit_btn">
          <a-button v-show="query.type != 'view'" type="primary" @click="submit" :loading="loadingBtn">{{
            query.projectId ? '修改' : '创建'
          }}</a-button>
        </a-form-item>
      </a-form>
      <ModelTeamTable :visible="teamVisible" :teamIdList="formParam.albx0022" @child="onClose"></ModelTeamTable>
      <ModelProjectTable :visible="projectVisible" :projectList="formParam.albx0023" @child="onClose2"></ModelProjectTable>
      <ModelImg :visible="imgVisible" :imgIndex="imgIndex" @child="onClose3"></ModelImg>
      <baidu-map v-model:visible="mapVisible" @resuleHandel="handleMapSubmit"> </baidu-map>
      <!-- :center="center" -->
      <a-modal v-model:visible="cluesVisible" :closable="false" width="650px" :maskClosable="false">
        <template #title>
          <span style="color: #ff2828; font-size: 18px">请仔细阅读，以下活动不允许作为志愿项目发布</span>
        </template>
        <template #footer>
          <a-button key="submit" type="primary" @click="cluesVisible = false">确定</a-button>
        </template>
        <div style="font-size: 16px">
          <p>
            1、参与者在工作时间内参加与本职工作密切相关的活动。例如社区工作人员在工作日参与社区日常服务、党员干部工作时间下沉社区参加抗疫日常服务等。
          </p>
          <p>
            2、单位或学校内部有明确制度要求的活动。例如内部团建、资料整理、日常值班、工作会议、班级卫生清扫、主题班会、实验室清洁、学校值日、协助老师、学生会日常工作等。
          </p>
          <p>
            3、与参与者个人利益密切相关的活动。例如业委会选举、班级互助学习、阅读图书、社会实践、单位实习、课题调研、参加会议、观看影片、参观场馆、夏令营、冬令营、活动体验、文化交流等。
          </p>
          <p>
            4、公益目的不纯或不明确的活动。例如团建过程中捡拾垃圾、旅行过程中看望困难群众，会议讲座、聚餐、祈福、演出排练、演唱会、充当节目录制观众等。
          </p>
          <p>5、参与者获得报酬明显高于志愿服务正常补贴标准的活动。如某地志愿者补贴每日最多不超过50元（含交通、餐费、通讯补贴），但实际补贴200元。</p>
          <p>
            6、明显违反志愿服务时间记录规定的活动。例如为抗疫捐款50元记录1小时，捐衣服1件记录1小时，捐书2本记录1小时，承诺完成某项任务给予记录时长，奖励时长等。例如通过微博、朋友圈等方式转发公益宣传内容，转发一次记录1小时等。
          </p>
        </div>
      </a-modal>
    </a-spin>
  </div>
</template>

<script>
import { uploadHandle, checkFileType, checkUpload } from '@/utils/upload'
import projectBg from '@/assets/img/proImg/2.png'
// 代码表
import { sortOptions, nvsiAlbx0024, nvsiAlbx0014, nvsiAlbx0019, getAllCodeFortis } from '@/utils/codevalue'
import moment from 'moment'
import { message } from 'ant-design-vue'
import { defineComponent, onMounted, reactive, ref, watch, onBeforeMount } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import { imgList } from '../img.js'
import { LocalGetUserInfo, LocalGetProjectInfo, LocalSetProjectInfo } from '@/utils/localStorage.js'
import { checkPhoneno, checkTelPhoneno, checkEmail, checkName, checktime2, redDate, reg1, reg3, sortCode } from '@/utils/publicMethods/common'
import { ZoomInOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'
import ModelImg from './ModelImg' //默认图片选择弹窗
import ModelTeamTable from './ModelTeamTable' //指定队伍招募 可招募队伍选择弹窗
import ModelProjectTable from './ModelProjectTable' //不可同时报名项目选择弹窗
import apis from '@/server/request'
export default defineComponent({
  props: {},
  components: {
    ZoomInOutlined,
    PlusOutlined,
    ModelImg,
    ModelTeamTable,
    ModelProjectTable,
  },
  setup(props, text) {
    const area = ref() //区划组件
    const route = useRoute()
    const confirmLoading = ref(false)
    const isPhoneOpen = ref(true)
    const isTelOpen = ref(true)
    const mapVisible = ref(false) //选择地址地图弹窗
    const mapData = ref({}) //地图弹窗返回的数据
    const userInfo = ref(LocalGetUserInfo())
    const loading = ref(false)
    const loadingBtn = ref(false) //保存按钮
    const teamVisible = ref(false) //指定队伍招募 队伍选择弹窗
    const projectVisible = ref(false) //不可同时报名项目选择弹窗
    const imgVisible = ref(false) //项目封面默认图片选择弹窗
    const imgIndex = ref(1) //项目封面默认选择图片被选中的图片下标
    const query = ref({}) //其它页面跳转到该页面携带的参数
    const imageUrl = ref('') // 封面图片地址
    const option = reactive({
      albx0024: '1', // 志愿者招募范围
      albx0022List: [], //可报名队伍对象列表
      albx0023List: [], //不可同时报名项目列表
      projectDate: null, //项目开始结束时间
      recruitingDate: null, //项目招募时间
      areaid: [],
    })
    console.log(nvsiAlbx0014)
    const codeValue = reactive({
      codeNvsiAlbx0024: nvsiAlbx0024, //招募范围
      codeNvsiAlbx0014: [], //服务对象
      codeNvsiAlbx0009: [], //服务类别
      codeNvsiAlbx0019: nvsiAlbx0019, //志愿者保障
    })
    const formRef = ref()
    const formParam = reactive({
      albx0021: '', // 区域
      albx0002: '', // 项目名称
      albx0013: '', // 项目编号
      albx0024: '1', // 志愿者招募范围
      albx0020: imgList[1], // 项目图片对象 默认给第二张图
      albx0004: null, // 项目开始时间
      albx0005: null, // 项目结束时间
      albx0006: null, //项目招募开始时间
      albx0007: null, //项目招募结束时间
      albx0014: [], // 服务对象 代码表
      albx0009: [], // 服务类别 代码表
      albx0019: [], // 志愿者保障
      albx0017: '', // 免审密码
      albx0022: [], // 可报名队伍编号列表
      albx0025: '', // 联系人姓名
      albx0026: '', // 联系人手机
      albx0027: '', // 联系人手机是否公开
      albx0028: '', // 联系人座机
      albx0029: '', // 联系人座机是否公开
      albx0030: '', // 联系人邮箱
      albx0018: '', // 项目描述
      albx0023: [], // 不可同时报名项目编号
      albx0033: '', // 报名前服务时长要求
      albx0003: '', // 服务地点
      albx0035: '', // 经度
      albx0036: '', // 纬度
      albx0062: '', // 项目所属团体名称
      albx0047: '', //补录项目扫描件
    })
    const center = ref({
      //百度地图默认地址
      lng: '',
      lat: '',
    })
    const albx0533 = ref('') //审核不通过项目 审核意见
    const cluesVisible = ref(false) //创建项目时的提示语弹窗
    const checked = ref(false) //补录项目扫描件  提示语单选框
    onMounted(() => {
      getNvsi()
      formParam.albx0062 = userInfo.value.team.albe0002
      query.value = LocalGetProjectInfo()
      query.value.type == 'create' && query.value.isRepair ? (checked.value = false) : (checked.value = true)
      query.value.type == 'create' ? (cluesVisible.value = true) : ''
      if (query.value.projectId) {
        option.areaid.push(query.value.areaId)
        getData() //获取项目详情
      } else {
        userInfo.value.areaLevel == '0' ? option.areaid.push('100000000000000000') : option.areaid.push(userInfo.value.team.albe0012)
      }
      option.areaid[0] = option.areaid[0].trim()
      area.value.defaultInitArea(option.areaid)
      if (query.value.isRepair) {
        option.albx0024 = '5'
        formParam.albx0024 = '5'
      }
    })

    const getNvsi = async () => {
      //查询服务类别 服务对象 志愿者保障
      const def_nvsiAlbx0014 = []
      const def_lbe05 = []
      const def_nvsiAlbx0019 = []
      nvsiAlbx0014.forEach((item) => {
        def_nvsiAlbx0014.push({
          codeid: item.value,
          codevalue: item.label,
        })
      })
      nvsiAlbx0019.forEach((item) => {
        def_nvsiAlbx0019.push({
          codeid: item.value,
          codevalue: item.label,
        })
      })
      sortOptions.forEach((item) => {
        def_lbe05.push({
          codeid: item.value,
          codevalue: item.label,
        })
      })
      const [res_nvsi_albx0014, res_lbe05, res_nvsi_albx0019] = await Promise.all([
        apis.getCodeValue('nvsi_albx0014', 'getAllCodeFortis', { codeTypeName: 'nvsi_albx0014' }),
        apis.getCodeValue('lbe05', 'getAllCodeFortis', { codeTypeName: 'lbe05', areaid: userInfo.value.areaid }),
        apis.getCodeValue('nvsi_albx0019', 'getAllCodeFortis', { codeTypeName: 'nvsi_albx0019' }),
      ])
      //服务对象
      res_nvsi_albx0014.code == 0 ? (codeValue.codeNvsiAlbx0014 = res_nvsi_albx0014.data) : (codeValue.codeNvsiAlbx0014 = def_nvsiAlbx0014)
      //服务类别
      res_lbe05.code == 0 ? (codeValue.codeNvsiAlbx0009 = res_lbe05.data) : (codeValue.codeNvsiAlbx0009 = [])
      //志愿者保障
      res_nvsi_albx0019.code == 0 ? (codeValue.codeNvsiAlbx0019 = res_nvsi_albx0019.data) : (codeValue.codeNvsiAlbx0019 = def_nvsiAlbx0019)
    }

    const openTeamModel = () => {
      //打开指定队伍选择弹窗
      teamVisible.value = true
    }

    const onClose = (bool, arr1) => {
      //关闭指定队伍选择弹窗
      if (bool) {
        formParam.albx0022 = arr1
        option.albx0022List = []
        arr1.forEach((element) => {
          let obj = {
            value: element,
            label: element,
          }
          option.albx0022List.push(obj)
        })
      }
      teamVisible.value = false
    }

    const openProjectModel = () => {
      //打开不可同时报名项目选择弹窗
      projectVisible.value = true
    }

    const onClose2 = (arr1) => {
      //关闭不可同时报名项目选择弹窗
      projectVisible.value = false
      formParam.albx0023 = arr1
      option.albx0023List = []
      arr1.forEach((element) => {
        let obj = {
          value: element,
          label: element,
        }
        option.albx0023List.push(obj)
      })
    }

    const showModal = () => {
      //打开默认项目封面按钮
      imgVisible.value = true
    }

    const onClose3 = (bool, obj) => {
      //关闭项目封面默认图片选择弹窗
      if (bool) {
        imageUrl.value = obj.imageUrl
        formParam.albx0020 = obj.albx0020
        imgIndex.value = obj.imgIndex
      }
      imgVisible.value = false
    }

    const disabledDate = (current) => {
      //普通项目时间不能选今天之前 补录项目可随意
      if (!query.value.isRepair) {
        return current && current < moment(redDate(moment(new Date()).format('YYYY-MM-DD'), 1)).endOf('day')
      } else {
        return current && current > moment(redDate(moment(new Date()).format('YYYY-MM-DD'), 1)).endOf('day')
      }
    }

    const getData = () => {
      //获取项目详情 修改或查看操作
      let bean = {
        albx0021: query.value.areaId, //区划
        proId: query.value.projectId, //项目id
      }
      if (query.value.isNotAudit) {
        //未通过审核项目需查询审核意见
        let bean2 = {
          proId: query.value.projectId,
        }
        rpcPost('projectAuditOpinionFortis', { bean2 }).then((res) => {
          if (res && res.code === 0 && res.data) {
            albx0533.value = res.data.albx0533
          }
        })
      }
      rpcPost('getGroupProjectDetailsFortis', { bean }).then((res) => {
        //查询项目详情
        console.log(res.data)
        if (res && res.data) {
          Object.keys(formParam).forEach((name) => {
            if (res.data[name]) {
              formParam[name] = res.data[name]
            }
          })
          formParam.albx0035 ? (center.value.lng = formParam.albx0035) : ''
          formParam.albx0036 ? (center.value.lat = formParam.albx0036) : ''
          imageUrl.value = formParam.albx0020 ? formParam.albx0020 : ''
          // if (formParam.albx0020) {
          //   //查询项目封面图片地址
          //   rpcPost('downloadFortisLogic', { bean: formParam.albx0020 }).then((res) => {
          //     debugger
          //     if (res && res.code === 0 && res.data) {
          //       imageUrl.value = res.data
          //     } else {
          //       message.warning('项目封面图片获取失败，请刷新重试')
          //     }
          //   })
          // }
          formParam.albx0047 && query.value.isRepair ? (formParam.albx0047 = JSON.parse(formParam.albx0047)) : ''
          isPhoneOpen.value = formParam.albx0027 == 1 ? true : false
          isTelOpen.value = formParam.albx0029 == 1 ? true : false
          option.albx0024 = formParam.albx0024

          if (formParam.albx0022 && formParam.albx0022.length != 0) {
            formParam.albx0022 = formParam.albx0022.split(',')
            option.albx0022List = []
            formParam.albx0022.forEach((element) => {
              let obj = {
                value: element,
                label: element,
              }
              option.albx0022List.push(obj)
            })
          }
          if (formParam.albx0023 && formParam.albx0023.length != 0) {
            formParam.albx0023 = formParam.albx0023.split(',')
            option.albx0023List = []
            formParam.albx0023.forEach((element) => {
              let obj = {
                value: element,
                label: element,
              }
              option.albx0023List.push(obj)
            })
          }
          formParam.albx0019 = formParam.albx0019 && formParam.albx0019.length > 0 ? formParam.albx0019.split(',') : []
          formParam.albx0014 = formParam.albx0014 && formParam.albx0014.length > 0 ? formParam.albx0014.split(',') : []
          formParam.albx0009 = formParam.albx0009 && formParam.albx0009.length > 0 ? formParam.albx0009.split(',') : []
          if (formParam.albx0006 && formParam.albx0007) {
            option.recruitingDate = [moment(formParam.albx0006), moment(formParam.albx0007)]
          }
          option.projectDate = [moment(formParam.albx0004), moment(formParam.albx0005)]
        } else {
          message.warning('未查询到该项目相关信息')
        }
      })
    }

    const toggleMap = () => {
      //详细地址 地图弹窗打开按钮
      mapVisible.value = !mapVisible.value
    }
    const handleMapSubmit = ({ val, e }) => {
      //详细地址 地图选中地址关闭调用
      mapData.value = e
      formParam.albx0003 = val
      formParam.albx0035 = mapData.value.point.lng //经度
      formParam.albx0036 = mapData.value.point.lat //纬度
    }
    // 招募范围
    const onChangeScope = (e) => {
      formParam.albx0024 = e.target.value
    }
    const onAreaChange = (e) => {
      //服务区域
      option.areaid = e
      formParam.albx0021 = e[e.length - 1]
    }
    // 图片上传
    const handleFileUpload = async (options) => {
      const res = await uploadHandle(options)
      if (res) {
        rpcPost('downloadFortisLogic', { bean: res }).then((result) => {
          imageUrl.value = result.data
          message.success('上传成功')
        })
        formParam.albx0020 = res
      } else {
        message.warning('上传失败')
      }
    }
    // 补录项目 扫描件上传
    const handleFileUpload2 = async (options) => {
      const res = await uploadHandle(options)
      if (res) {
        formParam.albx0047 = res
        message.success('上传成功')
      } else {
        message.warning('上传失败')
      }
    }
    const beforeUpload = (file) => {
      const flag = checkFileType(file)
      if (!flag) {
        message.error('上传文件格式错误，请重新上传')
        return false
      }
      const flag2 = checkUpload(file)
      if (!flag2) {
        message.warning('上传文件最大为10M，请重新上传')
        return false
      }
      return true
    }

    const del = () => {
      //补录项目扫描件删除按钮
      formParam.albx0047 = ''
    }
    //保存按钮事件
    const submit = () => {
      if (query.value.type === 'modify') {
        //修改
        modify()
      } else {
        //新增
        handleSubmit()
      }
    }

    const beanObj = () => {
      //表单字段集合
      return {
        albx0021: option.areaid[option.areaid.length - 1], // 区域
        albx0002: formParam.albx0002, // 项目名称
        albx0013: formParam.albx0013, // 项目编号
        albx0024: query.value.isRepair ? 5 : formParam.albx0024, // 志愿者招募范围志愿者招募范围
        albx0022: option.albx0024 == 2 ? formParam.albx0022.join(',') : null, // 可报名团体编号
        albx0017: option.albx0024 == 3 ? formParam.albx0017 : null, // 免审密码
        albx0020: formParam.albx0020, // 项目图片对象
        albx0004: moment(new Date(option.projectDate[0])).format('YYYY-MM-DD'), // 项目开始时间 固定每天0时0分0秒
        albx0005: moment(new Date(option.projectDate[1])).format('YYYY-MM-DD'), // 项目结束时间 固定每天23时59分59秒
        albx0006: moment(new Date(option.recruitingDate[0])).format('YYYY-MM-DD'), //项目招募开始时间
        albx0007: moment(new Date(option.recruitingDate[1])).format('YYYY-MM-DD'), //项目招募结束时间
        albx0014: formParam.albx0014.join(','), // 服务对象 代码表
        albx0009: formParam.albx0009.join(','), // 服务类别 代码表
        albx0019: formParam.albx0019.join(','), // 志愿者保障
        albx0025: formParam.albx0025, // 联系人姓名
        albx0026: formParam.albx0026, // 联系人手机
        albx0027: isPhoneOpen.value ? 1 : 0, // 联系人手机是否公开
        albx0028: formParam.albx0028 ? formParam.albx0028 : null, // 联系人座机
        albx0029: isTelOpen.value ? 1 : 0, // 联系人座机是否公开
        albx0030: formParam.albx0030 ? formParam.albx0030 : null, // 联系人邮箱
        albx0018: formParam.albx0018, // 项目描述
        albx0023: formParam.albx0023 ? formParam.albx0023.join(',') : null, // 不可同时报名项目编号
        albx0033: formParam.albx0033 ? formParam.albx0033 : null, // 报名前服务时长要求
        albx0003: formParam.albx0003, // 服务地点//formParam.albx0003
        albx0035: formParam.albx0035, // 经度formParam.albx0035
        albx0036: formParam.albx0036, // 纬度formParam.albx0036
        albx0047: query.value.isRepair ? formParam.albx0047 : null, //补录项目扫描件
      }
    }

    const modify = () => {
      //项目基本信息 修改提交
      formRef.value.validate().then(() => {
        let bean = {
          ...beanObj(),
          proId: query.value.projectId, //项目id
          teamAreaId: userInfo.value.areaLevel == '0' ? '100000000000000000' : userInfo.value.team.albe0012, //队伍areaid
        }
        bean.albx0021 != query.value.areaId ? (bean.startAreaId = query.value.areaId) : (bean.startAreaId = null) //如果项目修改区划了 则多传一个字段
        loadingBtn.value = true
        rpcPost('groupModifyProjectFortis', { bean: bean }).then((res) => {
          if (res && res.code === 0) {
            message.success('修改成功')
          } else {
            message.warning(res.message)
          }
          loadingBtn.value = false
        })
      })
    }

    const handleSubmit = () => {
      //项目基本信息 创建提交
      formRef.value.validate().then(() => {
        let bean = {
          ...beanObj(),
          albx0062: userInfo.value.team.albe0002, // 项目所属团体名称
          teamId: userInfo.value.team.groupid,
          teamAreaId: userInfo.value.areaLevel == '0' ? '100000000000000000' : userInfo.value.team.albe0012,
        }
        loadingBtn.value = true
        // 这个接口需要返回项目插入成功后的id
        rpcPost('groupPublishProjectFortis', {
          bean,
        }).then((res) => {
          console.log(res)
          if (res && res.code === 0) {
            let obj = {
              type: 'modify',
              isRepair: query.value.isRepair,
              projectType: query.value.isRepair ? 6 : 1,
              projectId: res.data.proid,
              areaId: option.areaid[option.areaid.length - 1],
            }
            LocalSetProjectInfo(obj)
            query.value = LocalGetProjectInfo()
            message.success('创建成功')
          } else {
            message.error(res.message)
          }
          loadingBtn.value = false
        })
      })
    }

    const download = ref() //补录项目证明件 下载按钮

    const download_albx0047 = () => {
      //补录项目证明件 下载按钮事件
      rpcPost('downloadFortisLogic', { bean: formParam.albx0047 }).then((res) => {
        if (res && res.code === 0 && res.data) {
          download.value.href = res.data
          download.value.click()
        } else {
          message.warning('下载失败，请重试')
        }
      })
    }

    const checkPhone = async (rule, value) => {
      if (value && checkPhoneno(value)) {
        return Promise.resolve()
      } else if (value && !checkPhoneno(value)) {
        return Promise.reject('请输入正确的手机号码')
      } else {
        return Promise.reject('手机号码不能为空')
      }
    }
    const checkLandline = async (rule, value) => {
      //座机验证
      if (value && !checkTelPhoneno(value)) {
        return Promise.reject('请输入正确的座机号码')
      } else {
        return Promise.resolve()
      }
    }
    const checkemail = async (rule, value) => {
      //邮箱验证
      if (value && !checkEmail(value)) {
        return Promise.reject('请输入正确的邮箱')
      } else {
        return Promise.resolve()
      }
    }

    const checkAreaid = async (rule, value) => {
      //项目服务区域验证
      if (option.areaid && option.areaid.length && option.areaid.length !== 0) {
        return Promise.resolve()
      } else {
        return Promise.reject('选择服务区域')
      }
    }

    const checkTime = async (rule, value) => {
      //项目时间验证
      if (option.projectDate && option.projectDate.length && option.projectDate.length === 2) {
        return Promise.resolve()
      } else {
        return Promise.reject('请选择项目时间')
      }
    }

    const checkTime2 = async (rule, value) => {
      //项目招募时间验证
      if (!option.recruitingDate || option.recruitingDate == 0) {
        return Promise.reject('请选择项目招募时间')
      } else if (
        option.recruitingDate &&
        option.recruitingDate.length &&
        option.recruitingDate.length === 2 &&
        option.projectDate &&
        option.projectDate.length &&
        option.projectDate.length === 2 &&
        checktime2(moment(new Date(option.projectDate[1])).format('YYYY-MM-DD'), moment(new Date(option.recruitingDate[1])).format('YYYY-MM-DD'))
      ) {
        return Promise.reject('招募结束时间不能晚于项目结束时间')
      } else {
        return Promise.resolve()
      }
    }

    const checkname = async (rule, value) => {
      //联系人姓名校验
      if (!formParam.albx0025) {
        return Promise.reject('请填写联系人姓名')
      } else if (!checkName(formParam.albx0025)) {
        return Promise.reject('请填写正确格式的联系人姓名')
      } else {
        return Promise.resolve()
      }
    }

    const checkAlbx0047 = async (rule, value) => {
      //补录项目扫描件校验
      if (query.value.isRepair && !formParam.albx0047) {
        return Promise.reject('请上传项目证明扫描件')
      } else {
        return Promise.resolve()
      }
    }

    const checkAlbx0017 = async (rule, value) => {
      if (!value && option.albx0024 == 3) {
        return Promise.reject('请输入免审密码')
      } else if (value && !reg1(value) && option.albx0024 == 3) {
        return Promise.reject('免审密码只能由纯数字组成')
      } else if (value.length > 6) {
        return Promise.reject('免审密码最多6位')
      } else {
        return Promise.resolve()
      }
    }

    const checkAlbx0022 = async (rule, value) => {
      //可报名队伍编号
      if (option.albx0024 == 2 && formParam.albx0022.length == 0) {
        return Promise.reject('请选择可报名队伍')
      } else {
        return Promise.resolve()
      }
    }

    const checkAlbx0033 = async (rule, value) => {
      //时长要求
      if (value && !reg3(value)) {
        return Promise.reject('请输入大于或等于0的数字，且最多保留2位小数')
      } else {
        return Promise.resolve()
      }
    }

    const checkAlbx0009 = async (rule, value) => {
      //服务类别
      if (value && value.length == 0) {
        return Promise.reject('请选择服务类别')
      } else if (value && value.length > 4) {
        return Promise.reject('服务类别最多可选4项')
      } else {
        return Promise.resolve()
      }
    }

    const checkChecked = async (rule, value) => {
      //补录上传扫描件声明
      if (!checked.value && query.value.isRepair) {
        return Promise.reject('请同意声明内容')
      } else {
        return Promise.resolve()
      }
    }

    const rules = reactive({
      albx0002: [
        { required: true, message: '请输入项目名称' },
        { max: 50, message: '项目名称最多为50个字' },
      ],
      albx0024: [{ required: true, message: '请选择志愿者招募范围' }],
      albx0004: [{ required: true, validator: checkTime, type: 'object', trigger: 'change' }],
      recruitingDate: [{ required: true, validator: checkTime2, type: 'object', trigger: 'change' }],
      albx0021: [{ required: true, validator: checkAreaid, type: 'object', trigger: 'change' }],
      albx0003: [{ required: true, message: '请选择详细地址', trigger: 'blur' }],
      albx0014: [{ required: true, message: '请选择服务对象', trigger: 'change', type: 'array' }],
      albx0009: [{ required: true, validator: checkAlbx0009, trigger: 'change', type: 'array' }],
      albx0019: [{ required: true, message: '请选择志愿者保障', trigger: 'change', type: 'array' }],
      albx0025: [{ required: true, validator: checkname }],
      albx0026: [{ required: true, validator: checkPhone }], //手机号码
      albx0018: [{ required: true, message: '请填写项目详情' }],
      albx0028: [{ required: false, validator: checkLandline }], //座机
      albx0030: [{ required: false, validator: checkemail }], //邮箱
      albx0017: [{ required: false, validator: checkAlbx0017 }], //免审密码
      albx0022: [{ required: true, validator: checkAlbx0022, trigger: 'change' }], //团体编号
      albx0047: [{ required: true, validator: checkAlbx0047, trigger: 'blur' }],
      albx0033: [{ required: false, validator: checkAlbx0033, trigger: 'blur' }],
      checked: [{ required: false, validator: checkChecked, trigger: 'change' }], //补录上传扫描件声明
    })

    watch(
      () => option.albx0024,
      (value) => {
        rules.albx0017[0].required = false
        if (value == 3) {
          rules.albx0017[0].required = true
        }
      }
    )

    return {
      center,
      download,
      area,
      imgVisible,
      cluesVisible,
      checked,
      onClose,
      onClose2,
      onClose3,
      openTeamModel,
      openProjectModel,
      albx0533,
      teamVisible,
      projectVisible,
      query,
      formRef,
      imgIndex,
      confirmLoading,
      moment,
      isPhoneOpen,
      isTelOpen,
      mapVisible,
      mapData,
      userInfo,
      basicFormLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
      },
      codeValue,
      loading,
      loadingBtn,
      imageUrl,
      projectBg,
      disabledDate,
      option,
      formParam,
      rules,
      sortOptions,
      showModal,
      checkPhone,
      checkLandline,
      checkEmail,
      toggleMap,
      handleMapSubmit,
      onChangeScope,
      onAreaChange,
      handleFileUpload,
      handleFileUpload2,
      beforeUpload,
      submit,
      handleSubmit,
      del,
      download_albx0047,
    }
  },
})
</script>
<style lang="less" scoped>
.avatar-uploader .ant-upload {
  width: 100%;
}
.nv-project-scope {
  .scope-label {
    width: 78%;
    height: 66px;
    padding: 0 12px;
    display: table;
    div {
      display: table-cell;
      vertical-align: middle;
    }
  }
  .scope-name {
    width: 22%;
    height: 66px;
    padding: 0 12px;
    line-height: 66px;
  }
  .scope-grid {
    margin-bottom: 16px;
    width: 100%;
    padding: 0;
  }
}
.ml_10 {
  margin-left: 10px;
}
.download_btn {
  border-bottom: 1px solid #d92f2f;
  margin: 0 15px 0 40px;
}
.del_btn {
  border-bottom: 1px solid #d92f2f;
}
.select_project_btn {
  position: absolute;
  padding: 0 18px;
}
.submit_btn {
  width: 100%;
  text-align: center;
}
</style>
<style>
.my_input {
  min-height: 40px;
}
.my_input input.ant-input {
  min-height: 38px !important;
}
.ant-select-selector {
  min-height: 40px;
}
</style>

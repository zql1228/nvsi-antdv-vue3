<template>
  <div>
    <a-drawer
      v-model:visible="props.visible"
      title="通知公告"
      :maskClosable="false"
      placement="right"
      @close="onClose(0)"
      width="800"
      :body-style="{ paddingBottom: '80px' }"
    >
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef" :model="form" :rules="rules">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              name="title"
              label="标题"
              :wrapper-col="{
                span: 10,
              }"
            >
              <a-input v-model:value="form.title" type="text" :disabled="props.type == 'view'" placeholder="请输入公告标题" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item name="urgentlevel" label="紧急程度">
              <a-radio-group v-model:value="form.urgentlevel" :disabled="props.type == 'view'" :options="optionsList.options1" /> </a-form-item
          ></a-col>
          <a-col :span="24">
            <a-form-item name="sort" label="通知类别">
              <a-radio-group :options="optionsList.options2" v-model:value="form.sort" :disabled="props.type == 'view'" /> </a-form-item
          ></a-col>
          <a-col :span="24"
            ><a-form-item name="unit" label="接收单位">
              <a-checkbox-group :options="optionsList.options3" v-model:value="form.unit" :disabled="props.type == 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="24" v-show="form.unit.indexOf('3') != -1"
            ><a-form-item
              name="personnelList"
              :label-col="{
                span: 0,
              }"
              :wrapper-col="{
                span: 16,
                offset: 4,
              }"
            >
              <a-select mode="multiple" v-model:value="form.personnelList" placeholder="请点击右侧按钮选择人员" :disabled="props.type == 'view'">
                <a-select-option v-for="(item, index) in options.personnelList" :key="index" :value="item.id">{{ item.name }} </a-select-option>
              </a-select>
              <a-button type="primary" style="position: absolute; padding: 0 18px" @click="openModel('personnel')" :disabled="props.type == 'view'"
                >选择人员</a-button
              >
            </a-form-item>
          </a-col>
          <a-col :span="24"
            ><a-form-item label="接收志愿队伍" name="team">
              <a-radio-group v-model:value="form.team" :options="optionsList.options4" :disabled="props.type == 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="24" v-show="form.team.indexOf('1') != -1"
            ><a-form-item
              name="teamList"
              :label-col="{
                span: 0,
              }"
              :wrapper-col="{
                span: 16,
                offset: 4,
              }"
            >
              <a-select mode="multiple" v-model:value="form.teamList" placeholder="请点击右侧按钮选择队伍" :disabled="props.type == 'view'">
                <a-select-option v-for="(item, index) in options.teamList" :key="index" :value="item.id">{{ item.name }} </a-select-option>
              </a-select>
              <a-button type="primary" style="position: absolute; padding: 0 18px" @click="openModel('team')" :disabled="props.type == 'view'"
                >选择队伍</a-button
              >
            </a-form-item>
          </a-col>
          <a-col :span="24"
            ><a-form-item name="content" label="通知内容">
              <!-- :options="quillOption" -->
              <!-- <QuillEditor v-model="form.content" :options="quillEditorConf" toolbar="full" ref="QuillEditor" maxlength="15000" /> -->
              <QuillEditor class="editor" v-model="form.content" theme="snow" toolbar="full" ref="QuillEditor" maxlength="15000" />
            </a-form-item>
          </a-col>
          <a-col :span="24"
            ><a-form-item name="file" label="附件">
              <a-row v-for="(item, index) in fileList" :key="index" justify="end" style="border-bottom: 1px solid#666; margin-top: 5px">
                <a-col span="18">
                  <a-col span="22" class="nowrap"
                    ><span>{{ item.showname }}</span></a-col
                  >
                </a-col>
                <a-col span="6">
                  <a-row justify="end">
                    <a-col span="12" style="text-align: right"> <a style="border-bottom: 1px solid red" @click="down(index)">下载</a></a-col>
                    <a-col span="12" style="text-align: right"
                      ><a @click="del(index)" :style="{ color: props.type == 'view' ? '#ddd' : 'red' }">删除</a></a-col
                    >
                  </a-row>
                </a-col>
              </a-row>
              <a ref="download" download v-show="false" href="#"></a>
              <a-upload :file-list="fileList" name="file" :showUploadList="false" :beforeUpload="beforeUpload" :customRequest="handleFileUpload">
                <a-button
                  :style="fileList.length > 0 ? 'margin-top:8px;' : ''"
                  v-show="!(props.type == 'view' && fileList.length > 0)"
                  :disabled="props.type == 'view'"
                >
                  <template #icon><PlusOutlined /> </template>
                  上传</a-button
                >
              </a-upload>
            </a-form-item>
            <a-col :span="24" v-if="personnelRead.yingread > 0" align="right">
              <span class="span">应阅：</span>{{ personnelRead.yingread }}<span class="span">&nbsp;人</span>&nbsp;&nbsp;<span class="span"
                >已阅：</span
              >{{ personnelRead.read }}<span class="span">&nbsp;人</span>&nbsp;&nbsp;<span class="span">未阅：</span>{{ personnelRead.noread
              }}<span class="span">&nbsp;人</span>&nbsp;&nbsp;
            </a-col>
          </a-col>
        </a-row>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
        v-show="props.type != 'view'"
      >
        <a-button style="margin-right: 8px" @click="submit(2)" :loading="loading1" :disabled="loading2">暂存</a-button>
        <a-button type="primary" @click="submit(1)" :loading="loading2" :disabled="loading1">发送</a-button>
      </div>
    </a-drawer>
    <PersonnelModelTable
      :visible="visible.personnelVisable"
      @child="onCloseModel1"
      :personnelIdList="form.personnelList"
      :personnelList="options.personnelList"
    ></PersonnelModelTable>
    <TeamlModelTable :visible="visible.teamVisable" @child="onCloseModel2" :teamIdList="form.teamList" :teamList="options.teamList"></TeamlModelTable>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, watch } from 'vue'
import { uploadHandle, checkFileType } from '@/utils/upload'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { PlusOutlined } from '@ant-design/icons-vue'
import PersonnelModelTable from './PersonnelModelTable' //人员选择弹窗
import TeamlModelTable from './TeamlModelTable' //队伍选择弹窗
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue/es'
import getQuillEditorConf from '@/pages/mcaworkMes/quillEditorConfig.js' //引入富文本编辑器按钮配置
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '', //create创建 modify修改 view查看
    },
    item: {
      type: Object,
      default: {},
    },
  },
  components: {
    PlusOutlined,
    PersonnelModelTable,
    TeamlModelTable,
  },
  setup(props, text) {
    const download = ref()
    const formRef = ref()
    const userInfo = ref(LocalGetUserInfo())
    const form = reactive({
      title: '', //标题
      urgentlevel: '', //紧急程度
      sort: '', //通知类别
      content: '', //通知内容
      unit: [], //接收单位
      team: '', //接收志愿队伍
      personnelList: [], //选中人员id数组
      teamList: [], //选中队伍id数组
    })
    const personnelRead = reactive({
      //当前通知公告浏览情况
      noread: 0, //未读人数
      read: 0, //已读人数
      yingread: 0, //应读人数
    })
    const options = reactive({
      personnelList: [], //从弹窗传过来的人员对象数组
      teamList: [], //从弹窗传过来的队伍对象数组
    })
    const QuillEditor = ref() //富文本对象form.content = QuillEditor.value.getHTML()
    const editorOption = ref() //富文本对象上传图片配置

    const quillEditorConf = getQuillEditorConf(QuillEditor)

    const fileList = ref([]) //上传文件组件按钮的文件列表
    const confirmLoading = ref(false) //确定按钮loading
    const visible = reactive({
      //队伍和人员选择弹窗
      personnelVisable: false,
      teamVisable: false,
    })
    const loading1 = ref(false)
    const loading2 = ref(false)
    const optionsList = reactive({
      options1: [
        {
          label: '紧急',
          value: '1',
        },
        {
          label: '普通',
          value: '2',
        },
      ],
      options2: [
        {
          label: '工作通知',
          value: '1',
        },
        {
          label: '会议通知',
          value: '2',
        },
        {
          label: '培训通知',
          value: '3',
        },
      ],
      options3: [
        //areaLevel 0,1,2,3全国 省 市 区
        //部级 省市区本级
        //省级 市区本级
        //市级 区本级
        //区级 本级
        {
          label: '各省级管理部门', //部级可选
          value: '0',
          disabled: userInfo.value.areaLevel != 0,
        },
        {
          label: '全市级管理部门', //省级可选
          value: '1',
          disabled: userInfo.value.areaLevel != 0 && userInfo.value.areaLevel != 1,
        },
        {
          label: '全区/县级管理部门', //部级可选 省级可选 市级可选
          value: '2',
          disabled: userInfo.value.areaLevel != 0 && userInfo.value.areaLevel != 1 && userInfo.value.areaLevel != 2,
        },
        {
          label: '本级其它管理人员', //都能选
          value: '3',
        },
      ],
      options4: [
        {
          label: '管辖范围内全部志愿服务队伍',
          value: '0',
        },
        {
          label: '指定服务队伍',
          value: '1',
        },
      ],
    })
    const onClose = (bool) => {
      //叉号 关闭弹窗
      formRef.value.resetFields()
      fileList.value = []
      QuillEditor.value.setHTML('')
      options.teamList = []
      options.personnelList = []
      personnelRead.noread = 0
      personnelRead.read = 0
      personnelRead.yingread = 0
      loading1.value = false
      loading2.value = false
      text.emit('child', bool)
    }

    const onCloseModel1 = (arr1, arr2) => {
      //人员选择弹窗关闭所调用的方法
      form.personnelList = arr1
      options.personnelList = arr2
      visible.personnelVisable = false
    }

    const onCloseModel2 = (arr1, arr2) => {
      //队伍选择弹窗关闭所调用的方法
      form.teamList = arr1
      options.teamList = arr2
      visible.teamVisable = false
    }

    const openModel = (str) => {
      //打开队伍和人员弹窗
      if (str == 'personnel') {
        visible.personnelVisable = true
      } else {
        visible.teamVisable = true
      }
    }

    const beforeUpload = (file) => {
      //文件格式校验
      const flag = checkFileType(file)
      if (!flag) {
        message.warning('上传文件格式错误，请重新上传')
        return false
      }
      return true
    }

    // 文件上传
    const handleFileUpload = async (options) => {
      const res = await uploadHandle(options)
      if (res) {
        message.success('上传成功')
        fileList.value.push(res)
      } else {
        message.warning('上传失败')
      }
    }

    const del = (index) => {
      //文件上传 文件删除
      if (props.type !== 'view') {
        fileList.value.splice(index, 1)
      }
    }

    const submit = (sendstatus) => {
      formRef.value.validate().then(() => {
        let bean = {
          bean: {
            creatorid: userInfo.value.userid,
            creatorname: userInfo.value.fullName,
            sendstatus: sendstatus, //未发送2 发送1
            title: form.title,
            urgentlevel: form.urgentlevel,
            sort: form.sort,
            content: form.content,
            provice: form.unit.indexOf('0') != -1 ? 1 : null, //是否选中各省级管理部门 1选中
            city: form.unit.indexOf('1') != -1 ? 1 : null, //是否选中全市级管理部门
            county: form.unit.indexOf('2') != -1 ? 1 : null, //是否选中全区/县级管理部门
            team: form.team == 0 ? 1 : null, //是否选中管辖范围内全部志愿服务队伍
            annex: JSON.stringify(fileList.value), //附件
            areaid: userInfo.value.areaid,
          },
          areaid: userInfo.value.areaLevel == 0 ? 0 : userInfo.value.areaid, //全国的部级账号传0
          level: userInfo.value.areaLevel,
        }
        let arr = []
        if (form.unit.indexOf('3') != -1) {
          form.personnelList.forEach((element1) => {
            options.personnelList.forEach((element2) => {
              element2.accounttype = 0 //0是人 1是队伍
              if (element2.id == element1) {
                arr.push(element2)
              }
            })
          })
        }
        if (form.team == 1) {
          form.teamList.forEach((element1) => {
            options.teamList.forEach((element2) => {
              element2.accounttype = 1 //0是人 1是队伍
              if (element2.id == element1) {
                arr.push(element2)
              }
            })
          })
        }
        bean.bean.userid = arr.length > 0 ? arr : null
        console.log(bean)
        if (sendstatus == 2) {
          staging(bean)
        } else if (sendstatus == 1) {
          send(bean)
        }
      })
    }

    const staging = (bean) => {
      loading1.value = true
      if (props.type == 'create') {
        //新建暂存
        rpcPost('InsertBulletin', { bean }).then((res) => {
          if (res && res.code === 0) {
            message.success('保存成功')
            onClose(1)
          } else {
            message.warning(res.message)
          }
          loading1.value = false
        })
      } else if (props.type == 'modify') {
        //修改暂存
        bean.id = props.item.id
        rpcPost('updateBulletin', { bean }).then((res) => {
          if (res && res.code === 0) {
            message.success('修改成功')
            onClose(1)
          } else {
            message.warning(res.message)
          }
          loading1.value = false
        })
      }
    }

    const send = (bean) => {
      //发送
      loading2.value = true
      // 发送
      props.type = 'modify' ? (bean.id = props.item.id) : ''
      rpcPost('InsertBulletin', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('发送成功')
          props.type = 'modify' ? onClose(3) : onClose(2)
        } else {
          message.warning(res.message)
        }
        loading2.value = false
      })
    }

    const down = (index) => {
      //下载 按钮
      rpcPost('downloadFortisLogic', { bean: fileList.value[0] }).then((res) => {
        if (res && res.code === 0 && res.data) {
          download.value.href = res.data
          download.value.click()
        } else {
          message.warning('下载失败')
        }
      })
    }

    watch(
      () => props.visible,
      (visible) => {
        if (visible && props.type != 'create') {
          //除新建操作外 需查询当前通知公告详情
          let bean = {
            id: props.item.id,
          }
          rpcPost('getBulletin', { bean }).then((res) => {
            console.log(res.data)
            if (res && res.code === 0) {
              form.title = res.data.title
              form.urgentlevel = res.data.urgentlevel
              form.sort = res.data.sort
              form.content = res.data.content
              QuillEditor.value.setHTML(res.data.content) //富文本编辑器
              res.data.provice ? form.unit.push('0') : '' //各省级管理部门
              res.data.city ? form.unit.push('1') : '' //全市级管理部门
              res.data.county ? form.unit.push('2') : '' //全区/县级管理部门
              form.team = res.data.team ? '0' : '1'
              fileList.value = JSON.parse(res.data.annex)
              if (res.data.userid) {
                res.data.userid.forEach((element) => {
                  if (element.accounttype == 0) {
                    //接收单位
                    form.unit.push('3') //有接收单位说明"本级其它管理人员"被选中了
                    form.personnelList.push(element.id)
                    options.personnelList.push(element)
                  } else if (element.accounttype == 1) {
                    form.teamList.push(element.id)
                    options.teamList.push(element)
                  }
                })
              }
            } else {
              message.warning(res.message)
            }
          })
          if (props.item.isShowRead) {
            //查询已读人数
            rpcPost('getReadAndNoReadNum', { bean: { bulletinid: props.item.id } }).then((res) => {
              if (res && res.code == 0) {
                personnelRead.noread = res.data.noread
                personnelRead.read = res.data.read
                personnelRead.yingread = res.data.yingread
              }
            })
          }
        }
      }
    )

    const checkUnit = async (rule, value) => {
      //接收单位验证
      if (form.unit.length > 0) {
        return Promise.resolve()
      } else {
        return Promise.reject('请选择接收单位')
      }
    }

    const checkContent = async (rule, value) => {
      //公告内容验证
      form.content = QuillEditor.value.getHTML()
      if (!form.content || form.content == '<p><br></p>') {
        return Promise.reject('请填写公告内容')
      } else {
        return Promise.resolve()
      }
    }

    const rules = reactive({
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      urgentlevel: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
      sort: [{ required: true, message: '请选择通知类别', trigger: 'change' }],
      unit: [{ required: true, validator: checkUnit, trigger: 'change' }],
      team: [{ required: true, message: '请选择接收志愿队伍', trigger: 'change' }],
      content: [{ required: true, validator: checkContent, trigger: 'blur' }],
      personnelList: [{ required: false, message: '请选择接收单位', type: 'array', trigger: 'blur' }],
      teamList: [{ required: false, message: '请选择接志愿队伍', type: 'array', trigger: 'blur' }],
    })

    watch(
      () => form.unit,
      (unit) => {
        rules.personnelList[0].required = false
        if (unit.indexOf('3') != -1) {
          rules.personnelList[0].required = true
        }
      }
    )

    watch(
      () => form.team,
      (team) => {
        rules.teamList[0].required = false
        if (team.indexOf(1) != -1) {
          rules.teamList[0].required = true
        }
      }
    )

    return {
      quillEditorConf,
      personnelRead,
      download,
      down,
      QuillEditor,
      loading2,
      loading1,
      fileList,
      props,
      options,
      visible,
      formRef,
      form,
      rules,
      confirmLoading,
      optionsList,
      onClose,
      beforeUpload,
      handleFileUpload,
      onCloseModel1,
      onCloseModel2,
      openModel,
      del,
      staging,
      send,
      submit,
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 21,
      },
    }
  },
})
</script>
<style scoped>
.nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.span {
  font-weight: bolder;
}
.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:' !important;
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px !important;
  content: '保存' !important;
  padding-right: 0px !important;
}

.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:' !important;
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px' !important;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
  content: '10px' !important;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
  content: '18px' !important;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
  content: '32px' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本' !important;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1' !important;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2' !important;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3' !important;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4' !important;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5' !important;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体' !important;
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
  content: '衬线字体' !important;
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
  content: '等宽字体' !important;
}
</style>

<template>
  <div>
    <a-drawer
      v-model:visible="props.visible"
      title="新闻"
      :maskClosable="false"
      placement="right"
      @close="onClose(false)"
      width="800"
      :body-style="{ paddingBottom: '80px' }"
    >
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef" :model="form" layout="horizontal" :rules="rules">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              name="title"
              label="新闻标题"
              :wrapper-col="{
                span: 10,
              }"
            >
              <a-input v-model:value="form.title" type="text" placeholder="请输入新闻标题" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              name="newsfrom"
              label="新闻来源"
              :wrapper-col="{
                span: 10,
              }"
            >
              <a-input v-model:value="form.newsfrom" type="text" placeholder="请输入新闻来源" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item label="录入时间">
              <a-space direction="vertical" :size="12" v-model:value="form.entrytime">
                <a-date-picker show-time placeholder="选择录入时间" @change="onChange" @ok="onOk" />
              </a-space>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="isvideonews" label="是否视频稿件">
              <a-radio-group v-model:value="form.isvideonews" :options="optionsList.options1" />
            </a-form-item>
          </a-col>
          <!-- 如果是 则开始填视频链接 -->
          <a-col :span="24">
            <a-form-item
              name="title"
              label="视频链接"
              :wrapper-col="{
                span: 10,
              }"
              v-show="form.isvideonews == 1"
            >
              <a-input v-model:value="form.videolink" type="text" placeholder="请输入视频链接" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="istop" label="是否置顶">
              <a-radio-group v-model:value="form.istop" :options="optionsList.options1" />
            </a-form-item>
          </a-col>
          <!-- 置顶的时候需要保存置顶时间 后台判断是否置顶创建时间 -->
          <a-col :span="24">
            <a-form-item label="置顶时间" v-show="form.istop == 1">
              <a-space direction="vertical" :size="12" v-model:value="form.toptime">
                <a-date-picker show-time placeholder="选择置顶时间" @change="onChange" @ok="onOk" />
              </a-space>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item name="exlink" label="外链地址">
              <a-input v-model:value="form.exlink" type="text" placeholder="请输入外链地址" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="istabloid" label="是否轮播新闻">
              <a-radio-group v-model:value="form.istabloid" :options="optionsList.options1" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="newscontent" label="新闻内容">
              <QuillEditor v-model:value="form.newscontent" theme="snow" toolbar="full" ref="QuillEditor" :options="editorOption" maxlength="15000" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="imgtitle" label="图片封面">
              <a-upload
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                style="width: 100%"
                :customRequest="handleFileUpload2"
                :beforeUpload="beforeUpload"
                :showUploadList="false"
                :disabled="props.type == 'view'"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">上传新闻封面</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>

          <a-col :span="24"
            ><a-form-item name="file" label="附件">
              <a-row v-for="(item, index) in fileList" :key="index" justify="end" style="border-bottom:1px solid#666;margin-top:5px;">
                <a-col span="18">
                  <a-col span="22" class="nowrap"
                    ><span>{{ item.showname }}</span></a-col
                  >
                </a-col>
                <a-col span="6">
                  <a-row justify="end">
                    <a-col span="12" style="text-align:right;"> <a style="border-bottom:1px solid red;" @click="down(index)">下载</a></a-col>
                    <a-col span="12" style="text-align:right;"
                      ><a @click="del(index)" :style="{ color: props.type == 'view' ? '#ddd' : 'red' }">删除</a></a-col
                    >
                  </a-row>
                </a-col>
              </a-row>
              <a ref="download" download v-show="false" href="#"></a>
              <a-upload :file-list="fileList" name="file" :showUploadList="false" :beforeUpload="beforeUpload" :customRequest="handleFileUpload">
                <a-button :style="fileList.length > 0 ? 'margin-top:8px;' : ''" v-show="!(props.type == 'view' && fileList.length > 0)">
                  <template #icon><PlusOutlined /> </template>
                  上传</a-button
                >
              </a-upload>
            </a-form-item>
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
        <!-- 当前新闻保存到未发布中 -->
        <a-button style="margin-right: 8px" @click="submit(0)" :loading="loading1">保存</a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, watch } from 'vue'
import { uploadHandle, checkFileType } from '@/utils/upload'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { PlusOutlined } from '@ant-design/icons-vue'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue/es'
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
  },
  setup(props, text) {
    const download = ref()
    const imageUrl = ref('') // 封面图片地址
    const formRef = ref()
    const userInfo = ref(LocalGetUserInfo())
    const form = reactive({
      title: '', //标题
      englishtitle: '', //英文标题
      newsfrom: '', //稿件来源
      entrytime: '', //录入时间
      beresourcename: '', //所属资源
      videolink: '', //视频链接
      layoutList: [], //选中布局id数组
      imgtitle: '', //图片地址=
      forsystem: '', //所属系统
      ispublish: '', //是否发布
      istabloid: '', //是否轮播
      istop: '', //是否置顶
      isvideonews: '', //是否视频稿件
      newsfrom: '', //稿件来源
      toptime: '', //置顶时间
      exlink: '', //'
      newscontent: '',
    })

    const QuillEditor = ref() //富文本对象form.content = QuillEditor.value.getHTML()
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
          label: '是',
          value: '1',
        },
        {
          label: '否',
          value: '2',
        },
      ],
    })
    const handleOk = (e) => {
      //确定按钮
      onClose(true)
    }
    const onClose = (bool) => {
      //叉号 关闭弹窗
      formRef.value.resetFields()
      fileList.value = []
      QuillEditor.value.setHTML('')
      text.emit('child', bool)
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
    // 图片上传
    const handleFileUpload2 = async (options) => {
      const res = await uploadHandle(options)
      if (res) {
        rpcPost('downloadFortisLogic', { bean: res }).then((result) => {
          imageUrl.value = result.data
          message.success('上传成功')
        })
        imageUrl = res
      } else {
        message.warning('上传失败')
      }
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

    //把新闻的所有字段写出来
    const beanObj = () => {
      //表单字段集合
      return {
        creator: userInfo.value.userflag,
        areaid: userInfo.value.areaid,
        title: form.title,
        entrytime: form.entrytime,
        newsfrom: form.newsfrom,
        newscontent: QuillEditor.value.getHTML(),
        attachments: JSON.stringify(fileList.value), //附件
        imgtitle: props.item.imgtitle,
        istabloid: form.istabloid,
        isvideonews: form.isvideonews,
        istop: form.istop,
        toptime: form.toptime,
        exlink: form.exlink,
        videolink: form.videolink, //视频链接
      }
    }

    const submit = (sendstatus) => {
      formRef.value.validate().then(() => {
        let bean = {
          ...beanObj(),
          creator: userInfo.value.fullName,
          areaid: userInfo.value.areaid,
          ispublish: sendstatus, //未发布0 发布1
        }
        staging(bean) //暂存稿件
      })
    }

    const staging = (bean) => {
      loading1.value = true
      if (props.type == 'modify') {
        //修改暂存
        bean.id = props.item.id
        rpcPost('saveContentFront', { bean }).then((res) => {
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

    const onEditorFocus = (event) => {
      // 富文本获得焦点时的事件
      // console.log(val); // 富文本获得焦点时的内容
      // if (props.type == 'view') {
      //   QuillEditor.value.enable(false) //查看状态禁用富文本 在获取焦点的时候禁用
      // }
    }

    const rules = reactive({
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    })
    //监听修改页面，赋值
    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          Object.keys(form).forEach((name) => {
            if (props.item[name]) {
              form[name] = props.item[name]
            }
          })
        }
        //  fileList.value = JSON.parse(props.item.attachments)

        if (props.item.imgtitle) {
          //查询封面地址
          rpcPost('downloadFortisLogic', { bean: props.item.imgtitle }).then((res) => {
            if (res && res.code === 0 && res.data) {
              imageUrl.value = res.data
            } else {
              message.warning('栏目封面图片获取失败')
            }
          })
        }
        if (props.item.newscontents) {
          QuillEditor.value.setHTML(props.item.newscontents)
        }
      }
    )

    return {
      props,
      download,
      down,
      QuillEditor,
      loading2,
      loading1,
      fileList,
      props,
      visible,
      formRef,
      form,
      rules,
      confirmLoading,
      optionsList,
      handleOk,
      onClose,
      beforeUpload,
      handleFileUpload,
      handleFileUpload2,
      del,
      staging,
      submit,
      onEditorFocus,
      imageUrl,
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
</style>

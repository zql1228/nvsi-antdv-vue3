<template>
  <!-- 新建或修改项目 -->
  <a-modal
    title="项目编辑"
    :width="900"
    :visible="visible"
    :confirmLoading="loading"
    @ok="submit"
    @cancel="onClose(false)"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout" layout="horizontal">
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
            <a-form-item v-show="model && model.id > 0" label="主键ID">
              <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item v-show="model && model.id > 0" label="主键ID">
              <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="项目名称">
              <a-input v-model="formParam.albx0002" placeholder="项目名称" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="项目区域">
              <a-input v-model="formParam.albx0021" placeholder="项目区域" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="志愿者招募范围">
              <a-input
                v-model="formParam.albx0024"
                placeholder="志愿者招募范围"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="项目开始时间">
              <a-input
                v-model="formParam.albx0004"
                placeholder="项目开始时间"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <!-- 这两个可以合成一个字段 -->
            <a-form-item label="项目开始时间">
              <a-input
                v-model="formParam.albx0004"
                placeholder="项目开始时间"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="项目结束时间">
              <a-input
                v-model="formParam.albx0005"
                placeholder="项目结束时间"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="服务对象">
              <a-input v-model="formParam.albx0014" placeholder="服务对象" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="服务类别">
              <a-input v-model="formParam.albx0009" placeholder="服务类别" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="志愿者保障">
              <a-input v-model="formParam.albx0019" placeholder="志愿者保障" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="联系人姓名">
              <a-input v-model="formParam.albx0025" placeholder="联系人姓名" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="联系人手机">
              <a-input v-model="formParam.albx0026" placeholder="联系人手机" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="联系人手机是否公开">
              <a-input
                v-model="formParam.albx0027"
                placeholder="联系人手机是否公开"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="联系人座机">
              <a-input v-model="formParam.albx0028" placeholder="联系人座机" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="联系人座机是否公开">
              <a-input
                v-model="formParam.albx0029"
                placeholder="联系人座机是否公开"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="联系人邮箱">
              <a-input v-model="formParam.albx0030" placeholder="联系人邮箱" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="项目描述">
              <a-input v-model="formParam.albx0018" placeholder="项目描述" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="不可同时报名项目编号">
              <a-input
                v-model="formParam.albx0023"
                placeholder="不可同时报名项目编号"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="报名前服务时长要求">
              <a-input
                v-model="formParam.albx0033"
                placeholder="报名前服务时长要求"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="服务地点">
              <a-input v-model="formParam.albx0003" placeholder="服务地点" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="经度">
              <a-input v-model="formParam.albx0035" placeholder="经度" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="纬度">
              <a-input v-model="formParam.albx0036" placeholder="纬度" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="项目所属团体名称">
              <a-input
                v-model="formParam.albx0062"
                placeholder="项目所属团体名称"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import apis from '@/server/request'
// 表单字段
const fields = ['description', 'id']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    // loading: {
    //   type: Boolean,
    //   default: () => false
    // },
    model: {
      //修改时传递的参数
      type: Object,
      default: () => null,
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    }
    return {
      loading: false,
      form: this.$form.createForm(this),
      proInfo: JSON.parse(this.$route.query.record), //当前项目信息
      formParam: {
        albx0021: null, // 区域
        albx0002: '', // 项目名称
        albx0024: '', // 志愿者招募范围
        albx0020: '', // 项目图片
        albx0004: '', // 项目开始时间
        albx0005: '', // 项目结束时间
        albx0014: '', // 服务对象 代码表
        albx0009: '', // 服务类别 代码表
        albx0019: '', // 志愿者保障
        albx0025: '', // 联系人姓名
        albx0026: '', // 联系人手机
        albx0027: '', // 联系人手机是否公开
        albx0028: '', // 联系人座机
        albx0029: '', // 联系人座机是否公开
        albx0030: '', // 联系人邮箱
        albx0018: '', // 项目描述
        albx0023: '', // 不可同时报名项目编号
        albx0033: '', // 报名前服务时长要求
        albx0003: '', // 服务地点
        albx0035: '', // 经度
        albx0036: '', // 纬度
        albx0062: '', // 项目所属团体名称
      },
    }
  },
  watch: {
    visible(newVal, oldVal) {
      if (newVal && this.model.operation === 'modify') {
        //修改需要查询该岗位信息
      }
    },
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    async getData() {
      //新建岗位
      let bean = {
        // albx0021		//区划
        // proId		//项目id
        // albx0072		//岗位名称
        // albx0077		//计划招募
        // albx0074		//岗位描述
        // albx0075		//岗位条件
      }
      const res = await apis.groupProjectAddPostFortis(bean)
      if (res && res.data) {
        this.onClose(true)
      } else {
        this.$message.warning(res.message)
      }
    },
    async getData() {
      //修改岗位
      let bean = {
        //         albx0021	//	区划
        // gwid	//	岗位人员信息表id
        // proid	//	项目id
        // albx0090	//	岗位名称
        // albx0077	//	计划招募人数
        // albx0079	//	已加入成员数
      }
      const res = await apis.groupProjectUpdatePostFortis(bean)
      if (res && res.data) {
        this.onClose(true)
      } else {
        this.$message.warning(res.message)
      }
    },
    submit() {
      //  确定按钮
      if (this.model.operation === 'create') {
        //  新增
      } else if (this.model.operation === 'modify') {
        // 修改
      }
    },
    onClose(bool) {
      //关闭弹窗
      this.$emit('child', bool)
    },
  },
}
</script>

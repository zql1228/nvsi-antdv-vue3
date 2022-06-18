<template>
  <!--通知公告详情  工作台 -->
  <a-drawer title="会议通知(紧急)" placement="right" :maskClosable="false" :visible="visible" @close="onClose(false)" width="600">
    <a-card :title="title" :bordered="false" headStyle="text-align:center;border:0;font-weight:bolder;font-size:24px;" bodyStyle="padding-top:0;">
      <a-row :gutter="[0, 48]">
        <a-col :span="24">
          <div style="width:100%;text-align:right;">
            <span style="margin-right:40px;">某某区县管理员</span>
            <span>2021-09-07</span>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="[0, 48]">
        <a-col :span="24">
          <div style="width:300px;height:150px;margin:auto;">
            <img style="width:100%;height:100%;" src="" alt="">
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div>据tap切换，默认选择新启动项目数图表展示该队伍时间范围内（时间范围根据右上时间选择组件而定），新启动的项目数量，以柱状图形式展示，右侧显示时间范围内新启动项目总数Y轴为数量，单位个</div>
        </a-col>
      </a-row>
    </a-card>
  </a-drawer>
</template>
<script>


export default {
  props:{
    visible:Boolean,
    item:Object,
  },
  data() {
    return{
      title:'始终坚持走中国特色社会主义道路'

    }
  },
  methods:{
    onClose(bool) {//bool为true时需要重新查询列表
      this.$emit('child',bool)
    },
  }
}
</script>

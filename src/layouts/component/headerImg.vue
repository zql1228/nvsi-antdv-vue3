<template>
  <!--修改头像 -->
  <a-modal title="修改头像" :visible="props.visible" @cancel="onClose" width="620px" :footer="null">
    <a-row :gutter="20">
      <a-col :span="14">
        <a-row :gutter="[0, 20]">
          <a-col :span="12" align="center">
            <a-button type="primary" class="btn1">上传本地图片</a-button>
          </a-col>
          <a-col :span="12" align="center">
            <a-button class="btn1 btn3">使用默认图</a-button>
          </a-col>
          <a-col :span="24">
            <div class="img1_div">
              <img class="img" src="" alt="" />
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="10">
        <a-row :gutter="[0, 20]">
          <a-col :span="24" align="center">
            <div class="text">预览</div>
          </a-col>
          <a-col :span="24" align="center">
            <div class="img2_div">
              <img class="img" src="" alt="" />
            </div>
          </a-col>
          <a-col :span="12" align="center">
            <a-button type="primary" class="btn2">确定</a-button>
          </a-col>
          <a-col :span="12" align="center">
            <a-button class="btn2 btn3">取消</a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
import { message } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, watch } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import { LocalGetUserInfo } from '@/utils/localStorage'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, text) {
    const userInfo = ref(LocalGetUserInfo())
    const onClose = () => {
      //关闭弹窗
      text.emit('child')
    }

    return {
      props,
      onClose,
    }
  },
})
</script>
<style scoped>
.btn1 {
  width: 140px;
  height: 40px;
  border-radius: 5px;
  border: 0;
}
.btn2 {
  width: 110px;
  height: 40px;
  border-radius: 5px;
  border: 0;
}
.btn3 {
  color: #000;
  border: 1px solid#000;
}
.text {
  line-height: 40px;
  font-weight: bolder;
  font-size: 18px;
  color: #000;
}
.img1_div {
  width: 100%;
  height: 230px;
}
.img2_div {
  width: 170px;
  height: 170px;
  border-radius: 85px;
}
.img {
  width: 100%;
  height: 100%;
}
</style>

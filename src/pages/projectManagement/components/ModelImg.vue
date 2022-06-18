<template>
  <!-- 发布项目 默认图片选择弹窗 -->
  <a-modal
    title="请选择图片"
    :visible="props.imgVisible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel(fasle)"
    width="1000px"
  >
    <div class="div">
      <a-row :gutter="[24, 24]">
        <a-col span="6" v-for="(item, index) in imglist" :key="index">
          <div class="img_div" @click="changeImg(index)">
            <img class="w_100" :src="item" alt="" />
            <input class="input" type="radio" name="img" :value="index" :checked="index == imgIndex ? true : false" />
          </div>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import { imgList } from '../img.js'
import { message } from 'ant-design-vue'
export default defineComponent({
  props: {
    imgVisible: {
      type: Boolean,
      default: false,
    },
    imgIndex: {
      type: Number,
      default: 1,
    },
  },
  setup(props, text) {
    const confirmLoading = ref(false)
    const imglist = ref([
      require('@/assets/img/proImg/1.png'),
      require('@/assets/img/proImg/2.png'),
      require('@/assets/img/proImg/3.png'),
      require('@/assets/img/proImg/4.png'),
      require('@/assets/img/proImg/5.png'),
      require('@/assets/img/proImg/6.png'),
      require('@/assets/img/proImg/7.png'),
      require('@/assets/img/proImg/8.png'),
      require('@/assets/img/proImg/9.png'),
      require('@/assets/img/proImg/10.png'),
      require('@/assets/img/proImg/11.png'),
      require('@/assets/img/proImg/12.png'),
      require('@/assets/img/proImg/13.png'),
      require('@/assets/img/proImg/14.png'),
      require('@/assets/img/proImg/15.png'),
      require('@/assets/img/proImg/16.png'),
      require('@/assets/img/proImg/17.png'),
      require('@/assets/img/proImg/18.png'),
      require('@/assets/img/proImg/19.png'),
      require('@/assets/img/proImg/20.png'),
    ])
    const imgIndex = ref(1) //项目封面默认选择图片被选中的图片下标
    const imageUrl = ref('') // 封面图片地址
    const albx0020 = ref({}) //项目图片文件对象
    const changeImg = (index) => {
      //默认项目封面单选框点击事件
      imgIndex.value = index
    }
    const handleOk = (e) => {
      //选择默认项目封面对话框确定按钮事件
      confirmLoading.value = true
      rpcPost('downloadFortisLogic', { bean: JSON.stringify(imgList[imgIndex.value]) }).then((result) => {
        if (result && result.code === 0 && result.data) {
          imageUrl.value = result.data
          albx0020.value = imgList[imgIndex.value]
          confirmLoading.value = false
          message.success('上传成功')
          handleCancel(true)
        } else {
          confirmLoading.value = false
          message.warning('上传失败')
        }
      })
    }
    const handleCancel = (bool) => {
      //选择默认项目封面对话框取消按钮事件
      bool ? text.emit('child', bool, { imgIndex: imgIndex.value, imageUrl: imageUrl.value, albx0020: albx0020.value }) : text.emit('child', bool, {})
    }

    watch(
      () => props.imgVisible,
      (visible) => {
        imgIndex.value = props.imgIndex
      }
    )

    return {
      props,
      confirmLoading,
      imglist,
      imgIndex,
      imageUrl,
      changeImg,
      handleOk,
      handleCancel,
    }
  },
})
</script>
<style lang="less" scoped>
.div {
  height: 330px;
  overflow: scroll;
  padding: 12px;
}
.img_div {
  width: 100%;
  position: relative;
}
.w_100 {
  width: 100%;
}
.input {
  position: absolute;
  left: -5px;
  top: -5px;
  background: red;
}
</style>

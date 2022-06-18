<template>
  <a-spin :spinning="spinning">
    <a-card title="志愿者证">
      <a-row :gutter="24">
        <a-col :span="24">
          <a-space>
            <a-button type="primary" @click="downloadVolunteerCard">下载志愿者证</a-button>
            <a-button type="primary" @click="refreshVolunteerCard">刷新</a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="card_container">
        <a-col :span="12" v-show="!spinning && showCard">
          <a href="javascript:void(0)" ref="aDownCardOwnRef" download>
            <img ref="volunteerCardRef" src="" alt="" />
          </a>
        </a-col>
        <a-col :span="12">
          <a href="javascript:void(0)" ref="aDownCardTwoRef" download>
            <img :src="volunteerCardImg" alt="" />
          </a>
        </a-col>
      </a-row>
      <!-- <div class="card_container">
        <a href="javascript:void(0)" ref="aDownCardOwnRef" download>
          <img ref="volunteerCardRef" src="" alt="" />
        </a>
        <a href="javascript:void(0)" ref="aDownCardTwoRef" download>
          <img :src="volunteerCardImg" alt="" />
        </a>
      </div> -->
    </a-card>
  </a-spin>
  <!-- 2- 志愿者证 -->
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import apis from '@/server/request'
import { LocalGetVolunteerInfo } from '@/utils/localStorage.js'
import volunteerCardImg from '@/assets/img/volunteerCard/volunteerCard.png'
import { message } from 'ant-design-vue'
export default defineComponent({
  setup(props) {
    const volListRecord = reactive(LocalGetVolunteerInfo())
    const volunteerInfo = ref()
    const aDownCardOwnRef = ref()
    const aDownCardTwoRef = ref()
    const volunteerCardRef = ref()
    const spinning = ref(true)
    const showCard = ref(false)
    const currentVolVard = ref()
    const getVolunteerCard = async () => {
      console.log(volunteerInfo, 'volunteerInfo')
      const params = {
        volid: volunteerInfo.value.id,
        // 志愿者姓名 albp0003
        name: volunteerInfo.value.albp0003,
        // 志愿者编号 albp0029
        volnum: volunteerInfo.value.albp0029,
        // 志愿者注册区域
        regarea: '湖北省',
        // 志愿者注册日期 albp0034
        regdate: volunteerInfo.value.albp0034,
        // 志愿者联络编号及学号 albp0030
        vollinknum: `https://wuhan.yxybb.com/nvsidfh5/basiczapi?id=${volunteerInfo.value.cardno}`,
        // 志愿者性别 albp0006
        sex: volunteerInfo.value.albp0006,
        // 服务区域 albp0020
        areaid: volunteerInfo.value.albp0020,
        // 加密的身份证号
        cardno: volunteerInfo.value.cardno,
        // 自己上传的志愿者证的图片
        albp0083: volunteerInfo.value.albp0083,
      }
      !volunteerInfo.value.albp0083 && delete params.albp0083
      Object.keys(params).forEach((item) => {
        if (!params[item] && params[item] != 0) {
          delete params[item]
        }
      })
      console.log('params...志愿者证', params)
      apis
        .produceVolunteerServiceCard(params)
        .then((res) => {
          if (res.code == 0) {
            return apis.downloadFortisLogic(res.data)
          } else {
            return Promise.reject(res)
          }
        })
        .then((res) => {
          if (res.code == '0') {
            volunteerCardRef.value.src = res.data
            showCard.value = true
          } else {
            message.warning(res.message)
          }
        })
        .catch((e) => {
          message.warning('志愿者证生成失败')
        })
        .finally(() => {
          spinning.value = false
        })
      // apis
      //   .produceVolunteerServiceCard(params)
      //   .then(async (res) => {
      //     spinning.value = false
      //     if (res.code == '0') {
      //       downloadFortisLogic(res.data)
      //       // currentVolVard.value = res.data
      //       // volunteerCardRef.value.src = res.data.serviceurl
      //       showCard.value = true
      //     } else {
      //       message.warning(res.message)
      //     }
      //     console.log(res, '++++')
      //   })
      //   .catch((e) => {
      //     console.log(e)
      //     // message.warning(res.message)
      //   })
      //   .finally(() => {
      //     spinning.value = false
      //   })
    }
    const downloadFortisLogic = async (docParam) => {
      const res = await apis.downloadFortisLogic(docParam)
      if (res.code == '0') {
        volunteerCardRef.value.src = res.data
      } else {
        message.warning(res.message)
      }
    }
    const getVolunteerInfo = async () => {
      const params = {
        cardno: volListRecord.albp0005,
      }
      volunteerInfo.value = await apis.getVolunteerInfo(params)
      console.log(volunteerInfo, 'volunteerInfo')
    }
    const downloadVolunteerCard = () => {
      // 下载那个死的图片（反面）
      aDownCardOwnRef.value.href = volunteerCardImg
      aDownCardOwnRef.value.click()
      aDownCardTwoRef.value.href = volunteerCardRef.value.src
      aDownCardTwoRef.value.click()
    }
    const refreshVolunteerCard = () => {
      getVolunteerCard()
    }
    onMounted(async () => {
      await getVolunteerInfo()
      getVolunteerCard()
    })
    return {
      volunteerCardImg,
      aDownCardOwnRef,
      aDownCardTwoRef,
      volunteerCardRef,
      downloadVolunteerCard,
      spinning,
      refreshVolunteerCard,
      showCard,
    }
  },
})
</script>

<style scoped lang="less">
.card_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-top: 20px;
  a {
    margin-top: 10px;
    width: 100%;
    height: 300px;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>

<template>
  <!-- 通知公告 -->
  <div>
    <a-card
      title="通知公告"
      :headStyle="{
        height: '56px',
        border: 0,
        fontSize: '18px',
        color: '#333',
        fontWeight: 'bold',
      }"
      :bodyStyle="{
        background: '#fff',
        height: '421px',
        boxSizing: 'border-box',
        paddingTop: '17px',
        paddingBottom: '24px',
      }"
      :bordered="false"
    >
      <template #extra><a class="extra" @click.prevent="goOther">更多</a></template>
      <a-row>
        <a-col :span="24">
          <a-row class="cursor card3_list" v-for="(item, index) in card3" :key="index" @click="noticeDetail(item)">
            <a-col span="18" class="left">
              <div class="left_div"></div>
              <span class="name">{{ item.title }}</span>
            </a-col>
            <a-col span="6" class="right"
              ><span>{{ item.createtime ? item.createtime.slice(5, 10) : '' }}</span></a-col
            >
          </a-row>
        </a-col>
      </a-row>
    </a-card>
    <InfoNoticeAnmentDrawer></InfoNoticeAnmentDrawer>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted, watch, nextTick } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import InfoNoticeAnmentDrawer from '@/pages/informationManagement/components/drawers/InfoNoticeAnmentDrawer'
import EventBus from '@/utils/bus'
export default defineComponent({
  components: {
    InfoNoticeAnmentDrawer,
  },
  setup() {
    const router = useRouter()
    const userInfo = ref(LocalGetUserInfo())
    const card3 = ref([])
    onMounted(() => {
      setTimeout(() => {
        getData()
      }, 2000)
    })

    const noticeDetail = (item) => {
      //通知公告详情
      EventBus.emit('handleViewNotice', item)
    }

    const getData = () => {
      userInfo.value = LocalGetUserInfo()
      //获取通知公告
      if (userInfo.value.areaLevel != 0) {
        //不是全国
        let bean = {
          userid: userInfo.value.userid,
          areaid: userInfo.value.areaid,
          level: userInfo.value.areaLevel, //全国0 省1 市2 区3
          read: 0, //1已读 0未读
          pagesize: 8,
          pagenum: 1,
        }

        rpcPost('getAllBulletinNoReadOrReadOnManager', { bean })
          .then((res) => {
            if (res && res.data) {
              card3.value = res.data.data
            }
          })
          .catch((error) => {})
          .finally(() => {})
      } else {
        //部级全国账号
        let bean = {
          userid: userInfo.value.userid,
          read: 0, //1已读 0未读
          pagesize: 8,
          pagenum: 1,
        }
        rpcPost('getBulletinNoReadOrReadOnMinisterial', { bean })
          .then((res) => {
            if (res && res.data) {
              card3.value = res.data.data
              // card3.value = [
              //   { title: '11', createtime: '124646876843' },
              //   { title: '11', createtime: '124646876843' },
              //   { title: '11', createtime: '124646876843' },
              //   { title: '11', createtime: '124646876843' },
              //   { title: '11', createtime: '124646876843' },
              //   { title: '11', createtime: '124646876843' },
              //   { title: '11', createtime: '124646876843' },
              //   { title: '11', createtime: '124646876843' },
              // ]
            }
          })
          .catch((error) => {})
          .finally(() => {})
      }
    }
    const goOther = (name) => {
      //页面跳转 跳转到发件箱
      router.push('/mcaworkNoticeResive')
    }

    return {
      userInfo,
      card3,
      goOther,
      noticeDetail,
    }
  },
})
</script>
<style scoped>
.extra {
  color: #bfbfbf;
  font-size: 12px;
}
.cursor {
  cursor: pointer;
}
.card3_list {
  color: #000;
  height: 19px;
  line-height: 19px;
  margin-bottom: 28.5px;
}
.card3_list:hover .name {
  color: #dc2b19;
}
.left {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  padding-left: 16px;
}
.left_div {
  width: 4px;
  height: 4px;
  background: #dc2b19;
  border-radius: 2px;
  position: absolute;
  left: 0;
  top: 8px;
}
.right {
  text-align: right;
  font-size: 16px;
  font-weight: bold;
}
</style>

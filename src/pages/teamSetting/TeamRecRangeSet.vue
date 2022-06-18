<template>
  <PageFormTableWrapper :showSearchForm="false">
    <template #table>
      <div style="height: 100%; overflow: scroll">
        <a-form ref="form1" :model="formParam" layout="vertical" class="nv-form" :style="{ padding: ' 0 24px' }">
          <a-card title="队伍设置" :bordered="false" style="width: 100%; padding: 0px">
            <a-row :gutter="24">
              <a-col :md="24" :sm="24">
                <a-form-item label="队伍是否公开：" class="cus-a-form-item formItemTitle">
                  <a-radio-group name="radioGroup" v-model:value="formParam.albe0027" @change="handleChangeIsPublic">
                    <a-radio value="1"> 是 </a-radio>
                    <a-radio value="0"> 否 </a-radio>
                    <div class="teamTypeSpan">若选择不公开队伍,则您的队伍将不在志愿者网站展示</div>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :md="24" :sm="24">
                <a-form-item label="加入队伍方式：" class="cus-a-form-item formItemTitle">
                  <a-card :bordered="false" :bodyStyle="{ padding: '0px' }" class="nv-project-scope">
                    <a-radio-group button-style="solid" v-model:value="formParam.albe0028" @change="handleChangeWay">
                      <div v-for="item in joinTeamWay" :key="item.value">
                        <a-card-grid class="scope-grid">
                          <a-card-grid class="scope-name">
                            <a-radio :value="item.value" style="font-size: 15px">
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
              <a-col :md="24" :sm="24" v-show="formParam.albe0028 == '4'">
                <div>
                  <div>
                    <a-input
                      style="width: 50%; margin-right: 10px"
                      v-model:value="formParam.albe0029"
                      :disabled="inputDisabled"
                      placeholder="请输入数字或者字母"
                      @keyup="formParam.albe0029 = formParam.albe0029.replace(/[^\w\.\/]/gi, '')"
                    ></a-input>
                    <a-space>
                      <div v-if="formParam.albe0029 !== '' && inputDisabled">
                        <a-button type="primary" @click="handleUpdatePsd">修改密码</a-button>
                      </div>
                      <div v-else>
                        <a-space>
                          <a-button @click="cancel">取消</a-button>
                          <a-button type="primary" @click="handleSubmitPsd">确定</a-button>
                        </a-space>
                      </div>
                    </a-space>
                  </div>
                  <!-- <span>请输入数字或者字母</span> -->
                </div>
              </a-col>
            </a-row>
          </a-card>
        </a-form>
        <!-- <div>
          <AreaDevNew style="width:400px" :showAll="true" :showLevel="5" v-model:value="form.albe0012"></AreaDevNew>
        </div> -->
      </div>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch } from 'vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
export default defineComponent({
  setup() {
    const userInfo = reactive(LocalGetUserInfo())
    const baseTeamInfo = ref({})

    const inputDisabled = ref(true)
    // 420205000000000000
    // 420205003000000000
    // 420000000000000000
    // 420107000000000000

    // 120103000000000000
    // 130406102000000000
    // 120103003000000000
    // 120103004000000000
    const form = reactive({
      albe0012: ['110101001000000000'],
    })
    const formParam = reactive({
      id: userInfo.team.groupid,
      areaId: userInfo.areaid,
      albe0027: '', // 团体是否公开：(0: 不公开, 1: 公开)
      albe0028: '', // 成员加入方式
      albe0029: '', // 免审密码
    })

    const joinTeamWay = reactive([
      {
        label: '验证信息加入',
        value: '1',
        extra: '选择此项,志愿者加入你的队伍需要经过队伍审核,审核通过才可加入',
      },
      {
        label: '允许任何人加入',
        value: '2',
        extra: '选择此项,任何志愿者点击加入队伍,可直接加入您的队伍',
      },
      {
        label: '拒绝任何人加入',
        value: '3',
        extra: '选择此项,任何志愿者点击加入队伍,都会收到提示无法加入',
      },
      {
        label: '免审密码加入',
        value: '4',
        extra: '选择此项,设置免审密码,志愿者点击加入队伍时,需要输入密码,密码正确则直接加入队伍,错误则无法加入',
      },
    ])

    const getTeamInfo = async () => {
      const params = {
        id: userInfo.team.groupid,
        areaid: userInfo.areaid,
      }

      const res = await apis.getTeamInfoFortis(params)

      if (res.code == '0' || res.code == 0) {
        if (res.data) {
          baseTeamInfo.value = res.data
          formParam.albe0027 = res.data.albe0027
          formParam.albe0028 = res.data.albe0028
          formParam.albe0029 = res.data.albe0029
        }
      } else {
        message.warning('队伍信息错误')
      }
    }

    onMounted(async () => {
      await getTeamInfo()
      // console.log(userInfo, 'userInfo')
    })
    const handleUpdatePsd = () => {
      inputDisabled.value = false
    }
    const cancel = async () => {
      await getTeamInfo()
      inputDisabled.value = true
    }
    const handleSubmitPsd = async () => {
      if (!formParam.albe0029) {
        return message.warning('请先填写免审密码')
      }
      await setRecruitment()
      inputDisabled.value = true
      getTeamInfo()
    }
    const setRecruitment = async () => {
      const res = await apis.updateRecruitmentScopeFortis({ ...formParam })
      if (res.code == '0' || res.code == 0) {
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
      getTeamInfo()
    }
    const handleChangeIsPublic = async (e) => {
      setRecruitment()
    }
    const handleChangeWay = async (e) => {
      if (e.target.value !== '4') {
        setRecruitment()
      }
    }
    watch(
      () => formParam.albe0028,
      () => {
        if (formParam.albe0028 == '4') {
          inputDisabled.value = false
        }
      }
    )
    return {
      formParam,
      joinTeamWay,
      handleChangeWay,
      inputDisabled,
      handleChangeIsPublic,
      handleUpdatePsd,
      cancel,
      handleSubmitPsd,
      form,
    }
  },
})
</script>

<style scoped lang="less">
.optContainer {
  margin-top: 20px;
}
.optContainer:first-child {
  margin-top: 0px;
}
.formItemTitle :deep(label) {
  position: relative;
  font-size: 18px;
  font-weight: 600;
}

.radioCom {
  display: block;
  border-radius: 5px;
}
.teamTypeSpan {
  margin-top: 5px;
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
.ant-radio-group {
  width: 100%;
}
</style>

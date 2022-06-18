<template>
  <div class="login">
    <div class="login-logo">
      <img src="@/assets/img/login/logo.png" alt="" />
    </div>
    <div class="login-panel">
      <h2>欢迎登录</h2>
      <a-form class="formH">
        <a-form-item v-bind="validateInfos.userFlag">
          <h3>用户名</h3>
          <div class="input">
            <input type="text" placeholder="请输入用户名" autocomplete="off" v-model="modelRef.userFlag" @keypress="Login" />
            <img src="@/assets/img/login/clear.png" alt="" @click="clean(1)" />
          </div>
        </a-form-item>
        <a-form-item v-bind="validateInfos.password">
          <h3>密码</h3>
          <div class="input">
            <input type="password" placeholder="请输入密码" autocomplete="off" v-model="modelRef.password" @keypress="Login" />
            <img src="@/assets/img/login/clear.png" alt="" @click="clean(2)" />
          </div>
        </a-form-item>
        <a-form-item v-bind="validateInfos.code">
          <h3>验证码</h3>
          <div class="row">
            <div class="input" style="flex: 1; margin-right: 20px">
              <input type="text" placeholder="请输入验证码" maxlength="4" v-model="modelRef.code" @keypress="Login" />
              <img src="@/assets/img/login/clear.png" alt="" @click="clean(3)" />
            </div>
            <div class="input">
              <img :src="imgvc" alt="" class="core" />
              <img src="@/assets/img/login/refresh.png" alt="" @click="setImg" />
            </div>
          </div>
        </a-form-item>
      </a-form>
      <div class="button" :class="{ opacity: isclick }" style="margin-top: 20px" @click.prevent="onSubmit">登录</div>
      <!-- <div class="row" style="justify-content: space-between; margin: 20px 0">
        <div class="checkbox">
          <input type="checkbox" />
          <span>
            <img src="@/assets/img/login/check.svg" alt="" />
          </span>
          <span>记住密码</span>
        </div>
        <router-link to="/">忘记密码</router-link>
      </div> -->
      <div class="info">
        <p>
          客服电话：4006818148转8
          <!-- <br />技术支持：深圳市永兴元科技股份有限公司 -->
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRaw, onMounted } from 'vue'
import { Form, message } from 'ant-design-vue'
import { notification } from 'ant-design-vue'
import util from '@/utils/util'
import { useRouter } from 'vue-router'
import { leapLogin } from '@/server/request/LeapServer'
import { LocalGetUserInfo, LocalGetMenu, LocalSetUserRole, LocalGetUserRole } from '@/utils/localStorage'
import x64Core from 'crypto-js/x64-core'
import { CONTEXT, API_TAG } from '@/utils/config'

const useForm = Form.useForm

export default defineComponent({
  setup() {
    let imgvc = ref('')
    const modelRef = reactive({
      userFlag: '',
      password: '',
      code: '',
    })

    const router = useRouter()

    let validateUserFlag = async (rule, value) => {
      if (value === '') {
        return Promise.reject('请输入用户名！')
      }
    }

    let validatePassword = async (rule, value) => {
      if (value === '') {
        return Promise.reject('请输入密码！')
      } else {
        return Promise.resolve()
      }
    }

    let validateCode = async (rule, value) => {
      if (value === '') {
        return Promise.reject('请输入验证码！')
      } else {
        return Promise.resolve()
      }
    }

    const rulesRef = reactive({
      userFlag: [
        {
          required: true,
          validator: validateUserFlag,
          trigger: 'change',
        },
      ],
      password: [
        {
          required: true,
          validator: validatePassword,
          trigger: 'change',
        },
      ],
      code: [
        {
          required: true,
          validator: validateCode,
          trigger: 'change',
        },
      ],
    })

    const Login = (el) => {
      var evt = window.event || el
      if (evt.keyCode == 13) {
        onSubmit(el)
      }
    }

    let isclick = ref(false) //登录按钮点击
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef)
    let data = toRaw(modelRef)
    const onSubmit = (e) => {
      e.preventDefault()
      validate()
        .then(() => {
          if (!isclick.value) {
            isclick.value = true
            leapLogin(data)
              .then((res) => loginSuccess(res))
              .catch((err) => requestFailed(err))
          }
        })
        .catch((err) => {
          // message.error('err', err)
        })
    }

    const loginSuccess = (res) => {
      const userInfo = LocalGetUserInfo()
      if (userInfo.team && userInfo.team.albe0026 && userInfo.team.albe0026 == 3) {
        notification['error']({
          message: '当前账号已被停用，如有问题请联系所在区域民政管理部门',
        })
        isclick.value = false
        setImg()
        return
      }
      router.push({ path: '/' })
      console.log(userInfo, 'userInfo')
      notification['success']({
        message: '登录成功',
        description: `${userInfo.fullName}, ${util.timeFix()}欢迎回来。`,
        onClose: () => {
          isclick.value = false
        },
      })
    }

    const requestFailed = (err) => {
      console.log(err, 'err')
      let message = `登录失败`
      let code = 1
      if (typeof err == 'string' && err.indexOf('code:') > 0) code = err.slice(err.indexOf('code:') + 5)
      if (code == -8 || !code) {
        message = '错误的用户名或密码'
      } else if (code == -6) {
        message = '验证码错误'
      }
      notification['error']({
        message: message,
        // description: err,
      })
      isclick.value = false
      setImg()
    }

    const clean = (type) => {
      if (type == 1) {
        modelRef.userFlag = ''
      } else if (type == 2) {
        modelRef.password = ''
      } else {
        modelRef.code = ''
      }
    }

    const setImg = () => {
      imgvc.value = `${API_TAG}${CONTEXT}/logic/va/${util.randomUUID()}.do`
    }

    onMounted(() => {
      setImg()
    })

    return {
      validateInfos,
      resetFields,
      modelRef,
      onSubmit,
      clean,
      imgvc,
      setImg,
      isclick,
      Login,
    }
  },
})
</script>
<style lang="less" scoped>
.login {
  background: url(../assets/img/login/bg.jpg) no-repeat center center;
  width: 100%;
  // height: 100%;
  height: 100vh;
  // background-size: 100% auto;
  background-size: 100% 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 66px 100px;
  font-size: 16px;
  box-sizing: border-box;
  &-logo {
    flex: 1;
    align-self: flex-start;
    text-align: left;
    height: 72px;
    img {
      height: 100%;
    }
  }
  &-panel {
    background: #fff;
    width: 520px;
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    h2 {
      font-size: 20px;
      color: #242e42;
      font-weight: bold;
      margin: 20px 0;
    }
    h3 {
      font-size: 16px;
      color: #242e42;
      font-weight: normal;
      margin: 0px 0 10px 0;
      text-align: left;
    }
    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
      a {
        color: #dc2b19;
        text-decoration: none;
      }
    }
    .input {
      height: 48px;
      border: 1px solid #e6e6e6;
      display: flex;
      flex-direction: row;
      transition: 0.3s;
      align-items: center;
      border-radius: 2px;
      &:focus-within {
        box-shadow: 0px 0px 4px rgba(220, 43, 25, 0.2);
        border-color: #dc2b19;
      }
      input {
        flex: 1;
        outline: none;
        border: none;
        padding: 8px;
      }
      img {
        margin: 0 8px;
        max-height: 100%;
        cursor: pointer;
      }
    }
    .button {
      height: 48px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background: #dc2b19;
      font-size: 18px;
      color: #fff;
      cursor: pointer;
    }
    .info {
      background: #eee;
      font-size: 16px;
      margin: 20px -20px 0 -20px;
      padding: 20px;
      box-sizing: border-box;
      color: rgba(36, 46, 66, 0.6);
      p {
        margin: 0;
        line-height: 2;
      }
    }
    .formH {
      height: 322px;
    }
    .opacity {
      opacity: 0.8;
    }
  }
}

.checkbox {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  input {
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    & + span {
      display: inline-flex;
      width: 18px;
      height: 18px;
      border: 1px solid #e6e6e6;
      border-radius: 2px;
      margin-right: 8px;
      box-sizing: border-box;
      transition: 0.3s;
      img {
        opacity: 0;
        transition: 0.3s;
      }
    }
    &:checked + span {
      border-color: #dc2b19;
      img {
        opacity: 1;
      }
    }
  }
}

@media screen and (max-width: 1600px) {
  .login {
    font-size: 14px;
    &-logo {
      height: 56px;
    }
    &-panel {
      width: 450px;
    }
    h3 {
      font-size: 14px;
    }
    .button,
    .input {
      height: 36px;
      input {
        padding: 6px;
      }
      img {
        max-height: 16px;
        &.core {
          max-height: 100%;
        }
      }
    }
    .info {
      padding: 10px;
      font-size: 14px;
    }
    .formH {
      height: 276px;
    }
  }
}
</style>

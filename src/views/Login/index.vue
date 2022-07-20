<template>
  <div class="login-container">
    <div class="form-box">
      <div class="avatar">
        <img src="@/assets/wallhaven-k75xrd.png" alt="" />
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-unlock"
          ></el-input>
        </el-form-item>

        <el-form-item class="btn-item">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  created () { },
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '长度为3到8位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '长度为3到8位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.loginFormRef.resetFields()
    },
    async login () {
      try {
        await this.$refs.loginFormRef.validate()
        try {
          const res = await login(this.loginForm)
          console.log(res)
          // 把token存入vuex并且持久化
          this.$store.commit('setUserMsg', res.data.data)
          this.$router.push('/')
        } catch (err) {
          console.log(err)
        }
      } catch (err) {
        console.log('表单数据校验失败')
      }
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.login-container {
  width: 100vw;
  height: 100vh;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;

  .form-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    padding: 80px 15px;
    box-sizing: border-box;
    position: relative;
    .avatar {
      position: absolute;
      top: -50px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 100px;
      background-color: #fff;
      border-radius: 50%;
      box-shadow: 0 0 10px green;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      img {
        transform: scale(1.7);
      }
    }
    .btn-item {
      text-align: right;
    }
  }
}
</style>

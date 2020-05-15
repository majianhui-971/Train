<template>
  <div class="container">

    <el-form ref="LoginForm" :model="user" :rules="rules" label-position="left" v-show="isShow" class="form login">
      <h3>售票系统登录</h3>
      <el-form-item prop="username" label="用户名">
        <el-input type="text" v-model="user.username" auto-complete="off" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="user.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <p>
          <el-button @click="handleLogin" :loading="loading" type="primary" round>立即登录</el-button>
          <el-button @click="go" round>快速注册</el-button>
        </p>
      </el-form-item>
    </el-form>

    <el-form ref="RegisterForm" :model="user" :rules="rules" label-position="left" class="form register"
             v-show="!isShow">
      <h3>售票系统注册</h3>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="name">
            <el-input placeholder="请输入真实姓名" v-model="user.name"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱">
            <el-input type="text" v-model="user.email" auto-complete="off" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="user.sex">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="password" label="密码">
            <el-input type="password" v-model="user.password" auto-complete="off" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item prop="identityCard" label="身份证">
            <el-input type="text" v-model="user.identityCard" auto-complete="off" placeholder="身份证号码"></el-input>
          </el-form-item>
          <el-form-item prop="validateCode" label="验证码">
            <el-input type="text" v-model="user.validateCode" auto-complete="off" placeholder="验证码"></el-input>
          </el-form-item>

          <el-form-item>
            <el-col :span="12">
              <div @click="refreshCode">
                <identify-code :identifyCode="identifyCode"></identify-code>
              </div>
            </el-col>
            <el-col :span="12">
              <el-button @click="refreshCode" type='text'>看不清，换一张</el-button>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <p>
          <el-button @click="handleRegister" type="primary" round>立即注册</el-button>
          <el-button @click="go" :loading="loading" round>返回登录</el-button>
        </p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import IdentifyCode from '../components/identify-code'
  import {login, register} from '@/api/customer'

  export default {
    name: 'Login',
    components: {
      IdentifyCode
    },
    data() {

      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码!'))
        } else if (value.length < 6) {
          callback(new Error('密码至少为6位!'))
        } else {
          callback()
        }
      };

      const validateEmail = (rule, value, callback) => {
        let reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        if (value === '') {
          callback(new Error('请输入邮箱!'))
        } else if (!reg.test(value)) {
          callback(new Error('邮箱格式不正确!'))
        } else {
          callback()
        }
      };

      const validateCard = (rule, value, callback) => {
        let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
        if (value === '') {
          callback(new Error('请输入身份证号码!'))
        } else if (!reg.test(value)) {
          callback(new Error('请输入正确身份证号码!'))
        } else {
          callback()
        }
      };

      const validateCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码!'))
        } else if (value !== this.identifyCode) {
          callback(new Error('验证码不正确!'))
        } else {
          callback()
        }
      };

      return {
        loading: false,
        isShow: true,
        identifyCodes: '1234567890',
        identifyCode: '',
        user: {
          email: '',
          password: '',
          sex: '',
          identityCard: '',
          validateCode: '',
          name:'',
          username:'',
        },
        rules: {
          email: [
            {
              required: true, validator: validateEmail, trigger: 'blur'
            }
          ],
          password: [
            {
              required: true, validator: validatePass, trigger: 'blur'
            }
          ],
          identityCard: [
            {
              required: true, validator: validateCard, trigger: 'blur'
            }
          ],
          validateCode: [
            {
              required: true, validator: validateCode, trigger: 'blur'
            }
          ],
          name: [
            {
              required: true, message: '请输入真实姓名', trigger: 'blur'
            }
          ],
          username: [
            {
              required: true, message: '请输入用户名', trigger: 'blur'
            }
          ]
        },
      }
    },
    mounted() {
      // 验证码初始化
      this.identifyCode = '';
      this.makeCode(this.identifyCodes, 4)
    },
    created() {
      if (this.$route.query.isShow === false) {
        this.isShow = this.$route.query.isShow;
      }
    },
    methods: {
      go() {
        this.isShow = !this.isShow;
        this.$refs.RegisterForm.clearValidate();
        this.$refs.LoginForm.clearValidate();
      },
      handleLogin() {
        this.$refs.LoginForm.validate((valid) => {
          if (valid) {
            login(this.user).then(res => {
                if (res.data.type === 'success') {
                  this.$store.commit('$_setUser', res.data.user);
                  this.$store.commit('$_setLogin', '1');
                  this.$notify({
                    type: 'success',
                    message: '欢迎你，' + res.data.user.name + '!',
                    duration: 3000
                  });
                  this.$router.push('/')
                } else {
                  this.$message({
                    type: 'error',
                    message: '用户名或密码错误',
                    showClose: true
                  })
                }
              }
            )
          } else {
            return false
          }
        })
      },
      handleRegister() {
        this.$refs.RegisterForm.validate((valid) => {
          if (valid) {
            register(this.user).then(res => {
              if (res.data.type === 'success') {
                this.$message({
                  type: 'success',
                  message: '注册成功，欢迎登录',
                  showClose: true
                });
                // 跳转登录
                this.go();
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.message,
                  showClose: true
                })
              }
            })
          } else {
            return false
          }
        });
      },
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      },
      // 切换验证码
      refreshCode() {
        this.identifyCode = '';
        this.makeCode(this.identifyCodes, 4)
      },
      // 生成四位随机验证码
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
        }
      }

    }
  }
</script>

<style scoped>

  .container {
    display: flex;
    height: 100%;
    background-size: cover;
    justify-content: center;
    background-image: url("../assets/img/bg.jpg");
    opacity: 0.8;
    color: #FFF;
  }

  .form {
    text-align: center;
    position: absolute;
    width: 520px;
    padding: 20px 40px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 4px;
    top: 50%;
  }

  .login {
    margin-top: -180px;
    width: 320px;
  }

  .register {
    margin-top: -270px;
    width: 520px;
  }

  >>> .el-form-item__label {
    color: #FFF
  }

</style>

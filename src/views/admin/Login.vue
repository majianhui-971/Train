<template>
  <div class="container">
    <el-form ref="LoginForm" :model="admin" :rules="rules" label-position="left" class="form login">
      <h3>后台系统</h3>
      <el-form-item prop="username" label="账号">
        <el-input type="text" v-model="admin.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="admin.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <p>
          <el-button @click="handleLogin" type="primary" :loading="loading" round>立即登录</el-button>
        </p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {login} from '@/api/admin'

  export default {
    name: 'Login',
    data() {

      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入管理员密码!'))
        } else if (value.length < 6) {
          callback(new Error('管理员密码至少为6位!'))
        } else {
          callback()
        }
      };

      const validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入管理员账号!'))
        } else {
          callback()
        }
      };

      return {
        loading: false,
        admin: {
          username: '',
          password: '',
        },
        rules: {
            username: [
            {
              required: true, validator: validateName, trigger: 'blur'
            }
          ],
          password: [
            {
              required: true, validator: validatePass, trigger: 'blur'
            }
          ]
        },
      }
    },
    methods: {
      handleLogin() {
        this.$refs.LoginForm.validate((valid) => {
          if (valid) {
            login(this.admin).then(res => {
                if (res.data.type === 'success') {
                  this.$store.commit('$_setAdmin', res.data.admin);
                  this.$notify({
                    type: 'success',
                    message: '你好，管理员' + res.data.admin.username + '!',
                    duration: 3000
                  });
                  this.$router.push('/admin')
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
    }
  }
</script>

<style scoped>

  .container {
    display: flex;
    height: 100%;
    justify-content: center;
    background: url("../../assets/img/login_bg.jpg") no-repeat;
    background-size: cover;
  }

  .form {
    text-align: center;
    position: absolute;
    width: 380px;
    padding: 20px 40px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
/*    background-color: #FFFFFF;*/
    border-radius: 4px;
    top: 50%;
  }

  .login {
    margin-top: -180px;
  }

</style>

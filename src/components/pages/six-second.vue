<template>
  <el-row>
    <el-col :span="10" :offset="7">
      <el-form ref="user" :model="user" label-width="80px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" placeholder="请输入原密码" v-model="user.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" placeholder="请输入新密码" v-model="user.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input type="password" placeholder="请输入确认密码" v-model="user.rePassword"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="onSubmit">立即修改</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>

</template>
<script>

  import { updatePass } from '@/api/customer'

  export default {
    name: "seven-first",
    data() {
      return {
        user: {
          oldPassword: '',
          newPassword: '',
          rePassword: ''
        }
      }
    },
    methods: {
      onSubmit() {

        if (!this.validateParam()) {
          return
        }

        let data = {
          'id': JSON.parse(window.sessionStorage.user).id,
          'oldPassword': this.user.oldPassword,
          'newPassword': this.user.newPassword,
        };

        updatePass(data).then(res => {
          this.$message({
            type: res.data.type,
            message: res.data.message,
          });

          if(res.data.type == 'success'){
              this.$router.push({
                  path: '/login',
                  query: {
                      isShow: true
                  }
              })
          }
        })

      },
      validateParam() {

        if (this.user.oldPassword === '') {
          this.$message({
            type: 'warning',
            message: '请输入原密码',
          });
          return false
        }

        if (this.user.newPassword === '') {
          this.$message({
            type: 'warning',
            message: '请输入新密码',
          });
          return false
        }

        if (this.user.rePassword === '') {
          this.$message({
            type: 'warning',
            message: '请输入确认密码',
          });
          return false
        }

        if (this.user.newPassword.length < 6 || this.user.rePassword.length < 6) {
          this.$message({
            type: 'warning',
            message: '密码长度必须大于6位',
          });
          return false
        }

        if (this.user.newPassword !== this.user.rePassword) {
          this.$message({
            type: 'warning',
            message: '两次密码输入不一致',
          });
          return false
        }

        if (this.user.oldPassword.length < 6) {
          this.$message({
            type: 'error',
            message: '原密码输入错误',
          });
          return false
        }

        return true
      }
    }
  }
</script>

<style scoped>

</style>

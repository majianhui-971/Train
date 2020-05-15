<template>
  <div>
    <el-row v-loading="loading" v-if="!edit">
      <el-col :span="10" :offset="9">
        <el-form ref="userForm" :model="user" label-width="120px" :rules="rules">
          <el-form-item label="用户名：">
            <div v-text="user.username" style="margin-left: 20px"></div>
          </el-form-item>
          <el-form-item label="出生年月：">
            <div style="margin-left: 20px">
              {{ user.age | dateFormat }}
            </div>
          </el-form-item>
          <el-form-item label="性别：">
              <div v-text="user.sex" style="margin-left: 20px"></div>
          </el-form-item>
          <el-form-item label="真实姓名：">
            <div v-text="user.name" style="margin-left: 20px"></div>
          </el-form-item>
          <el-form-item label="身份证：">
            <div v-text="user.identityCard" style="margin-left: 20px"></div>
          </el-form-item>
          <el-form-item label="邮箱：">
            <div v-text="user.email" style="margin-left: 20px"></div>
          </el-form-item>
          <el-form-item label="联系方式：">
            <div  v-text="user.telephone" style="margin-left: 20px"></div>
          </el-form-item>
          <el-form-item label="座右铭：">
            <div v-text="user.remark" style="margin-left: 20px"></div>
          </el-form-item>
          <el-form-item>
            <el-button round style="margin-top: 20px" size="small" @click="toEdit">修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row v-loading="loading" v-if="edit">
      <el-col :span="12" :offset="6">
        <el-form ref="userForm" :model="user" label-width="80px" :rules="rules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="出生年月" prop="age">
            <el-col :span="10">
              <el-date-picker type="date" placeholder="选择日期" v-model="user.age" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="user.sex">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="真实姓名" prop="name">
            <el-col :span="10">
              <el-input placeholder="请输入真实姓名" v-model="user.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="身份证" prop="identityCard">
            <el-input placeholder="请输入身份证" v-model="user.identityCard"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input placeholder="请输入邮箱" v-model="user.email"></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input placeholder="请输入联系方式" v-model="user.telephone"></el-input>
          </el-form-item>
          <el-form-item label="座右铭">
            <el-input type="textarea" v-model="user.remark" rows="4" placeholder="请输入座右铭"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确认</el-button>
            <el-button @click="onBack">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>

    import {updateInfo, fetchCustomer} from '@/api/customer'

    export default {
        name: "seven-first",
        data() {

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

            const validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入真实姓名!'))
                } else {
                    callback()
                }
            };

            return {
                user: {
                    email: '',
                    username: '',
                    sex: '',
                    identityCard: '',
                    name: '',
                    age: '',
                    telephone: '',
                    remark: ''
                },
                edit: false,
                loading: false,
                rules: {
                    email: [
                        {
                            required: true, validator: validateEmail, trigger: 'blur'
                        }
                    ],
                    identityCard: [
                        {
                            required: true, validator: validateCard, trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true, validator: validateName, trigger: 'blur'
                        }
                    ]
                },
            }
        },
        created() {

            let id = JSON.parse(window.sessionStorage.user).id;

            fetchCustomer(id).then(res => {
                this.user = res.data
            })

        },
        filters:{
            dateFormat: function (data) {
                let date = new Date(data);
                if (!date) {
                    return "";
                }

                let year = date.getFullYear(),
                    month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
                    day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

                return year + '年' + month + '月' + day + '日'
            },
        },
        methods: {
            onSubmit() {
                this.$refs.userForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.user.id = JSON.parse(window.sessionStorage.user).id;
                        updateInfo(this.user).then(res => {
                            this.$message({
                                type: res.data.type,
                                message: res.data.message,
                            });
                            this.loading = false;
                        });
                        this.$refs.userForm.clearValidate();

                        // 刷新此用戶信息
                        this.$store.commit('$_setUser', this.user);
                        this.$store.commit('$_setLogin', '1');
                    }
                })
            },
            onReset() {
                this.user = {
                    email: '',
                    username: '',
                    sex: '',
                    identityCard: '',
                    name: '',
                    age: '',
                    telephone: '',
                    remark: ''
                };

                this.$refs.userForm.clearValidate();
            },
            toEdit(){
                this.edit = true
            },
            onBack(){
                this.edit = false
            },
        }
    }
</script>

<style scoped>

</style>

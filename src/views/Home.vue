<template>
  <div class="container">
    <el-row style="margin: 20px 0 25px 0">
      <el-col :span="12" :offset="4">
        <i class="el-icon-s-promotion" style="color: #409EFF;font-size: 50px;"></i><span
        style="font-size: 30px; font-weight: bold; margin-left: 10px">火车售票系统</span>
      </el-col>
      <el-col :span="3" :offset="5">
          <el-button v-if="!show" @click="login" type="text">登录</el-button>
          <el-button v-if="!show" @click="register" type="text">注册</el-button>
        <el-button v-if="show" type="text">{{ name }}</el-button>
          <el-button v-if="show" @click="logout" type="text">退出系统</el-button>
      </el-col>
<!--      <el-col :span="2"><el-button v-if="show" @click="logout" type="text">后台系统</el-button></el-col>-->
    </el-row>
    <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect" background-color="#409EFF"
             text-color="#fff" active-text-color="#ffd04b" align="center">
      <el-col :span="3">
        <el-menu-item index="1">首页</el-menu-item>
      </el-col>
      <el-col :span="3">
        <el-menu-item index="2-1">购票</el-menu-item>
      </el-col>
      <el-col :span="3">
        <el-menu-item index="2-2">退票</el-menu-item>
      </el-col>
      <el-col :span="3">
        <el-menu-item index="2-3">改签</el-menu-item>
      </el-col>
      <el-col :span="3">
        <el-menu-item index="3">公告查询</el-menu-item>
      </el-col>
      <el-col :span="3">
        <el-menu-item index="4">订单管理</el-menu-item>
      </el-col>
      <el-col :span="3">
        <el-menu-item index="5">用户反馈</el-menu-item>
      </el-col>
      <el-col :span="3">
        <el-submenu index="6" v-if="show">
          <template slot="title">我的信息</template>
          <el-menu-item index="6-4" v-if="show">修改密码</el-menu-item>
          <el-menu-item index="6-5" v-if="show">基本信息</el-menu-item>
        </el-submenu>
      </el-col>
      <!--      <el-menu-item index="7">后台系统</el-menu-item>-->
    </el-menu>
    <div class="content">
      <first-page v-if="activeIndex === '1'"></first-page>
      <second-one v-if="activeIndex === '2-1'"></second-one>
      <second-second v-if="activeIndex === '2-2'"></second-second>
      <second-third v-if="activeIndex === '2-3'"></second-third>
      <third v-if="activeIndex === '3'"></third>
      <five v-if="activeIndex === '5'"></five>
      <six-first v-if="activeIndex === '6-5'"></six-first>
      <six-second v-if="activeIndex === '6-4'"></six-second>
      <four v-if="activeIndex === '4'"></four>
    </div>

  </div>
</template>

<script>

    import {firstPage, sixFirst, third, four, five, sixSecond, secondOne, secondSecond, secondThird} from '@/components/pages'

    import {deleteUserSession, getOnline} from '@/api/common'

    export default {
        name: 'Hello',
        components: {
            firstPage, sixFirst, third, four, five, sixSecond, secondOne, secondSecond,secondThird
        },
        data() {
            return {
                show: false,
                activeIndex: '1',
                online: '0',
                name: ''
            }
        },
        created() {
            this.show = window.sessionStorage.isLogin === '1';
            getOnline().then(res => {
               this.online =  res.data;
            });
            let user = this.$store.getters.getUser;
            this.name = user.name;
        },
        methods: {
            login(){
                this.$router.push({
                    path: '/login',
                    query: {
                        isShow: true
                    }
                })
            },
            register(){
                this.$router.push({
                    path: '/login',
                    query: {
                        isShow: false
                    }
                })
            },
            logout(){
                this.$store.commit('$_removeUser');
                this.$store.commit('$_setLogin', '0');
                deleteUserSession().then(res => {
                    this.$router.push({
                        path: '/login',
                        query: {
                            isShow: true
                        }
                    })
                })
            },
            handleSelect(key, keyPath) {
                this.activeIndex = key;

            /*    // 跳转后台
                if (key === '7') {
                    if(this.$store.getters.getAdmin){
                        this.$router.push({path: '/admin'})
                    }else {
                        this.$router.push({path: '/admin/login'})
                    }
                }*/
            }
        }
    }
</script>

<style scoped>

  .container >>> .el-menu-item {
    text-align: center;
    margin: 0 auto;
  }

  .el-menu {
    text-align: center;
    margin: 0 auto;
    background-color: #606266;
  }

  .link {
    text-decoration: none;
    color: black;
  }

  .content {
    margin: 50px 0;
  }
</style>

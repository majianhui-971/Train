<template>
  <el-container class="container">
    <el-aside width="210px">
      <div><h3 style="color: #fff; margin-left: 30px">火车售票系统</h3></div>
      <el-divider></el-divider>
      <el-menu :default-openeds="['票务管理']"  :default-active="activeIndex" @select="handleSelect"
               background-color="#006EE0"
               text-color="#fff" active-text-color="#ffd04b" style="margin-left: 10px">

        <el-menu-item index="用户信息"><i class="el-icon-user" style="color: #fff"></i>用户信息</el-menu-item>
        <el-menu-item index="管理员信息" v-if="admin"><i class="el-icon-setting" style="color: #fff"></i>管理员信息</el-menu-item>
        <el-submenu index="票务管理">
          <template slot="title"><i class="el-icon-setting" style="color: #fff"></i>票务管理</template>
          <el-menu-item index="车票信息"><i class="el-icon-position" style="color: #fff"></i>车票信息</el-menu-item>
          <el-menu-item index="订单信息"><i class="el-icon-tickets" style="color: #fff"></i>订单信息</el-menu-item>
        </el-submenu>
        <el-menu-item index="站点信息"><i class="el-icon-location-outline" style="color: #fff"></i>站点信息</el-menu-item>
        <el-menu-item index="线路信息"><i class="el-icon-link" style="color: #fff"></i>线路信息</el-menu-item>
        <el-menu-item index="车次信息"><i class="el-icon-time" style="color: #fff"></i>车次信息</el-menu-item>
        <el-menu-item index="发布公告"><i class="el-icon-message" style="color: #fff"></i>发布公告</el-menu-item>
        <el-menu-item index="反馈管理"><i class="el-icon-chat-dot-square" style="color: #fff"></i>反馈管理</el-menu-item>

      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <el-col :span="12">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 60px">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in list" :key="item">{{ item }}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>

        <el-col :span="12">
          <el-dropdown @command="handleCommand" class="dropdown">
            <span class="el-dropdown-link">{{username}}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="exit">退出后台</el-dropdown-item>
              <el-dropdown-item command="go">返回前台</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-header>

      <el-main style="padding-left: 30px">
        <customer v-if="activeIndex === '用户信息'"></customer>
        <admin v-if="activeIndex === '管理员信息'"></admin>
        <ticket v-if="activeIndex === '车票信息'"></ticket>
        <order v-if="activeIndex === '订单信息'"></order>
        <site v-if="activeIndex === '站点信息'"></site>
        <line-info v-if="activeIndex === '线路信息'"></line-info>
        <drive v-if="activeIndex === '车次信息'"></drive>
        <message v-if="activeIndex === '发布公告'"></message>
        <comment v-if="activeIndex === '反馈管理'"></comment>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>

    import {admin, comment, customer, drive, lineInfo, message, order, site, ticket} from './components'

    import {deleteAdminSession} from '@/api/common'

    export default {
        name: "Home",
        components: {
            admin,
            comment,
            customer,
            drive,
            lineInfo,
            message,
            order,
            site,
            ticket
        },
        data() {
            return {
                activeIndex: '用户信息',
                username: JSON.parse(window.sessionStorage.admin).username,
                list: [],
                admin: false
            }
        },
        created() {
            this.admin = JSON.parse(window.sessionStorage.admin).state === '1111';
        },
        methods: {
            handleSelect(key, keyPath) {
                this.activeIndex = key;
                this.list = keyPath
            },
            handleCommand(command) {
                if (command === 'go') {
                    this.$router.push({path: '/'})
                } else if (command === 'exit') {
                    this.$store.commit('$_removeAdmin');
                    deleteAdminSession().then(res => {
                        this.$router.push({path: '/admin/login'})
                    })
                }
            },

        }
    };
</script>

<style scoped>

  .container {
    height: 100%;
  }

  >>> .el-header {
    height: 100%;
    line-height: 60px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  >>> .el-aside {
    background-color: #006EE0;
    height: 100%;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #545c64;
  }

  .dropdown {
    float: right;
  }

  >>> .el-submenu__title i {
    color: #fff;
  }
</style>

<template>
  <el-row v-loading="loading" element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading">
    <el-col :span="14" :offset="6">
      <el-input placeholder="请输入搜索内容" v-model="listQuery.fuzzy" style="width: 50%;height: 30%">
      </el-input>
      <el-button style="color: #409EFF" icon="el-icon-search" @click="clickSearch"></el-button>
    </el-col>

    <div>
      <el-col :span="14" :offset="6" v-for="(message) in messageInfo" :key="message.key">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-col :span="8" class="title">
              {{message.title}}
            </el-col>
            <el-button size="small" style="float: right" icon="el-icon-view" circle  @click="moreReadeClick(message.content)"></el-button>
          </div>
          <div class="text">
            {{message.content}}
          </div>
          <div class="footer">
            <i class="el-icon-time"> 发布时间: {{message.createTime | formatDate}}</i>
 <!--           <i class="el-icon-user" style="float: right"> 作者:{{message.createUser}}</i>-->
          </div>
        </el-card>

      </el-col>
      <el-col :span="12" :offset="10">
        <el-pagination
          :current-page.sync="listQuery.page"
          :page-size.sync="listQuery.size"
          :layout="layout"
          :total="total"
          v-bind="$attrs"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </el-col>
    </div>

    <el-dialog title="文章详情" :visible.sync="dialogMoreVisible">
        <div class="text1">
          {{moreContent }}
        </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import {fetchMessageInfo} from '@/api/message'

  export default {
    data() {
      return {
        messageInfo: [],
        listQuery: {
          page: 1,
          size: 3,
          fuzzy: ''
        },
        total: 0,
        layout: "prev, pager, next",
        loading: false,
        dialogMoreVisible: false,
        moreContent: ''
      }
    },
    created() {
      this.initData();
    },
    filters: {
      formatDate: function (value) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m;
      },
    },
    methods: {
      initData() {
        this.loading = true
        fetchMessageInfo(this.listQuery).then(res => {
          this.messageInfo = res.data.list
          this.total = res.data.total
          this.loading = false
        })
      },
      clickSearch() {
        this.initData();
      },
      handleSizeChange(val) {
        this.listQuery["page"] = val;
        this.initData();
      },
      handleCurrentChange(val) {
        this.listQuery["page"] = val;
        this.initData();
      },
      moreReadeClick(value) {
        this.dialogMoreVisible = true
        this.moreContent = value
        console.log(value)
      }
    }
  }
</script>

<style lang="css" scoped>
  .text {
    font-size: 15px;
    text-indent: 2em;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    height: 100px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 880px;
    margin: 15px 0;
  }

  .title {
    font-size: 24px;
    margin-top: 5px;
  }

  .text1 {
    font-size: 15px;
    text-indent: 2em;
    line-height: 25px;
    margin-bottom: 20px;
  }

  .footer {
    margin: 10px;
  }

</style>

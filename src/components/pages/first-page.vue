<template>
  <div class="container">
    <el-row :gutter="60">
      <el-col :span="16" :offset="4">

        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="item in images" :key="item.id">
            <img :src="item.idView" class="image"/>
          </el-carousel-item>
        </el-carousel>
      </el-col>

      <el-col :span="16" :offset="4" style="margin-top:20px">
        <h3 style="text-align:left; padding-bottom: 15px">最新车次信息</h3>
        <el-table stripe border style="width: 100%" :data="ticketInfo">
          <el-table-column prop="startTime" label="发车时间" :formatter="startDateFormat" align="center"></el-table-column>
          <el-table-column prop="startSiteName" label="起始站" align="center"></el-table-column>
          <el-table-column prop="endSiteName" label="目的地" align="center"></el-table-column>
          <el-table-column prop="endTime" label="抵达时间" :formatter="endDateFormat" align="center"></el-table-column>
        </el-table>
      </el-col>

      <el-col :span="8" :offset="4" style="margin-top:50px" >
        <h3 style="padding-bottom: 15px">最新发布信息</h3>
        <div v-for="item in messageInfo" :key="item.id" >
          <span class="item" @click="moreReadeClick(item.content)">{{ item.content }}</span>
          <el-divider></el-divider>
        </div>
      </el-col>

      <el-col :span="8" style="margin-top:50px">
        <h3 style="padding-bottom: 15px">最新用户反馈</h3>
        <div v-for="item in commentInfo" :key="item.id">
          <span  @click="moreReadeClick(item.content)" class="item">{{ item.content }}</span>
          <el-divider></el-divider>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="详情" :visible.sync="dialogMoreVisible">
        <div  class="text1">
          {{moreContent }}
        </div>
    </el-dialog>
  </div>
</template>

<script>

  import {fetchNewMessageInfo} from '@/api/message'
  import {fetchNewTicketInfo} from '@/api/ticket'
  import {fetchNewCommentInfo} from '@/api/comment'

  export default {
    name: "first-page",
    data() {
      return {
        images: [
          {id: 0, idView: require("../../assets/img/train_1.jpg")},
          {id: 1, idView: require("../../assets/img/train_2.jpg")},
          {id: 2, idView: require("../../assets/img/train_3.jpg")},
        ],
        messageInfo: [],
        ticketInfo: [],
        commentInfo: [],
        dialogMoreVisible: false,
        moreContent:''
      }
    },
    created() {
      fetchNewMessageInfo().then(res => {
          this.messageInfo = res.data
      });
      fetchNewTicketInfo().then(res => {
        this.ticketInfo = res.data
      });
      fetchNewCommentInfo().then(res => {
        this.commentInfo = res.data
      })
    },
    methods: {
      startDateFormat: function (row, column) {
        let date = new Date(row.startTime);
        if (!date) {
          return "";
        }

        let year = date.getFullYear(),
          month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
          day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
          hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
          min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
          sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

        return month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
      },
      endDateFormat: function (row, column) {
        let date = new Date(row.endTime);
        if (!date) {
          return "";
        }

        let year = date.getFullYear(),
          month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
          day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
          hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
          min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
          sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

        return month + '-' + day + ' ' + hour + ':' + min + ':' + sec;

      },
      moreReadeClick(value) {
        this.dialogMoreVisible = true;
        this.moreContent = value
      }
    }

  }
</script>

<style scoped>

  >>> .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  >>> .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  >>> .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .image {
    width: 1600px;
    height: auto;
    max-width: 230%;
    max-height: 210%;

  }

  .item {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    cursor: pointer;
  }

</style>

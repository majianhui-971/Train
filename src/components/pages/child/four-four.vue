<template>
  <el-row v-loading="loading"  element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
    <el-col>
      <el-table :data="tableData" border>
        <el-table-column prop="createTime" label="购票时间" align="center" :formatter="dateFormat"></el-table-column>
        <el-table-column prop="startSiteName" label="起始站" align="center"></el-table-column>
        <el-table-column prop="endSiteName" label="终点站" align="center"></el-table-column>
        <el-table-column prop="startTime" label="发车时间" :formatter="startDateFormat" align="center"></el-table-column>
        <el-table-column prop="endTime" label="到站时间" :formatter="endDateFormat" align="center"></el-table-column>
        <el-table-column prop="orderSum" label="数量" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="总价格" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="small" icon="el-icon-delete" circle
                       @click="deleteDataInfo(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>

  import {fetchPageInfo, deleteData} from '@/api/order'

  export default {
    data() {
      return {
        tableData: [],
        loading: true,
        dataInfo: {
          fuzzy: '',
          fetchType: 'D'
        }
      }
    },
    created(){
      this.fetchInfo();
    },
    methods: {
      fetchInfo(){
          fetchPageInfo(this.dataInfo).then(res=>{
              this.tableData = res.data.list;
              this.loading = false
          })
      },
      deleteDataInfo(row){
          if(row.id){
              this.$confirm('此操作将删除此信息, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(() => {
                  deleteData(row.id).then(res => {
                      this.$message({
                          type: res.data.type,
                          message: res.data.message,
                      });
                      this.fetchInfo()
                  })
              })
          }
      },
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

          return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
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

          return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
      },
      dateFormat: function (row, column) {
        let date = new Date(row.createTime);
        if (!date) {
          return "";
        }

        let year = date.getFullYear(),
          month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
          day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

        return year + '-' + month + '-' + day
      },
    }
  }
</script>

<template>
  <el-row>
    <el-col :span="18" :offset="3">
      <el-table :data="tableData" border>
        <el-table-column prop="createTime" label="购票时间" align="center" :formatter="dateFormat"></el-table-column>
        <el-table-column prop="startSiteName" label="起始站" align="center"></el-table-column>
        <el-table-column prop="endSiteName" label="终点站" align="center"></el-table-column>
        <el-table-column prop="startTime" label="发车时间" :formatter="startDateFormat" align="center"></el-table-column>
        <el-table-column prop="endTime" label="到站时间" :formatter="endDateFormat" align="center"></el-table-column>
        <el-table-column prop="orderSum" label="数量" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="总金额" align="center"></el-table-column>
        <el-table-column label="退票" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="editDataInfo(scope.row)">退票</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>


    <el-dialog title="退票" :visible.sync="dialogFormVisible" width="30%" :before-close="handleClose">

      <div> 您好！ 请问你确认退票吗？ </div>
      <p>此次退票将收取 10% 手续费，将退给您金额为：{{ price }}</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="small">取 消</el-button>
        <el-button type="primary" @click="saveData" size="small">退 票</el-button>
      </div>
    </el-dialog>

  </el-row>
</template>

<script>

  import {fetchOrderTicketInfo, backOrderInfo} from '@/api/order'

  export default {
    data() {
      return {
        tableData: [],
        dialogFormVisible: false,
        price: 0,
        orderId: 0,
        free: 0
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
          fetchOrderTicketInfo().then(res => {
          this.tableData = res.data
        })
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
      editDataInfo(row) {
        this.price = (parseInt(row.orderAmount)  * .9).toFixed(2);
        this.free = (parseInt(row.orderAmount)  * .1).toFixed(2);
        this.orderId = row.id;
        this.dialogFormVisible = true
      },
      handleClose(){
        this.price = 0;
        this.orderId = 0;
        this.free = 0;
        this.dialogFormVisible = false
      },
      saveData(){
        let data ={
          id: this.orderId,
          price: this.free
        };

        backOrderInfo(data).then(res=>{
          this.$message({
            type: res.data.type,
            message: res.data.message,
          });
          this.handleClose();
          this.fetchData()
        })

      }
    }
  }
</script>

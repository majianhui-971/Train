<template>
  <div class="container" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入线路、创建时间、费用、类型" v-model="fuzzy" size="small" clearable></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="small" icon="el-icon-search" @click="fetchDataInfo">搜索</el-button>
      </el-col>
      <el-col :span="4" :offset="12" style="text-align: center">
        <el-button v-if="oneOrMoreShow" type="danger" size="small" icon="el-icon-delete" @click="deleteDataInfo">删除
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border stripe :header-cell-style="header" class="table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column prop="cName" label="客户" align="center">
      </el-table-column>
      <el-table-column prop="lineName" label="线路" align="center">
      </el-table-column>
      <el-table-column prop="orderSum" label="数量" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" :formatter="dateFormat">
      </el-table-column>
      <el-table-column prop="free" label="手续费" align="center">
      </el-table-column>
      <el-table-column prop="type" label="类型" align="center">
      </el-table-column>
      <el-table-column v-if="stateShow" prop="state" label="状态" align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="fetchDataInfo"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" class="pagination">
    </el-pagination>

  </div>
</template>

<script>

  import {fetchInfo, deleteInfo} from '@/api/order'

  export default {
    name: "order",
    data() {
      return {
        tableData: [],
        currentPage: 1,
        fuzzy: '',
        pageSize: 10,
        selection: [],
        dialogFormVisible: false,
        operate: '',
        total: 0,
        loading: true,
        stateShow: false,
        header: {
          background: '#eef1f6',
          color: '#606266'
        }
      }
    },
    created() {
      fetchInfo({}).then(res => {
        this.tableData = res.data.list;
        this.total = res.data.total;
        this.loading = false
      });
      this.$store.dispatch('fetchRedis', 'state').then(data => {
          this.stateShow = data
      });
    },
    computed: {
      oneOrMoreShow() {
        if (this.selection) {
          return this.selection.length > 0;
        }
        return false;
      },
    },
    methods: {
      fetchDataInfo() {
        this.loading = true;
        let data = {
          'fuzzy': this.fuzzy,
          'page': this.currentPage,
          'pageSize': this.pageSize
        };

        fetchInfo(data).then(res => {
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.loading = false
        })
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.fetchDataInfo()
      },
      deleteDataInfo() {
        this.$confirm('此操作将删除此信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = '';
          for (let i = 0; i < this.selection.length; i++) {
            ids = ids + ',' + this.selection[i].id
          }
          deleteInfo(ids).then(res => {
            this.$message({
              type: res.data.type,
              message: res.data.message,
            });
            this.handleClose();
            this.fetchDataInfo()
          })
        })
      },
      handleClose() {
        this.order = {
          username: '',
          password: ''
        };
        this.dialogFormVisible = false;
        this.$refs.Form.clearValidate();
      },
      handleSelectionChange(val) {
        this.selection = val
      },
      dateFormat: function (row, column) {
        let date = new Date(row.createTime);
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
      }
    }
  }
</script>

<style scoped>

  .table, .pagination {
    margin: 20px 0;
  }

</style>

<template>
  <div class="container" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入标题、内容" v-model="fuzzy" size="small" clearable></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="small" icon="el-icon-search" @click="fetchDataInfo">搜索</el-button>
      </el-col>
      <el-col :span="5" :offset="11" style="text-align: center">
        <el-button type="success" size="small" icon="el-icon-folder-add" @click="addDataInfo">新增</el-button>
        <el-button v-if="oneOrMoreShow" type="danger" size="small" icon="el-icon-delete" @click="deleteDataInfo">删除
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border stripe :header-cell-style="header" class="table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column prop="title" label="标题" align="center">
      </el-table-column>
      <el-table-column prop="content" label="内容" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="发表时间" :formatter="dateFormat" align="center">
      </el-table-column>
      <el-table-column v-if="stateShow" prop="state" label="状态" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" circle
                     @click="editDataInfo(scope.row)"></el-button>
        </template>
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

    <el-dialog title="发布信息维护" :visible.sync="dialogFormVisible" width="40%" :before-close="handleClose" center>
      <el-form :rules="rules" :model="message" ref="Form">
        <el-form-item label="标题" prop="title">
          <el-input v-model="message.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="message.content" rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveData">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  import {fetchInfo, updateInfo, addInfo, deleteInfo} from '@/api/message'

  export default {
    name: "message",
    data() {
      const validateContent = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入内容!'))
        } else {
          callback()
        }
      };

      const validateTitle = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入标题!'))
        } else {
          callback()
        }
      };
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
        message: {
          title: '',
          content: ''
        },
        header: {
          background: '#eef1f6',
          color: '#606266'
        },
        rules: {
          title: [
            {
              required: true, validator: validateTitle, trigger: 'blur'
            }
          ],
          content: [
            {
              required: true, validator: validateContent, trigger: 'blur'
            }
          ]
        },
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
      addDataInfo() {
        this.operate = 'add';
        this.dialogFormVisible = true;
      },
      editDataInfo(row) {
        this.message = row;
        this.operate = 'edit';
        this.dialogFormVisible = true;
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.fetchDataInfo()
      },
      saveData() {
        this.$refs.Form.validate((valid) => {
          if (valid) {
            if (this.operate === 'add') {
              addInfo(this.message).then(res => {
                this.$message({
                  type: res.data.type,
                  message: res.data.message,
                });
                this.handleClose();
                this.fetchDataInfo()
              })
            } else {
              updateInfo(this.message).then(res => {
                this.$message({
                  type: res.data.type,
                  message: res.data.message,
                });
                this.handleClose();
                this.fetchDataInfo()
              })
            }
          }
        });
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
        this.message = {
          title: '',
          content: ''
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

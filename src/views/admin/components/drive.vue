<template>
  <div class="container" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入司机、司龄" v-model="fuzzy" size="small" clearable></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="small" icon="el-icon-search" @click="fetchDataInfo">搜索</el-button>
      </el-col>
      <el-col :span="4" :offset="12" style="text-align: center">
        <el-button type="success" size="small" icon="el-icon-folder-add" @click="addDataInfo">新增</el-button>
        <el-button v-if="oneOrMoreShow" type="danger" size="small" icon="el-icon-delete" @click="deleteDataInfo">删除
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border stripe :header-cell-style="header" class="table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column prop="driverName" label="司机" align="center">
      </el-table-column>
      <el-table-column prop="driveAge" label="司龄" align="center">
      </el-table-column>
      <el-table-column prop="capacity" label="客容量" align="center">
      </el-table-column>
      <el-table-column prop="emptyCapacity" label="空余量" align="center">
      </el-table-column>
      <el-table-column prop="driveNumber" label="车次" align="center">
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

    <el-dialog title="客车信息维护" :visible.sync="dialogFormVisible" width="30%" :before-close="handleClose" center>
      <el-form :rules="rules" :model="drive" ref="Form">
        <el-form-item label="司机" prop="driverName">
          <el-input v-model="drive.driverName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="司龄" prop="driveAge">
          <el-input v-model="drive.driveAge" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="客容量" prop="capacity">
          <el-input v-model="drive.capacity" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="座位空余量" prop="emptyCapacity">
          <el-input v-model="drive.emptyCapacity" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="车次" prop="driveNumber">
          <el-input v-model="drive.driveNumber" autocomplete="off"></el-input>
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

    import {fetchInfo, updateInfo, addInfo, deleteInfo} from '@/api/drive'

    export default {
        name: "drive",
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
                drive: {
                    driverName: '',
                    driveAge: '',
                    capacity: '',
                    emptyCapacity: '',
                    driveNumber: '',
                },
                header: {
                  background: '#eef1f6',
                  color: '#606266'
                },
                rules: {
                    driverName: [
                        {
                            required: true, message: '请输入司机名称', trigger: 'blur'
                        }
                    ],
                    driveAge: [
                        {
                            required: true, message: '请输入司龄', trigger: 'blur'
                        },
                        {
                            type: 'number', message: '司龄必须为数字值'
                        }
                    ],
                    capacity: [
                        {
                            required: true, message: '请输入容量', trigger: 'blur'
                        }
                    ],
                    emptyCapacity: [
                        {
                            required: true, message: '请输入空余量', trigger: 'blur'
                        },
                        {
                            type: 'number', message: '空余量必须为数字值'
                        }
                    ],
                    driveNumber: [
                        {
                            required: true, message: '请输入车次号', trigger: 'blur'
                        }
                    ],

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
            handleSizeChange(val){
              this.pageSize = val;
              this.fetchDataInfo()
            },
            addDataInfo() {
                this.operate = 'add';
                this.dialogFormVisible = true;
            },
            editDataInfo(row) {
                this.drive = row;
                this.operate = 'edit';
                this.dialogFormVisible = true;
            },
            saveData() {
                this.$refs.Form.validate((valid) => {
                    if (valid) {
                        if (this.operate === 'add') {
                            addInfo(this.drive).then(res => {
                                this.$message({
                                    type: res.data.type,
                                    message: res.data.message,
                                });
                                this.handleClose();
                                this.fetchDataInfo()
                            })
                        } else {
                            updateInfo(this.drive).then(res => {
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
                this.drive = {
                    driverName: '',
                    driveAge: '',
                    capacity: '',
                    emptyCapacity: '',
                    driveNumber: '',
                };
                this.dialogFormVisible = false;
                this.$refs.Form.clearValidate();
            },
            handleSelectionChange(val) {
                this.selection = val
            },

        }
    }
</script>

<style scoped>

  .table, .pagination {
    margin: 20px 0;
  }

</style>

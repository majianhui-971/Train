<template>
  <div class="container" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入起始站、终点站、开始时间、结束时间" v-model="fuzzy" size="small" clearable></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="small" icon="el-icon-search" @click="fetchDataInfo">搜索</el-button>
      </el-col>
      <el-col :span="4" :offset="10" style="text-align: center">
        <el-button type="success" size="small" icon="el-icon-folder-add" @click="addDataInfo">新增</el-button>
        <el-button v-if="oneOrMoreShow" type="danger" size="small" icon="el-icon-delete" @click="deleteDataInfo">删除
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border stripe :header-cell-style="header" class="table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column prop="startSiteName" label="起始站" align="center">
      </el-table-column>
      <el-table-column prop="endSiteName" label="终点站" align="center">
      </el-table-column>
<!--      <el-table-column prop="passSiteName" label="经过站" align="center">-->

      <el-table-column prop="startTime" label="开始时间" align="center" :formatter="startDateFormat">
      </el-table-column>
      <el-table-column prop="offsetTime" label="经过时间" align="center">
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" align="center" :formatter="endDateFormat">
      </el-table-column>
      <el-table-column prop="driveNumber" label="车次号" align="center">
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

    <el-dialog title="线路信息维护" :visible.sync="dialogFormVisible" width="30%" :before-close="handleClose" center>
      <el-form :label-position="labelPosition" label-width="80px" :rules="rules" :model="line" ref="Form">

        <el-form-item label="起始站" prop="startSite">
          <el-select v-model="line.startSite" placeholder="起始站" class="form-item-half">
            <el-option  v-for="item in siteList" :key="item.code" :label="item.name" :value="'' + item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="终点站" prop="endSite">
          <el-select v-model="line.endSite" placeholder="终点站" class="form-item-half">
            <el-option  v-for="item in siteList" :key="item.code" :label="item.name" :value="'' + item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="客车信息" prop="driveId">
          <el-select v-model="line.driveId" placeholder="客车信息" class="form-item-half">
            <el-option v-for="item in driveList" :key="item.id" :label="item.driveNumber" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

      <!--  <el-form-item label="经过站" prop="passSite">
          <el-select v-model="line.passSite" multiple placeholder="经过站" class="form-item-fill">
            <el-option  v-for="item in siteList" :key="item.code" :label="item.name" :value="'' + item.id"></el-option>
          </el-select>
        </el-form-item>-->
        <el-row>
          <el-form-item label="发车时间" prop="startTime">
            <el-date-picker v-model="line.startTime" type="datetime" placeholder="选择日期时间" class="form-item-half"></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="到达时间" prop="endTime">
            <el-date-picker v-model="line.endTime" type="datetime" placeholder="选择日期时间" class="form-item-half"></el-date-picker>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveData">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

    import {fetchInfo, updateInfo, addInfo, deleteInfo} from '@/api/line_info'
    import {fetchSiteBySelect} from '@/api/site'
    import {fetchDriveBySelect} from '@/api/drive'

    export default {
        name: "line_info",
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
                labelPosition: 'right',
                siteList: [],
                driveList: [],
                header: {
                  background: '#eef1f6',
                  color: '#606266'
                },
                line: {
                  startSite: '',
                  endSite: '',
                  /* passSite: [],*/
                  startTime: '',
                  endTime: '',
                  driveId: ''
                },
                rules: {
                    startSite: [
                        {
                            required: true, message: '请输入起始站', trigger: 'change'
                        }
                    ],
                    endSite: [
                        {
                            required: true, message: '请输入终点站', trigger: 'change'
                        }
                    ],
                    driveId: [
                      {
                        required: true, message: '请输入客车信息', trigger: 'change'
                      }
                    ],
                   /* passSite: [
                        {
                            required: true, message: '请输入经过站', trigger: 'change'
                        }
                    ],*/
                    startTime: [
                        {
                            required: true, message: '请输入发车时间', trigger: 'change'
                        }
                    ],
                    endTime: [
                        {
                            required: true, message: '请输入到达时间', trigger: 'change'
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

            fetchSiteBySelect().then(res => {
                this.siteList = res.data;
            });

            fetchDriveBySelect().then(res => {
              this.driveList = res.data;
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
                this.line = row;
                this.operate = 'edit';
               /* if(typeof(this.line.passSite) === "string" ){
                    this.line.passSite = this.line.passSite.split(',');
                }*/
                this.dialogFormVisible = true;
            },
            saveData() {
                this.$refs.Form.validate((valid) => {
                    if (valid) {
                        let data = {};
                        Object.assign(data, this.line);
              /*          data.passSite = this.line.passSite.join(",");*/
                        if (this.operate === 'add') {
                            addInfo(data).then(res => {
                                this.$message({
                                    type: res.data.type,
                                    message: res.data.message,
                                });
                                this.handleClose();
                                this.fetchDataInfo()
                            })
                        } else {
                            updateInfo(data).then(res => {
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
                this.line = {
                    startSite: '',
                    endSite: '',
/*                    passSite: [],*/
                    startTime: '',
                    endTime: '',
                    driveId: ''
                };
                this.$refs.Form.clearValidate();
                this.dialogFormVisible = false;
            },
            handleSelectionChange(val) {
                this.selection = val
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
            }
        }
    }
</script>

<style scoped>

  .table, .pagination {
    margin: 20px 0;
  }


  .form-item-half {
    width: 90%;
  }
</style>

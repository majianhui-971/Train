<template>
  <div class="container" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-input placeholder="请输入起始站、终点站、发车时间、到站时间、售票开始时间、售票结束时间" v-model="fuzzy" size="small" clearable></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="small" icon="el-icon-search" @click="fetchDataInfo">搜索</el-button>
      </el-col>
      <el-col :span="5" :offset="6" style="text-align: center">
        <el-button type="success" size="small" icon="el-icon-folder-add" @click="addDataInfo">新增</el-button>
        <el-button v-if="oneOrMoreShow" type="danger" size="small" icon="el-icon-delete" @click="deleteDataInfo">删除
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border stripe :header-cell-style="header" class="table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
  <!--    <el-table-column prop="cName" label="客户" align="center">
      </el-table-column>-->
<!--      <el-table-column prop="lineName" label="线路" align="center">
      </el-table-column>-->
      <el-table-column prop="startSiteName" label="起始站" width="120" align="center">
      </el-table-column>
      <el-table-column prop="endSiteName" label="终点站" width="120" align="center">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="80" align="center">
      </el-table-column>
      <el-table-column prop="startTime" label="发车时间" :formatter="startDateFormat" align="center">
      </el-table-column>
      <el-table-column prop="endTime" label="到站时间" :formatter="endDateFormat" align="center">
      </el-table-column>
      <el-table-column prop="saleStartTime" label="售票开始时间" :formatter="saleStartDateFormat" align="center">
      </el-table-column>
      <el-table-column prop="saleEndTime" label="售票结束时间" :formatter="saleEndDateFormat" align="center">
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

    <el-dialog title="车票信息维护" :visible.sync="dialogFormVisible" width="30%" :before-close="handleClose" center>
      <el-form :label-position="labelPosition" :rules="rules" :model="ticket" ref="Form" label-width="120px">
<!--        <el-form-item label="客户" prop="cId">
          <el-select v-model="ticket.cId" placeholder="客户" class="form-item-half">
            <el-option  v-for="item in customerList" :key="item.id" :label="item.name" :value="'' + item.id"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="线路" prop="lineId">
          <el-select v-model="ticket.lineId" placeholder="线路" class="form-item-half" @change="handleChange">
            <el-option  v-for="item in lineList" :key="item.id" :label="item.startSiteName+ '-' + item.endSiteName"
                        :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始站" prop="startSite">
          <el-select v-model="ticket.startSite" placeholder="起始站" class="form-item-half" disabled>
            <el-option  v-for="item in siteList" :key="item.code" :label="item.name" :value="'' + item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终点站" prop="endSite">
          <el-select v-model="ticket.endSite" placeholder="终点站" class="form-item-half" disabled>
            <el-option  v-for="item in siteList" :key="item.code" :label="item.name" :value="'' + item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="ticket.price" :step="10" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="发车时间" prop="startTime">
          <el-date-picker v-model="ticket.startTime" type="datetime" placeholder="选择日期时间" class="form-item-half"></el-date-picker>
        </el-form-item>
        <el-form-item label="到站时间" prop="endTime">
          <el-date-picker v-model="ticket.endTime" type="datetime" placeholder="选择日期时间" class="form-item-half"></el-date-picker>
        </el-form-item>
        <el-form-item label="售票开始时间" prop="saleStartTime">
          <el-date-picker v-model="ticket.saleStartTime" type="datetime" placeholder="选择日期时间" class="form-item-half"></el-date-picker>
        </el-form-item>
        <el-form-item label="售票结束时间" prop="saleEndTime">
          <el-date-picker v-model="ticket.saleEndTime" type="datetime" placeholder="选择日期时间" class="form-item-half"></el-date-picker>
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

    import {fetchInfo, updateInfo, addInfo, deleteInfo} from '@/api/ticket'
    import {fetchSiteBySelect} from '@/api/site'
    import {fetchCustomerBySelect} from '@/api/customer'
    import {fetchLineBySelect} from '@/api/line_info'

    export default {
        name: "ticket",
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
                siteList: [],
                customerList: [],
                lineList: [],
                labelPosition: 'right',
                header: {
                  background: '#eef1f6',
                  color: '#606266'
                },
                ticket: {
/*                    cId: '',*/
                    lineId: '',
                    price: '',
                    startTime: '',
                    endTime: '',
                    startSite: '',
                    endSite: '',
                    saleStartTime: '',
                    saleEndTime: '',
                },
                rules: {
          /*          cId: [
                        {
                            required: true, message: '请输入客户编号', trigger: 'blur'
                        }
                    ],*/
                    lineId: [
                        {
                            required: true, message: '请输入线路编号', trigger: 'blur'
                        }
                    ],
                    price: [
                        {
                            required: true, message: '请输入价格', trigger: 'blur'
                        },
                        {
                            type: 'number', message: '价格必须为数字值'
                        }
                    ],
                    startTime: [
                        {
                            required: true, message: '请输入发车时间', trigger: 'blur'
                        }
                    ],
                    endTime: [
                        {
                            required: true, message: '请输入到站时间', trigger: 'blur'
                        }
                    ],
                    startSite: [
                        {
                            required: true, message: '请输入起始站', trigger: 'blur'
                        }
                    ],
                    endSite: [
                        {
                            required: true, message: '请输入终点站', trigger: 'blur'
                        }
                    ],
                    saleStartTime: [
                        {
                            required: true, message: '请输入售票开始时间', trigger: 'blur'
                        }
                    ],
                    saleEndTime: [
                        {
                            required: true, message: '请输入售票结束时间', trigger: 'blur'
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

            fetchCustomerBySelect().then(res => {
                this.customerList = res.data;
            });

            fetchLineBySelect().then(res => {
                this.lineList = res.data;
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
                this.ticket = row;
                this.operate = 'edit';
                this.dialogFormVisible = true;
            },
            saveData() {
                this.$refs.Form.validate((valid) => {
                    if (valid) {
                        if (this.operate === 'add') {
                            addInfo(this.ticket).then(res => {
                                this.$message({
                                    type: res.data.type,
                                    message: res.data.message,
                                });
                                this.handleClose();
                                this.fetchDataInfo()
                            })
                        } else {
                            updateInfo(this.ticket).then(res => {
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
                this.ticket = {
    /*                cId: '',*/
                    lineId: '',
                    price: '',
                    startTime: '',
                    endTime: '',
                    startSite: '',
                    endSite: '',
                    saleStartTime: '',
                    saleEndTime: '',
                };
                this.dialogFormVisible = false;
                this.$refs.Form.clearValidate();
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
            },
            saleStartDateFormat: function (row, column) {
                let date = new Date(row.saleStartTime);
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
            saleEndDateFormat: function (row, column) {
                let date = new Date(row.saleEndTime);
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
            handleChange() {
                debugger
                for (let i = 0; i < this.lineList.length; i++) {
                    if (this.lineList[i].id === this.ticket.lineId) {
                        this.ticket.startSite = this.lineList[i].startSite;
                        this.ticket.endSite = this.lineList[i].endSite
                    }
                }
            }
        }
    }
</script>

<style scoped>

  .table, .pagination {
    margin: 20px 0;
  }

</style>

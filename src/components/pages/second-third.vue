<template>
  <div>
    <el-row v-if="!isShow">
      <el-col :span="18" :offset="3">
        <el-table :data="tableData" border>
          <el-table-column prop="createTime" label="购票时间" align="center" :formatter="dateFormat"></el-table-column>
          <el-table-column prop="startSiteName" label="起始站" align="center"></el-table-column>
          <el-table-column prop="endSiteName" label="终点站" align="center"></el-table-column>
          <el-table-column prop="startTime" label="发车时间" :formatter="startDateFormat" align="center"></el-table-column>
          <el-table-column prop="endTime" label="到站时间" :formatter="endDateFormat" align="center"></el-table-column>
          <el-table-column prop="orderSum" label="数量" align="center"></el-table-column>
          <el-table-column prop="orderAmount" label="总金额" align="center"></el-table-column>
          <el-table-column label="改签" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="editDataInfo(scope.row)">改签</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row v-if="isShow">
      <el-col :span="12" :offset="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>火车票改签</span>
            <el-button style="float: right" type="primary" @click="onSubmit" round icon="el-icon-search">查询</el-button>
          </div>
          <el-form :inline="true" :model="buyTicket" :rules="rules" ref="buyTicketForm" class="demo-form-inline">
            <el-row>
              <el-col :span="12">
                <el-form-item label="出发城市" prop="startSite">
                  <el-select v-model="buyTicket.startSite" clearable placeholder="请选择">
                    <el-option
                      v-for="item in cityOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="到达城市" prop="endSite">
                  <el-select v-model="buyTicket.endSite" clearable placeholder="请选择">
                    <el-option
                      v-for="item in cityOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出发日期" prop="startTime">
                  <el-date-picker
                    v-model="buyTicket.startTime"
                    type="date"
                    :picker-options="pickerOptions"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12" :offset="6">
        <el-divider></el-divider>
      </el-col>
      <el-col :span="12" :offset="6">
        <el-button @click="goBackDay">前一天</el-button>
        <el-button @click="nextDay">后一天</el-button>
        <el-table
          :data="list"
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            label="发车时间"
            width="230">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.leaveTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="发/到站"
            width="180">
            <template slot-scope="scope">
              {{ scope.row.startSiteName }}
              <i class="el-icon-right">{{ scope.row.endSiteName}}</i>
            </template>
          </el-table-column>

          <el-table-column
            label="时长"
            width="180">
            <template slot-scope="scope">
              {{ scope.row.totalTime }}
            </template>
          </el-table-column>

          <el-table-column label="票价">
            <template slot-scope="scope">
              <i class="el-icon-coin">{{ scope.row.price }}</i>
            </template>
          </el-table-column>


          <el-table-column
            label="剩余票数">
            <template slot-scope="scope">
              {{ scope.row.ticketNumber }}
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                @click="clickReservation(scope.$index, scope.row)">预定
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12" :offset="6">
        <el-pagination
          :current-page.sync="buyTicket.page"
          :page-size.sync="buyTicket.size"
          :layout="layout"
          :total="total"
          v-bind="$attrs"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </el-col>

      <el-dialog title="填写购票信息" :visible.sync="buyTicketDialogVisible" width="50%" :before-close="handleClose">

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight:bold;font-size: 18px">车票信息</span>
          </div>
          <div>
            <span style="font-size: 20px; text-align: center; margin-left: 190px">{{buyTicketInfo.startTime | formatDate}}<i
              class="el-icon-minus"></i> {{buyTicketInfo.endTime | formatDate}}</span>
          </div>
          <div style="margin-top: 20px">
          <span style="font-size: 25px; text-align: center; margin-left: 350px">
            {{buyTicketInfo.startSiteName}}
           <i class="el-icon-right" style="width: 50px"></i>
           {{buyTicketInfo.endSiteName}}
           </span>
          </div>
          <div>
            <span> 单张票价 {{buyTicketInfo.price}}</span>
            <span> 乘客个数 {{maxItem}}</span>
            <span> 实际金额{{maxItem*buyTicketInfo.price | formatMoney}}</span>
          </div>
        </el-card>

        <el-divider></el-divider>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight:bold;font-size: 18px">乘车人</span>
            <span style="margin-left: 5px;color: #E6A23C">单笔订单最多添加三个联系人</span>
            <el-button style="float: right;padding: 3px 0" type="text" @click="addDomain" icon="el-icon-coordinate">
              添加乘车人
            </el-button>
          </div>
          <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px">
            <el-col v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key">
              <el-col :span="12" :offset="6">
                <el-form-item
                  label="姓名"
                  :prop="'domains.' + index + '.userName'"
                  :rules="[{required: true, message: '请填写姓名', trigger: 'blur'}]"
                >
                  <el-input v-model="domain.userName"></el-input>
                </el-form-item>

                <el-form-item
                  label="身份证号码"
                  :prop="'domains.' + index + '.idNumber'"
                  :rules="[{required: true, message: '请填写身份证号码', trigger: 'blur'}]"
                >
                  <el-input v-model="domain.idNumber"></el-input>
                  <el-button v-if="index > 0" @click.prevent="removeDomain(domain)">删除</el-button>
                </el-form-item>
              </el-col>
            </el-col>
          </el-form>
        </el-card>

        <el-divider></el-divider>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('dynamicValidateForm')">去支付</el-button>
          <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
        </div>
      </el-dialog>
    </el-row>

    <el-dialog title="支付方式" :visible.sync="cardDialogVisible" width="50%" :before-close="closePay">
      <el-form label-width="150px" :model="cardValidateForm" ref="cardValidateForm" >
        <el-col>
          <el-divider content-position="left">银联支付</el-divider>
        </el-col>

        <el-col :span="8">
          <el-form-item label="上海银行">
            <el-radio v-model="radio" label="1">
              <svg-icon name="上海银行" color="#FFF" class="svg"></svg-icon>
            </el-radio>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="招商银行">
            <el-radio v-model="radio" label="2">
              <svg-icon name="招商银行" color="#FFF" class="svg"></svg-icon>
            </el-radio>
          </el-form-item>
        </el-col>


        <el-col :span="8">
          <el-form-item label="建设银行">
            <el-radio v-model="radio" label="3">
              <svg-icon name="建设银行" color="#FFF" class="svg"></svg-icon>
            </el-radio>
          </el-form-item>
        </el-col>


        <el-col :span="8">
          <el-form-item label="工商银行">
            <el-radio v-model="radio" label="4">
              <svg-icon name="工商银行" color="#FFF" class="svg"></svg-icon>
            </el-radio>
          </el-form-item>
        </el-col>


        <el-col :span="8">
          <el-form-item label="中信银行">
            <el-radio v-model="radio" label="5">
              <svg-icon name="中信银行" color="#FFF" class="svg"></svg-icon>
            </el-radio>
          </el-form-item>
        </el-col>


        <el-col :span="8">
          <el-form-item label="中国农业银行">
            <el-radio v-model="radio" label="6">
              <svg-icon name="中国农业银行" color="#FFF" class="svg"></svg-icon>
            </el-radio>
          </el-form-item>
        </el-col>

        <el-col>
          <el-divider content-position="left">账户信息</el-divider>
        </el-col>

        <el-col>
          <el-form-item label="银行卡号："  :prop="account" :rules="[{ required: true, message: '不能为空'},{ type: 'number', message: '必须为数字值'}]">
            <el-input type="text" v-model="account"></el-input>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="密码：" :prop="password" :rules="[{ required: true, message: '不能为空'},{ type: 'number', message: '必须为数字值'}]">
            <el-input type="password" v-model="password"></el-input>
          </el-form-item>
        </el-col>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCard('cardValidateForm')">立即支付</el-button>
      </div>
    </el-dialog>



    <el-dialog title="支付" :visible.sync="payDialogVisible" width="50%" :before-close="closePay">
      <el-form label-width="150px">
        <el-row>
          <el-col>
            <el-divider content-position="left">车票信息</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出发站：">
              {{buyTicketInfo.startSiteName}}
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="抵达站：">
              {{buyTicketInfo.endSiteName}}
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="发车时间：">
              {{buyTicketInfo.startTime | formatDate}}
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="抵达时间：">
              {{buyTicketInfo.endTime | formatDate}}
            </el-form-item>
          </el-col>

          <el-col>
            <el-divider content-position="left">乘客信息</el-divider>
          </el-col>

          <div v-for="(domain) in dynamicValidateForm.domains">
            <el-col :span="12">
              <el-form-item label="姓名：">
                {{ domain.userName }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证：">
                {{ domain.idNumber }}
              </el-form-item>
            </el-col>
          </div>
          <el-col>
            <el-divider content-position="left">支付信息</el-divider>
          </el-col>
          <el-col>
            <el-form-item label="车票数量：">
              {{maxItem}}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="支付金额：">
              {{maxItem*buyTicketInfo.price | formatMoney}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPay()">立即支付</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

    import {fetchOrderTicketInfo, addInfoData} from '@/api/order'
    import {getSiteInfo} from '@/api/site'
    import {fetchTicketInfo} from '@/api/ticket'

    export default {
        data() {
            return {
                tableData: [],
                cardValidateForm:{},
                cityOptions:[],
                password: '',
                account: '',
                radio: '1',
                isShow: false,
                orderId: 0,
                buyTicket: {
                    startTime: '',
                    startSite: '',
                    endSite: '',
                    page: 1,
                    size: 5
                },
                rules: {
                    startTime: [
                        {required: true, message: "请选择出发时间", trigger: 'blur'}
                    ],
                    startSite: [
                        {required: true, message: "请选择出发城市", trigger: 'blur'}
                    ],
                    endSite: [
                        {required: true, message: "请选择到达城市", trigger: 'blur'}
                    ]

                },
                list: [],
                total: 0,
                layout: "prev, pager, next",
                buyTicketDialogVisible: false,
                payDialogVisible: false,
                cardDialogVisible: false,
                dynamicValidateForm: {
                    orderAmount: '',
                    orderSum: 0,
                    orderPrice: '',
                    cId: 0,
                    lineId: '',
                    ticketNumber: 0,
                    ticketId: 0,
                    domains: [],
                    id: 0
                },
                //存储购票信息的容器
                buyTicketInfo: {},
                maxItem: 1,
                loading: false,
                pickerOptions: {
                    disabledDate(time) {
                        let date = new Date();
                        date = new Date(date.setDate(date.getDate() - 1));
                        return time.getTime() < date;
                    }
                },
            }
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
            formatMoney: function (value) {
                return "￥" + value.toFixed(2)
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                getSiteInfo().then(res => {
                    this.cityOptions = res.data;
                });
                fetchOrderTicketInfo().then(res => {
                    this.tableData = res.data
                });
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
                this.$confirm('确定改签此订单吗, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   this.orderId = row.id;
                   this.isShow = true;
                })
            },
            onSubmit() {
                this.$refs['buyTicketForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        fetchTicketInfo(this.buyTicket).then(res => {
                            this.list = res.data.list;
                            this.total = res.data.total;
                            this.loading = false
                        })

                    } else {
                        return false
                    }
                })

            },
            submitCard(formName){
              this.$refs[formName].validate(valid => {
                if (valid) {
                  this.payDialogVisible = true;
                  this.cardDialogVisible = false;
                } else {
                  return false;
                }
              });

            },
            submitPay() {
                let _that = this.buyTicketInfo;
                this.dynamicValidateForm.lineId = _that.lineId;
                this.dynamicValidateForm.orderPrice = _that.price;
                this.dynamicValidateForm.orderSum = this.maxItem;
                this.dynamicValidateForm.cId = JSON.parse(window.sessionStorage.user).id;
                this.dynamicValidateForm.ticketNumber = _that.ticketNumber;
                this.dynamicValidateForm.ticketId = _that.id;
                addInfoData(this.dynamicValidateForm).then(res => {
                    if (res.data.type === 'success') {
                        this.$message({
                            type: 'success',
                            message: '支付成功，您的改签已完成，上次购票金额将退回您的账号',
                        });
                        this.onSubmit();
                        this.clearData();
                    } else if (res.data.type === 'error') {
                        this.$message({
                            type: 'waring',
                            message: '票数不足，无法支付',
                        });
                        this.onSubmit();
                        this.clearData();
                    } else if (res.data.type === 'repeat') {
                        this.$message({
                            type: 'waring',
                            message: '您已购买过改时间段的车票',
                        });
                        this.onSubmit();
                        this.clearData();
                    }
                })
            },
            closePay() {
                this.$confirm('确认关闭支付吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  this.payDialogVisible = false;
                  this.cardDialogVisible = false;
                    this.dynamicValidateForm = {
                        orderAmount: '',
                        orderSum: 0,
                        orderPrice: '',
                        cId: 0,
                        lineId: '',
                        ticketNumber: 0,
                        ticketId: 0,
                        domains: [],
                    }
                })
            },
            goBackDay() {
                this.$refs['buyTicketForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let date1 = this.buyTicket.startTime;
                        this.buyTicket.startTime = new Date(this.buyTicket.startTime.setDate(this.buyTicket.startTime.getDate() - 1))

                        let date = new Date();
                        date = new Date(date.setDate(date.getDate() - 1));
                        if (date1 < date) {
                            this.loading = false;
                            this.$message({
                                type: 'waring',
                                message: '只可查看当天和当天以后的车票信息',
                                showClose: true
                            })
                        } else {
                            fetchTicketInfo(this.buyTicket).then(res => {
                                this.list = res.data.list;
                                this.total = res.data.total;
                                this.loading = false
                            })
                        }

                    } else {
                        return false
                    }
                })

            },
            nextDay() {
                this.$refs['buyTicketForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.buyTicket.startTime = new Date(this.buyTicket.startTime.setDate(this.buyTicket.startTime.getDate() + 1));
                        fetchTicketInfo(this.buyTicket).then(res => {
                            this.list = res.data.list;
                            this.total = res.data.total;
                            this.loading = false
                        })

                    } else {
                        return false
                    }
                })

            },
            clickReservation(index, row) {
                this.buyTicketInfo = row;
                if (window.sessionStorage.user) {
                    this.buyTicketDialogVisible = true;
                    this.dynamicValidateForm.domains.push(
                        {
                            userName: JSON.parse(window.sessionStorage.user).name,
                            idNumber: JSON.parse(window.sessionStorage.user).identityCard,
                        }
                    )
                } else {
                    this.$router.push({
                        path: '/login',
                        query: {
                            isShow: true
                        }
                    })
                }
            },
            handleSizeChange(val) {
                this.buyTicket["page"] = val;
                this.onSubmit();
            },
            handleCurrentChange(val) {
                this.buyTicket["page"] = val;
                this.onSubmit();
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                        this.dynamicValidateForm.domains.push(
                            {
                                userName: JSON.parse(window.sessionStorage.user).name,
                                idNumber: JSON.parse(window.sessionStorage.user).identityCard,
                            }
                        )
                    });
                this.maxItem = 1;
                this.dynamicValidateForm = {
                    orderAmount: '',
                    orderSum: 0,
                    orderPrice: '',
                    cId: 0,
                    lineId: '',
                    ticketNumber: 0,
                    ticketId: 0,
                    domains: [],
                    id: 0
                }
            },
            addDomain() {
                if (this.dynamicValidateForm.domains.length === 3) {
                    this.$message({
                        type: 'success',
                        message: '单笔订单最多添加三个乘车人',
                    });
                    return
                }
                this.maxItem = this.dynamicValidateForm.domains.length + 1;
                this.dynamicValidateForm.domains.push({
                    userName: '',
                    idNumber: ''
                });
            },
            clearData() {
                this.maxItem = 1;
                this.dynamicValidateForm = {
                    orderAmount: '',
                    orderSum: 0,
                    orderPrice: '',
                    cId: 0,
                    lineId: '',
                    ticketNumber: 0,
                    ticketId: 0,
                    domains: [],
                    id: 0
                };
                this.payDialogVisible = false;
                this.cardDialogVisible = false;
            },
            removeDomain(item) {
                let index = this.dynamicValidateForm.domains.indexOf(item);
                if (index !== -1) {
                    this.dynamicValidateForm.domains.splice(index, 1)
                }
                let data = this.maxItem;
                this.maxItem = data - 1
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.cardDialogVisible = true;
                        this.buyTicketDialogVisible = false
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        }
    }
</script>

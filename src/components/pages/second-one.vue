<template>
<el-row>
   <el-col :span="12" :offset="6">
     <el-card class="box-card">
       <div slot="header" class="clearfix">
         <span >火车票购买</span>
         <el-button  style="float: right" size="small" @click="onSubmit" round icon="el-icon-search">查询</el-button>
       </div>
       <el-form :inline="true" :model="buyTicket" :rules="rules" ref="buyTicketForm" class="demo-form-inline" >
         <el-row>
           <el-col :span="12">
             <el-form-item label="出发站点" prop="startSite">
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
             <el-form-item label="到达站点" prop="endSite">
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
    <el-button type="primary" icon="el-icon-arrow-left" @click="goBackDay">前一天</el-button>
    <el-button type="primary" @click="nextDay" >后一天<i class="el-icon-arrow-right el-icon--right"></i></el-button>
    <el-table
      :data="list"
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        label="发车时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.leaveTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发/到站" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.startSiteName }}
          <i class="el-icon-right">{{ scope.row.endSiteName}}</i>
        </template>
      </el-table-column>

      <el-table-column
        label="时长">
        <template slot-scope="scope">
          {{ scope.row.totalTime }}
        </template>
      </el-table-column>

      <el-table-column
        label="票价">
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

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            @click="clickReservation(scope.$index, scope.row)">预定</el-button>
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
    <span style="font-size: 20px; text-align: center; margin-left: 190px">{{buyTicketInfo.startTime | formatDate}}<i class="el-icon-minus"></i> {{buyTicketInfo.endTime | formatDate}}</span>
      </div>
      <div style="margin-top: 20px">
          <span  style="font-size: 25px; text-align: center; margin-left: 350px" >
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
    <el-card  class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight:bold;font-size: 18px">乘车人</span>
        <span style="margin-left: 5px;color: #E6A23C">单笔订单最多添加三个联系人</span>
        <el-button  style="float: right;padding: 3px 0" type="text" @click="addDomain"  icon="el-icon-coordinate">添加乘车人</el-button>
      </div>
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px">
        <el-col v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key">

          <el-col :span="12" :offset="6">
          <el-form-item
            label="姓名"
            :prop="'domains.' + index + '.userName'"
            :rules="[{required:true,message:'请填写姓名',trigger: 'blur'}]"
          >
            <el-input v-model="domain.userName"></el-input>
          </el-form-item>

          <el-form-item
            label="身份证号码"
            :prop="'domains.' + index + '.idNumber'"
            :rules="[{required:true,message:'请填写身份证号码',trigger: 'blur'}]"
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
</el-row>
</template>
<script>

  import {getSiteInfo} from '@/api/site'
  import {fetchTicketInfo} from '@/api/ticket'
  import {addInfoData} from '@/api/order'
    export default {
        name: "seven-One",
        data() {
            return {
                cityOptions:[],
                buyTicket: {
                    startTime: '',
                    startSite: '',
                    endSite: '',
                    page:1,
                    size:5
                },
                rules:{
                    startTime:[
                        {required:true,message:"请选择出发时间",trigger:'blur'}
                    ],
                    startSite:[
                        {required:true,message:"请选择出发城市",trigger:'blur'}
                    ],
                    endSite:[
                        {required:true,message:"请选择到达城市",trigger:'blur'}
                    ]

                },
                list: [],
                total:0,
                layout: "prev, pager, next",
                buyTicketDialogVisible:false,
                payDialogVisible: false,
                dynamicValidateForm: {
                    orderAmount:'',
                    orderSum:0,
                    orderPrice:'',
                    cId:0,
                    lineId:'',
                    ticketNumber:0,
                    ticketId:0,
                    domains: [],
                },
                //存储购票信息的容器
                buyTicketInfo:{},
                maxItem:1,
                loading:false,
                pickerOptions:{
                    disabledDate(time) {
                        let date = new Date();
                        date = new Date(date.setDate(date.getDate() - 1));
                        return time.getTime() < date;
                    }
                }
            }
        },
        created(){
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
                return y + '-' + MM + '-' + d + ' ' + h + ':' + m ;
            },
            formatMoney:function (value) {
                return "￥"+value.toFixed(2)
            }
        },
        methods: {
            initData(){
                getSiteInfo().then(res => {
                    this.cityOptions=res.data;
                })
            },
            onSubmit(){
                this.$refs['buyTicketForm'].validate((valid) =>{
                    if(valid){
                        this.loading = true;
                        fetchTicketInfo(this.buyTicket).then(res => {
                            this.list = res.data.list;
                            this.total = res.data.total;
                            this.loading = false
                        })
                    }else {
                        return false
                    }
                })
            },
            goBackDay(){
                this.$refs['buyTicketForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let date1 = this.buyTicket.startTime;
                        this.buyTicket.startTime = new Date(this.buyTicket.startTime.setDate(this.buyTicket.startTime.getDate() - 1));

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
            nextDay(){
                this.$refs['buyTicketForm'].validate((valid) =>{
                    if(valid){
                        this.loading = true;
                        this.buyTicket.startTime = new Date(this.buyTicket.startTime.setDate(this.buyTicket.startTime.getDate() + 1));
                        fetchTicketInfo(this.buyTicket).then(res => {
                            this.list = res.data.list;
                            this.total = res.data.total;
                            this.loading = false
                        })

                    }else {
                        return false
                    }
                })

            },
            clickReservation(index, row){
                this.buyTicketInfo = row;
                if(window.sessionStorage.user){
                  this.buyTicketDialogVisible = true;
                  this.dynamicValidateForm.domains.push(
                    {
                      userName: JSON.parse(window.sessionStorage.user).name,
                      idNumber: JSON.parse(window.sessionStorage.user).identityCard,
                    }
                  )
                }else {
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
                            message: '支付成功',
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
            handleClose(done) {
                this.$confirm('确认关闭？').then(_ => {
                        done();
                    }).catch(_ => {
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
                }
            },
            addDomain() {
                if( this.dynamicValidateForm.domains.length===3){
                    this.$message({
                        type: 'success',
                        message: '单笔订单最多添加三个乘车人',
                    });
                    return
                }
                this.maxItem=this.dynamicValidateForm.domains.length+1
                this.dynamicValidateForm.domains.push({
                    userName: '',
                    idNumber:''
                });
            },
            closePay() {
                this.$confirm('确认关闭支付吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  this.payDialogVisible = false;
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
            clearData(){
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
                };
                this.payDialogVisible = false
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
                        this.payDialogVisible = true;
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

<style  scoped>

</style>

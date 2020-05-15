<template>
  <el-row v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
    <el-col :span="12" :offset="6">
      <div class="add-btn">
          <el-button  icon="el-icon-plus" circle  @click="handleComment('发表评论')"></el-button>
      </div>
      <div v-for="item in allCommentInfo">
        <el-card class="container">
          <div v-if="item.parentId === 0">
            <div><h4 class="title">{{item.cName}} {{ '：' }}</h4></div>
            <div class="content">
              <span>{{item.content}}</span>
              <el-button size="mini" round @click="handleComment('回复 ' + item.cName, item.id, item.id)">回复</el-button>
            </div>
          </div>
          <div v-for="itemSecond in item.childrenList" class="child">
            <div>
              <h5><span>{{itemSecond.cName}}</span> <span> 回复 </span><span>{{itemSecond.pName }} {{ '：'}}</span>
              </h5>
            </div>
            <div class="child-content">
              <span>{{itemSecond.content}}</span>
              <el-button size="mini" circle class="el-icon-chat-dot-square"
                         @click="handleComment('回复 ' + itemSecond.pName, item.id, itemSecond.id)"></el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-col>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="30%" :before-close="handleClose">
      <el-form :model="comment">
        <el-input type="textarea" v-model="comment.content" rows="4"></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="small">取 消</el-button>
        <el-button type="primary" @click="saveData" size="small">发 表</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>

    import {fetchAllCommentInfo, addInfo} from '@/api/comment'

    export default {
        name: "five",
        data() {
            return {
                allCommentInfo: [],
                dialogFormVisible: false,
                title: '',
                loading: true,
                comment: {
                    indexId: 0,
                    parentId: 0,
                    content: ''
                }
            }
        },
        created() {
            this.initData()
        },
        methods: {
            initData() {
                fetchAllCommentInfo().then(res => {
                    this.allCommentInfo = res.data;
                    this.loading = false
                })
            },
            handleComment(title, indexId = 0, parentId = 0) {
                if (!window.sessionStorage.user) {
                    this.$router.push({
                        path: '/login',
                        query: {
                            isShow: true
                        }
                    })
                } else {
                    this.title = title;
                    this.comment.indexId = indexId;
                    this.comment.parentId = parentId;
                    this.dialogFormVisible = true;
                }
            },
            handleClose() {
                this.title = '';
                this.comment.indexId = 0;
                this.comment.parentId = 0;
                this.comment.content = '';
                this.dialogFormVisible = false;
            },
            saveData() {
                if (this.comment.content === '') {
                    this.$message({
                        message: '评论内容不能为空，请输入评论',
                        type: 'warning'
                    });
                    return
                }

                let data = {
                    "indexId": this.comment.indexId,
                    "parentId": this.comment.parentId,
                    "content": this.comment.content,
                };

                addInfo(data).then(res => {
                    this.$message({
                        type: res.data.type,
                        message: res.data.message,
                    });
                    this.initData();
                    this.handleClose();
                })
            }
        }
    }
</script>

<style scoped>

  .container {
    padding: 15px 30px;
    margin-bottom: 30px;
  }

  .content {
    text-indent: 1em;
  }

  .child {
    text-indent: 2em;
  }

  .child-content {
    text-indent: 3em;
    font-size: 14px;
  }

  .add-btn {
    text-align: right;
    margin-bottom: 25px;
    margin-top: -20px;
  }

  >>> .el-dialog__title {
    font-size: 16px;
  }

</style>

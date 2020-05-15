<template>
  <el-row>
    <el-col :span="14" :offset="5">
      <el-tabs v-model="editableTabsValue" type="card" >
        <el-tab-pane v-for="(item, index) in editableTabs" :key="index" :label="item.title" :name="item.name">
          <four-one v-if="editableTabsValue==='1'">待出发订单</four-one>
   <!--       <four-two v-if="editableTabsValue==='2'">已完成订单</four-two>
          <four-third v-if="editableTabsValue==='3'">已退款订单</four-third>-->
          <four-four v-if="editableTabsValue==='4'">全部订单</four-four>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
  import fourOne from '@/components/pages/child/four-one'
  import fourTwo from '@/components/pages/child/four-two'
  import fourThird from '@/components/pages/child/four-third'
  import fourFour from '@/components/pages/child/four-four'

  export default {
    components: {
      fourOne,
      fourTwo,
      fourThird,
      fourFour
    },
    data() {
      return {
        editableTabsValue: '1',
        editableTabs: [{
          title: '待出发',
          name: '1',
        },/* {
          title: '已完成',
          name: '2',
        }, {
          title: '已退款',
          name: '3',
        }*/
        {
          title: '全部订单',
          name: '4',
        },],
      }
    },
    methods: {}
  }
</script>

<template>
  <div>
    <sub-nav-msg></sub-nav-msg>
    <el-table :data="listData.list">
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">用户消息</span>
          <span v-if="scope.row.type == 1">公告消息</span>
        </template>
      </el-table-column>
      <el-table-column label="信息">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">{{scope.row.info}}</span>
          <template v-if="scope.row.type == 1 && scope.row.notice_id > 0">
            <span
              v-for="notice in noticeList"
              v-if="scope.row.notice_id == notice.id"
              :key="notice.id"
            >{{notice.id}}.{{notice.title}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="发送时间">
        <template slot-scope="scope">
          {{
          dateFormat(scope.row.create_time)
          }}
        </template>
      </el-table-column>
      <el-table-column label="用户信息">
        <template slot-scope="scope">
          <div v-if=" scope.row.user_id > 0">
            <span
              v-for="user in userList"
              v-if="scope.row.user_id == user.id"
            >{{user.id}}.{{user.username || user.mobile}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="listData.page"
      :page-size="listData.limit"
      layout="prev, pager, next, total, jumper"
      :total="listData.count"
      class="mt-4"
      @current-change="pageChange"
      @prev-click="pageChange"
      @next-click="pageChange"
    ></el-pagination>
  </div>
</template>

<script>
import apis from "@/assets/js/apis";
import utils from "@/assets/js/utils";
import SubNavMsg from "@/components/SubNavMsg.vue";
export default {
  components: {
    SubNavMsg
  },
  head() {
    return {
      title: "用户消息记录"
    };
  },
  data() {
    return {
      listData: {
        list: [],
        page: 1,
        limit: 10,
        count: 0,
        search: ""
      },
      userList: "",
      noticeList: ""
    };
  },
  methods: {
    ...utils,
    async getListData() {
      let data = {};
      data.page = this.listData.page;
      data.limit = this.listData.limit;
      data.search = this.listData.search;

      try {
        let dataRet = await apis.getMessageListData(data);
        console.log("/getListData dataRet:", dataRet);
        if (dataRet.code === 0) {
          this.listData.count = dataRet.data.count;
          dataRet.data.rows.forEach(item => {
            this.listData.list.push(item);
          });
        } else {
          throw new Error(dataRet.message);
        }
      } catch (err) {
        this.$message.error(err.message || "获取列表数据失败");
      }
    },
    getRefreshData() {
      this.listData.list = [];
      this.listData.count = 0;
      this.getListData().then(() => {
        this.getUserList();
        this.getNoticeList();
      });
    },
    pageChange(page) {
      this.listData.list = [];
      this.listData.page = page;
      this.getListData();
    },
    async getUserList() {
      let userIds = [];
      this.userList = [];
      this.listData.list.forEach(item => {
        userIds.push(item.user_id);
      });

      let ret = await apis.getUserListData({ ids: userIds, limit: 0 });
      console.log("/getUserList ret:", ret);
      if (ret.code === 0) {
        this.userList = ret.data.rows;
      }
    },
    async getNoticeList() {
      let noticeIds = [];
      this.noticeList = [];
      this.listData.list.forEach(item => {
        noticeIds.push(item.user_id);
      });

      let ret = await apis.getNoticeListData({ ids: noticeIds, limit: 0 });
      console.log("/getNoticeList ret:", ret);
      if (ret.code === 0) {
        this.noticeList = ret.data.rows;
      }
    }
  },
  created() {
    this.getListData().then(() => {
      this.getUserList();
      this.getNoticeList();
    });
  }
};
</script>

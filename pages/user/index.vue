<template>
  <div>
    <el-table :data="listData.list">
      <el-table-column label="昵称" prop="nickname"></el-table-column>
      <el-table-column label="手机" prop="mobile"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="真实姓名" prop="realname"></el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == 1">男</span>
          <span v-if="scope.row.sex == 2">女</span>
          <span v-if="scope.row.sex == 1">-</span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="listData.search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini">查看</el-button>
          <el-button size="mini" type="danger">禁用</el-button>
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

export default {
  head() {
    return { title: "用户管理" };
  },
  data() {
    return {
      listData: {
        list: [],
        page: 1,
        limit: 1,
        count: 0,
        search: ""
      }
    };
  },
  methods: {
    async getListData() {
      let data = {};
      data.page = this.listData.page;
      data.limit = this.listData.limit;
      data.search = this.listData.search;

      try {
        let dataRet = await apis.getUserListData(data);
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
        this.$message.error(err.message || "获取用户数据失败");
      }
    },
    pageChange(page) {
      this.listData.list = [];
      this.listData.page = page;
      this.getListData();
    }
  },
  created() {
    this.getListData();
  }
};
</script>
<template>
  <div>
    <sub-nav-msg></sub-nav-msg>
    <el-row class="mt-4">
      <el-col :span="6"
        ><el-input
          v-model="listData.search"
          size="mini"
          placeholder="输入关键字搜索"
      /></el-col>
      <el-col :span="18" class="text-right">
        <el-button type="primary" size="small" @click="noticeAddBtnClick"
          >添加</el-button
        >
      </el-col>
    </el-row>
    <el-table :data="listData.list">
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="添加时间">
        <template slot-scope="scope">{{
          dateFormat(scope.row.create_time)
        }}</template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">未发送</span>
          <span v-if="scope.row.status == 1">已发送</span>
        </template>
      </el-table-column>
      <el-table-column align="right" fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="noticeSendToUser(scope.row)"
            >发送给用户</el-button
          >
          <el-button
            size="mini"
            plain
            @click="noticeInfoUpdateBtnClick(scope.row)"
            >查看 / 修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            plain=""
            @click="noticeDelete(scope.row)"
            >删除</el-button
          >
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

    <el-dialog
      title="公告添加 / 修改"
      :visible.sync="dialogNoticeUpdateVisible"
    >
      <el-form
        :model="notice"
        label-width="100px"
        :rules="rulesNotice"
        ref="formNoticeUpdate"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="notice.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="info">
          <el-input v-model="notice.info" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNoticeUpdateVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="noticeInfoUpdate"
          :disabled="noticeInfoUpdateBtn.disabled"
          >确定</el-button
        >
      </div>
    </el-dialog>
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
      title: "公告消息"
    };
  },
  data() {
    return {
      listData: {
        list: [],
        page: 1,
        limit: 1,
        count: 0,
        search: ""
      },
      dialogNoticeUpdateVisible: false,
      noticeInfoUpdateBtn: {
        disabled: false
      },
      notice: {
        id: 0,
        title: "",
        info: ""
      },
      rulesNotice: {
        title: [{ required: true, message: "请输入公告名称", trigger: "blur" }],
        info: [{ required: true, message: "请输入公告内容", trigger: "blur" }]
      }
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
        let dataRet = await apis.getNoticeListData(data);
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
      this.getListData();
    },
    pageChange(page) {
      this.listData.list = [];
      this.listData.page = page;
      this.getListData();
    },
    noticeAddBtnClick() {
      this.notice.id = 0;
      this.notice.title = "";
      this.notice.info = "";

      this.dialogNoticeUpdateVisible = true;
    },
    noticeInfoUpdateBtnClick(item) {
      this.notice.id = item.id;
      this.notice.title = item.title;
      this.notice.info = item.info;
      console.log("/noticeInfoUpdateBtnClick this.notice:", this.notice);

      this.dialogNoticeUpdateVisible = true;
    },
    async noticeInfoUpdate() {
      let valid = await this.$refs.formNoticeUpdate.validate();
      console.log("/noticeInfoUpdate valid:", valid);
      if (valid !== true) {
        return;
      }

      this.noticeInfoUpdateBtn.disabled = true;

      let data = this.notice;
      console.log("/noticeInfoUpdate data:", data);
      try {
        let ret;
        if (data.id) {
          ret = await apis.noticeDataUpdate(data);
        } else {
          ret = await apis.noticeDataCreate(data);
        }
        if (ret.code !== 0) {
          throw new Error(ret.message);
        } else {
          this.getRefreshData();
        }
      } catch (err) {
        this.$message.error(err.message || err);
      }

      this.noticeInfoUpdateBtn.disabled = false;
      this.dialogNoticeUpdateVisible = false;
    },
    async noticeSendToUser(item) {
      let data = {
        id: item.id
      };

      try {
        let confirm = await this.$confirm(
          "发送公告消息给所有用户, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
        console.log("/noticeSendToUser confirm", confirm);
        if (confirm !== "confirm") {
          return;
        }
      } catch (err) {
        console.error("/noticeSendToUser err:", err.message || err);
        return;
      }

      try {
        let ret = await apis.noticeSendUser(data);
        if (ret.code !== 0) {
          throw new Error(ret.message);
        } else {
          this.getRefreshData();
        }

        this.$message("发送成功");
      } catch (err) {
        this.$message.error(err.message || err);
      }
    },
    async noticeDelete(item) {
      let data = {
        id: item.id
      };

      try {
        let confirm = await this.$confirm("删除公告消息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        console.log("/noticeDelete confirm", confirm);
        if (confirm !== "confirm") {
          return;
        }
      } catch (err) {
        console.error("/noticeDelete err:", err.message || err);
        return;
      }

      try {
        let ret = await apis.noticeDelete(data);
        if (ret.code !== 0) {
          throw new Error(ret.message);
        } else {
          this.getRefreshData();
        }

        this.$message("删除成功");
      } catch (err) {
        this.$message.error(err.message || err);
      }
    }
  },
  created() {
    this.getListData();
  }
};
</script>

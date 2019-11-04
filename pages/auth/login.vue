<template>
  <el-container class="container">
    <el-card class="box-card" body-style="padding:20px;margin:20px;width:400px;text-align:left;">
      <el-form ref="form">
        <el-form-item>
          <el-input v-model="postData.email" placeholder="请输入登录邮箱" type="email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="postData.password" placeholder="请输入登录密码" type="password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onLogin">登录</el-button>
          <el-button type="reset">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-container>
</template>

<script>
export default {
  layout: "login",
  data() {
    return {
      postData: {
        email: "",
        password: "",
        type: "admin",
        platform: "pc"
      }
    };
  },
  methods: {
    async onLogin() {
      let postData = this.postData;
      console.log("onLogin postData", postData);
      let ret = await this.$store.dispatch("onLogin", postData);
      console.log("onLogin ret", ret);
      if (ret.code === 0) {
        this.$store.commit("authTokenSet", ret.data.token);
        this.$router.push({ path: "/" });
        // location.href = "/";
      }
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
<template>
  <div>
    <el-container style="height:100%;">
      <el-aside width="240px" class="border-r">
        <div class="p-4 h-24 text-3xl border-b">v0.1</div>
        <el-menu default-active="1" style="border-right:none;">
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">
              <router-link :to="{path:'/'}">Dashborad</router-link>
            </span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-user"></i>
            <span slot="title">
              <router-link :to="{path:'/user'}">用户管理</router-link>
            </span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-message"></i>
            <span slot="title">
              <router-link :to="{path:'/msg/notice'}">消息管理</router-link>
            </span>
          </el-menu-item>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>功能应用</span>
            </template>
            <template v-for="app in apps">
              <el-menu-item :index="app.id" @click="goToApp(app)">
                <i class="el-icon-menu"></i>
                <span slot="title">
                  <a>{{ app.title }}</a>
                </span>
              </el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="p-4 h-24 text-3xl border-b">
          <el-row class="pt-4">
            <el-col :span="12">
              <el-page-header @back="goBack" content></el-page-header>
            </el-col>
            <el-col :span="12">
              <div class="text-right">
                <el-button type="info" round @click="onLogout" size="small">退出</el-button>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <nuxt />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Axios from "@/assets/js/axios";
import apps from "./../config/apps";
export default {
  head() {
    return {
      title: "后台管理"
    };
  },
  data() {
    return {
      apps: apps
    };
  },
  methods: {
    async onLogout() {
      let ret = await this.$store.dispatch("onLogout");
      if (ret.code == 0) {
        this.$router.push({ path: "/auth/login" });
      }
    },
    goBack() {
      console.log("go back");
      this.$router.go(-1);
    },
    goToApp(app) {
      let token = this.$store.state.token;
      this.$store.commit("appUrlSet", app.url + "?token=" + token);
      this.$router.push({ path: "/app?name=" + app.name + "&t=" + Date.now() });
    }
    // async fetch({ store, params }) {
    //   // let ret = await store.dispatch("getConfig", params);
    //   let ret = await Axios.post("/api/auth/apps", params);
    //   console.log("get apps ========", ret.data);
    //   store.commit("websiteAppsSet", ret.data);
    //   return ret;
    // }
  }
};
</script>

<style>
@font-face {
  font-family: "webfont";
  font-display: swap;
  src: url("//at.alicdn.com/t/webfont_yst6vnl4i78.eot"); /* IE9*/
  src: url("//at.alicdn.com/t/webfont_yst6vnl4i78.eot?#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */ url("//at.alicdn.com/t/webfont_yst6vnl4i78.woff2")
      format("woff2"),
    url("//at.alicdn.com/t/webfont_yst6vnl4i78.woff") format("woff"),
    /* chrome、firefox */ url("//at.alicdn.com/t/webfont_yst6vnl4i78.ttf")
      format("truetype"),
    /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
      url("//at.alicdn.com/t/webfont_yst6vnl4i78.svg#AlibabaPuHuiTiL")
      format("svg"); /* iOS 4.1- */
}
html,
body {
  /* font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 62.5% !important; */
  font-family: "webfont", "Helvetica Neue", Helvetica, "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif !important;
  /* font-size: 16px; */
  font-size: 62.5% !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100%;
}

#__nuxt,
#__layout {
  height: 100%;
}

#__layout > div {
  height: 100%;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>

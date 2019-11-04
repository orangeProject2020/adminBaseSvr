<template>
  <div class="w-full h-full">
    <iframe :src="$store.state.appUrl" frameborder="0" class="w-full h-full"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
  // async fetch({ store, params }) {
  //   // let ret = await store.dispatch("getConfig", params);
  //   // let ret = await Axios.post("/api/website/info/config", params);
  //   // console.log("get config", ret.data);
  //   // store.commit("appUrlSet", "http://baidu.com");
  //   // return ret;
  // }
};
</script>

<style>
</style>
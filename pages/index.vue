<template>
  <div class>
    <h3 class="text-3xl">欢迎使用</h3>
    <div>
      <Uploader @uploadSuccess="uploadSuccess" accpet-type-limit="mp4"></Uploader>
    </div>
  </div>
</template>

<script>
import Axios from "./../server/axios";
import Uploader from "./../components/Uploader";

export default {
  components: {
    Uploader
  },
  async fetch({ store, params }) {},
  methods: {
    uploadSuccess(data) {
      console.log("uploadSuccess data", data);
    }
  }
};
</script>

<style>
</style>

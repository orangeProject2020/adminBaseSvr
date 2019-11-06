<template>
  <div class>
    <h3 class="text-3xl">欢迎使用</h3>
    <div>
      <Uploader></Uploader>
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
  methods: {}
};
</script>

<style>
</style>

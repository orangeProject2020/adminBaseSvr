<template>
  <div>
    <el-menu :default-active="$store.state.subNavMsgIndex" mode="horizontal">
      <el-menu-item index="0">
        <router-link to="/msg/notice">公告消息</router-link>
      </el-menu-item>
      <el-menu-item index="1">
        <router-link to="/msg/list">用户消息记录</router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {};
</script>

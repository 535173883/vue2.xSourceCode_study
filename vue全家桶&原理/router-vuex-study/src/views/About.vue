<template>
  <div class="about">
    <h1>This is an about page</h1>
    <span>{{ $store.state.count }}</span>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      key: "value",
    };
  },
};
</script>

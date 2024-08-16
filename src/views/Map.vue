<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <div class="home">
      <img  class='role1' src="@/assets/location1.png" alt="" @click="toRole(1)">
      <img  class='role2'  src="@/assets/location2.png" alt="" @click="toRole(2)">
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {

    };
  },
  methods: {
    toRole(idx) {
      this.$router.push(`/Role?type=${idx}`);
    },
  },
};
</script>

<style scoped lang="less">
.home {
  width: 100%;
  min-height: 100vh;
  background-image: url('@/assets/map.png');
  background-size: cover;
  background-position: bottom;
}
.role1 {
  position: absolute;
  left: 50%;
  top: 50%;
}
.role2 {
  position: absolute;
  left: 80%;
  top: 20%;
}
</style>

<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <div class="role">
  </div>
</template>

<script>
export default {
  name: "role-page",
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
.role {
  width: 100%;
  min-height: 100vh;
  background-image: url('@/assets/role2.png');
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

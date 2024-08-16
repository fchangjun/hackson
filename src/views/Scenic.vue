<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <div class="home">
    <div class="title">
      <div class="left">Scenic Selection</div>
    </div>
    <div class="content">
      <div v-for="(item,index) in images" :key="item" class="item"
         :style="[1,4,7].includes(index) ? { transform: 'translateY(80px)' } : {}"
         @click="goMap"
      >
        <img :src="item" alt="" srcset="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      images: [
        require("@/assets/scenic1.png"),
        require("@/assets/scenic2.png"),
        require("@/assets/scenic3.png"),
        require("@/assets/scenic4.png"),
        require("@/assets/scenic7.png"),
        require("@/assets/scenic6.png"),
        require("@/assets/scenic5.png"),
        require("@/assets/scenic8.png"),
        require("@/assets/scenic9.png"),
      ],
    };
  },
  methods: {
    goMap() {
      this.$router.push("/map?type=gugong");
    },
  },
};
</script>

<style scoped lang="less">
.home {
  background: #000;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 100px;
  .title {
    color: #fff;
    padding: 0px 37px;
    width: 100%;
    height: 218px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      font-family: PingFang SC;
      font-size: 90px;
      font-weight: 500;
      line-height: 70px;
      text-align: left;
    }
  }
  .content {
    width: 1540px;
    min-height: 100vh ;
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 510px;
      height: 900px;
      padding: 15px;
      img {
        width: 100%;
        height: 100%;
      }

    }
  }
}
</style>

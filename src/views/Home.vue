<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <div class="home">
    <div class="title">
      <div class="left">Tourism Agent</div>
      <div class="right">English</div>
    </div>
    <div class="content">
      <img src="@/assets/home1.png" alt="" srcset="" />
    </div>
    <div class="bottom">
      <div>
        <img src="@/assets/home2.png" alt="" srcset="" />
      </div>
      <div>
        <img src="@/assets/home3.png" alt="" srcset="" />
      </div>
      <div>
        <img src="@/assets/home4.png" alt="" srcset="" />
      </div>
      <div>
        <img src="@/assets/home5.png" alt="" srcset="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
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
    .right {
      font-family: PingFang SC;
      font-size: 54px;
      font-weight: 600;
      line-height: 70px;
      text-align: left;
    }
  }
  .content {
    width: 1169px;
    height: 775 px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .bottom {
    width: 1169px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    div {
      width: 562px;
      height: 775 px;
      margin-top: 45px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <div class="role">
    <img
      :src="recordImage"
      alt="Record"
      @touchstart="startLongPress"
      @touchend="stopLongPress"
      @touchcancel="stopLongPress"
      @contextmenu.prevent="disableContextMenu"
      :class="{ 'record-button': true, recording: isRecording }"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isRecording: false,
      recordImage: require("@/assets/voice-icon.png"), // 图片路径
    };
  },
  methods: {
    startLongPress(event) {
      event.preventDefault();
      this.longPressTimeout = setTimeout(() => {
        this.startRecording();
      }, 500); // 设置长按时间
    },
    stopLongPress() {
      clearTimeout(this.longPressTimeout);
      if (this.isRecording) {
        this.stopRecording();
      }
    },
    startRecording() {
      this.isRecording = true;
      console.log("开始录音...");
      // 在这里调用录音 API
    },
    stopRecording() {
      this.isRecording = false;
      console.log("录音结束");
      // 在这里结束录音并处理音频数据
    },
    disableContextMenu(event) {
      event.preventDefault();
    },
  },
};
</script>

<style scoped lang="less">
.role {
  width: 100%;
  min-height: 100vh;
  background-image: url("@/assets/role2.png");
  background-size: cover;
  background-position: bottom;
}
.recorder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.record-button {
  width: 100px;
  height: 100px;
  border-radius: 40%;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: absolute;
  left: 50%;
  top: 60%;
  -webkit-touch-callout: none; /* 禁用 iOS 的触摸调用 */
  -webkit-user-select: none; /* 禁用用户选择 */
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
}

.record-button:active {
  transform: scale(1.2);
  box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.5);
}
.recording {
  animation: pulse 1s infinite;
  transform: scale(1.2);
  box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.5);
}

@keyframes pulse {
  0% {
    transform: scale(1.2);
    box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.5);
  }
  50% {
    transform: scale(1.3);
    box-shadow: 0px 0px 30px rgba(255, 255, 255, 0.5);
  }
  100% {
    transform: scale(1.2);
    box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.5);
  }
}
</style>

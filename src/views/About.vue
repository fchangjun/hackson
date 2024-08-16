<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <div class="home">
    <AudioPlayer/>
  </div>
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer.vue'

export default {
  name: 'AboutPage',
  components: {
    AudioPlayer
  }
};
</script>

<style scoped>
.test{
  width: 375px;
  background: red;
}
</style>
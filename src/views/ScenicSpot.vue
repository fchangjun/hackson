<template>
    <div class="scenic-spot">
        <div class="scenic-spot_bg">
            <WebCamUI v-if="false" ref="webcam" :fullscreenState="false"  @photoTaken="photoTaken" />
            <input type="file" @change="onFileChange">
        </div>
        <div class="scenic-spot_chat-container">
            <div class="scenic-spot_chat-user">
                <img src="@/assets/location2.png" alt="" srcset="">
            </div>
            <div class="scenic-spot_chat-list">
                <div :class='["scenic-spot_chat-block", {"animate": loading}]'>
                    {{ imageDesc }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { WebCamUI } from 'vue-camera-lib';
import cache from '@/util/cache';
const file2Base64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default {
    name: 'ScenicSpot',
    components: { WebCamUI },
    data() {
        return {
            imageDesc: '请耐心等待，我正在帮你快速扫描中……',
            loading: true
        }
    },
    methods: {
        photoTaken(data) {
            console.log('image blob: ', data.blob)
            console.log('image data url', data.image_data_url)
        },
        async onFileChange(e) {
            const file = e.target.files[0];
            let base64String = await file2Base64(file);
            if (base64String.indexOf('base64,') > -1) {
                base64String = base64String.split(',')[1];
            }
            const data = await axios.post("/image_to_text", {
                prompt: "你是一个文物鉴赏家，用中文详细描述这幅图像包含的文物？",
                image: base64String
            });

            const desc = await axios.get('/api/v1/trans/text', {
                params: {
                    q: data.data.result,
                    from: 'en',
                    to: 'zh',
                },
            });
            this.imageDesc = desc; //data.data.result;
            this.loading = false;
        }
    },
    mounted() {
      console.log(3333)
      console.log(cache.get('file'))
    }
}
</script>
<style lang="less">
    .scenic-spot {
        background: #000;
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        &_bg {
            background: url(@/assets/scenic1.png) no-repeat center;
            background-size: cover;
            min-height: 100vh;
            width: 100%;
        }

        &_chat-container {
            position: fixed;
            bottom: 300px;
            display: flex;
            width: 95%;
            margin: 0 auto;
        }

        &_chat-user {
            flex-basis: 1;
            flex-shrink: 0;
            img {
                max-width: 155px;
                max-height: 200px;
            }
        }

        &_chat-list {
            flex-shrink: 1;
            flex: 1;
            margin-left: 20px;
        }

        &_chat-block {
            padding: 30px 20px;
            background: rgba(255, 255, 255, 0.35);
            color: #fff;
            font-family: PingFang SC;
            font-size: 48px;
            font-weight: 400;
            line-height: 48px;
            text-align: left;
            border-radius: 10px 50px 50px 50px;
        }

        &_chat-block.animate {
            animation: zoomInOut 2s infinite alternate;  
        }
    }

    @keyframes zoomInOut {  
        0% {  
            transform: scale(1); /* 初始状态，放大比例为1 */  
        }  
        50% {  
            transform: scale(1.02); /* 中间状态，放大比例为1.5 */  
        }  
        100% {  
            transform: scale(1); /* 结束状态，回到初始放大比例 */  
        }  
    } 
</style>
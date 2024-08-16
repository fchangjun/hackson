<template>
    <div class="scenic-spot">
        <div class="scenic-spot_bg">
            <WebCamUI v-if="false" ref="webcam" :fullscreenState="false"  @photoTaken="photoTaken" />
            <input style="display: none;" ref="inputFile" type="file" @change="onFileChange">
            <div class="camera" @click="onCameraClick">
                <img src="@/assets/file-icon.png" alt="" srcset="">
            </div>
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
import cache from '@/util/cache';
import axios from 'axios';
import { WebCamUI } from 'vue-camera-lib';
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
            imageDesc: '有什么需要帮忙的吗？',
            loading: false
        }
    },
    methods: {
        photoTaken(data) {
            console.log('image blob: ', data.blob)
            console.log('image data url', data.image_data_url)
        },
        onCameraClick() {
            this.$refs.inputFile.click();
        },
        async onFileChange(e) {
            if(this.loading) {
                return;
            }
            const file = e.target?.files[0];
            if(!file) {
                return;
            }
            this.analysisFile(file);
        },

        async analysisFile(file) {
            this.loading = true;
            this.imageDesc = '正在识别，请稍等...';
            let base64String = await file2Base64(file);
            if (base64String.indexOf('base64,') > -1) {
                base64String = base64String.split(',')[1];
            }
            try {
                const data = await axios.post("/image_to_text", {
                    prompt: "你是一个文物鉴赏家，详细描述这幅图像包含的文物？",
                    image: base64String
                });

                const desc = await axios.get('/api/v1/trans/text', {
                    params: {
                        q: data.data.result,
                        from: 'en',
                        to: 'zh',
                    },
                });
                this.imageDesc = desc.data.result[0].dst; //data.data.result;
            } catch (e) {
                this.imageDesc = '识别失败，请重试';
                return;
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        const file = cache.get('file');
        if (file) {
            this.analysisFile(file);
        }
    },
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
            background: rgba(0, 0, 0, 0.45);
            color: #fff;
            font-family: PingFang SC;
            font-size: 48px;
            font-weight: 400;
            line-height: 60px;
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

    .camera {
        margin: 40px;
        img {
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            width: 120px;
            height: 120px;
        }
    }
</style>
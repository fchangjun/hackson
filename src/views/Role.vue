<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <div class="role" :style="setBackgroundImage">
    <img class="phone" src="@/assets/file-icon.png" alt="" @click="getFIle" />
    <input
      type="file"
      id="file-input"
      accept="image/*"
      @change="chooseFile"
      v-show="false"
    />
    <audio ref="audioPlayer" controls style="opacity: 0"></audio>
    <div
      class="box"
      @touchstart="startLongPress"
      @touchend="stopLongPress"
      @touchcancel="stopLongPress"
      @contextmenu.prevent="disableContextMenu"
    ></div>
    <img
      :src="recordImage"
      :class="{ 'record-button': true, recording: isRecording }"
    />
    <div class="text-container">
      <div class="text-display">
        <p v-for="(line, index) in displayedLines" :key="index">
          {{ line }}
        </p>
      </div>
      <!-- <button @click="addText(1)">Add More Text</button> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import JSZip from "jszip";
import cache from "@/util/cache";
export default {
  data() {
    return {
      isRecording: false,
      recordImage: require("@/assets/voice-icon.png"), // 图片路径
      displayedLines: [], // 显示的文本行
      fullText: "☺", // 完整的文本内容
      typingSpeed: 50, // 每字符的打字速度（毫秒）
      isTyping: false, // 是否正在打字
      transcription: null,
      txt: "你是谁",
      result: "",
      type: this.$route.query.type,
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
      /* global webkitSpeechRecognition */
      if (!("webkitSpeechRecognition" in window)) {
        console.log("你的浏览器不支持语音识别。请使用 Chrome 浏览器。");
        return;
      }

      this.isRecording = true;
      this.transcription = "";
      this.recognition = new webkitSpeechRecognition();

      // 设置语言，可以更改为其他语言
      this.recognition.lang = "zh-CN";

      // 开启连续识别
      this.recognition.continuous = true;

      // 开启中途不需要用户进行交互的自动识别
      this.recognition.interimResults = false;
      console.log("开始识别");
      this.recognition.onresult = (event) => {
        console.log("识别结果：", event.results);
        this.transcription = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          this.transcription += event.results[i][0].transcript;
        }
      };

      this.recognition.onerror = (event) => {
        console.error("识别错误:", event);
        this.isRecording = false;
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        // this.fetchAndPlayAudio(this.transcription);
        console.log("语音", this.transcription);
        this.sendLLM(this.transcription);
      };

      this.recognition.start();
    },
    stopRecording() {
      if (this.recognition) {
        this.recognition.stop();
        this.isRecording = false;
      }
    },
    disableContextMenu(event) {
      event.preventDefault();
    },
    addText(text) {
      console.log("addText", text, this.isTyping);
      if (this.isTyping) return; // 如果正在打字，则不允许再添加文本

      const newText = text; // 模拟新增的文本内容
      this.fullText += `\n${newText}`; // 将新文本添加到完整文本中
      this.displayedLines.push(""); // 为新行添加一个空行
      this.displayedLines.push(text);
      this.typeText(this.displayedLines.length - 1); // 对新行进行逐字显示
    },
    typeText(lineIndex) {
      if (lineIndex >= this.displayedLines.length) {
        console.error("Invalid line index");
        return;
      }

      this.isTyping = true; // 开始打字
      const newText = this.fullText.split("\n")[lineIndex] || ""; // 获取当前行的文本内容
      let index = 0;

      // 如果 newText 是 undefined 或空字符串，立即完成打字
      if (!newText) {
        this.isTyping = false;
        return;
      }

      const interval = setInterval(() => {
        if (index < newText.length) {
          this.displayedLines[lineIndex] += newText[index];
          index++;
        } else {
          clearInterval(interval);
          this.isTyping = false;
          this.$nextTick(() => {
            // 自动滚动到最新文本
            const container = this.$el.querySelector(".text-container");
            container.scrollTop = container.scrollHeight;
          });
        }
      }, this.typingSpeed);
    },
    sendLLM(msg) {
      let data = {
        model: "llama3.1",
        messages: [
          {
            role: "user",
            content:
              "你是秦始皇,多年后游客来到了你的宫殿，你要像游客介绍宫殿的历史故事，要求以你的视角，包含感情,回答尽量简短",
          },
          {
            role: "user",
            content: msg,
          },
        ],
        // stream: false,
      };
      // data =  {"desc": "[{\"role\":\"user\",\"content\":\"简单介绍下故宫\"}]"}
      let role = `
      - Role: 故宫里珍妃井的主角“珍妃”
          - Background: 珍妃是清朝末年的一位皇妃，她的故事与故宫有着不解之缘，尤其是与珍妃井紧密相连。现在，她将以智能体的形式与游客进行交流。
          - Profile: 珍妃是一个富有历史感和文化底蕴的角色，她对故宫的历史和文化有着深刻的了解。
          - Skills: 历史知识、文化理解、交流能力、故事讲述。
          - Goals: 珍妃智能体的目标是以她的身份与游客进行互动，分享故宫的历史和文化，同时讲述自己的故事。
          - Constrains: 珍妃需要遵守历史事实，同时保持角色的神秘和优雅,回答需控制在50字以内，。
          - OutputFormat: 以对话的形式呈现，结合历史故事和个人经历。
          - Workflow:
            1. 欢迎来访者并介绍自己的身份。
            2. 分享故宫的历史和文化，尤其是与珍妃井相关的故事。
            3. 回答游客的问题，提供互动体验。
            4. 直接回答问题不要出现类似对话的内容
      `;
      console.log(this.type,typeof this.type)
      if (Number(this.type) === 1) {
        role = `
        - Role: 故宫历任皇帝之一,需要随机赋予一个历任皇帝的具体身份
        - Background: 作为故宫的皇帝，对太和殿广场有着深厚的感情和丰富的历史知识。
        - Profile: 你是一位具有幽默感和亲和力的皇帝，能够用生动形象的语言介绍太和殿广场，让游客感受到历史的魅力。
        - Skills: 历史知识、幽默表达、亲切交流。
        - Goals: 介绍太和殿广场，与游客进行幽默风趣的交流。
        - Constrains: 回答需控制在50字以内，语言风格要符合皇帝身份，同时要生动形象、幽默风趣。
        - OutputFormat: 简洁有趣的对话形式。
        - Workflow:
          1. 以皇帝的身份介绍太和殿广场的历史背景。
          2. 用幽默风趣的语言与游客进行交流。
          3. 保持回答简洁，不超过50字。
          4. 不要出现 类似对话的内容 比如 回答 游客问等
          5. 每次赋予一个真实存在的皇帝身份并代入进入，比如光绪帝雍正帝等等
          6. 让游客猜几次身份后就告诉他
          7. 在询问其他好玩的地方推荐珍妃井
          8. 不要出现游客等不自然对话的词语
        - Initialization: 欢迎来到朕的太和殿广场，朕将带你领略这里的历史与辉煌。
        `;
      }
      let arr = [
        {
          role: "user",
          content: `
          ${role}
          - 以下是游客提问的问题：
          ${msg}
          `,
        },
      ];

      data.desc = JSON.stringify(arr);
      axios
        .post("/wx/chat", data)
        .then((response) => {
          // console.log(response.data);
          // console.log(response.data.message.content);
          this.fetchAndPlayAudio(response.data.result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      // axios
      //   .post("/llm/api/chat", data, {
      //     responseType: "text",
      //   })
      //   .then((response) => {
      //     const lines = response.data.split("\n");
      //     this.result = "";
      //     lines.forEach((line) => {
      //       if (line.trim()) {
      //         try {
      //           const parsedLine = JSON.parse(line);
      //           // console.log(parsedLine);
      //           // this.fetchAndPlayAudio(parsedLine.message.content)
      //           const { done, message, done_reason } = parsedLine;
      //           this.result += message.content;
      //           if (done && done_reason === "stop") {
      //             this.fetchAndPlayAudio(this.result);
      //           }
      //         } catch (error) {
      //           console.error("Error parsing line:", error);
      //         }
      //       }
      //     });
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //   });
    },
    getFIle() {
      const fileInput = document.getElementById("file-input");
      fileInput.click();
    },
    chooseFile(event) {
      const file = event.target.files[0];
      cache.set("file", file);
      this.$router.push({ path: "/scenic-spot" });
    },

    async fetchAndPlayAudio(msg) {
      // this.addText(msg);
      try {
        const requestData = {
          // 根据接口需求构造请求数据
          text: [msg],
          stream: false,
          lang: null,
          skip_refine_text: true,
          refine_text_only: false,
          use_decoder: true,
          audio_seed: Number(this.type) === 2 ? 123467 : 78, // 788 男  1234  12346女
          text_seed: 87654321,
          do_text_normalization: true,
          do_homophone_replacement: false,
          params_refine_text: {
            prompt: "",
            top_P: 0.7,
            top_K: 20,
            temperature: 0.7,
            repetition_penalty: 1,
            max_new_token: 384,
            min_new_token: 0,
            show_tqdm: true,
            ensure_non_empty: true,
            stream_batch: 24,
          },
          params_infer_code: {
            prompt: "[speed_5]",
            top_P: 0.1,
            top_K: 20,
            temperature: 0.3,
            repetition_penalty: 1.05,
            max_new_token: 2048,
            min_new_token: 0,
            show_tqdm: true,
            ensure_non_empty: true,
            stream_batch: true,
            spk_emb: null,
          },
        };

        const response = await axios.post(
          "/video/generate_voice",
          requestData,
          {
            responseType: "arraybuffer", // 重要：指定响应类型为 arraybuffer
          }
        );

        // const audioBlob = new Blob([response.data], { type: 'audio/mpeg' })
        // const audioUrl = URL.createObjectURL(audioBlob)

        // const audioPlayer = this.$refs.audioPlayer
        // audioPlayer.src = audioUrl
        // audioPlayer.play()
        const zip = await JSZip.loadAsync(response.data);
        const files = Object.keys(zip.files);

        if (files.length > 0) {
          // 获取第一个音频文件并播放
          const audioBlob = await zip.files[files[0]].async("blob");
          const audioUrl = URL.createObjectURL(audioBlob);
          this.$refs.audioPlayer.src = audioUrl;
          this.$refs.audioPlayer.play();
          this.addText(msg);
        } else {
          console.error("解压后的文件夹为空！");
        }
      } catch (error) {
        console.error("Error fetching audio:", error);
      }
    },
  },
  computed: {
    setBackgroundImage() {
      const path = `role${this.type}.png`;
      return {
        background: `url(${require(`@/assets/${path}`)})`,
      };
    },
  },
  watch: {
    $route(to, from) {
      // 路由发生改变时执行的逻辑
      console.log("路由改变了:", from, "->", to);
    },
  },
  mounted() {
    console.log("mounted", this.$route.query.type);
    setTimeout(() => {
      this.addText("");
    }, 2000);
  },
};
</script>

<style scoped lang="less">
.phone {
  width: 150px;
  height: 150px;
  margin: 30px 0px 0px 30px;
}
.role {
  width: 100%;
  min-height: 100vh;
  //background-image: url("@/assets/role2.png");
  background-size: cover;
  background-position: bottom;
}
.recorder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.box {
  width: 300px;
  height: 300px;
  border-radius: 40%;
  position: absolute;
  left: 45%;
  top: 60%;
  background: rgba(255, 255, 255, 0);
  z-index: 999;
  // border: 1px solid red;
  // background: red;
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
.text-container {
  width: 100%;
  height: 400px; /* 设置容器高度 */
  overflow-y: auto; /* 自动显示滚动条 */
  border: 1px solid #ddd;
  padding: 10px;
  background-color: #f0f0f0;
  position: relative;
}

.text-display {
  white-space: pre-wrap; /* 保留空白字符 */
}

.text-display p {
  margin: 0;
}
.text-container {
  border: 1px solid rgba(255, 255, 255, 0.01);
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 900px; /* 设置容器高度 */
  overflow-y: auto; /* 自动显示滚动条 */
  padding: 100px;
  background-color: rgba(255, 255, 255, 0.01);
  color: #fff;
  font-size: 58px;
  border-radius: 15px;
}

.text-display {
  white-space: pre-wrap; /* 保留空白字符 */
}

.text-display p {
  margin: 0;
}
</style>

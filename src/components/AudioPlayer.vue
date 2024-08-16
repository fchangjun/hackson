<template>
  <div>
    <button @click="fetchAndPlayAudio">Play Audio</button>
    <audio ref="audioPlayer" controls></audio>
    <hr />
    <h2>录音与语音识别</h2>
    <button @click="startRecording" :disabled="isRecording">开始录音</button>
    <button @click="stopRecording" :disabled="!isRecording">停止录音</button>
    <p v-if="transcription">识别结果: {{ transcription }}</p>
    <hr />
    <input type="text" v-model="txt" /> <button @click="sendLLM">ask</button>
    {{ result }}
  </div>
</template>

<script>
import axios from "axios";
import JSZip from "jszip";
export default {
  data: () => {
    return {
      isRecording: false,
      transcription: null,
      txt:'你是谁',
      result:'',
    };
  },
  methods: {
    async fetchAndPlayAudio(msg) {
      try {
        const requestData = {
          // 根据接口需求构造请求数据
          text: [msg],
          stream: false,
          lang: null,
          skip_refine_text: true,
          refine_text_only: false,
          use_decoder: true,
          audio_seed: 12345678,
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
        } else {
          console.error("解压后的文件夹为空！");
        }
      } catch (error) {
        console.error("Error fetching audio:", error);
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

      this.recognition.onresult = (event) => {
        console.log("识别结果：", event.results);
        this.transcription = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          this.transcription += event.results[i][0].transcript;
        }
      };

      this.recognition.onerror = (event) => {
        console.error("识别错误:", event.error);
        this.isRecording = false;
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        this.fetchAndPlayAudio(this.transcription);
      };

      this.recognition.start();
    },
    stopRecording() {
      if (this.recognition) {
        this.recognition.stop();
        this.isRecording = false;
      }
    },
    sendLLM() {
      const data = {
        model: "llama3.1",
        messages: [
          {
            role: "system",
            content: "你是秦始皇,多年后游客来到了你的宫殿，你要像游客介绍宫殿的历史故事，要求以你的视角，包含感情,回答尽量简短",
          },
          {
            role: "user",
            content: this.txt,
          },
        ],
        // stream: false,
      };

      // axios
      //   .post("http://localhost:11434/api/chat", data)
      //   .then((response) => {
      //     console.log(response.data);
      //     console.log(response.data.message.content);
      //     this.fetchAndPlayAudio(response.data.message.content)
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //   });
      axios
        .post("/llm/api/chat", data, {
          responseType: 'text' 
        })
        .then((response) => {
          const lines = response.data.split('\n');
         this.result = ""
        lines.forEach((line) => {
          if (line.trim()) {
            try {
              const parsedLine = JSON.parse(line);
              console.log(parsedLine);
              // this.fetchAndPlayAudio(parsedLine.message.content)
              const { done, message,done_reason } = parsedLine;
              this.result += message.content
              if(done && done_reason === 'stop') {
                this.fetchAndPlayAudio(this.result)
              } 
            } catch (error) {
              console.error('Error parsing line:', error);
            }
          }
        });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
};
</script>

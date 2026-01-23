<template>
  <div class="audio-box">
    <div class="audio-btn-box">
      <div
        class="audio-btn"
        @touchstart="startRecording"
        @touchend="stopRecording"
        @touchcancel="stopRecording"
        @mousedown="startRecording"
        @mouseup="stopRecording"
        :class="[isRecording ? 'audio-btn-recording' : '']"
      >
        <el-icon size="24" color="#ffffff">
          <Microphone />
        </el-icon>
      </div>
      <div class="audio-desc">{{ isRecording ? '松开发送' : '按住说话' }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';

const $emit = defineEmits(['audioUrl']);

const isRecording = ref(false);
const audioChunks: Blob[] = [];
let mediaRecorder: MediaRecorder | null;
let audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
let audioSource: MediaStreamAudioSourceNode | null = null;

const startRecording = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    ElMessage.error('MediaDevices not supported');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioSource = audioContext.createMediaStreamSource(stream);
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log(audioUrl);
      // const formData = new FormData();
      // formData.append('audio', audioBlob, 'audio.webm');
      // let res:any = await reqUploadFile(formData)
      // if(res.code == 200) {
      //   console.log(res.data)
      // }
      $emit('audioUrl', { url: audioUrl });
      audioChunks.length = 0; // 清空数据，准备下一次录音
      isRecording.value = false;
    };

    mediaRecorder.start();
    isRecording.value = true;
  } catch (err) {
    console.error('Error accessing media devices.', err);
  }
};

const stopRecording = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
};

onMounted(() => {});

onUnmounted(() => {
  // 清理资源，如停止录音流、释放媒体资源等
  if (audioSource) {
    audioSource.disconnect();
  }
  if (mediaRecorder) {
    mediaRecorder.stop();
    mediaRecorder.onstop = null;
    mediaRecorder.ondataavailable = null;
  }
});
</script>

<style lang="scss" scoped>
// 语音工具栏
.audio-box {
  display: flex;
  width: 100%;
  height: 160px;
  justify-content: center;
  align-items: center;

  .audio-btn-box {
    width: 200px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .audio-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-image: radial-gradient(circle, #00c5ff, #009bff);
    }

    .audio-btn-recording {
      border: 5px solid rgb(0, 179, 255);
    }

    .audio-desc {
      margin-top: 10px;
      width: 100%;
      text-align: center;
      color: #aaaaaa;
      font-size: 12px;
    }
  }
}
</style>

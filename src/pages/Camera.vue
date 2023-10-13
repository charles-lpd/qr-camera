<template>
  <div>
    <video ref="videoElement" autoplay />
    <button @click="startCamera">
      Start Camera
    </button>
    <br>
    <button @click="stopCamera">
      Stop Camera
    </button>
    <br>
    <button @click="test">
      test
    </button>
  </div>
</template>

<script setup lang='ts'>
import { BrowserMultiFormatReader } from '@zxing/library'
import { ref } from 'vue'

const codeReader = ref(new BrowserMultiFormatReader())
const videoElement = ref<HTMLVideoElement | null>(null)
const videoInput = ref<MediaStream | null>(null)

const test = () => {
  navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { exact: 'environment' },
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      frameRate: { ideal: 60, max: 120 }
    }
  }).then(res => {
    console.log(res)
  })
}
const startCamera = async () => {
  try {
    // 获取摄像头视频流
    videoInput.value = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { exact: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 60, max: 120 }
      }
    })
    console.log(videoInput.value)

    // 在 <video> 中展示视频流
    videoElement.value!.srcObject = videoInput.value

    // 开始扫描条形码和二维码
    codeReader.value.decodeFromStream(videoInput.value, videoElement.value!, (result) => {
      console.log(result)

      if (result) {
        alert(result)
        videoElement.value && videoElement.value.pause()
        codeReader.value && codeReader.value.reset()
      }
    })
  } catch (err) {
    console.error(err)
  }
}
const stopCamera = () => {
  // 停止视频流
  videoInput.value && videoInput.value.getTracks().forEach(track => track.stop())
  videoInput.value = null

  // 停止条形码和二维码扫描
  codeReader.value.stopContinuousDecode()
}
</script>

<style></style>

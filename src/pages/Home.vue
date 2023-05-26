<template>
  <div class="box">
    <button class="qr_btn" @click="isQRCamera = true">
      点击扫描二维码
    </button>
    <div class="qr_result">
      <div>
        以下是扫描结果
      </div>
      <div class="mt-5">
        二维码条内容: {{ resultText?.getText() ?? null }}
      </div>
      <div class="mt-5">
        原始字节码由条形码编码 : {{ resultText?.getRawBytes() ?? null }}
      </div>
      <div class="mt-5">
        图片中与条形码相关的点 : {{ resultText?.getResultPoints() ?? null }}
      </div>
      <div class="mt-5">
        已解码条形码格式: {{ resultText?.getBarcodeFormat() ?? null }}
      </div>
      <div class="mt-5">
        Timestamp: {{ resultText?.getTimestamp() ?? null }}
      </div>
      <div class="mt-5">
        已解码的二维码的元数据: {{ resultText?.getResultMetadata() }}
      </div>

      <div class="mt-5">
        摄像机列表: {{ cameraList.length }}
      </div>
      <div v-for="(item,index) in cameraList" :key="index" class="mt-2">
        label: {{ item.label }}
      </div>
    </div>
  </div>
  <transition name="move">
    <QRcamera
      v-if="isQRCamera"
      @cameraQRcode="cameraQRcode"
      @getCameraList="getCameraList"
      @close="isQRCamera = false" />
  </transition>
</template>

<script setup lang='ts'>
import { Result } from '@zxing/library'
import { ref } from 'vue'
import QRcamera from './QRCamera.vue'
const isQRCamera = ref(false)
const cameraList = ref<any>([])
const resultText = ref<Result | null>(null)
const cameraQRcode = (result:Result) => {
  resultText.value = result
  isQRCamera.value = false
}
const getCameraList = (list:any[]) => {
  cameraList.value = list
}
</script>

<style>
.box {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 100px;
}

.qr_result {
  width: 300px;
  margin-top: 50px;
}

.qr_result div {
  word-break: break-all;
}

.qr_btn {
  width: 200px;
  height: 60px;
  text-align: center;
  background: gray;
  color: white;
  border-radius: 20px;
}
</style>

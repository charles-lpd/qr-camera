<template>
  <div class="videoBox">
    <div v-if="loading" class="loading">
      loading...
    </div>
    <video
      id="video"
      ref="videoDom"
      class="video"
      autoplay />
    <svg class="svg" width="100%" height="100%">
      <defs>
        <mask id="myMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            style="stroke: none; fill: #ccc"
          />
          <rect
            class="rectWhite"
            width="200"
            height="200"
            x="50%"
            y="50%"
            style="fill: #000"
          />
        </mask>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        style="stroke: none; fill: rgba(0, 0, 0, 0.6); mask: url(#myMask)"
      />
    </svg>
  </div>
</template>

<script setup lang='ts'>
import { BrowserMultiFormatReader, Result, NotFoundException, ChecksumException, FormatException } from '@zxing/library'
import { ref, onMounted, defineEmits, nextTick, onUnmounted } from 'vue'

interface Emits {
  (e: 'cameraQRcode', result:Result):void
  (e: 'getCameraList', list:any[]):void
}
const emits = defineEmits<Emits>()
const videoDom = ref<null | HTMLVideoElement>(null)
// const router = useRouter()
const decodeContinuously = (codeReader:BrowserMultiFormatReader, selectedDeviceId:string) => {
  codeReader?.decodeFromVideoDevice(
    selectedDeviceId,
    'video',
    (result, err) => {
      if (result) {
        // properly decoded qr code
        videoDom.value && videoDom.value.pause()
        emits('cameraQRcode', result)
        codeReader && codeReader.reset()
      }

      if (err) {
        console.log(err)
        // As long as this error belongs into one of the following categories
        // the code reader is going to continue as excepted. Any other error
        // will stop the decoding loop.
        //
        // Excepted Exceptions:
        //  - NotFoundException
        //  - ChecksumException
        //  - FormatException

        if (err instanceof NotFoundException) {
          console.log('No QR code found.')
        }

        if (err instanceof ChecksumException) {
          console.log(
            "A code was found, but it's read value was not valid."
          )
        }

        if (err instanceof FormatException) {
          console.log(
            'A code was found, but it was in a invalid format.'
          )
        }
      }
    }
  )
}

// 选中摄像头设备的 id
const loading = ref(false)
const selectedDeviceId = ref('')
const codeReader = ref<BrowserMultiFormatReader | null>(null)
const initCodeReader = async () => {
  // zxing 创建二维码读取器实例
  codeReader.value = new BrowserMultiFormatReader()
  codeReader.value
    ?.listVideoInputDevices()
    .then((videoInputDevices) => {
      // 筛选后置摄像头
      // alert(`拥有多少:${JSON.stringify(videoInputDevices)}`)
      // 安卓摄像头 查询有 7个后置摄像头
      // ios 查询有 1个摄像头
      const backCameras = videoInputDevices.filter(device => {
        return device.kind === 'videoinput' && device.label.toLowerCase().includes('back')
      })

      // 检查是否有 后置摄像头
      if (backCameras.length > 0) {
        if (backCameras.length >= 4) {
          selectedDeviceId.value = backCameras[2].deviceId ?? ''
        }
      } else {
        // 没有的话就取 列表中第一个
        selectedDeviceId.value = videoInputDevices[0].deviceId
      }
      // alert(`后置:${JSON.stringify(backCameras)}`)
      emits('getCameraList', videoInputDevices)
      decodeContinuously(codeReader.value as BrowserMultiFormatReader, selectedDeviceId.value)
    })
    .catch((err) => {
      console.error(err, '开启错误')
    })
}
// 进入界面就开始
onMounted(() => {
  loading.value = true
  // codeReader.value && codeReader.value.reset()
  initCodeReader()
  nextTick(() => {
    videoDom.value?.addEventListener('play', () => {
      setTimeout(() => {
        loading.value = false
      }, 500)
    })
  })
})
onUnmounted(() => {
  codeReader.value && codeReader.value.reset()
})

</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
  position: relative;
}

video {
  position: absolute;
  width: 100%;
  height: 100% !important;
  z-index: -2;
  object-fit: cover;
}

.videoBox {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.svg {
  width: 100%;
}

.svg .rectWhite {
  transform: translate(-100px, -150px)
}

.loading {
  position: fixed;
  z-index: -1;
  width: 100%;
  height: 100% !important;
  background: #9b9b9b;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

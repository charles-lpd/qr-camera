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
      <mask id="mask">
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          style="stroke: none; fill: #fff"
        />
        <rect
          width="200"
          height="200"
          x="50%"
          y="50%"
          rx="10"
          ry="10"
          transform="translate(-100, -150)"
          style="fill: #000"
        />
      </mask>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        style="stroke: none; fill: rgba(0, 0, 0, 0.6);"
        mask="url(#mask)"
      />
    </svg>
  </div>
  <div class="icon_back p-6 flex justify-center">
    <div class="absolute left-6 top-6" @click="emits('close')">
      返回
    </div> <div>扫码</div>
  </div>
</template>

<script setup lang='ts'>
import { BrowserMultiFormatReader, Result } from '@zxing/library'
import { ref, onMounted, defineEmits, onUnmounted } from 'vue'

interface Emits {
  (e: 'cameraQRcode', result:Result):void
  (e: 'getCameraList', list:any[]):void
  (e: 'close'):void
}
const emits = defineEmits<Emits>()
const videoDom = ref<null | HTMLVideoElement>(null)
const isResult = ref(false)
// const router = useRouter()
const decodeContinuously = (codeReader:BrowserMultiFormatReader, selectedDeviceId:string) => {
  codeReader?.decodeFromVideoDevice(
    selectedDeviceId,
    'video',
    (result, err) => {
      if (result) {
        // properly decoded qr code
        videoDom.value && videoDom.value.pause()
        if (!isResult.value) {
          isResult.value = true
          setTimeout(() => {
            if (isResult.value) {
              emits('cameraQRcode', result)
              codeReader && codeReader.reset()
            }
          }, 1000)
        }
      }

      // if (err) {
      //   console.log(err)
      //   // As long as this error belongs into one of the following categories
      //   // the code reader is going to continue as excepted. Any other error
      //   // will stop the decoding loop.
      //   //
      //   // Excepted Exceptions:
      //   //  - NotFoundException
      //   //  - ChecksumException
      //   //  - FormatException

      //   if (err instanceof NotFoundException) {
      //     console.log('No QR code found.')
      //   }

      //   if (err instanceof ChecksumException) {
      //     console.log(
      //       "A code was found, but it's read value was not valid."
      //     )
      //   }

      //   if (err instanceof FormatException) {
      //     console.log(
      //       'A code was found, but it was in a invalid format.'
      //     )
      //   }
      // }
    }
  )
}

// 选中摄像头设备的 id
const loading = ref(true)
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
      // alert(JSON.stringify(videoInputDevices))
      // 安卓摄像头 查询有 7个后置摄像头
      const backCameras = videoInputDevices.filter(device => {
        return device.kind === 'videoinput' && device.label.toLowerCase().includes('back')
      })

      // ios 第一次获取，获取不到摄像机，只有默认的，授权后，才能获取到 (前置和后置摄像机)，需要将后置摄像机分离出来
      const iosBackCameras = videoInputDevices.filter(device => {
        return device.kind === 'videoinput' && device.label.includes('后置')
      })
      // 检查是否有 后置摄像头
      if (backCameras.length > 0) {
        if (backCameras.length >= 4) {
          selectedDeviceId.value = backCameras[2].deviceId ?? ''
        } else {
          selectedDeviceId.value = backCameras[backCameras.length - 1].deviceId ?? ''
        }
      } else if (iosBackCameras.length > 0) {
        selectedDeviceId.value = iosBackCameras[iosBackCameras.length - 1].deviceId ?? ''
      } else {
        // 没有的话就取 列表中第一个
        selectedDeviceId.value = videoInputDevices[0].deviceId
      }
      emits('getCameraList', videoInputDevices)
      decodeContinuously(codeReader.value as BrowserMultiFormatReader, selectedDeviceId.value)
    })
    .catch((err) => {
      console.error(err, '开启错误')
    })
}
// 进入界面就开始
onMounted(() => {
  // initCodeReader()
  navigator.mediaDevices.getUserMedia({ video: true }).then(res => {
    res.getTracks().forEach(res => res.stop())
    // alert('打开摄像头')
    initCodeReader()
  }).catch(() => {
    alert('禁止打开摄像头')
    emits('close')
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

.icon_back {
  position: fixed;
  top: 0;
  left: 0;
  color: white;
  height: 100vh;
  width: 100%;
  z-index: 999999;
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

.loading {
  position: fixed;
  z-index: -3;
  width: 100%;
  height: 100% !important;
  background: #9b9b9b;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

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
          transform="translate(-100, -170)"
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
import { ref, onMounted, defineEmits, onUnmounted, defineProps } from 'vue'

interface Props {
  deviceId: string
}
const props = defineProps<Props>()
interface Emits {
  (e: 'cameraQRcode', result:Result):void
  (e: 'getCameraList', list:any[]):void
  (e: 'updatedDeviceID', device:string):void
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
      // 筛选传递 的 deviceId
      if (props.deviceId !== '') {
        const data = videoInputDevices.find(device => {
          return device.kind === 'videoinput' && device.deviceId.toLowerCase() === props.deviceId.toLowerCase()
        })
        selectedDeviceId.value = data?.deviceId ?? ''
      } else {
        /** 安卓的 imToken 无法根据 label 进行分辨 后置摄像头
       *  Video camera 1...7
       *  安卓的 Metamask 和 imToken 情况一致
       *
       * ios 的 imToken label 会出现 中文的问题,
       * 前置相机，后置相机，后置长焦相机
       *
       * ios 的 Metamask 则不会出现中文问题,
       * Front Camera, Back Camera, Back Telephoto Camera
       * 翻译后和 imToken 一致。
       *
       * bitkepp app 无法获取摄像头，无法进行判断
       *
      */
        // 判断 是否 包含 back
        const backCameras = videoInputDevices.filter(device => {
          return device.kind === 'videoinput' && device.label.toLowerCase().includes('back')
        })

        // 判断出现中文 后置相机之类
        const iosBackCameras = videoInputDevices.filter(device => {
          return device.kind === 'videoinput' && device.label.includes('后置')
        })
        /**
         *  如果 包含 back 的数组中有 并且数量 大于 4 个，那么就挑选下标为 2 的,
         *  因为在 安卓 chrome 和其他部分浏览器上会获取 四个后置摄像头。
         *  如果小于 4个 取数组中最后一个。
         *
         *  // ios 端imToken
         *  如果 包含 后置相机以及后置长焦相机，大于 0 就取 第一个。
         *
         * 如果 即不包含 "back"  也不包含 "后置"
         * 就取最后一个
         *
         */
        if (backCameras.length > 0) {
          if (backCameras.length >= 4) {
            selectedDeviceId.value = backCameras[2].deviceId ?? ''
          } else {
            selectedDeviceId.value = backCameras[backCameras.length - 1].deviceId ?? ''
          }
        } else if (iosBackCameras.length > 0) {
          selectedDeviceId.value = iosBackCameras[0].deviceId ?? ''
        } else {
        // 安卓 imToken 和 metamask 无法根据 label 进行进行判断。取最后一个后置摄像头即可
          selectedDeviceId.value = videoInputDevices[videoInputDevices.length - 1].deviceId
        }
      }

      emits('getCameraList', videoInputDevices)
      emits('updatedDeviceID', selectedDeviceId.value)
      decodeContinuously(codeReader.value as BrowserMultiFormatReader, selectedDeviceId.value)
    })
    .catch((err) => {
      console.error(err, '开启错误')
    })
}
// 进入界面就开始
onMounted(() => {
  // initCodeReader()
  navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'environment' } } }).then(res => {
    res.getTracks().forEach(res => res.stop())
    initCodeReader()
  }).catch((err) => {
    alert(`禁止打开摄像头${err}`)
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

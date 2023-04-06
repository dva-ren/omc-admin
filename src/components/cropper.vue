<script lang="ts" setup>
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'

const { onFinish } = defineProps<{
  onFinish: (url: string) => void
}>()

const showModal = ref(false)
const previews = ref({})
const cropper = ref<any>()
const message = useMessage()
const option = reactive({
  img: 'https://avatars2.githubusercontent.com/u/15681693?s=460&v=4',
  size: 1,
  full: false,
  outputType: 'png',
  canMove: true,
  fixedBox: false,
  original: false,
  canMoveBox: true,
  autoCrop: true,
  // 只有自动截图开启 宽度高度才生效
  autoCropWidth: 800,
  autoCropHeight: 450,
  centerBox: true,
  high: true,
  max: 99999,
})
// 实时预览函数
function realTime(data) {
  previews.value = data
}
const fixedNumber = [16, 9]
const fixed = ref(false)

const onPositiveClick = () => {
  cropper.value!.getCropBlob(async (data: Blob) => {
    try {
      const res = await upload('/pictures', data)
      onFinish(`https://image.dvaren.xyz/${res.name}`)
      message.success('上传成功')
      return true
    }
    catch {
      message.error('上传失败')
    }
  })
  return false
}
const onNegativeClick = () => {
  showModal.value = false
}
const imageChange = (e: Event) => {
  const file = e.target.files[0] as File
  const fileReader = new FileReader()
  fileReader.onload = (e) => {
    option.img = e.target.result
  }
  fileReader.readAsDataURL(file)
}
</script>

<template>
  <n-button text @click="() => showModal = true">
    裁剪上传
  </n-button>
  <n-modal
    v-model:show="showModal"
    style="height: 100vh;width: 100vw;"
    :mask-closable="false"
    preset="dialog"
    title="编辑"
    positive-text="完成"
    negative-text="取消"
    @positive-click="onPositiveClick"
    @negative-click="onNegativeClick"
    @after-leave="onNegativeClick"
  >
    <div w-80vw h-80vh>
      <VueCropper
        ref="cropper" :img="option.img" :output-size="option.size" :output-type="option.outputType" :info="true" :full="option.full" :fixed="fixed" :fixed-number="fixedNumber"
        :can-move="option.canMove" :can-move-box="option.canMoveBox" :fixed-box="option.fixedBox" :original="option.original"
        :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight" :center-box="option.centerBox"
        :high="option.high" mode="contain"
        :can-scale="true"
        :max-img-size="option.max" @real-time="realTime"
      />
      <input type="file" multiple @change="imageChange">
      <!-- <n-button @click="">
        重新选择
      </n-button> -->
    </div>
  </n-modal>
</template>

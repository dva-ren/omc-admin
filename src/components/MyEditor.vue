<script lang="ts" setup>
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import type { ExposeParam } from 'md-editor-v3'
import { isDark } from '~/composables'
import { upload } from '~/composables/upload'

const { modelValue } = defineProps<{ modelValue: string }>()
const emits = defineEmits(['update:modelValue', 'onClose'])
const editorRef = ref<ExposeParam>()
const message = useMessage()

const preview = ref(false)

const handleUploadImg = (files: Array<File>, callback: Function) => {
  const uploadList: Array<Promise<any>> = []

  files.forEach((f) => {
    uploadList.push(upload('/ohmycat/pictures', f))
  })
  Promise.all(uploadList).then((result) => {
    message.success('上传成功')
    callback(result.map(r => `${r.url}?x-oss-process=image/resize,w_800`))
  })
}
const onChange = (s: string) => {
  emits('update:modelValue', s)
}
const handleSave = () => {
}
const switchPreview = () => {
  preview.value = !preview.value
  editorRef.value?.togglePreview(preview.value)
}
onMounted(() => {
  if (window.innerWidth < 600) {
    preview.value = false
    editorRef.value?.togglePreview(false)
  }
})
</script>

<template>
  <div w-full bg-white dark:bg-black>
    <h3 text-black dark:text-white pl-2>
      Markdown编辑器
    </h3>
    <MdEditor
      ref="editorRef"
      :model-value="modelValue"
      :theme="isDark ? 'dark' : 'light'"
      style="height: calc(100vh-10rem);"
      :preview="preview"
      @change="onChange"
      @on-upload-img="handleUploadImg"
      @save="handleSave"
    />
    <n-space p-4 justify="end">
      <n-button strong secondary type="success" @click="switchPreview">
        {{ preview ? '关闭' : '打开' }}预览
      </n-button>
      <n-button strong type="success" @click="emits('onClose')">
        完成
      </n-button>
    </n-space>
  </div>
</template>

<style scoped>
:deep(.md-editor-dark) {
  --md-bk-color: transparent;
}
:deep(.md-editor-dark blockquote) {
  background-color: rgba(224,224,224,0.1) ;
}
</style>

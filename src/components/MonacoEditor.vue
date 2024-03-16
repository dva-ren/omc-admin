<script setup lang="ts">
import { defineProps, nextTick, onMounted, ref } from 'vue'
import { editor as monacoEditor } from 'monaco-editor/esm/vs/editor/editor.api'
// import { initMonaco } from '../monaco/setup'
import '../monaco/worker'
const props = defineProps<{
  onChange?: (value: string) => any
  initialValue?: string
  config?: monacoEditor.IStandaloneEditorConstructionOptions
}>()

const container = ref<null | HTMLElement>(null)
onMounted(() => {
  nextTick(() => {
    const editor = monacoEditor.create(container.value!, {
      value: props.initialValue,
      ...props.config,
    })
    editor.onDidChangeModelContent(() => {
      (props.onChange || (() => {}))(editor.getValue())
    })
    watchEffect(() => {
      editor.setValue(props.initialValue || '')
    })
  })
})
</script>

<template>
  <div id="container" ref="container" style="height: 100%" />
</template>

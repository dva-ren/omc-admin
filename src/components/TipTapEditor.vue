<script setup>
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
  ],
})
</script>

<template>
  <EditorContent :editor="editor" />
</template>

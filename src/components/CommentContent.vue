<script lang="ts" setup>
import type { CommentModel } from '~/models'
import { CommentState } from '~/models'
import { CommentEvent } from '~/types'
const props = defineProps<{
  comment: CommentModel
  onActive: (e: CommentEvent) => void
}>()
</script>

<template>
  <div>
    <div>9天前 于 <Link :to="props.comment.ref.slug" :text="props.comment.ref.title" /></div>
    <div my-1>
      {{ props.comment.text }}
    </div>
    <div flex gap-2>
      <n-button v-if="comment.state !== CommentState.Read" size="tiny" quaternary type="primary" @click="props.onActive(CommentEvent.read)">
        已读
      </n-button>
      <n-button v-if="comment.state !== CommentState.Junk" size="tiny" quaternary type="warning" @click="props.onActive(CommentEvent.junk)">
        垃圾
      </n-button>
      <n-button size="tiny" quaternary type="info" @click="props.onActive(CommentEvent.reply)">
        回复
      </n-button>
      <n-button size="tiny" quaternary type="error" @click="props.onActive(CommentEvent.delete)">
        删除
      </n-button>
    </div>
  </div>
</template>

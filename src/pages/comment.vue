<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { NButton, NGradientText, NPopconfirm } from 'naive-ui'
import type { Comment, Note } from '~/types'

import { changeCommentStatus, deleteComment, queryComment } from '~/api'

import { dateFns, emptyValue } from '~/composables'
const route = useRoute()
const router = useRouter()
const comments = ref<Array<Comment>>([])
const loadding = ref(true)
const pagination = reactive({ pageSize: 20 })
const message = useMessage()
const status = computed(() => Number(route.query.status) || 0)
const processing = ref(false)
const view = reactive({
  visible: false,
  comment: {} as Comment,
})

const getComments = async () => {
  loadding.value = true
  const res = await queryComment(status.value)
  comments.value = res.data.list
  loadding.value = false
}
watch(status, () => {
  getComments()
}, { immediate: true })

const rowKey = (row: Note) => row.id

const handleDelete = async () => {
  processing.value = true
  const res = await deleteComment(view.comment.id)
  if (res.code === 200) {
    message.success('删除成功')
    view.visible = false
    getComments()
  }
  else {
    message.error('未知错误，删除失败')
  }
  processing.value = false
}
const handleView = (row: Comment) => {
  view.visible = true
  view.comment = row
}
const handleUpdateValue = (value: string) => {
  router.push(`/comment?status=${value}`)
}
const updateStatus = async (status: number) => {
  processing.value = true
  const res = await changeCommentStatus(view.comment.id, status)
  if (res.code === 200) {
    message.success('操作成功')
    view.visible = false
  }
  else { message.success('操作失败') }
  processing.value = false
  getComments()
}
const createColumns = (): DataTableColumns<Comment> => [
  {
    type: 'selection',
  },
  {
    title: '作者',
    key: 'author',
    width: 80,
    render: (row) => {
      if (row.url) {
        return h(
          'a',
          {
            href: row.url,
            target: '_blank',
            class: 'link',
          },
          { default: () => row.author },
        )
      }
      return row.author
    },
  },

  {
    title: '评论内容',
    key: 'content',
    width: 300,
    render(row) {
      if (row.isWhispers) {
        return h(
          NGradientText,
          {
            type: 'info',
          },
          {
            default: () => row.content,
          },
        )
      }
      else { return row.content }
    },
  },
  {
    title: '评论于',
    width: 80,
    key: 'createTime',
    render: row => dateFns(row.createTime).fromNow(),
  },
  {
    title: 'ip归属',
    width: 80,
    key: 'location',
    render: row => row.location || '-',
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    width: 60,
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          secondary: true,
          size: 'tiny',
          type: 'primary',
          onClick: () => handleView(row),
        },
        { default: () => '查看' },
      )
    },
  },
]
</script>

<template>
  <div>
    <div pb-4 text-xl font-bold>
      评论
    </div>
    <n-tabs
      ref="tabsRef"
      :value="status"
      type="line"
      p-2
      @update:value="handleUpdateValue"
    >
      <n-tab name="0">
        未读
      </n-tab>
      <n-tab name="1">
        已读
      </n-tab>
      <n-tab name="2">
        垃圾箱
      </n-tab>
    </n-tabs>
    <n-data-table
      remote
      size="small"
      :columns="createColumns()"
      :data="comments"
      :pagination="pagination"
      :max-height="250"
      :row-key="rowKey"
      :loading="loadding"
      row-class-name="table-row"
    />
    <n-modal
      v-model:show="view.visible"
      :mask-closable="false"
      preset="card"
      max-w-160
      title="查看评论"
    >
      <n-descriptions label-placement="left" :column="2">
        <n-descriptions-item label="作者">
          {{ view.comment.author }}
        </n-descriptions-item>
        <n-descriptions-item label="邮箱">
          {{ emptyValue(view.comment.mail) }}
        </n-descriptions-item>
        <n-descriptions-item label="网站">
          {{ emptyValue(view.comment.url) }}
        </n-descriptions-item>
        <n-descriptions-item label="评论时间">
          {{ view.comment.createTime }}
        </n-descriptions-item>
        <n-descriptions-item label="IP">
          {{ view.comment.sendIp }}
        </n-descriptions-item>
        <n-descriptions-item label="位置">
          {{ emptyValue(view.comment.location) }}
        </n-descriptions-item>
        <n-descriptions-item label="悄悄话">
          {{ view.comment.isWhispers ? '是' : '否' }}
        </n-descriptions-item>
        <n-descriptions-item label="评论类型">
          {{ view.comment.refType }}
        </n-descriptions-item>
        <n-descriptions-item label="评论内容" :span="3">
          {{ view.comment.content }}
        </n-descriptions-item>
      </n-descriptions>
      <n-space mt-4 justify="space-between">
        <NPopconfirm
          @positive-click="handleDelete"
        >
          <template #trigger>
            <NButton strong secondary type="error" :loading="processing">
              删除
            </NButton>
          </template>
          确定删除吗？
        </NPopconfirm>
        <n-space>
          <NButton v-if="view.comment.status !== 1" strong secondary type="success" :loading="processing" @click="updateStatus(1)">
            已读
          </NButton>
          <NButton v-if="view.comment.status !== 2" strong secondary type="warning" :loading="processing" @click="updateStatus(2)">
            垃圾评论
          </NButton>
        </n-space>
      </n-space>
    </n-modal>
  </div>
</template>

<style scoped>
:deep(.link){
  transition: color .1s;
  color: rgba(24,160,88,0.8);
}
:deep(.link:hover){
  color: rgba(24,160,88,1);
}
</style>

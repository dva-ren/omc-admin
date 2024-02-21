<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { NAvatar, NSpace } from 'naive-ui'
// import IpInfo from '~/components/IpInfo.vue'
import { deleteComment, getRecentlyComments, modifyCommentState } from '~/api'
// import { dateFns, emptyValue } from '~/composables'
import type { CommentModel } from '~/models'
import { CommentState } from '~/models'
import MCommentContent from '~/components/CommentContent.vue'
import MLink from '~/components/Link.vue'
import { CommentEvent } from '~/types'

const route = useRoute()
const router = useRouter()
const comments = ref<Array<CommentModel>>([])
const loadding = ref(true)

const pagination = reactive({
  page: 1,
  pageSize: 15,
  showSizePicker: true,
  pageSizes: [15, 20, 50],
  itemCount: 0,
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
  prefix: () => `共${pagination.itemCount}条记录`,
})

const message = useMessage()
const state = computed(() => Number(route.query.state) || 0)
const processing = ref(false)

const getComments = async () => {
  loadding.value = true
  const res = await getRecentlyComments({
    page: pagination.page,
    size: pagination.pageSize,
    state: state.value,
  })
  comments.value = res.data
  pagination.itemCount = res.pagination.total
  loadding.value = false
}
watch(state, () => {
  pagination.page = 1
  pagination.pageSize = 15
  getComments()
}, { immediate: true })

const rowKey = (row: CommentModel) => row.id

const handleDelete = async (id: string) => {
  processing.value = true
  await deleteComment(id)
  message.success('删除成功')
  getComments()
  processing.value = false
}

const handleUpdateValue = (value: string) => {
  router.push(`/comment?state=${value}`)
}
const updateStatus = async (comment: CommentModel, state: CommentState) => {
  if (comment.state === state)
    return
  processing.value = true
  await modifyCommentState(comment.id, { state })
  message.success('操作成功')
  processing.value = false
  getComments()
}

const createColumns = (): DataTableColumns<CommentModel> => [
  {
    type: 'selection',
  },
  {
    key: 'avatar',
    render: row => h(NAvatar, {
      src: row.avatar,
      round: true,
    }),
    width: 60,
  },
  {
    key: 'author',
    title: '作者',
    render: row => [
      h(NSpace, { vertical: true, size: 'small' }, {
        default: () => [
          h(MLink, {
            to: row.url,
            text: row.author,
          }),
          h(MLink, {
            to: `mailto:${row.mail}`,
            text: row.mail,
          }),
          h('span',
            {
              className: 'ml-1 text-gray-500',
            }, { default: () => row.ip }),
        ],
      }),
    ],
  },
  {
    key: 'content',
    title: '内容',
    render: row => [
      h(MCommentContent, {
        comment: row,
        onActive: (e) => {
          switch (e) {
            case CommentEvent.reply:
              break
            case CommentEvent.junk:
              updateStatus(row, CommentState.Junk)
              break
            case CommentEvent.delete:
              handleDelete(row.id)
              break
            case CommentEvent.read:
              updateStatus(row, CommentState.Read)
              break
          }
        },
      }),
    ],
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
      :value="state"
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
      :row-key="rowKey"
      :loading="loadding"
      row-class-name="table-row"
    />
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

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { NAvatar, NSpace } from 'naive-ui'
// import IpInfo from '~/components/IpInfo.vue'
import { Trash } from '@vicons/ionicons5'
import { deleteComment, deleteComments, getRecentlyComments, masterReplyComment, modifyCommentState } from '~/api'
// import { dateFns, emptyValue } from '~/composables'
import type { CommentModel } from '~/models'
import { CommentState } from '~/models'
import MCommentContent from '~/components/CommentContent.vue'
import MLink from '~/components/Link.vue'
import { CommentEvent } from '~/types'

const route = useRoute()
const router = useRouter()
const checkedRowKeys = ref<Array<string>>([])

const pagination = reactive({
  page: 1,
  pageSize: 15,
  showSizePicker: true,
  pageSizes: [15, 20, 50],
  itemCount: 0,
  prefix: () => `共${pagination.itemCount}条记录`,
})

const message = useMessage()
const state = computed(() => Number(route.query.state) || 0)
const processing = ref(false)
const { data: comments, refresh, loading } = useAsyncData(async () => {
  const res = await getRecentlyComments({
    page: pagination.page,
    size: pagination.pageSize,
    state: state.value,
  })
  pagination.itemCount = res.pagination.total

  return res.data
})
const showReplyModal = ref(false)
const replyForm = reactive({
  id: '',
  text: '',
  name: '',
})

const rowKey = (row: CommentModel) => row.id

const handleDelete = async (id: string) => {
  processing.value = true
  await deleteComment(id)
  message.success('删除成功')
  refresh()
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
  refresh()
}

watch(state, refresh)

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
              replyForm.id = row.id
              replyForm.name = row.author
              showReplyModal.value = true
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

async function handleDeleteComments() {
  if (checkedRowKeys.value.length === 0)
    return
  await deleteComments(checkedRowKeys.value)
  message.success('删除成功')
  refresh()
}

async function replyFormSubmit() {
  if (!replyForm.text) {
    message.warning('请输入回复内容')
    return false
  }
  await masterReplyComment(replyForm.id, {
    text: replyForm.text,
  })
  message.success('回复成功')
}

function onPageChange(page: number) {
  pagination.page = page
  refresh()
}
function onPageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize
  pagination.page = 1
  refresh()
}
</script>

<template>
  <div>
    <div pb-4 text-xl font-bold flex justify-between min-h-10>
      <div>
        评论
      </div>
      <NButton v-if="checkedRowKeys.length" type="error" circle size="large" :loading="loading" :disabled="loading" @click="handleDeleteComments">
        <template #icon>
          <n-icon><Trash /></n-icon>
        </template>
      </NButton>
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
      v-if="comments"
      v-model:checked-row-keys="checkedRowKeys"
      remote
      size="small"
      :columns="createColumns()"
      :data="comments"
      :pagination="pagination"
      :row-key="rowKey"
      :loading="loading"
      :on-page-change="onPageChange"
      :on-page-size-change="onPageSizeChange"
      row-class-name="table-row"
    />
    <n-modal
      v-model:show="showReplyModal"
      preset="dialog"
      style="width: 600px"
      :title="`回复${replyForm.name}`"
      positive-text="回复"
      negative-text="取消"
      @positive-click="replyFormSubmit"
    >
      <n-input v-model:value="replyForm.text" type="textarea" />
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

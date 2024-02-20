<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { NButton, NGradientText, NImage, NPopconfirm } from 'naive-ui'
import IpInfo from '~/components/IpInfo.vue'
import { deleteComment, getRecentlyComments, modifyCommentState } from '~/api'
import { dateFns, emptyValue } from '~/composables'
import type { CommentModel } from '~/models'

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
const view = reactive({
  visible: false,
  comment: {} as CommentModel,
})

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

const handleDelete = async () => {
  processing.value = true
  await deleteComment(view.comment.id)
  message.success('删除成功')
  getComments()
  view.visible = false
  processing.value = false
}

const handleUpdateValue = (value: string) => {
  router.push(`/comment?state=${value}`)
}
const updateStatus = async (state: number) => {
  processing.value = true
  await modifyCommentState(view.comment.id, { state })
  message.success('操作成功')
  view.visible = false
  processing.value = false
  getComments()
}
const createColumns = (): DataTableColumns<CommentModel> => [
  {
    type: 'selection',
  },
  {
    key: 'avatar',
    render: row => h(NImage, {
      src: row.avatar,
      style: 'width: 30px; height: 30px; border-radius: 50%;',
    }),
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
    <n-modal
      v-model:show="view.visible"
      :mask-closable="false"
      preset="card"
      max-w-160
      title="查看评论"
    >
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
          <NButton v-if="view.comment.state !== 1" strong secondary type="success" :loading="processing" @click="updateStatus(1)">
            已读
          </NButton>
          <NButton v-if="view.comment.state !== 2" strong secondary type="warning" :loading="processing" @click="updateStatus(2)">
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

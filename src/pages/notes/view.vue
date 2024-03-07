<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { NButton, NIcon, NPopconfirm, NSpace } from 'naive-ui'
import { EyeOff, Lock } from '@vicons/tabler'
import Link from '~/components/Link.vue'
import type { NoteModel } from '~/models'
import { deleteNote, getNoteList } from '~/api'
import { dateFns, emptyValue, isOutOfDate } from '~/composables'
import { useMasterStore } from '~/store'

const masterStore = useMasterStore()
const pagination = reactive({
  page: 1,
  pageSize: 15,
  showSizePicker: true,
  pageSizes: [15, 20, 30],
  itemCount: 0,
  prefix: () => `共${pagination.itemCount}条记录`,
})
const message = useMessage()
const router = useRouter()

const { data: notes, loading, refresh } = useAsyncData(async () => {
  const res = await getNoteList(pagination.page, pagination.pageSize)
  pagination.itemCount = res.pagination.total
  return res.data
})

function onPageChange(page: number) {
  pagination.page = page
  refresh()
}
function onPageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize
  pagination.page = 1
  refresh()
}

const rowKey = (row: NoteModel) => row.id

const handleDelete = async (row: NoteModel) => {
  await deleteNote(row.id)
  message.success('删除成功')
  refresh()
}

const createColumns = (): DataTableColumns<NoteModel> => [
  {
    type: 'selection',
  },
  {
    key: 'status',
    width: 30,
    render: row => [
      row.hide
        ? h(NIcon, {
          component: EyeOff,
          size: 15,
          color: 'green',
        })
        : '',
      row.secret
        ? !isOutOfDate(row.secret)
            ? h(NIcon, {
              component: Lock,
              size: 15,
              color: 'red',
            })
            : ''
        : '',
    ],

  },
  {
    title: '标题',
    key: 'title',
    width: 150,
    ellipsis: true,
    render: row => masterStore.masterInfo.url
      ? h(
        Link,
        {
          to: `${masterStore.masterInfo.url}/note/${row.nid}`,
          text: row.title,
          target: '_blank',
        },
      )
      : row.title,
  },

  {
    title: '心情',
    key: 'mood',
    width: 80,
    render: row => emptyValue(row.mood),
  },
  {
    title: '天气',
    key: 'weather',
    width: 80,
    render: row => emptyValue(row.weather),
  },
  {
    title: '位置',
    key: 'position',
    width: 80,
    render: row => emptyValue(row.location),
  },
  {
    title: '创建于',
    width: 80,
    key: 'createTime',
    render: row => dateFns(row.created).fromNow(),
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    width: 100,
    render(row) {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(NButton,
              {
                strong: true,
                secondary: true,
                size: 'tiny',
                onClick: () => {
                  router.push(`/notes/write?id=${row.id}`)
                },
                type: 'tertiary',
              },
              { default: () => '编辑' }),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDelete(row),
              },
              {
                default: () => '确认删除吗?',
                trigger: () => {
                  return h(
                    NButton,
                    {
                      strong: true,
                      secondary: true,
                      size: 'tiny',
                      type: 'error',
                    },
                    { default: () => '删除' },
                  )
                },
              }),
          ],
        },
      )
    },
  },
]
</script>

<template>
  <div>
    <div pb-4 text-xl font-bold>
      日记 · 管理
    </div>
    <n-data-table
      v-if="notes"
      remote
      size="small"
      :columns="createColumns()"
      :data="notes"
      :pagination="pagination"
      :on-update:page="onPageChange"
      :on-update:page-size="onPageSizeChange"
      :row-key="rowKey"
      :loading="loading"
      :scroll-x="100"
      row-class-name="table-row"
    />
  </div>
</template>

<style scoped>
:deep(.link){
  transition: color .1s;
  color: rgba(24,160,88,0.8);
}
:deep(.is-hide){
  color: pink;
}
:deep(.link:hover){
  color: rgba(24,160,88,1);
}
</style>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { NButton, NIcon, NPopconfirm, NSpace } from 'naive-ui'
import { EyeOff, Lock } from '@vicons/tabler'
import type { NoteModel } from '~/models'
import { deleteNote, getNoteList } from '~/api'
import { dateFns, emptyValue } from '~/composables'

const notes = ref<Array<NoteModel>>([])

const loadding = ref(true)
const pagination = reactive({
  page: 1,
  pageSize: 15,
  showSizePicker: true,
  pageSizes: [15, 20, 30],
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
const router = useRouter()

const getNotes = async () => {
  loadding.value = true
  const res = await getNoteList(pagination.page, pagination.pageSize)
  pagination.itemCount = res.pagination.total
  notes.value = res.data
  // console.log(res)
  loadding.value = false
}
watch(pagination, () => {
  getNotes()
}, { immediate: true })

const rowKey = (row: NoteModel) => row.id

function isSecret(row: NoteModel) {
  return dateFns().isBefore(dateFns(row.secret))
}

const handleDelete = async (row: NoteModel) => {
  await deleteNote(row.id)
  message.success('删除成功')
  getNotes()
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
      isSecret(row)
        ? h(NIcon, {
          component: Lock,
          size: 15,
          color: 'red',
        })
        : '',
    ],

  },
  {
    title: '标题',
    key: 'title',
    width: 150,
    ellipsis: true,
    render: row => row.title,
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
      remote
      size="small"
      :columns="createColumns()"
      :data="notes"
      :pagination="pagination"
      :row-key="rowKey"
      :loading="loadding"
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

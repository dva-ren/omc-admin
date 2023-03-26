<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { NButton, NPopconfirm, NSpace } from 'naive-ui'

import { deleteNote, queryNoteList } from '~/api'

import type { Note } from '~/types'
import { dateFns, emptyValue } from '~/composables'
import { useMainStore } from '~/store'

const notes = ref<Array<Note>>([])
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
const website = useMainStore().master.url
const router = useRouter()

const getNotes = async () => {
  loadding.value = true
  const res = await queryNoteList(pagination.page, pagination.pageSize)
  pagination.itemCount = res.data.total
  notes.value = res.data.list
  // console.log(res)
  loadding.value = false
}
watch(pagination, () => {
  getNotes()
}, { immediate: true })

const rowKey = (row: Note) => row.id

const handleDelete = async (row: Note) => {
  const res = await deleteNote(row.id)
  if (res.code === 200) {
    message.success('删除成功')
    getNotes()
  }
  else {
    message.error('未知错误，删除失败')
  }
}
const createColumns = (): DataTableColumns<Note> => [
  {
    type: 'selection',
  },
  {
    title: '标题',
    key: 'title',
    width: 150,
    ellipsis: true,
    render: (row) => {
      return h(
        'a',
        {
          href: `${website.endsWith('/') ? website : `${website}/`}notes/${row.id}`,
          target: '_blank',
          class: row.status === 1 ? 'is-hide' : 'link',
        },
        { default: () => row.title },
      )
    },
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
    render: row => emptyValue(row.position),
  },
  {
    title: '创建于',
    width: 80,
    key: 'createTime',
    render: row => dateFns(row.createTime).fromNow(),
  },
  {
    title: '最后修改',
    width: 80,
    key: 'updateTime',
    render: row => row.updateTime ? dateFns(row.updateTime).fromNow() : '-',
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

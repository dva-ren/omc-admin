<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { NButton, NPopconfirm } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { cloudApi } from '~/composables/cloud'
import type { Note } from '~/types/api'
import { dateFns, emptyValue } from '~/composables'

const notes = ref<Array<Note>>([])
const loadding = ref(true)
const pagination = reactive({ pageSize: 20 })
const message = useMessage()

const getArticles = async () => {
  loadding.value = true
  const res = await cloudApi.invokeFunction('get-notes', {})
  notes.value = res.data
  loadding.value = false
}
getArticles()

const rowKey = (row: Note) => row._id

const handleDelete = async (row: Note) => {
  const res = await cloudApi.invokeFunction('delete-data', { col: 'notes', id: row._id })
  if (res.code === 200) {
    message.success('删除成功')
    getArticles()
  }
  else {
    message.error('未知错误，删除失败')
  }
}
const createColumns = (): DataTableColumns<Note> => [
  {
    type: 'selection',
  },
  // {
  //   title: 'id',
  //   key: '_id',
  //   width: 80,
  //   ellipsis: true,
  // },
  {
    title: '标题',
    key: 'title',
    width: 200,
    ellipsis: true,
    render: (row) => {
      return h(
        RouterLink,
        {
          to: {
            path: '/notes/write',
            query: { id: row._id },
          },
          class: 'link',
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
    width: 100,
    render: row => emptyValue(row.weather),
  },
  {
    title: '位置',
    key: 'position',
    width: 100,
    render: row => emptyValue(row.position),
  },
  {
    title: '创建于',
    width: 100,
    key: 'createTime',
    render: row => dateFns(row.createTime).fromNow(),
  },
  {
    title: '最后修改',
    width: 100,
    key: 'updateTime',
    render: row => row.updateTime ? dateFns(row.updateTime).fromNow() : '-',
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    width: 60,
    render(row) {
      if (row.state === 0) {
        return h(
          NPopconfirm,
          {
            onPositiveClick: () => handleDelete(row, 1),
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
          },
        )
      }
      else {
        return h(
          NButton,
          {
            strong: true,
            secondary: true,
            size: 'tiny',
            type: 'info',
            onClick: () => handleDelete(row, 0),
          },
          { default: () => '恢复' },
        )
      }
    },
  },
]
</script>

<template>
  <div>
    <div text="18px" font-bold>
      日记 · 管理
    </div>
    <n-data-table
      remote
      size="small"
      :columns="createColumns()"
      :data="notes"
      :pagination="pagination"
      :max-height="250"
      :row-key="rowKey"
      :loading="loadding"
      row-class-name="table-row"
      width="100"
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

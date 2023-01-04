<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { NButton, NText } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { cloudApi } from '~/composables/cloud'
import type { Article } from '~/types/api'
import { dateFns } from '~/composables'

const notes = ref<Array<Article>>([])
const loadding = ref(true)
const pagination = reactive({ pageSize: 10 })

const getArticles = async () => {
  const res = await cloudApi.invokeFunction('get-notes', {})
  notes.value = res.data
  loadding.value = false
}
getArticles()

const rowKey = (row: Article) => row._id

const handleDelete = (row: Article) => {

}
const createColumns = (): DataTableColumns<Article> => [
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
    title: '分类',
    key: 'category',
    width: 80,
    render: (row, index) => row.category.name,
  },
  {
    title: '标签',
    key: 'label',
    width: 100,
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
    render: row => dateFns(row.updateTime).fromNow(),
  },
  {
    title: 'Action',
    key: 'actions',
    fixed: 'right',
    width: 60,
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          secondary: true,
          size: 'small',
          onClick: () => handleDelete(row),
          type: 'error',
        },
        { default: () => '删除' },
      )
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

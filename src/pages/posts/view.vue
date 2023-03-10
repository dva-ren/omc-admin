<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { NButton, NPopconfirm, NText } from 'naive-ui'

import { RouterLink } from 'vue-router'
import { cloudApi } from '~/composables/cloud'
import type { Article } from '~/types/api'
import { dateFns, emptyValue } from '~/composables'

const articles = ref<Array<Article>>([])
const loadding = ref(true)
const pagination = reactive({ pageSize: 20 })
const message = useMessage()

const getArticles = async () => {
  const res = await cloudApi.invokeFunction('get-article', {})
  articles.value = res.data
  loadding.value = false
}
getArticles()

const rowKey = (row: Article) => row._id

const handleDelete = async (row: Article, state: number) => {
  const res = await cloudApi.invokeFunction('delete-data', { id: row._id, col: 'article' })
  if (res.code === 200) {
    message.success('删除成功')
    getArticles()
  }
  else { message.error('删除失败') }
}
const createColumns = (): DataTableColumns<Article> => [
  {
    type: 'selection',
  },
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
            path: '/posts/write',
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
    render: row => emptyValue(row.category.name),
  },
  {
    title: '标签',
    key: 'label',
    width: 100,
    render: row => row.label || [],
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
      博文 · 管理
    </div>
    <n-data-table
      remote
      size="small"
      :columns="createColumns()"
      :data="articles"
      :pagination="pagination"
      :max-height="250"
      :row-key="rowKey"
      :loading="loadding"
      row-class-name="table-row"
      width="100"
    />
  </div>
</template>

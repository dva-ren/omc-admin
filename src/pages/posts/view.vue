<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { NButton, NIcon, NPopconfirm, NSpace } from 'naive-ui'
import { Pin } from '@vicons/tabler'
import type { PostModel } from '~/models'
import { dateFns, emptyValue, isOutOfDate } from '~/composables'
import { deletePost, getPostList } from '~/api'
import { useMasterStore } from '~/store'
import Link from '~/components/Link.vue'

const pagination = reactive({
  page: 1,
  pageSize: 15,
  showSizePicker: true,
  pageSizes: [15, 20, 50],
  itemCount: 0,
  prefix: () => `共${pagination.itemCount}条记录`,
})
const message = useMessage()
const router = useRouter()
const masterStore = useMasterStore()
const { data: articles, refresh, loading } = useAsyncData(async () => {
  const res = await getPostList(pagination.page, pagination.pageSize)
  pagination.itemCount = res.pagination.total
  return res.data
}, [])

function onPageChange(page: number) {
  pagination.page = page
  refresh()
}
function onPageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize
  pagination.page = 1
  refresh()
}

const rowKey = (row: PostModel) => row.id

const handleDelete = async (row: PostModel) => {
  await deletePost(row.id)
  message.success('删除成功')
  refresh()
}
const createColumns = (): DataTableColumns<PostModel> => [
  {
    type: 'selection',
  },
  {
    key: 'status',
    width: 20,
    render: row => [
      row.pin
        ? (!isOutOfDate(row.pin)
            ? h(NIcon, {
              component: Pin,
              size: 16,
              color: 'green',
            })
            : '')
        : '',

    ],
  },
  {
    title: '标题',
    key: 'title',
    width: 220,
    ellipsis: true,
    render: row => masterStore.masterInfo.url
      ? h(
        Link,
        {
          to: `${masterStore.masterInfo.url}/post/${row.id}`,
          text: row.title,
          target: '_blank',
        },
      )
      : row.title,
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
    render: row => row.tags,
  },
  {
    title: '置顶',
    key: 'pin',
    width: 100,
    render: row => row.pin,
  },
  {
    title: '创建于',
    width: 100,
    key: 'createTime',
    render: row => dateFns(row.created).fromNow(),
  },
  {
    title: '最后修改',
    width: 100,
    key: 'updateTime',
    render: row => row.modified ? dateFns(row.modified).fromNow() : '-',
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
                  router.push(`/posts/write?id=${row.id}`)
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
              },
            ),
          ],
        })
    },
  },
]
</script>

<template>
  <div>
    <div pb-4 text-xl font-bold>
      博文 · 管理
    </div>
    <n-data-table
      v-if="articles"
      remote
      size="small"
      :columns="createColumns()"
      :data="articles"
      :pagination="pagination"
      :on-page-change="onPageChange"
      :on-page-size-change="onPageSizeChange"
      :row-key="rowKey"
      :loading="loading"
      row-class-name="table-row"
      :scroll-x="100"
      width="100"
    />
  </div>
</template>

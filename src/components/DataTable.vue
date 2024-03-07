<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { NButton, NIcon, NSpace } from 'naive-ui'

const props = defineProps<{
  createColumns: () => DataTableColumns<any>
  getListFn?: (page?: number, size?: number) => Promise<any>
  deleteFn?: (id: string) => Promise<any>
  deleteManyFn?: (ids: string[]) => Promise<any>
}>()
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
const { data: articles, refresh, loading } = useAsyncData(async () => {
  if (!props.getListFn)
    return
  const res = await props.getListFn(pagination.page, pagination.pageSize)
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

const rowKey = (row: any) => row.id

const handleDelete = async (row: any) => {
  if (!props.deleteFn)
    return
  await props.deleteFn(row.id)
  message.success('删除成功')
  refresh()
}
</script>

<template>
  <div pb-4 text-xl font-bold flex justify-between min-h-10>
    <div>
      评论
    </div>
    <NSpace>
      删除按钮
      <NButton v-if="checkedRowKeys.length && props.deleteManyFn" type="error" circle size="large" :loading="loading" :disabled="loading" @click="handleDelete">
        <template #icon>
          <NIcon><Trash /></NIcon>
        </template>
      </NButton>
      <!-- 刷新按钮 -->
      <NButton type="success" circle size="large" :loading="loading" :disabled="loading" @click="refresh">
        <template #icon>
          <NIcon><ReloadOutline /></NIcon>
        </template>
      </NButton>
      <slot name="actions" />
    </NSpace>
    <n-data-table
      v-if="articles"
      remote
      size="small"
      :columns="createColumns()"
      :data="articles"
      :pagination="pagination"
      :on-update:page="onPageChange"
      :on-update:page-size="onPageSizeChange"
      :row-key="rowKey"
      :loading="loading"
      row-class-name="table-row"
      :scroll-x="100"
      width="100"
    />
  </div>
</template>

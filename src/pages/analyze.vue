<script lang="ts" setup>
import { ReloadOutline } from '@vicons/ionicons5'
import UaParser from 'ua-parser-js'
import type { DataTableColumns } from 'naive-ui'
import IpInfo from '~/components/IpInfo.vue'

import type { Log } from '~/types'
import { dateFns } from '~/composables'
import { queryLogList } from '~/api'

interface Logger extends Log {
  device: string
  os: string
  browser: string
  cpu: string
}
const pagination = reactive({
  page: 2,
  pageSize: 30,
  showSizePicker: true,
  pageSizes: [15, 30, 50],
  pageCount: 1,
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
})
const loading = ref(false)

const logList = ref<Logger[]>([])

const getLogs = async () => {
  const res = await queryLogList(pagination.page, pagination.pageSize)
  logList.value = res.data.list.map((log) => {
    const ua = UaParser(log.ua)
    return {
      ...log,
      browser: `${ua.browser.name || '-'} ${ua.browser.version || '-'}`,
      device: `${ua.device.vendor || '-'} ${ua.device.model || '-'} ${ua.device.type || '-'}`,
      os: `${ua.os.name || '-'} ${ua.os.version || '-'}`,
      cpu: ua.cpu.architecture || '-',
    }
  })
}
const createColumns = (): DataTableColumns<Logger> => [
  {
    title: '时间',
    key: 'createTime',
    width: 100,
    render: row => dateFns(row.createTime).format('DD/MM hh:mm'),
  },
  {
    title: 'IP',
    key: 'ip',
    width: 120,
    ellipsis: true,
    render: (row) => {
      return h(
        IpInfo,
        {
          class: 'link',
          ip: row.ip,
        },
      )
    },
  },
  {
    title: '路径',
    key: 'path',
    width: 140,
    render: row => emptyValue(row.path),
  },
  {
    title: '设备',
    key: 'device',
    width: 100,
    render: row => emptyValue(row.device),
  },
  {
    title: 'OS',
    key: 'os',
    width: 100,
    render: row => emptyValue(row.os),
  },
  {
    title: '浏览器',
    key: 'browser',
    width: 100,
    render: row => emptyValue(row.browser),
  },
  {
    title: 'UA',
    key: 'ua',
    width: 300,
    ellipsis: {
      tooltip: true,
    },
    render: row => emptyValue(row.ua),
  },
]
watch(pagination, () => {
  getLogs()
}, { immediate: true })
</script>

<template>
  <div>
    <div pb-4 text-xl font-bold flex justify-between>
      <div>
        数据
      </div>
      <div>
        <!-- 刷新按钮 -->
        <NButton type="success" circle size="large" :loading="loading" :disabled="loading" @click="getLogs">
          <template #icon>
            <n-icon><ReloadOutline /></n-icon>
          </template>
        </NButton>
      </div>
    </div>
    <n-data-table
      remote
      size="small"
      :columns="createColumns()"
      :data="logList"
      :pagination="pagination"
      :row-key="(row) => row.id"
      :loading="loading"
      row-class-name="table-row"
      :scroll-x="100"
      width="100"
    />
  </div>
</template>

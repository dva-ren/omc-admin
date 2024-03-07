<script lang="ts" setup>
import { ReloadOutline, Trash } from '@vicons/ionicons5'
import UaParser from 'ua-parser-js'
import type { DataTableColumns } from 'naive-ui'
import IpInfo from '~/components/IpInfo.vue'

// import type { Log } from '~/types'
import { dateFns } from '~/composables'
import { clearLogs, deleteLogs, queryLogs } from '~/api'
import type { LogModel } from '~/models'
// import { clearIps, queryIps, queryLogList } from '~/api'

interface Logger extends LogModel {
  device: string
  os: string
  browser: string
  cpu: string
}
const pagination = reactive({
  page: 1,
  pageSize: 30,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [15, 30, 50],
  pageCount: 1,
  prefix: () => `共${pagination.itemCount}条记录`,
})

const message = useMessage()
const ips = ref<Array<string>>([])
const searchIp = ref('')
const checkedRowKeys = ref<Array<string>>([])

const { data: logList, loading, refresh } = useAsyncData(async () => {
  const res = await queryLogs({
    page: pagination.page,
    size: pagination.pageSize,
    ip: searchIp.value === '' ? undefined : searchIp.value,
  })
  pagination.itemCount = res.pagination.total
  return res.data.map((log) => {
    const ua = UaParser(log.ua)
    return {
      ...log,
      browser: `${ua.browser.name || '-'} ${ua.browser.version || '-'}`,
      device: `${ua.device.vendor || '-'} ${ua.device.model || '-'} ${ua.device.type || '-'}`,
      os: `${ua.os.name || '-'} ${ua.os.version || '-'}`,
      cpu: ua.cpu.architecture || '-',
    }
  })
})

const handleSearch = () => {
  pagination.page = 1
  refresh()
}

const createColumns = (): DataTableColumns<Logger> => [
  {
    type: 'selection',
  },
  {
    title: '时间',
    key: 'created',
    width: 100,
    render: row => dateFns(row.created).format('MM-DD HH:mm:ss'),
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

async function handlePositiveClick() {
  await clearLogs()
  message.success('清理成功')
  refresh()
}

async function handleDelete() {
  if (checkedRowKeys.value.length === 0)
    return message.warning('请选择要删除的日志')
  await deleteLogs(checkedRowKeys.value)
  message.success('删除成功')
  checkedRowKeys.value = []
  refresh()
}

function onPageChange(page: number) {
  pagination.page = page
  refresh()
}
function onPageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize
  pagination.page = 1
  refresh()
}
</script>

<template>
  <div>
    <div pb-4 text-xl font-bold flex justify-between>
      <div>
        数据
      </div>
      <div>
        <n-space>
          <NButton v-if="checkedRowKeys.length" type="error" circle size="large" :loading="loading" :disabled="loading" @click="handleDelete">
            <template #icon>
              <n-icon><Trash /></n-icon>
            </template>
          </NButton>
          <!-- 刷新按钮 -->
          <NButton type="success" circle size="large" :loading="loading" :disabled="loading" @click="refresh">
            <template #icon>
              <n-icon><ReloadOutline /></n-icon>
            </template>
          </NButton>
        </n-space>
      </div>
    </div>
    <div flex justify-between flex-col sm:flex-row>
      <div>
        <div>近期访问ip</div>
        <n-popconfirm
          @positive-click="handlePositiveClick"
        >
          <template #trigger>
            <n-button text ml-2 text-red>
              清除全部日志
            </n-button>
          </template>
          确定清除？
        </n-popconfirm>
      </div>
      <n-input-group w-80 py-1>
        <n-input v-model:value="searchIp" :style="{ width: '18rem' }" placeholder="过滤ip" />
        <n-button type="primary" ghost @click="handleSearch">
          搜索
        </n-button>
      </n-input-group>
    </div>
    <div mb-4>
      <div v-if="ips.length" flex flex-wrap gap-1>
        <div v-for="ip in ips" :key="ip">
          <IpInfo :ip="ip" class="border border-red rounded-full " text="12px" p-1.5 style="border: 1px solid #3333;" />
        </div>
      </div>
      <div v-else>
        暂无
      </div>
    </div>
    <n-data-table
      v-if="logList"
      v-model:checked-row-keys="checkedRowKeys"
      remote
      size="small"
      :columns="createColumns()"
      :data="logList"
      :pagination="pagination"
      :on-update:page="onPageChange"
      :on-update:page-size="onPageSizeChange"
      :row-key="(row) => row.id"
      :loading="loading"
      row-class-name="table-row"
      :scroll-x="100"
      width="100"
    />
  </div>
</template>

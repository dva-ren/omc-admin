<script lang="ts" setup>
import { ReloadOutline } from '@vicons/ionicons5'
import UaParser from 'ua-parser-js'
import type { DataTableColumns } from 'naive-ui'
import IpInfo from '~/components/IpInfo.vue'

import type { Log } from '~/types'
import { dateFns } from '~/composables'
import { clearIps, queryIps, queryLogList } from '~/api'

interface Logger extends Log {
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
const ips = ref<Array<string>>([])
const text = ref('')
const searchIp = ref('')

const getLogs = async (pageNum: number, pageSize: number) => {
  loading.value = true
  try {
    const res = await queryLogList(pageNum, pageSize, searchIp.value)
    pagination.itemCount = res.data.total
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
  finally {
    loading.value = false
  }
}

const getIps = async () => {
  const res = await queryIps()
  ips.value = res.data
}

const handleSearch = () => {
  pagination.page = 1
  text.value = text.value.trim()
  searchIp.value = text.value
  if (!searchIp.value)
    return
  getLogs(pagination.page, pagination.pageSize)
  getIps()
}

const createColumns = (): DataTableColumns<Logger> => [
  {
    title: '时间',
    key: 'createTime',
    width: 100,
    render: row => dateFns(row.createTime).format('MM-DD HH:mm:ss'),
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
watchEffect(() => {
  getLogs(pagination.page, pagination.pageSize)
  getIps()
})
const refresh = () => {
  pagination.page = 1
  getLogs(pagination.page, pagination.pageSize)
}
const handlePositiveClick = () => {
  clearIps().then((res) => {
    if (res.code === 200) {
      useMessage().success('清理成功')
      ips.value = []
    }
  })
}
</script>

<template>
  <div>
    <div pb-4 text-xl font-bold flex justify-between>
      <div>
        数据
      </div>
      <div>
        <!-- 刷新按钮 -->
        <NButton type="success" circle size="large" :loading="loading" :disabled="loading" @click="refresh">
          <template #icon>
            <n-icon><ReloadOutline /></n-icon>
          </template>
        </NButton>
      </div>
    </div>
    <div flex justify-between flex-col sm:flex-row>
      <div>
        <span>近期访问ip</span>
        <n-popconfirm
          @positive-click="handlePositiveClick"
        >
          <template #trigger>
            <n-button text ml-2 text-red>
              清除
            </n-button>
          </template>
          确定清除？
        </n-popconfirm>
      </div>
      <n-input-group w-80 py-1>
        <n-input v-model:value="text" :style="{ width: '18rem' }" placeholder="过滤ip" />
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

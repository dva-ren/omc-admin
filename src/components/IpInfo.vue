<script lang="ts" setup>
import { ipLocationCacheMap } from '~/composables'
import { queryIp } from '~/api'

const { ip } = defineProps<{ ip: string }>()
const text = ref('查询中...')

const queryIpInfo = async (show: boolean) => {
  if (!show)
    return
  let info = ipLocationCacheMap.get(ip)
  try {
    if (!info) {
      const res = await queryIp(ip)
      info = res.data
      ipLocationCacheMap.set(ip, info!)
    }
    text.value = `${info?.ipdata.info1} ${info?.ipdata.info2} ${info?.ipdata.info3} ${info?.ipdata.isp} `
  }
  catch {}
}
</script>

<template>
  <n-popover
    trigger="hover"
    :show-arrow="false"
    :on-update:show="queryIpInfo"
    :delay="500"
  >
    <template #trigger>
      <div v-bind="$attrs" text-green-6>
        {{ ip }}
      </div>
    </template>
    <div>
      {{ text }}
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import type { TabsInst } from 'naive-ui'

const tabsRef = ref<TabsInst | null>()
const route = useRoute()
const router = useRouter()
const path = computed(() => route.path)
const tabValue = ref(path.value.split('/').pop())

const handleUpdateValue = (value: string) => {
  router.replace(value)
  tabValue.value = value
}
</script>

<template>
  <div pb-4 text-xl font-bold>
    设定
  </div>
  <n-tabs
    ref="tabsRef"
    v-model:value="tabValue"
    type="line"
    px-2
    @update:value="handleUpdateValue"
  >
    <n-tab name="user">
      用户
    </n-tab>
    <n-tab name="system">
      系统
    </n-tab>
    <n-tab name="security">
      安全
    </n-tab>
    <n-tab name="keys">
      KEYS
    </n-tab>
  </n-tabs>
  <div p-4>
    <RouterView />
  </div>
</template>

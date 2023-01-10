<script lang="ts" setup>
import {
  BookOutline,
  CodeSlashOutline,
  DiscOutline,
  EyeSharp,
  SettingsOutline,
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import type { Component } from 'vue'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const list = [
  {
    title: '',
    total: '',
    edit: '',
    manage: '',
    icon: renderIcon(CodeSlashOutline),
  },
]
</script>

<template>
  <div p-2>
    <div text-xl font-bold>
      仪表盘
    </div>
    <div text-2xl py-4>
      欢迎回来
    </div>
    <div py-8>
      <div text-xl pb-2>
        登录记录
      </div>
      <div text-gray-5>
        上次登录IP: 10.10.10.10
      </div>
      <div text-gray-5>
        上次登录时间: 2023.01.10
      </div>
    </div>
    <div text-xl py-2>
      数据统计
    </div>
    <n-grid cols="1 s:3 m:4 l:5 xl:6 2xl:7" responsive="screen" :x-gap="12" :y-gap="8">
      <n-grid-item>
        <n-card title="博文" hoverable size="small">
          <template #header-extra>
            <CodeSlashOutline />
          </template>
          <div font-bold text-base p-1>
            100
          </div>
          <n-space>
            <n-button type="primary" round>
              撰写
            </n-button>
            <n-button secondary round>
              管理
            </n-button>
          </n-space>
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card title="卡片" hoverable>
          卡片内容
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

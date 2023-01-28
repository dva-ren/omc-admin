<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router'
import type { Component } from 'vue'
import { h, ref } from 'vue'
import { NIcon, dateZhCN, zhCN } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
  BarChartOutline,
  BookOutline,
  CodeSlashOutline,
  DiscOutline,
  EyeSharp,
  SettingsOutline,
} from '@vicons/ionicons5'
import {
  Hash,
  Message2,
  MessageCircle,
  Pencil,
} from '@vicons/tabler'
import { useMainStore } from './store'

const collapsed = ref(false)

;(() => {
  if (isDark)
    toggleDark(false)
  if (document.documentElement.clientWidth < 600)
    collapsed.value = true
  useMainStore().init()
})()

function renderMenuLabel(option: MenuOption) {
  if ('href' in option) {
    return h(
      RouterLink,
      { to: { path: option.href } }, { default: () => option.label },
    )
  }
  return option.label as string
}
function renderMenuIcon(option: MenuOption) {
  // 渲染图标占位符以保持缩进
  if (option.key === 'sheep-man')
    return true
  // 返回 falsy 值，不再渲染图标及占位符
  if (option.key === 'food')
    return null
  return h(NIcon, null, { default: () => h(option.icon ? option.icon : DiscOutline) })
}

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [

  {
    label: '总览',
    key: 'dashboard',
    href: '/dashboard',
    icon: renderIcon(DiscOutline),
  },
  {
    label: '博文',
    key: 'posts',
    icon: renderIcon(CodeSlashOutline),
    children: [
      {
        label: '管理',
        key: 'posts manage',
        href: '/posts/view',
        icon: renderIcon(EyeSharp),

      },
      {
        label: '撰写',
        key: 'posts write',
        href: '/posts/write',
        icon: renderIcon(Pencil),

      },
      {
        label: '分类',
        key: 'posts category',
        href: '/posts/category',
        icon: renderIcon(Hash),
      },
    ],
  },
  {
    label: '生活点滴',
    key: 'notes',
    icon: renderIcon(BookOutline),
    children: [
      {
        label: '管理',
        key: 'notes manage',
        href: '/notes/view',
        icon: renderIcon(EyeSharp),
      },
      {
        label: '撰写',
        key: 'notes write',
        href: '/notes/write',
        icon: renderIcon(Pencil),
      },
    ],
  },
  {
    label: '评论',
    key: 'comment',
    icon: renderIcon(MessageCircle),
    href: '/comment',
  },
  {
    label: '说点什么',
    key: 'says',
    icon: renderIcon(Message2),
    href: '/says',
  },
  {
    label: '数据',
    key: 'analyze',
    icon: renderIcon(BarChartOutline),
    href: '/analyze',
  },
  {
    label: '设定',
    key: 'setting',
    icon: renderIcon(SettingsOutline),
    href: '/setting/user',
  },
]
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" h-full>
    <n-message-provider>
      <main h-full>
        <n-layout has-sider h-full>
          <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            :collapsed="collapsed"
            show-trigger
            @collapse="collapsed = true"
            @expand="collapsed = false"
          >
            <div text-center p-4 style="border-bottom: 1px rgba(224, 224, 224, 0.2) solid;">
              <div font-bold select-none min-w-0>
                灰色の青
              </div>
            </div>
            <n-menu
              :collapsed="collapsed"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
              :render-label="renderMenuLabel"
            />
          </n-layout-sider>
          <n-layout py-4 px-1 sm:p-10>
            <RouterView />
          </n-layout>
        </n-layout>
      </main>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
:deep(.link){
  transition: color .1s;
  color: rgba(24,160,88,0.8);
}
:deep(.link:hover){
  color: rgba(24,160,88,1);
}
:deep(.table-row){
  font-size: 13px;
}
</style>

<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router'
import type { Component } from 'vue'
import { h, ref } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
  BookOutline,
  CodeSlashOutline,
  DiscOutline,
  EyeSharp,
  PencilSharp,

} from '@vicons/ionicons5'
import {
  Hash,
  Message2,
  Pencil,
} from '@vicons/tabler'
const collapsed = ref(false)

;(() => {
  if (isDark)
    toggleDark()
  if (document.documentElement.clientWidth < 600)
    collapsed.value = true
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
    label: '仪表盘',
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
    label: '点滴',
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
    label: '说说',
    key: 'says',
    icon: renderIcon(Message2),
    children: [
      {
        label: '管理',
        key: 'says manage',
        href: '/says/view',
        icon: renderIcon(EyeSharp),
      },
      {
        label: '撰写',
        key: 'says write',
        href: '/says/write',
        icon: renderIcon(Pencil),
      },
    ],
  },
]
</script>

<template>
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
</template>

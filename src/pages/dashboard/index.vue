<script lang="ts" setup>
import {
  BookOutline,
  BookmarksOutline,
  ChatboxEllipsesOutline,
  CodeSlashOutline,
  PeopleOutline,
} from '@vicons/ionicons5'

import { MessageReport, Messages } from '@vicons/tabler'
import { NIcon } from 'naive-ui'
import type { Component } from 'vue'
import { useMasterStore } from '~/store'

const router = useRouter()
const message = useMessage()
const masterStore = useMasterStore()
const go = (url: string | undefined) => {
  if (!url)
    return
  router.push(url)
}
const state = reactive<SystemState>({
  allComments: 0,
  categories: 0,
  comments: 0,
  link_apply: 0,
  links: 0,
  notes: 0,
  pages: 0,
  posts: 0,
  says: 0,
  recently: 0,
  unreadComments: 0,
  unreadFriends: 0,
  friends: 0,
  online: 0,
  todayMaxOnline: 0,
  todayOnlineTotal: 0,
  callTime: 0,
  uv: 0,
  todayIpAccessCount: 0,
})
interface DisplayList {
  title: string
  key: keyof SystemState
  edit?: string
  view: string
  manage?: string
  bottonText?: string
  fresh?: () => number
  icon: Component
}
const displayList: DisplayList[] = [
  {
    title: '博文',
    key: 'posts',
    edit: '/posts/write',
    view: '',
    manage: '/posts/view',
    icon: CodeSlashOutline,
  },
  {
    title: '日记',
    edit: '/notes/write',
    key: 'notes',
    view: '',
    manage: '/notes/view',
    icon: BookOutline,
  },
  {
    title: '分类',
    key: 'categories',
    edit: '',
    view: '',
    manage: '/posts/category',
    icon: BookmarksOutline,
  },
  {
    title: '说说',
    key: 'says',
    bottonText: '说点什么',
    edit: '/says',
    view: '',
    manage: '',
    icon: ChatboxEllipsesOutline,
  },
  {
    title: '全部评论',
    key: 'comments',
    edit: '',
    view: '',
    manage: '/comment',
    icon: Messages,
  },
  {
    title: '未读评论',
    key: 'unreadComments',
    bottonText: '查看',
    edit: '/comment?status=0',
    view: '',
    manage: '',
    fresh: () => state.unreadComments,
    icon: MessageReport,
  },
  {
    title: '友链',
    key: 'friends',
    bottonText: '查看',
    edit: '/friends?status=1',
    view: '',
    manage: '',
    fresh: () => state.unreadFriends,
    icon: PeopleOutline,
  },
]

const queryState = async () => {
  const res = await querySystemState()
  if (res.code !== 200) {
    message.error(res.msg)
    return
  }
  Object.assign(state, res.data)
}
queryState()
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
        上次登录IP: {{ masterStore.masterInfo.lastLoginIp }}
      </div>
      <div text-gray-5>
        上次登录时间: {{ masterStore.masterInfo.lastLoginTime }}
      </div>
    </div>
    <div text-xl py-2>
      数据统计
    </div>
    <n-grid cols="1 s:3 m:4 l:5 xl:6 2xl:7" responsive="screen" :x-gap="12" :y-gap="8">
      <n-grid-item v-for="i, idx in displayList" :key="idx">
        <n-card :title="i.title" hoverable size="small">
          <template #header-extra>
            <NIcon size="26" :component="i.icon" />
          </template>
          <div font-bold text-base p-1>
            {{ state[i.key] || 0 }}
          </div>
          <n-space>
            <n-badge v-if="i.fresh" :value="i.fresh()">
              <n-button v-if="i.edit" type="primary" round @click="go(i.edit)">
                查看
              </n-button>
            </n-badge>
            <n-button v-else type="primary" round @click="go(i.edit)">
              {{ i.bottonText || '撰写' }}
            </n-button>
            <n-button v-if="i.manage" secondary round @click="go(i.manage)">
              管理
            </n-button>
          </n-space>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

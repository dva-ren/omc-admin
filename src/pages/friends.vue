<script lang="ts" setup>
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NAvatar, NButton, NTag } from 'naive-ui'
import { Add } from '@vicons/ionicons5'
import type { Friend, FriendForm, Note } from '~/types'
import { addFriend, deleteFriend, queryFriends, updateFriend } from '~/api'
import { dateFns, emptyValue } from '~/composables'
const route = useRoute()
const router = useRouter()
const friends = ref<Array<Friend>>([])
const loading = ref(true)
const showModal = ref(false)
const message = useMessage()
const status = computed(() => Number(route.query.status) || -1)
const processing = ref(false)
const formInstRef = ref<FormInst | null>(null)

const initValue = {
  id: '',
  name: '',
  url: '',
  description: '',
  avatar: '',
  state: 0,
}

const friendForm = reactive<FriendForm>(initValue)

const getFriends = async () => {
  loading.value = true
  const res = await queryFriends(status.value)
  friends.value = res.data
  loading.value = false
}

const rowKey = (row: Note) => row.id
const resetForm = () => {
  Object.assign(friendForm, initValue)
}
const handleDelete = async (id: string) => {
  processing.value = true
  const res = await deleteFriend(id)
  if (res.code === 200) {
    message.success('删除成功')
    getFriends()
  }
  else {
    message.error('未知错误，删除失败')
  }
  processing.value = false
}
watch(status, () => {
  getFriends()
}, { immediate: true })
const onPositiveClick = async () => {
  formInstRef.value?.validate(async (errors: any) => {
    if (errors) {
      message.error('还有未填项')
    }
    else {
      try {
        loading.value = true
        if (friendForm.id) {
          const res = await updateFriend(friendForm)
          if (res.code === 200) {
            resetForm()
            message.success('修改成功')
            showModal.value = false
          }
        }
        else {
          const res = await addFriend(friendForm)
          if (res.code === 200) {
            resetForm()
            message.success('添加成功')
            showModal.value = false
          }
        }
        getFriends()
      }
      catch (e: any) {
        message.error(e)
      }
      finally {
        loading.value = false
      }
    }
  })
  return false
}
const handleUpdateValue = (value: string) => {
  router.push(`/friends?status=${value}`)
}
const getType = (state: number) => {
  switch (state) {
    case 0: return 'success'
    case 1: return 'warning'
    case 2: return 'error'
  }
}
const handleEdit = (row: Friend) => {
  friendForm.id = row.id
  friendForm.url = row.url
  friendForm.description = row.description
  friendForm.name = row.name
  friendForm.avatar = row.avatar
  friendForm.state = row.state
  showModal.value = true
}

const createColumns = (): DataTableColumns<Friend> => [
  {
    type: 'selection',
  },
  {
    title: '昵称',
    key: 'name',
    width: 80,
    render: (row) => {
      if (row.url) {
        return h(
          'a',
          {
            href: row.url,
            target: '_blank',
            class: 'link',
          },
          { default: () => row.name },
        )
      }
      return row.name
    },
  },
  {
    title: '头像',
    key: 'avatar',
    width: 80,
    render: row => h(NAvatar, { src: row.avatar, circle: true }),
  },
  {
    title: 'url',
    key: 'url',
    width: 100,
  },
  {
    title: '简介',
    key: 'description',
    width: 300,
  },
  {
    title: '状态',
    key: 'state',
    width: 80,
    render: row => h(NTag, {
      type: getType(row.state),
    },
    {
      default: () => {
        switch (row.state) {
          case 0: return '已通过'
          case 1: return '待审核'
          case 2: return '已拒绝'
        }
      },
    }),
  },
  {
    title: '申请时间',
    width: 80,
    key: 'createTime',
    render: row => dateFns(row.createTime).fromNow(),
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    width: 60,
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          secondary: true,
          size: 'tiny',
          type: 'primary',
          onClick: () => handleEdit(row),
        },
        { default: () => '编辑' },
      )
    },
  },
]

const rules = {
  name: {
    required: true,
    min: 4,
    message: '至少输入4个字符',
  },
  url: {
    required: true,
    min: 1,
    message: '至少输入一个字符',
  },
}
const onNegativeClick = () => {
  // resetForm()
  showModal.value = false
}
const options = [
  {
    label: '已通过',
    value: 0,
  },
  {
    label: '待审核',
    value: 1,
  },
  {
    label: '已删除',
    value: 2,
  },
]
</script>

<template>
  <div>
    <div pb-4 text-xl font-bold flex justify-between>
      <div>
        友链
      </div>
      <div>
        <!-- 添加按钮 -->
        <NButton type="success" circle size="large" :loading="loading" :disabled="loading" @click="showModal = !showModal">
          <template #icon>
            <n-icon><Add /></n-icon>
          </template>
        </NButton>
      </div>
    </div>
    <n-tabs
      ref="tabsRef"
      :value="status"
      type="line"
      p-2
      @update:value="handleUpdateValue"
    >
      <n-tab name="-1">
        全部
      </n-tab>
      <n-tab name="1">
        待审核
      </n-tab>
    </n-tabs>
    <n-data-table
      remote
      size="small"
      :columns="createColumns()"
      :data="friends"
      :row-key="rowKey"
      :loading="loading"
      row-class-name="table-row"
    />
    <n-modal
      v-model:show="showModal"
      :mask-closable="false"
      preset="dialog"
      title="编辑"
      positive-text="完成"
      negative-text="取消"
      @positive-click="onPositiveClick"
      @negative-click="onNegativeClick"
      @after-leave="onNegativeClick"
    >
      <n-form ref="formInstRef" :model="friendForm" :rules="rules">
        <n-form-item label="昵称" required path="author">
          <n-input v-model:value="friendForm.name" type="text" placeholder="昵称" />
        </n-form-item>
        <n-form-item label="状态" required path="state">
          <n-select v-model:value="friendForm.state" :options="options" :default-value="friendForm.state" :consistent-menu-width="false" />
        </n-form-item>
        <n-form-item label="网址" path="origin">
          <n-input v-model:value="friendForm.url" type="text" placeholder="网站地址" />
        </n-form-item>
        <n-form-item label="头像地址" path="avatar">
          <n-input v-model:value="friendForm.avatar" type="text" placeholder="头像地址" />
        </n-form-item>
        <n-form-item label="简介" required path="content">
          <n-input v-model:value="friendForm.description" type="textarea" placeholder="网站简介" />
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<style scoped>
:deep(.link){
  transition: color .1s;
  color: rgba(24,160,88,0.8);
}
:deep(.link:hover){
  color: rgba(24,160,88,1);
}
</style>

<script lang="ts" setup>
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NAvatar, NButton, NSpace, NTag } from 'naive-ui'
import { Add } from '@vicons/ionicons5'
import { dateFns } from '~/composables'
import type { LinkModel, LinkModelDto } from '~/models/link'
import { link } from '~/api'
import { useAsyncData } from '~/composables/useAsyncData'
import { LinkState, LinkStateMap } from '~/models/link'

const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const message = useMessage()
const status = computed(() => Number(route.query.status ?? 0))
const processing = ref(false)
const formInstRef = ref<FormInst | null>(null)

const initValue: LinkModelDto = {
  id: '',
  name: '',
  url: '',
  description: '',
  avatar: '',
  email: '',
  type: undefined,
  state: 0,
}

const LinkForm = reactive<LinkModelDto>(initValue)

const { data: links, loading, refresh } = useAsyncData(() => link.getLinks({
  state: status.value,
}))

const rowKey = (row: LinkModel) => row.id
const resetForm = () => {
  LinkForm.id = ''
  LinkForm.name = ''
  LinkForm.url = ''
  LinkForm.description = ''
  LinkForm.avatar = ''
  LinkForm.email = ''
  LinkForm.type = undefined
  LinkForm.state = 0
}
const handleDelete = async (id: string) => {
  processing.value = true
  await link.deleteLink(id)
  message.success('删除成功')
  refresh()
  processing.value = false
}

watch(status, () => {
  refresh()
})

const onPositiveClick = async () => {
  formInstRef.value?.validate(async (errors: any) => {
    if (errors) {
      message.error('还有未填项')
    }
    else {
      try {
        loading.value = true
        if (LinkForm.id) {
          await link.updateLink(LinkForm.id, LinkForm)
          resetForm()
          message.success('修改成功')
        }
        else {
          await link.addLink(LinkForm)
          message.success('添加成功')
        }
        showModal.value = false
        resetForm()
        refresh()
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
const handleEdit = (row: LinkModel) => {
  LinkForm.id = row.id
  LinkForm.url = row.url
  LinkForm.description = row.description
  LinkForm.name = row.name
  LinkForm.avatar = row.avatar
  LinkForm.state = row.state
  showModal.value = true
}
async function handelPass(row: LinkModel) {
  await link.approveLink(row.id)
  message.success('已通过')
  refresh()
}
const createColumns = (): DataTableColumns<LinkModel> => [
  {
    title: '头像',
    key: 'avatar',
    width: 80,
    render: row => h(NAvatar, { src: row.avatar, circle: true }),
  },
  {
    title: '名称',
    key: 'name',
    width: 80,
    render: row => row.name,
  },
  {
    title: 'url',
    key: 'url',
    width: 100,
    render: row => h(
      'a',
      {
        href: row.url,
        target: '_blank',
        class: 'link',
      },
      { default: () => row.url },
    ),
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
      default: () => LinkStateMap[row.state],
    }),
  },
  {
    title: '申请时间',
    width: 80,
    key: 'createTime',
    render: row => dateFns(row.created).fromNow(),
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    width: 80,
    render(row) {
      return h(NSpace, {

      },
      {
        default: () => [
          row.state !== LinkState.Pass
            ? h(
              NButton,
              {
                quaternary: true,
                secondary: true,
                size: 'tiny',
                type: 'primary',
                onClick: () => handelPass(row),
              },
              { default: () => '通过' },
            )
            : null,
          row.state === LinkState.Pass
            ? h(NButton,
              {
                quaternary: true,
                secondary: true,
                size: 'tiny',
                type: 'tertiary',
                onClick: () => handleEdit(row),
              },
              { default: () => '编辑' },
            )
            : null,
          h(NButton,
            {
              quaternary: true,
              secondary: true,
              size: 'tiny',
              type: 'error',
              onClick: () => handleDelete(row.id),
            },
            { default: () => '删除' },
          ),
        ],
      },
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
  showModal.value = false
}
type KeyType = keyof typeof LinkStateMap

const options = (Object.keys(LinkStateMap)).map(key => ({
  label: LinkStateMap[key as unknown as KeyType],
  value: Number(key),
}))

function handleClickAdd() {
  resetForm()
  showModal.value = true
}
</script>

<template>
  <div>
    <div pb-4 text-xl font-bold flex justify-between>
      <div>
        友链
      </div>
      <div>
        <!-- 添加按钮 -->
        <NButton type="success" circle size="large" :loading="loading" :disabled="loading" @click="handleClickAdd">
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
      <n-tab name="0">
        朋友们
      </n-tab>
      <n-tab name="1">
        待审核
      </n-tab>
    </n-tabs>
    <n-data-table
      remote
      size="small"
      :columns="createColumns()"
      :data="links?.data"
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
      <n-form ref="formInstRef" :model="LinkForm" :rules="rules">
        <n-form-item label="名称" required path="author">
          <n-input v-model:value="LinkForm.name" type="text" placeholder="昵称" />
        </n-form-item>
        <n-form-item label="状态" required path="state">
          <n-select v-model:value="LinkForm.state" :options="options" :consistent-menu-width="false" />
        </n-form-item>
        <n-form-item label="网址" path="origin">
          <n-input v-model:value="LinkForm.url" type="text" placeholder="网站地址" />
        </n-form-item>
        <n-form-item label="头像地址" path="avatar">
          <n-input v-model:value="LinkForm.avatar" type="text" placeholder="头像地址" />
        </n-form-item>
        <n-form-item label="简介" required path="content">
          <n-input v-model:value="LinkForm.description" type="textarea" placeholder="网站简介" />
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

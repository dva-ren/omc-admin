<script lang="ts" setup>
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NButton, NPopconfirm, NSpace } from 'naive-ui'
import { Add } from '@vicons/ionicons5'
import { addSay, deleteSay, querySay, querySayList, updateSay } from '~/api'

import type { Say } from '~/types'
import { dateFns, emptyValue } from '~/composables'

const says = ref<Array<Say>>([])
const loadding = ref(true)
const pagination = reactive({ pageSize: 20 })
const message = useMessage()
const showModal = ref(false)
const formInstRef = ref<FormInst | null>(null)

const sayForm = reactive({
  id: '',
  content: '',
  author: '',
  origin: '',
})

const getSays = async () => {
  loadding.value = true
  const res = await querySayList()
  says.value = res.data.list
  loadding.value = false
}
getSays()

const rowKey = (row: Say) => row.id

const handleDelete = async (row: Say) => {
  const res = await deleteSay(row.id)
  if (res.code === 200) {
    message.success('删除成功')
    getSays()
  }
  else { message.error('删除失败') }
}

const onPositiveClick = async () => {
  formInstRef.value?.validate(async (errors) => {
    if (errors) {
      message.error('还有未填项')
    }
    else {
      if (sayForm.id) {
        const res = await updateSay(sayForm.id, sayForm)
        if (res.code === 200) {
          sayForm.id = ''
          sayForm.content = ''
          sayForm.author = ''
          sayForm.origin = ''
          message.success('修改成功')
          showModal.value = false
          getSays()
        }
      }
      else {
        const res = await addSay(sayForm)
        if (res.code === 200) {
          sayForm.id = ''
          sayForm.content = ''
          sayForm.author = ''
          sayForm.origin = ''
          message.success('添加成功')
          showModal.value = false
          getSays()
        }
      }
    }
  })
  return false
}
const rules = {
  content: {
    required: true,
    min: 4,
    message: '至少输入4个字符',
  },
  author: {
    required: true,
    min: 1,
    message: '至少输入一个字符',
  },
}
const handleEdit = (row: Say) => {
  sayForm.id = row.id
  sayForm.origin = row.origin
  sayForm.author = row.author
  sayForm.content = row.content
  showModal.value = true
}
const onNegativeClick = () => {
  sayForm.id = ''
  sayForm.content = ''
  sayForm.author = ''
  sayForm.origin = ''
  showModal.value = false
}
const createColumns = (): DataTableColumns<Say> => [
  {
    type: 'selection',
  },
  {
    title: '内容',
    key: 'content',
    width: 200,
    ellipsis: true,
  },
  {
    title: '作者',
    key: 'category',
    width: 80,
    render: row => emptyValue(row.author),
  },
  {
    title: '来源',
    key: 'label',
    width: 100,
    render: row => emptyValue(row.origin),
  },
  {
    title: '创建于',
    width: 100,
    key: 'createTime',
    render: row => dateFns(row.createTime).fromNow(),
  },
  {
    title: '最后修改',
    width: 100,
    key: 'updateTime',
    render: row => row.updateTime ? dateFns(row.updateTime).fromNow() : '-',
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    width: 100,
    render(row) {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(NButton,
              {
                strong: true,
                secondary: true,
                size: 'tiny',
                onClick: () => handleEdit(row),
                type: 'tertiary',
              },
              { default: () => '编辑' }),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDelete(row),
              },
              {
                default: () => '确认删除吗?',
                trigger: () => {
                  return h(
                    NButton,
                    {
                      strong: true,
                      secondary: true,
                      size: 'tiny',
                      type: 'error',
                    },
                    { default: () => '删除' },
                  )
                },
              },
            ),
          ],
        },
      )
    },
  },
]
</script>

<template>
  <div>
    <div pb-4 text-xl flex justify-between>
      <div>
        说点什么
      </div>
      <div>
        <!-- 添加按钮 -->
        <NButton type="success" circle size="large" @click="showModal = !showModal">
          <template #icon>
            <n-icon><Add /></n-icon>
          </template>
        </NButton>
      </div>
    </div>
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
      <n-form ref="formInstRef" :model="sayForm" :rules="rules">
        <n-form-item label="作者" required path="author">
          <n-input v-model:value="sayForm.author" type="text" placeholder="谁说的呢" />
        </n-form-item>
        <n-form-item label="来源" path="origin">
          <n-input v-model:value="sayForm.origin" type="text" placeholder="出自哪里呢" />
        </n-form-item>
        <n-form-item label="内容" required path="content">
          <n-input v-model:value="sayForm.content" type="textarea" placeholder="说了点什么" />
        </n-form-item>
      </n-form>
    </n-modal>
    <n-data-table
      remote
      size="small"
      :columns="createColumns()"
      :data="says"
      :pagination="pagination"
      :row-key="rowKey"
      :loading="loadding"
      row-class-name="table-row"
      width="100"
    />
  </div>
</template>

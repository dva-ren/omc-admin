<script lang="ts" setup>
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NButton, NPopconfirm, NSpace } from 'naive-ui'
import { Add } from '@vicons/ionicons5'
import { createSay, deleteSay, getSayList, updateSay } from '~/api'
import type { CreateSayModel, SayModel } from '~/models'
import { dateFns, emptyValue } from '~/composables'

const says = ref<Array<SayModel>>([])
const loadding = ref(true)
const pagination = reactive({
  page: 1,
  pageSize: 20,
  showSizePicker: true,
  pageSizes: [20, 30, 50],
  itemCount: 0,
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
  prefix: () => `共${pagination.itemCount}条记录`,
})
const message = useMessage()
const showModal = ref(false)
const formInstRef = ref<FormInst | null>(null)
const loading = ref(false)
const sayForm = reactive<CreateSayModel & { id: string }>({
  id: '',
  text: '',
  author: '',
  source: '',
})
const resetForm = () => {
  sayForm.id = ''
  sayForm.text = ''
  sayForm.source = ''
  sayForm.author = ''
}
const getSays = async (pageNum: number, pageSize: number) => {
  loadding.value = true
  const res = await getSayList(pageNum, pageSize)
  pagination.itemCount = res.pagination.total
  says.value = res.data
  loadding.value = false
}
watchEffect(() => {
  getSays(pagination.page, pagination.pageSize)
})

const rowKey = (row: SayModel) => row.id

const handleDelete = async (row: SayModel) => {
  await deleteSay(row.id)
  message.success('删除成功')
  getSays(pagination.page, pagination.pageSize)
}

const onPositiveClick = async () => {
  formInstRef.value?.validate(async (errors) => {
    if (errors) {
      message.error('还有未填项')
    }
    else {
      try {
        loading.value = true
        if (sayForm.id) {
          await updateSay(sayForm.id, sayForm)
          message.success('修改成功')
          getSays(pagination.page, pagination.pageSize)
        }
        else {
          await createSay(sayForm)
          getSays(pagination.page, pagination.pageSize)
          message.success('添加成功')
        }
        showModal.value = false
        resetForm()
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
const rules = {
  text: {
    required: true,
    min: 4,
    message: '至少输入4个字符',
  },
}
const handleEdit = (row: SayModel) => {
  Object.assign(sayForm, row)
  showModal.value = true
}
const onNegativeClick = () => {
  resetForm()
  showModal.value = false
}
const createColumns = (): DataTableColumns<SayModel> => [
  {
    type: 'selection',
  },
  {
    title: '内容',
    key: 'text',
    width: 400,
  },
  {
    title: '作者',
    key: 'author',
    width: 60,
    render: row => emptyValue(row.author),
  },
  {
    title: '来源',
    key: 'source',
    width: 60,
    render: row => emptyValue(row.source),
  },
  {
    title: '创建于',
    width: 60,
    key: 'createTime',
    render: row => dateFns(row.created).fromNow(),
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
    <div pb-4 text-xl font-bold flex justify-between>
      <div>
        说点什么
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
        <n-form-item label="作者" path="author">
          <n-input v-model:value="sayForm.author" type="text" placeholder="谁说的呢" />
        </n-form-item>
        <n-form-item label="来源" path="origin">
          <n-input v-model:value="sayForm.source" type="text" placeholder="出自哪里呢" />
        </n-form-item>
        <n-form-item label="内容" required path="content">
          <n-input v-model:value="sayForm.text" type="textarea" placeholder="说了点什么" />
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
      :scroll-x="100"
      width="100"
    />
  </div>
</template>

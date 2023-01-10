<script lang="ts" setup>
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NButton, NPopconfirm, NSpace, useMessage } from 'naive-ui'
import { Add } from '@vicons/ionicons5'
import { addCategory, deleteCategory, queryCategoryList, updateCategory } from '~/api'
import type { Category } from '~/types'
import { dateFns } from '~/composables'

const message = useMessage()
const categories = ref<Array<Category>>([])
const loadding = ref(true)
const pagination = reactive({ pageSize: 20 })
const showModal = ref(false)
const formInstRef = ref<FormInst | null>(null)

const categoryForm = reactive({
  id: '',
  name: '',
  description: '',
})

const getCategories = async () => {
  const res = await queryCategoryList()
  categories.value = res.data
  loadding.value = false
}
getCategories()

const rowKey = (row: Category) => row.id

const handleDelete = async (row: Category) => {
  const res = await deleteCategory(row.id)
  if (res.code === 200) {
    message.success('删除成功')
    getCategories()
  }
  else { message.error(res.msg) }
}
const handleEdit = (row: Category) => {
  categoryForm.id = row.id
  categoryForm.name = row.name
  categoryForm.description = row.description
  showModal.value = true
}
const onPositiveClick = async () => {
  formInstRef.value?.validate(async (errors) => {
    if (errors) {
      message.error('还有未填项')
    }
    else {
      if (categoryForm.id) {
        const res = await updateCategory(categoryForm.id, categoryForm)
        if (res.code === 200) {
          categoryForm.id = ''
          categoryForm.name = ''
          categoryForm.description = ''
          message.success('修改成功')
          showModal.value = false
          getCategories()
        }
      }
      else {
        const res = await addCategory(categoryForm)
        if (res.code === 200) {
          categoryForm.name = ''
          categoryForm.description = ''
          message.success('添加成功')
          showModal.value = false
          getCategories()
        }
      }
    }
  })
  return false
}

const onNegativeClick = () => {
  categoryForm.id = ''
  categoryForm.name = ''
  categoryForm.description = ''
  showModal.value = false
}
const rules = {
  name: {
    key: 'a',
    required: true,
    min: 1,
    message: '至少输入一个字符',
  },
  value: {
    required: true,
    min: 1,
    message: '至少输入一个字符',
  },
}
const createColumns = (): DataTableColumns<Category> => [
  {
    type: 'selection',
  },
  {
    title: '名称',
    key: 'name',
    width: 80,
  },
  {
    title: '介绍',
    key: 'description',
    width: 80,
    ellipsis: true,
  },
  {
    title: '文章数',
    key: 'count',
    width: 80,
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
    <div pb-4 text-xl font-bold flex justify-between>
      <div>
        博文·标签/分类
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
      title="编辑分类"
      positive-text="完成"
      negative-text="取消"
      @positive-click="onPositiveClick"
      @negative-click="onNegativeClick"
      @after-leave="onNegativeClick"
    >
      <n-form ref="formInstRef" :model="categoryForm" :rules="rules">
        <n-form-item label="分类名称" required path="name">
          <n-input v-model:value="categoryForm.name" type="text" placeholder="取个名字吧" />
        </n-form-item>
        <n-form-item label="简介" required path="description">
          <n-input v-model:value="categoryForm.description" type="text" placeholder="分类介绍" />
        </n-form-item>
      </n-form>
    </n-modal>
    <n-data-table
      remote
      size="small"
      :columns="createColumns()"
      :data="categories"
      :pagination="pagination"
      :row-key="rowKey"
      :loading="loadding"
      row-class-name="table-row"
      width="100"
    />
  </div>
</template>

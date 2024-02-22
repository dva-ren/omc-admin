<script lang="ts" setup>
import type { DataTableColumns, DataTableRowKey, FormInst, UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui'
import { Add, ArchiveOutline, Trash } from '@vicons/ionicons5'
import { imageApi } from '~/api'

import { dateFns, emptyValue } from '~/composables'
import type { ImageModel } from '~/models/image'
import { useAsyncData } from '~/composables/useAsyncData'

const previewFileList = ref<UploadFileInfo[]>([])
const message = useMessage()
const showModal = ref(false)
const formInstRef = ref<FormInst | null>(null)
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
const checkedRowKeys = ref<DataTableRowKey[]>([])

const { data: pictures, loading, refresh } = useAsyncData(() => imageApi.getImages({
  size: pagination.pageSize,
  page: pagination.page,
}))

const initValue: ImageModel = {
  id: '',
  height: 0,
  width: 0,
  location: '',
  path: '',
  tag: [],
  title: '',
  url: '',
  description: '',
  created: '',
  updated: '',
}

const pictureForm = reactive(initValue)
const resetForm = () => {
  Object.assign(pictureForm, initValue)
}

const rowKey = (row: ImageModel) => row.id

const handleDelete = async (row: ImageModel) => {
  await imageApi.deleteImage(row.id)
  message.success('删除成功')
  refresh()
}
function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeys.value = rowKeys
}

async function handleDeleteMany() {
  if (checkedRowKeys.value.length === 0)
    return
  await imageApi.deleteMany(checkedRowKeys.value as string[])
  checkedRowKeys.value = []
  message.success('删除成功')
  refresh()
}
const onBeforeUpload = (data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) => {
  if (!data.file.file?.type.includes('image')) {
    message.info('只能上传图片格式')
    return false
  }
  return true
}
const handleUpload = async ({ file, onFinish, onError }: UploadCustomRequestOptions) => {
  try {
    const res = await upload('/pictures', file.file!)
    pictureForm.url = res.url
    const url = `https://image.dvaren.xyz/${res.name}`
    previewFileList.value.push({
      id: res.name,
      name: '封面',
      status: 'finished',
      url,
    })
    pictureForm.url = url
    message.success('上传成功')
    onFinish()
  }
  catch {
    message.error('上传失败')
    onError()
  }
}
const onCoverRemove = () => {
  pictureForm.url = ''
  previewFileList.value = []
}

const onPositiveClick = async () => {
  formInstRef.value?.validate(async (errors) => {
    if (errors) {
      message.error('还有未填项')
    }
    else {
      try {
        loading.value = true
        if (pictureForm.id) {
          await imageApi.updateImage(pictureForm.id, pictureForm)
          message.success('修改成功')
        }
        else {
          await imageApi.addImage(pictureForm)
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
const handleEdit = (row: ImageModel) => {
  Object.assign(pictureForm, row)
  showModal.value = true
}
const onNegativeClick = () => {
  Object.assign(pictureForm, initValue)
  showModal.value = false
}
const createColumns = (): DataTableColumns<ImageModel> => [
  {
    type: 'selection',
  },
  {
    title: 'URL',
    key: 'url',
    width: 80,
    ellipsis: true,
  },
  {
    title: '描述',
    key: 'description',
    width: 120,
    render: row => emptyValue(row.description),
  },
  {
    title: '标签',
    key: 'labels',
    width: 100,
    render: row => row.tag?.map(t => h(NTag, {}, { default: () => t })),
  },
  {
    title: '位置',
    key: 'label',
    width: 60,
    render: row => emptyValue(row.location),
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
const onFinish = (url: string) => {
  pictureForm.url = url
}
</script>

<template>
  <div>
    <div pb-4 text-xl font-bold flex justify-between>
      <div>
        照片
      </div>
      <NSpace>
        <NPopconfirm
          v-if="checkedRowKeys.length"
          @positive-click="handleDeleteMany"
        >
          <template #trigger>
            <NButton type="error" circle size="large" :loading="loading" :disabled="loading">
              <template #icon>
                <n-icon><Trash /></n-icon>
              </template>
            </NButton>
          </template>
          确认删除{{ checkedRowKeys.length }}项内容吗?
        </NPopconfirm>

        <!-- 添加按钮 -->
        <NButton type="success" circle size="large" :loading="loading" :disabled="loading" @click="showModal = !showModal">
          <template #icon>
            <n-icon><Add /></n-icon>
          </template>
        </NButton>
      </NSpace>
    </div>
    <n-modal
      v-model:show="showModal"
      :mask-closable="false"
      preset="dialog"
      title="编辑"
      positive-text="添加"
      negative-text="取消"
      @positive-click="onPositiveClick"
      @negative-click="onNegativeClick"
      @after-leave="onNegativeClick"
    >
      <n-form ref="formInstRef" :model="pictureForm" :rules="rules">
        <n-form-item>
          <img v-if="pictureForm.url" w-full :src="pictureForm.url" alt="">
        </n-form-item>
        <n-form-item label="图片" required path="image">
          <n-upload
            directory-dnd
            :custom-request="handleUpload"
            :on-before-upload="onBeforeUpload"
            :default-file-list="previewFileList"
            :on-remove="onCoverRemove"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <ArchiveOutline />
                </n-icon>
              </div>
              <n-text style="font-size: 16px">
                点击或者拖动文件到该区域来上传
              </n-text>
              <n-p depth="3" style="margin: 8px 0 0 0">
                请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
              </n-p>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>
        <Cropper :on-finish="onFinish" />
        <n-form-item label="图片地址" path="url" required>
          <n-input v-model:value="pictureForm.url" type="text" placeholder="上传或输入图片地址" />
        </n-form-item>
        <n-form-item label="标题" path="title">
          <n-input v-model:value="pictureForm.title" type="text" placeholder="图片标题" />
        </n-form-item>
        <n-form-item label="图片宽高" path="size">
          <div flex gap-6>
            <n-input-number v-model:value="pictureForm.width" flex-1 type="number" placeholder="宽度" />
            <n-input-number v-model:value="pictureForm.height" flex-1 type="text" placeholder="高度" />
          </div>
        </n-form-item>
        <n-form-item label="位置" path="position">
          <n-input v-model:value="pictureForm.location" type="text" placeholder="选择位置" />
        </n-form-item>
        <n-form-item label="标签" path="labels">
          <n-dynamic-tags v-model:value="pictureForm.tag" />
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input v-model:value="pictureForm.description" type="textarea" placeholder="关于这张图片" />
        </n-form-item>
      </n-form>
    </n-modal>
    <n-data-table
      remote
      size="small"
      :columns="createColumns()"
      :data="pictures?.data"
      :pagination="pagination"
      :row-key="rowKey"
      :loading="loading"
      row-class-name="table-row"
      :scroll-x="100"
      width="100"
      @update:checked-row-keys="handleCheck"
    />
  </div>
</template>

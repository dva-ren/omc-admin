<script lang="ts" setup>
import type { DataTableColumns, FormInst, UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import { NButton, NPopconfirm, NSpace } from 'naive-ui'
import { Add, ArchiveOutline } from '@vicons/ionicons5'
import { addPictrue, deletePictrue, queryPictrues, updatePictrue } from '~/api'

import type { Picture, PictureForm } from '~/types'
import { dateFns, emptyValue } from '~/composables'

const previewFileList = ref<UploadFileInfo[]>([])
const pictures = ref<Array<Picture>>([])
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
const initValue: PictureForm = {
  id: '',
  url: '',
  nickname: '',
  position: '',
  labels: '',
  description: '',
}

const pictureForm = reactive(initValue)
const resetForm = () => {
  Object.assign(pictureForm, initValue)
}
const getSays = async (pageNum: number, pageSize: number) => {
  loadding.value = true
  const res = await queryPictrues({
    pageSize,
    pageNum,
  })
  pagination.itemCount = res.data.total
  pictures.value = res.data.list
  loadding.value = false
}
watchEffect(() => {
  getSays(pagination.page, pagination.pageSize)
})

const rowKey = (row: Picture) => row.id

const handleDelete = async (row: Picture) => {
  const res = await deletePictrue(row.id)
  if (res.code === 200) {
    message.success('删除成功')
    getSays(pagination.page, pagination.pageSize)
  }
  else { message.error('删除失败') }
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
    previewFileList.value.push({
      id: res.name,
      name: '封面',
      status: 'finished',
      url: res.url,
    })
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
          const res = await updatePictrue(pictureForm.id, pictureForm)
          if (res.code === 200) {
            message.success('修改成功')
            showModal.value = false
            resetForm()
            getSays(pagination.page, pagination.pageSize)
          }
        }
        else {
          const res = await addPictrue(pictureForm)
          if (res.code === 200) {
            message.success('添加成功')
            showModal.value = false
            resetForm()
            getSays(pagination.page, pagination.pageSize)
          }
        }
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
const handleEdit = (row: Picture) => {
  Object.assign(pictureForm, row)
  showModal.value = true
}
const onNegativeClick = () => {
  Object.assign(pictureForm, initValue)
  showModal.value = false
}
const createColumns = (): DataTableColumns<Picture> => [
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
    render: row => emptyValue(row.labels),
  },
  {
    title: '位置',
    key: 'label',
    width: 60,
    render: row => emptyValue(row.position),
  },
  {
    title: '创建于',
    width: 60,
    key: 'createTime',
    render: row => dateFns(row.createTime).fromNow(),
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
        照片
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
      <n-form ref="formInstRef" :model="pictureForm" :rules="rules">
        <n-form-item>
          <img v-if="pictureForm.url" w-full :src="pictureForm.url" alt="">
        </n-form-item>
        <n-form-item label="图片" required path="image">
          <n-upload
            multiple
            directory-dnd
            :custom-request="handleUpload"
            :on-before-upload="onBeforeUpload"
            :default-file-list="previewFileList"
            :on-remove="onCoverRemove"
            :max="5"
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
        <n-form-item label="图片地址" path="url">
          <n-input v-model:value="pictureForm.url" type="text" placeholder="上传或输入图片地址" />
        </n-form-item>
        <n-form-item label="标签" path="labels">
          <n-input v-model:value="pictureForm.labels" type="text" placeholder="选择标签" />
        </n-form-item>
        <n-form-item label="位置" path="position">
          <n-input v-model:value="pictureForm.position" type="text" placeholder="选择位置" />
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
      :data="pictures"
      :pagination="pagination"
      :row-key="rowKey"
      :loading="loadding"
      row-class-name="table-row"
      :scroll-x="100"
      width="100"
    />
  </div>
</template>

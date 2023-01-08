<script lang="ts" setup>
import { PaperPlane, SettingsOutline } from '@vicons/ionicons5'
import type { Article, Category } from '~/types'
import { addArticle, queryArticle, queryCategoryList, updateArticle } from '~/api'

const route = useRoute()
const id = computed(() => route.query.id as string)
const show = ref(false)
const active = ref(false)
const showModal = ref(false)
const previewFileList: any = []
const previewImageUrl = ''
const message = useMessage()
const customCreateTime = reactive({
  flag: false,
  value: Date.now(),
  publishTime: null,
})
const initValue = {
  title: '',
  content: '',
  label: [],
  categoryId: undefined,
  isTop: 0,
  allowComment: 1,
  createTime: undefined,
  status: 0,
}
const articleForm = ref(initValue)

const categoryOptions = ref<Array<{ label: string; value: string }>>([])

const getArticle = async () => {
  if (id.value) {
    show.value = true
    const res = await queryArticle(id.value)
    articleForm.value = res.data
    customCreateTime.value = new Date(res.data.createTime).getTime()
    show.value = false
  }
}
const getCategory = async () => {
  const res = await queryCategoryList()
  categoryOptions.value = res.data.map(c => ({ label: c.name, value: c.id }))
}

const handleAdd = async () => {
  const { title, content, categoryId } = articleForm.value
  if (!title || !content) {
    message.info('标题或内容为空')
    return
  }
  if (!categoryId) {
    message.info('要选择文章分类哟')
    active.value = true
    return
  }
  const form = unref(articleForm)
  if (customCreateTime.flag)
    form.createTime = customCreateTime.value
  form.label = form.label ? JSON.stringify(form.label) : ''
  if (id.value) {
    const res = await updateArticle(id.value, form)
    if (res.code === 200)
      message.success('修改成功')
    else
      message.error(res.msg)
  }
  else {
    const res = await addArticle(form)
    if (res.code === 200)
      message.success('添加成功')
    else
      message.error(res.msg)
  }
  articleForm.value = initValue
}
watch(id, () => {
  if (id.value) {
    Promise.all([getArticle(), getCategory()])
  }
  else {
    articleForm.value = initValue
    getCategory()
  }
}, { immediate: true })
</script>

<template>
  <n-spin :show="show">
    <div pb-4 text-xl flex justify-between>
      <div>
        撰写新文章
      </div>
      <div>
        <n-space>
          <!-- 设置按钮 -->
          <n-button type="success" secondary circle size="large" @click="active = !active">
            <template #icon>
              <n-icon><SettingsOutline /></n-icon>
            </template>
          </n-button>
          <!-- 发布按钮 -->
          <n-button type="success" circle size="large" @click="handleAdd">
            <template #icon>
              <n-icon><PaperPlane /></n-icon>
            </template>
          </n-button>
        </n-space>
      </div>
    </div>
    <n-space vertical>
      <n-input v-model:value="articleForm.title" type="text" placeholder="文章标题" />
      <n-input
        v-model:value="articleForm.content"
        type="textarea"
        placeholder="内容"
        show-count
        h-100
      />
    </n-space>
    <n-drawer v-model:show="active" width="100%" style="max-width: 480px;">
      <n-drawer-content closable>
        <template #header>
          文章设定
        </template>
        <n-form
          ref="formRef"
          :model="articleForm"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
          size="medium"
          :style="{
            maxWidth: '420px',
          }"
        >
          <n-form-item label="分类" path="categoryId" required>
            <n-select
              v-model:value="articleForm.categoryId"
              :options="categoryOptions"
              placeholder="选择分类"
            />
          </n-form-item>
          <n-form-item label="发布状态" path="state" required>
            <n-select
              v-model:value="articleForm.status"
              :options="[{ label: '正常发布', value: 0 }, { label: '删除', value: 1 }, { label: '草稿', value: 2 }]"
              placeholder="状态"
            />
          </n-form-item>
          <n-form-item label="置顶" path="isTop">
            <n-switch v-model:value="articleForm.isTop" :checked-value="1" :unchecked-value="0" />
          </n-form-item>
          <n-form-item label="允许评论" path="allowComment">
            <n-switch v-model:value="articleForm.allowComment" :checked-value="1" :unchecked-value="0" />
          </n-form-item>
          <n-form-item label="自定义创建时间" path="customCreateTime">
            <n-switch v-model:value="customCreateTime.flag" :checked-value="1" :unchecked-value="0" />
            <n-date-picker
              v-if="customCreateTime.flag"
              v-model:value="customCreateTime.value"
              pl-2
              type="datetime"
            />
          </n-form-item>
          <n-form-item label="自定义封面图" path="cover">
            <n-upload
              action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
              :default-file-list="previewFileList"
              list-type="image-card"
              @preview="showModal = true"
            />
            <n-modal
              v-model:show="showModal"
              preset="card"
              style="width: 600px"
              title="一张很酷的图片"
            >
              <img :src="previewImageUrl" style="width: 100%">
            </n-modal>
          </n-form-item>
        </n-form>
        <template #footer>
          <n-button type="primary" @click="active = false">
            完成
          </n-button>
        </template>
      </n-drawer-content>
    </n-drawer>
    <template #description>
      你不知道你有多幸运
    </template>
  </n-spin>
</template>

<script lang="ts" setup>
import { PaperPlane, SettingsOutline } from '@vicons/ionicons5'
import { cloudApi } from '~/composables'
import type { Article, Category } from '~/types/api'

const route = useRoute()
const id = computed(() => route.query.id)
const show = ref(false)
const active = ref(false)
const customCreateTime = ref(null)
const showModal = ref(false)
const previewFileList: any = []
const previewImageUrl = ''
let categories: Category[] = []
const category = ref()
const message = useMessage()

const articleForm = ref<Article>({
  title: '',
  content: '',
  label: [],
  category: {
    name: '',
    value: '',
  },
  topping: false,
  allowComment: true,
  createTime: new Date(),
  state: 0,

})
const rowData = ref<Article>()

const categoryOptions = ref([])
const handleCategoryChange = (value: string) => {
  const c = categories.find(i => i.value === value)
  if (!c)
    return
  articleForm.value.category = {
    _id: c._id!,
    name: c.name!,
    value: c.value!,
  }
}
const getArticle = async () => {
  if (id.value) {
    show.value = true
    const res = await cloudApi.invokeFunction('query-article', { id: id.value })
    articleForm.value = res.data
    category.value = res.data.category.value
    rowData.value = res.data
    show.value = false
  }
}
const getCategory = async () => {
  const res = await cloudApi.invokeFunction('get-categories', {})
  categories = res.data
  categoryOptions.value = res.data.map((c: Category) => ({ label: c.name, value: c.value }))
}
const handleAdd = async () => {
  const { title, content } = articleForm.value
  if (!title || !content || !category.value) {
    message.error('还有未填项')
    return
  }
  if (id.value) {
    const res = await cloudApi.invokeFunction('update-article', unref(articleForm))
    if (res.code === 200)
      message.success('修改成功')
    else
      message.error(res.msg)
  }
  else {
    const res = await cloudApi.invokeFunction('add-article', unref(articleForm))
    if (res.code === 200)
      message.success('添加成功')
    else
      message.error(res.msg)
  }
}
watch(id, () => {
  if (id.value) {
    Promise.all([getArticle(), getCategory()])
  }
  else {
    articleForm.value = {
      title: '',
      content: '',
      label: [],
      category: {
        name: '',
        value: '',
      },
      topping: false,
      allowComment: true,
      createTime: new Date(),
      state: 0,

    }
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
          <n-form-item label="分类" path="category" required>
            <n-select
              v-model:value="category"
              :options="categoryOptions"
              placeholder="选择分类"
              @update-value="handleCategoryChange"
            />
          </n-form-item>
          <n-form-item label="发布状态" path="state" required>
            <n-select
              v-model:value="articleForm.state"
              :options="[{ label: '正常发布', value: 0 }, { label: '删除', value: 1 }, { label: '草稿', value: 2 }]"
              placeholder="状态"
            />
          </n-form-item>
          <n-form-item label="置顶" path="topping">
            <n-switch v-model:value="articleForm.topping" />
          </n-form-item>
          <n-form-item label="允许评论" path="allowComment">
            <n-switch v-model:value="articleForm.allowComment" />
          </n-form-item>
          <n-form-item label="自定义创建时间" path="createTime">
            <n-date-picker
              v-model:value="customCreateTime"
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

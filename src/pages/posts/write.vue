<script lang="ts" setup>
import { PaperPlane, SettingsOutline } from '@vicons/ionicons5'
import { Hash } from '@vicons/tabler'
import { addPost, getAllCategories, getPost, updatePost } from '~/api'
import type { PostDto } from '~/models/post'
const route = useRoute()
const id = computed(() => route.query.id as string)
const show = ref(false)
const active = ref(false)
const showModal = ref(false)
const message = useMessage()

const processing = ref(false)
const modifed = ref(false)
const initValue: PostDto = {
  title: '',
  text: '',
  tags: [],
  categoryId: '',
  pin: 'false',
  pinOrder: 0,
  allowComment: true,
  copyright: true,
  slug: '',
}
const pinTime = ref('')
const postForm = ref(initValue)
const categoryOptions = ref<Array<{ label: string; value: string }>>([])

const queryPost = async () => {
  if (id.value) {
    show.value = true
    const res = await getPost(id.value)
    if (res.pin) {
      if (res.pin !== 'true' && res.pin !== 'false') {
        pinTime.value = res.pin
        res.pin = 'true'
      }
    }
    delete res.images
    Object.assign(postForm.value, res)
    show.value = false
  }
}
const getCategory = async () => {
  const res = await getAllCategories()
  categoryOptions.value = res.data.map(c => ({ label: c.name, value: c.id }))
}

const handleAdd = async () => {
  const { title, text, categoryId } = postForm.value
  if (!title || !text) {
    message.info('标题或内容为空')
    return
  }
  if (!categoryId) {
    message.info('要选择文章分类哟')
    active.value = true
    return
  }
  const form = unref(postForm)
  if (form.pin === 'true' && pinTime.value)
    form.pin = pinTime.value
  if (id.value) {
    await updatePost(id.value, form)
    message.success('修改成功')
  }
  else {
    await addPost(form)
    message.success('创建成功')
  }
  modifed.value = false
  processing.value = false
}

function onConfirm(_: number, v: string) {
  pinTime.value = v
}

watch(id, () => {
  if (id.value) {
    Promise.all([queryPost(), getCategory()])
  }
  else {
    postForm.value = initValue
    getCategory()
  }
}, { immediate: true })

onBeforeRouteUpdate((to, from, next) => {
  if (modifed.value && postForm.value.text) {
    if (!window.confirm('当前内容可能还未保存，是否离开'))
      return
  }
  next()
})

onMounted(() => {
  window.onbeforeunload = (e) => {
    if (modifed.value && postForm.value.text)
      e.returnValue = '当前内容可能还未保存，是否离开'
  }
})
onBeforeUnmount(() => {
  window.onbeforeunload = null
})
</script>

<template>
  <n-spin :show="show">
    <div pb-4 text-xl font-bold flex justify-between>
      <div>
        撰写新文章
      </div>
      <div>
        <n-space>
          <!-- 打开Markdown编辑器 -->
          <n-button type="info" secondary circle size="large" @click="showModal = true">
            <template #icon>
              <n-icon><Hash /></n-icon>
            </template>
          </n-button>
          <!-- 设置按钮 -->
          <n-button type="success" secondary circle size="large" @click="active = !active">
            <template #icon>
              <n-icon><SettingsOutline /></n-icon>
            </template>
          </n-button>
          <!-- 发布按钮 -->
          <n-button type="success" circle size="large" :loading="processing" :disabled="processing" @click="handleAdd">
            <template #icon>
              <n-icon><PaperPlane /></n-icon>
            </template>
          </n-button>
        </n-space>
      </div>
    </div>
    <n-space vertical>
      <div>
        <span>https://xxx.xxx/</span>
        <input v-model="postForm.slug" type="text" w-15 class="slug-input">
      </div>
      <n-input
        v-model:value="postForm.title"
        type="text"
        placeholder="标题"
      />
      <n-input
        v-model:value="postForm.text"
        type="textarea"
        placeholder="内容"
        show-count
        h-60vh
        @input="modifed = true"
      />
    </n-space>
    <n-drawer v-model:show="active" width="100%" style="max-width: 480px;">
      <n-drawer-content closable>
        <template #header>
          文章设定
        </template>
        <n-form
          ref="formRef"
          :model="postForm"
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
              v-model:value="postForm.categoryId"
              :options="categoryOptions"
              placeholder="选择分类"
            />
          </n-form-item>
          <n-form-item label="标签" path="tags">
            <n-dynamic-tags v-model:value="postForm.tags" :max="8" />
          </n-form-item>
          <!-- <n-form-item label="发布状态" path="state" required>
            <n-select
              v-model:value="articleForm.status"
              :options="[{ label: '正常发布', value: 0 }, { label: '隐藏', value: 1 }, { label: '草稿', value: 2 }]"
              placeholder="状态"
            />
          </n-form-item> -->
          <n-form-item label="置顶" path="pin">
            <n-switch v-model:value="postForm.pin" mr-4 checked-value="true" unchecked-value="false" />
            <n-date-picker
              v-if="postForm.pin === 'true'"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              clearable
              format="yyyy-MM-dd HH:mm:ss"
              :on-confirm="onConfirm"
            />
          </n-form-item>
          <n-form-item label="允许评论" path="allowComment">
            <n-switch v-model:value="postForm.allowComment" />
          </n-form-item>
          <n-form-item label="版权标识" path="copyright">
            <n-switch v-model:value="postForm.copyright" />
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
    <n-modal v-model:show="showModal">
      <MyEditor v-model="postForm.text" @on-close="showModal = false" />
    </n-modal>
  </n-spin>
</template>

<style scoped>
.slug-input{
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
}
</style>

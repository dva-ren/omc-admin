<script lang="ts" setup>
import { PaperPlane, SettingsOutline } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'
import { cloudApi } from '~/composables'
import type { Note } from '~/types/api'

const route = useRoute()
const id = computed(() => route.query.id)
const show = ref(false)
const active = ref(false)
const customCreateTime = ref(null)
const message = useMessage()

const noteForm = ref({
  title: '',
  content: '',
  mood: undefined,
  weather: undefined,
  position: undefined,
  topping: false,
  allowComment: false,
  state: 0,
  publishTime: undefined,
})

const getArticle = async () => {
  if (id.value) {
    show.value = true
    const res = await cloudApi.invokeFunction('get-note', { id: id.value })
    noteForm.value = res.data
    show.value = false
  }
}
const weatherOptions = [
  {
    label: '晴',
    value: '晴',
  },
  {
    label: '阴',
    value: '阴',
  },
  {
    label: '雨',
    value: '雨',
  },
  {
    label: '雪',
    value: '雪',
  },
  {
    label: '雷阵雨',
    value: '雷阵雨',
  },
]
const moodOptions = [
  {
    label: '开心',
    value: '开心',
  },
  {
    label: '伤心',
    value: '伤心',
  },
  {
    label: '生气',
    value: '生气',
  },
  {
    label: '悲哀',
    value: '悲哀',
  },
  {
    label: '痛苦',
    value: '痛苦',
  },
  {
    label: '痛恨',
    value: '痛恨',
  },
  {
    label: '绝望',
    value: '绝望',
  },

  {
    label: '焦虑',
    value: '焦虑',
  },

  {
    label: '担心',
    value: '担心',
  },
]
const handleCreate = (value: string) => {
  return {
    label: value,
    value,
  }
}
const handleAdd = async () => {
  if (!noteForm.value.title || !noteForm.value.content) {
    message.error('请输入标题和内容')
    return
  }
  if (id.value) {
    const res = await cloudApi.invokeFunction('update-note', unref(noteForm))
    if (res.code === 200)
      message.success('修改成功')
  }
  else {
    const res = await cloudApi.invokeFunction('add-note', unref(noteForm))
    if (res.code === 200)
      message.success('添加成功')
  }
}
watch(id, () => {
  if (id.value) {
    getArticle()
  }
  else {
    noteForm.value = {
      title: '',
      content: '',
      mood: undefined,
      weather: undefined,
      position: undefined,
      topping: false,
      allowComment: false,
      state: 0,
      publishTime: undefined,
    }
  }
}, { immediate: true })
</script>

<template>
  <n-spin :show="show">
    <div pb-4 text-xl flex justify-between>
      <div>
        撰写新说说
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
      <n-input v-model:value="noteForm.title" type="text" placeholder="文章标题" />
      <n-input
        v-model:value="noteForm.content"
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
          :model="noteForm"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
          size="medium"
          :style="{
            maxWidth: '420px',
          }"
        >
          <n-form-item label="心情" path="mood" class="w-full">
            <n-select
              v-model:value="noteForm.mood"
              filterable
              clearable
              :options="moodOptions"
              tag
              placeholder="天天都要开心呀"
              @create="handleCreate"
            />
          </n-form-item>
          <n-form-item label="天气" path="weather">
            <n-select
              v-model:value="noteForm.weather"
              filterable
              clearable
              :options="weatherOptions"
              tag
              placeholder="今天天气好吗"
              @create="handleCreate"
            />
          </n-form-item>
          <n-form-item label="置顶" path="state">
            <n-switch v-model:value="noteForm.state" />
          </n-form-item>
          <n-form-item label="公开时间" path="publishTime">
            <n-date-picker
              v-model:value="noteForm.publishTime"
              type="datetime"
            />
          </n-form-item>
          <n-form-item label="允许评论" path="allowComment">
            <n-switch v-model:value="noteForm.allowComment" />
          </n-form-item>
          <n-form-item label="自定义创建时间" path="createTime">
            <n-date-picker
              v-model:value="customCreateTime"
              type="datetime"
            />
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

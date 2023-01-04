<script lang="ts" setup>
import { PaperPlane } from '@vicons/ionicons5'
import { cloudApi } from '~/composables'
import type { Article, ArticleForm } from '~/types/api'

const route = useRoute()
const id = computed(() => route.query.id)

const articleForm = reactive<ArticleForm>({
  title: '',
  content: '',
  label: [],
  category: {
    _id: '',
    category: '',
    name: '',
  },
})
const rowData = ref<Article>()

const getArticle = async () => {
  if (id.value) {
    const res = await cloudApi.invokeFunction('query-article', { id: id.value })
    articleForm.title = res.data.title
    articleForm.content = res.data.content
    articleForm.label = res.data.label
    articleForm.category = res.data.category
    rowData.value = res.data
  }
}
getArticle()
</script>

<template>
  <div>
    <div pb-4 text-xl flex justify-between>
      <div>
        撰写新文章
      </div>
      <div>
        <n-button type="success" circle size="large">
          <template #icon>
            <n-icon><PaperPlane /></n-icon>
          </template>
        </n-button>
      </div>
    </div>
    <n-space vertical>
      <n-input v-model:value="articleForm.title" type="text" placeholder="文章标题" />
      <n-input
        v-model:value="articleForm.content"
        type="textarea"
        placeholder="内容"
        show-count
      />
    </n-space>
  </div>
</template>

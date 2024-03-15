<script lang="ts" setup>
import { LocationOutline, PaperPlane, SettingsOutline } from '@vicons/ionicons5'
import { Hash } from '@vicons/tabler'
import { useMessage } from 'naive-ui'
import { addNote, getNote, updateNote } from '~/api'
import type { NoteCreateModel } from '~/models'

const route = useRoute()
const id = computed(() => route.query.id as string)
const show = ref(false)
const active = ref(false)
const showModal = ref(false)

const message = useMessage()
const formInstRef = ref(null)
const processing = ref(false)
const modifed = ref(false)
const initValue: NoteCreateModel = {
  nid: 0,
  title: '',
  text: '',
  mood: undefined,
  weather: undefined,
  allowComment: true,
  music: [],
  hide: false,
  location: '',
  topicId: undefined,
  secret: null,
  hasMemory: false,
  password: '',
  meta: undefined,
}
const noteForm = ref<NoteCreateModel>(initValue)

enum MusicType {
  QQ = 'qq',
  Netease = 'netease',
}

function onCreate() {
  return {
    type: MusicType.Netease,
    id: '',
  }
}

const publicTime = ref<number | null>(null)

const getNotes = async () => {
  if (id.value) {
    show.value = true
    const res = await getNote(id.value)
    if (res.secret)
      publicTime.value = new Date(res.secret).getTime()
    noteForm.value = res
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
    label: '平静',
    value: '平静',
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
const musicTypeOptions = [
  {
    label: '网易云',
    value: 'netease',
  },
  {
    label: 'QQ音乐',
    value: 'qq',
  },
]
const topicOptions = [
  {
    label: '学习',
    value: 's',
  },
  {
    label: '工作',
    value: 'w',
  },
  {
    label: '生活',
    value: 'l',
  },
]
const handleCreate = (value: string) => {
  return {
    label: value,
    value,
  }
}

function onConfirm(a: number) {
  publicTime.value = a
  noteForm.value.secret = new Date(a)
}

const rules = {
  mood: {
    require: true,
    min: 1,
    message: '要不随便选个',
  },
  weather: {
    require: true,
    min: 1,
    message: '看看外面的天气吧',
  },
}
const handleAdd = async () => {
  if (!noteForm.value.title || !noteForm.value.text) {
    message.info('请输入标题和内容')
    return
  }
  if (!noteForm.value.mood || !noteForm.value.weather) {
    active.value = true
    message.info('要选择天气和心情哟')
    return
  }
  processing.value = true
  try {
    if (id.value) {
      await updateNote(id.value, noteForm.value)
      message.success('修改成功')
    }
    else {
      await addNote(noteForm.value)
      message.success('添加成功')
    }
    modifed.value = false
  }
  catch (e) {}
  finally {
    processing.value = false
  }
}
const getLocation = () => {
  // navigator.geolocation.getCurrentPosition((e) => {
  //   queryLocation(e.coords.latitude, e.coords.longitude).then((res) => {
  //     console.log('res', res)
  //     // noteForm.value.position = res.data.data.address
  //   }).catch(() => {
  //     message.error('位置信息获取失败')
  //   })
  // })
}

watch(id, () => {
  if (id.value)
    getNotes()
  else
    Object.assign(noteForm.value, initValue)
}, { immediate: true })

onBeforeRouteUpdate((to, from, next) => {
  if (modifed.value && noteForm.value.text) {
    if (!window.confirm('当前内容可能还未保存，是否离开'))
      return
  }
  next()
})

onMounted(() => {
  window.onbeforeunload = (e) => {
    if (modifed.value && noteForm.value.text)
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
        撰写新说说
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
      <n-input v-model:value="noteForm.title" type="text" placeholder="文章标题" />
      <n-input
        v-model:value="noteForm.text"
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
          ref="formInstRef"
          :model="noteForm"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
          size="medium"
          :style="{
            maxWidth: '420px',
          }"
          :rules="rules"
        >
          <n-form-item label="心情" path="mood" class="w-full" required>
            <n-select
              v-model:value="noteForm.mood"
              filterable
              clearable
              :options="moodOptions"
              tag
              placeholder="生命苦短，开心最重要"
              @create="handleCreate"
            />
          </n-form-item>
          <n-form-item label="天气" path="weather" required>
            <n-select
              v-model:value="noteForm.weather"
              filterable
              clearable
              :options="weatherOptions"
              tag
              placeholder="今天有抬头看看天吗"
              @create="handleCreate"
            />
          </n-form-item>
          <n-form-item label="位置" path="position">
            <n-button-group>
              <n-button round @click="getLocation">
                <template #icon>
                  <n-icon><LocationOutline /></n-icon>
                </template>
              </n-button>
              <n-input v-model:value="noteForm.location" type="text" placeholder="发生在哪里" />
            </n-button-group>
          </n-form-item>
          <n-form-item label="密码访问" path="password">
            <n-input v-model:value="noteForm.password" show-password-on="click" type="password" placeholder="不填为空" />
          </n-form-item>
          <n-form-item label="公开时间" path="secret">
            <n-date-picker
              v-model:value="publicTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              clearable
              format="yyyy-MM-dd HH:mm:ss"
              @confirm="onConfirm"
            />
          </n-form-item>
          <n-form-item label="专栏选择" path="topicId">
            <n-select
              v-model:value="noteForm.topicId"
              clearable
              :options="topicOptions"
              placeholder="选择专栏"
            />
          </n-form-item>
          <n-form-item label="隐藏" path="isTop">
            <n-switch v-model:value="noteForm.hide" />
          </n-form-item>
          <n-form-item label="允许评论" path="allowComment">
            <n-switch v-model:value="noteForm.allowComment" />
          </n-form-item>
          <n-form-item label="拥有回忆" path="password">
            <n-switch v-model:value="noteForm.hasMemory" />
          </n-form-item>
          <n-form-item label="音乐" path="position">
            <n-dynamic-input
              v-model:value="noteForm.music"
              item-style="margin-bottom: 0;"
              :on-create="onCreate"
              #="{ index }"
            >
              <div style="display: flex">
                <!--
                  通常，path 的变化会导致 form-item 验证内容或规则的改变，所以 naive-ui 会清理掉
                  表项已有的验证信息。但是这个例子是个特殊情况，我们明确的知道，path 的改变不会导致
                  form-item 验证内容和规则的变化，所以就 ignore-path-change
                -->
                <n-form-item
                  ignore-path-change
                  :show-label="false"
                  :path="`noteForm.music[${index}].type`"
                  width="40"
                >
                  <n-select
                    v-model:value="noteForm.music[index].type"
                    default-value="netease"
                    style="min-width: 88px;"
                    :options="musicTypeOptions"
                  />
                  <!--
            由于在 input 元素里按回车会导致 form 里面的 button 被点击，所以阻止了默认行为
          -->
                </n-form-item>
                <n-form-item
                  ignore-path-change
                  :show-label="false"
                  :path="`noteForm.music[${index}].id`"
                >
                  <n-input
                    v-model:value="noteForm.music[index].id"
                    placeholder="音乐ID"
                    @keydown.enter.prevent
                  />
                </n-form-item>
              </div>
            </n-dynamic-input>
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
      <MyEditor v-model="noteForm.text" @on-close="showModal = false" />
    </n-modal>
  </n-spin>
</template>

<script setup lang="ts">
import { addKey, deleteKey, getKeys } from '~/api'

const message = useMessage()

const previewKey = reactive({
  key: '',
  value: '',
})
const isAdd = ref(false)

const { data, refresh } = useAsyncData(async () => {
  const res = await getKeys()
  const key = Object.keys(res)[0]
  previewKey.key = key
  previewKey.value = JSON.stringify(res[key])
  return res
})

function onKeyClick(key: string, value: any) {
  previewKey.key = key
  previewKey.value = JSON.stringify(value)
}

async function onSave() {
  if (previewKey.value === '')
    return message.error('请输入值')
  try {
    const data = JSON.parse(previewKey.value)
    await addKey(previewKey.key, data)
    message.success('保存成功')
  }
  catch (e) {
    message.error('值应为JSON格式')
  }
}

function handleClickAdd() {
  isAdd.value = true
  previewKey.key = ''
  previewKey.value = ''
}

function handleOnBlur() {
  if (previewKey.key !== '') {
    data.value![previewKey.key] = {}
    previewKey.value = ''
  }
  isAdd.value = false
}

async function handleDelete(key: string) {
  await deleteKey(key)
  message.success('删除成功')
  refresh()
}
</script>

<template>
  <div>
    <section flex items-center justify-between>
      <h1>Keys</h1>
      <n-button @click="onSave">
        保存
      </n-button>
    </section>
    <div flex gap-4>
      <div>
        <div
          v-for="v, k of data"
          :key="k"
          class="py-1 px-2 border rounded cursor-pointer flex items-center group justify-between"
          :class="{ 'bg-blue-50': previewKey.key === k }"
        >
          <div @click="onKeyClick(k, v)">
            {{ k }}
          </div>
          <n-popconfirm
            @positive-click="handleDelete(k)"
          >
            <template #trigger>
              <div group-hover:op-100 op-0 i-carbon:close text-red />
            </template>
            确认删除吗
          </n-popconfirm>
        </div>
        <n-space mt-2>
          <n-button v-if="!isAdd" size="small" w-full @click="handleClickAdd">
            添加
          </n-button>
          <n-input v-if="isAdd" v-model:value="previewKey.key" size="small" @blur="handleOnBlur" />
        </n-space>
      </div>
      <n-input v-model:value="previewKey.value" type="textarea" />
    </div>
  </div>
</template>

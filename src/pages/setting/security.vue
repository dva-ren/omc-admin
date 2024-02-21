<script lang="ts" setup>
import { changePassword } from '~/api'

const password = ref('')
const message = useMessage()
const loading = ref(false)

const noSideSpace = (value: string) => {
  return !value.startsWith(' ') && !value.endsWith(' ')
}
async function changePasswd() {
  if (password.value.length < 4 || password.value.length > 16) {
    message.info('密码长度在4-16个字符')
    return
  }
  loading.value = true
  try {
    await changePassword(password.value)
    message.success('修改成功')
  }
  catch (err) {}
  finally {
    loading.value = false
  }
}
</script>

<template>
  <n-collapse>
    <n-collapse-item title="修改密码" name="password">
      <n-space vertical>
        <n-input v-model:value="password" type="password" :allow-input="noSideSpace" />
        <n-button
          strong round type="primary"
          :loading="loading"
          :disabled="loading"
          size="small"
          @click="changePasswd"
        >
          修改密码
        </n-button>
      </n-space>
    </n-collapse-item>
  </n-collapse>
</template>

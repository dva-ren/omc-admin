<script lang="ts" setup>
import { login } from '~/api'
import { useMainStore } from '~/store'

const router = useRouter()
const message = useMessage()
const processing = ref(false)
const loginForm = reactive({
  username: '',
  password: '',
})

const handleLogin = async () => {
  if (!loginForm.password) {
    message.warning('请输入密码')
    return
  }
  try {
    processing.value = true
    const res = await login(loginForm.password)
    if (res.code === 200) {
      localStorage.setItem('token', res.token!)
      useMainStore().init()
      message.success('登录成功')
      router.replace('/dashboard')
    }
  }
  finally {
    processing.value = false
  }
}
</script>

<template>
  <div flex items-center justify-center h-full>
    <div flex flex-col gap-4 items-center>
      <div text-xl mb-4>
        灰色の青
      </div>
      <n-input v-model:value="loginForm.password" autofocus placeholder="密码" type="password" @keyup.enter="handleLogin" />
      <n-button type="primary" round :loading="processing" :disabled="processing" @click="handleLogin">
        登录
      </n-button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  full: true
</route>

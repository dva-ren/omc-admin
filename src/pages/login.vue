<script lang="ts" setup>
import { useMasterStore } from '~/store'
import { login } from '~/api'
import { ACCESS_TOKEN } from '~/constants/system'

const router = useRouter()
const message = useMessage()
const processing = ref(false)
const masterStore = useMasterStore()
const usename = computed(() => masterStore.username)
const loginForm = reactive({
  username: usename,
  password: '',
})

const handleLogin = async () => {
  if (!loginForm.password) {
    message.warning('请输入密码')
    return
  }
  try {
    processing.value = true
    const res = await login(loginForm.username, loginForm.password)
    localStorage.setItem(ACCESS_TOKEN, res.token)
    message.success('登录成功')
    router.replace('/dashboard')
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

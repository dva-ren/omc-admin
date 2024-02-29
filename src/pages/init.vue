<script setup lang="ts">
import { createMaster } from '~/api'
import { ACCESS_TOKEN } from '~/constants/system'
const message = useMessage()
const router = useRouter()
const userForm = reactive({
  username: '',
  name: '',
  password: '',
  mail: '',
})
const onSubmit = async () => {
  const res = await createMaster(userForm)
  localStorage.setItem(ACCESS_TOKEN, res.token)
  message.success('创建成功')
  router.push('/')
}
</script>

<template>
  <div flex justify-center items-center h-full>
    <div w-80>
      <h1 text-center>
        创建Master账户
      </h1>
      <n-form>
        <n-form-item label="用户名" path="username" required>
          <n-input v-model:value="userForm.username" placeholder="只能是英文或数字" />
        </n-form-item>
        <n-form-item label="昵称" path="name" required>
          <n-input v-model:value="userForm.name" placeholder="昵称" />
        </n-form-item>
        <n-form-item label="密码" path="password" required>
          <n-input v-model:value="userForm.password" placeholder="密码" type="password" />
        </n-form-item>
        <n-form-item label="邮箱" path="mail" required>
          <n-input v-model:value="userForm.mail" placeholder="邮箱" type="text" />
        </n-form-item>
        <n-button type="primary" @click="onSubmit">
          创建
        </n-button>
      </n-form>
    </div>
  </div>
</template>

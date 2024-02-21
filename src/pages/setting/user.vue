<script lang="ts" setup>
import type { FormItemRule, FormRules, UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import type { UserDto } from '~/models'
import { getMasterInfo, updateMasterInfo } from '~/api'
import { upload } from '~/composables/upload'
import { useMasterStore } from '~/store'

const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const message = useMessage()
const processing = ref(false)
const socialIds = ref<Array<{ key: string; value: string | number }>>()
const masterStore = useMasterStore()

const master = masterStore.masterInfo

const rules: FormRules = {
  username: [
    {
      required: true,
      min: 2,
      message: '至少两个字符',
      trigger: ['blur'],
    },
  ],
  name: [
    {
      required: true,
      min: 2,
      message: '至少两个字符',
      trigger: ['blur'],
    },
  ],
  mail: [
    {
      required: true,
      min: 2,
      validator(rule: FormItemRule, value: string) {
        if (!value)
          return new Error('必须输入邮箱')
        else if (!emailReg.test(value))
          return new Error('邮箱格式不正确')
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
}
const masterForm = reactive<UserDto>({
  avatar: '',
  username: '',
  name: '',
  mail: '',
  introduce: '',
  socialIds: {},
  url: '',
})

async function initForm() {
  const res = await getMasterInfo()
  masterForm.avatar = res.avatar
  masterForm.username = res.username
  masterForm.name = res.name
  masterForm.mail = res.mail
  masterForm.introduce = res.introduce
  masterForm.socialIds = res.socialIds
  masterForm.url = res.url
  if (res.socialIds) {
    socialIds.value = Object.keys(res.socialIds).map((key) => {
      type KeyType = keyof typeof res.socialIds
      return {
        key,
        value: res.socialIds[key as KeyType],
      }
    })
  }
}
initForm()
const socialOptions = [
  {
    label: 'Github',
    value: 'github',
    disabled: false,
  },
  {
    label: '网易云',
    value: 'netease',
    disabled: false,
  },
  {
    label: '哔哩哔哩',
    value: 'bilibili',
    disabled: false,
  },
  {
    label: 'QQ',
    value: 'qq',
    disabled: false,
  },
  {
    label: '微博',
    value: 'weibo',
    disabled: false,
  },
  {
    label: '知乎',
    value: 'zhihu',
    disabled: false,
  },
  {
    label: 'X',
    value: 'x',
    disabled: false,
  },
  {
    label: '小红书',
    value: 'xiaohongshu',
    disabled: false,
  },
]

const onCreate = () => {
  return {
    key: '',
    value: '',
  }
}
const onBeforeUpload = (data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) => {
  if (!data.file.file?.type.includes('image')) {
    message.info('只能上传图片格式')
    return false
  }
  return true
}
const handleUpload = async ({ file, onFinish, onError }: UploadCustomRequestOptions) => {
  try {
    const res = await upload('/imgs', file.file!)
    masterForm.avatar = res.url
    onFinish()
  }
  catch {
    message.error('上传失败')
    onError()
  }
}

const handleSave = async () => {
  processing.value = true
  if (socialIds.value) {
    masterForm.socialIds = socialIds.value.reduce((pre, cur) => {
      pre[cur.key] = cur.value
      return pre
    }, {})
  }
  try {
    await updateMasterInfo(masterForm)
    message.success('保存成功')
  }
  catch (e) {}
  finally {
    processing.value = false
  }
}
</script>

<template>
  <div flex flex-col md:flex-row justify-center>
    <div flex-1 py-10 justify-center text-center>
      <div h-30 w-30 rounded-full p-2 bg-gray-3 text-center m-auto>
        <img h-30 w-30 object-cover rounded-full :src="masterForm.avatar" mb-8>
      </div>
      <div pb-2 pt-4>
        上次登录时间
      </div>
      <div text-sm text-gray>
        {{ master.lastLoginTime }}
      </div>
      <div p-2>
        上次登录ip
      </div>
      <div text-sm text-gray>
        {{ master.lastLoginIp }}
      </div>
      <n-button strong round type="primary" mt-4 :loading="processing" :disabled="processing" @click="handleSave">
        保存更改
      </n-button>
    </div>
    <div flex-1 m-auto>
      <n-form
        ref="formRef"
        :model="masterForm"
        :rules="rules"
        style="max-width: 360px;"
      >
        <n-form-item path="username" label="用户名(usename)">
          <n-input v-model:value="masterForm.username" />
        </n-form-item>
        <n-form-item path="nickname" label="昵称(name)">
          <n-input v-model:value="masterForm.name" />
        </n-form-item>
        <n-form-item path="mail" label="邮箱(mail)">
          <n-input v-model:value="masterForm.mail" />
        </n-form-item>
        <n-form-item path="url" label="主页地址">
          <n-input v-model:value="masterForm.url" />
        </n-form-item>
        <n-form-item path="avatar" label="头像地址">
          <n-space>
            <n-input v-model:value="masterForm.avatar" flex-1 />
            <n-upload
              action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
              :custom-request="handleUpload"
              :show-file-list="false"
              :on-before-upload="onBeforeUpload"
            >
              <n-button>上传图片</n-button>
            </n-upload>
          </n-space>
        </n-form-item>
        <n-form-item path="introduce" label="网站介绍">
          <n-input v-model:value="masterForm.introduce" type="textarea" />
        </n-form-item>
        <n-form-item path="socialIds" label="社交平台">
          <n-dynamic-input
            v-model:value="socialIds"
            :on-create="onCreate"
          >
            <template #create-button-default>
              添加
            </template>
            <template #default="{ value }">
              <div style="display: flex; align-items: center; width: 100%">
                <n-select v-model:value="value.key" :options="socialOptions" style="margin-right: .5rem;" />
                <n-input v-model:value="value.value" type="text" />
              </div>
            </template>
          </n-dynamic-input>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

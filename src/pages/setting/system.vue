<script lang="ts" setup>
import { changeConfig, getConfigJsonSchema, getConfigs } from '~/api'
import { useAsyncData } from '~/composables/useAsyncData'

const { data: configs } = useAsyncData<any>(() => getConfigs())
const { data: jsonSchema } = useAsyncData<any>(() => getConfigJsonSchema())

function getKey(key: string) {
  let newkey = key[0].toLowerCase()
  for (let i = 1; i < key.length; i++)
    newkey += key[i]
  return newkey.replace('Dto', '')
}

function change(key: string, value: Record<string, any>) {
  changeConfig(getKey(key), value)
}
</script>

<template>
  <div v-if="jsonSchema && configs">
    <n-collapse>
      <n-collapse-item
        v-for="value, key of jsonSchema.definitions"
        :key="key"
        :title="value.title"
        :name="key"
      >
        <n-form>
          <n-form-item
            v-for="cs, ck of value.properties"
            :key="ck"
            :label="cs.title"
          >
            <n-input v-if="cs.type === 'string'" :value="configs[getKey(key)][ck]" @change="(v) => change(key, { ck: v })" />
            <n-switch v-if="cs.type === 'boolean'" :value="configs[getKey(key)][ck]" :on-update:value="(v) => change(key, { [ck]: v })" />
            <n-input v-if="cs.type === 'array'" :value="configs[getKey(key)][ck]" type="textarea" placeholder="多个使用,分隔" @change="(v) => change(key, { ck: v })" />
          </n-form-item>
        </n-form>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

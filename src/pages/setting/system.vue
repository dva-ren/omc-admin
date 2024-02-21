<script lang="ts" setup>
import { getConfigJsonSchema } from '~/api'
import { useAsyncData } from '~/composables/useAsyncData'
const formValue = ref()
const { data } = useAsyncData<any>(() => getConfigJsonSchema())
</script>

<template>
  <div v-if="data">
    <n-collapse>
      <n-collapse-item
        v-for="value, key of data.definitions"
        :key="key"
        :title="value.title"
        :name="key"
      >
        <n-form>
          <n-form-item
            v-for="cs, ck of value.properties"
            :key="ck"
            :label="cs.title"
            label-style="border-bottom: 1px solid rgba(222,222,222,0.5)"
          >
            <n-input v-if="cs.type === 'string'" />
            <n-switch v-if="cs.type === 'boolean'" />
          </n-form-item>
        </n-form>
        <!-- <div
          v-for="cs, ck of value.properties"
          :key="ck"
        >
          <div>{{ cs.title }}</div>
          <div>{{ ck }}</div>
        </div> -->
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

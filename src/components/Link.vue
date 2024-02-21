<script setup lang="ts">
const props = defineProps<{ to?: string; text: string }>()
</script>

<template>
  <a :href="props.to" class="link outline-none">
    {{ props.text }}
  </a>
</template>

<script setup>
const props = defineProps({
  html: {
    type: [String],
    default: () => (''),
  },
});
const { html } = toRefs(props);
</script>

<template>
  <div class="rich_text" v-html="html" /> <!-- eslint-disable-line vue/no-v-html -->
</template>

<style lang="scss" scoped>
.rich_text :deep(> *) {
  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>

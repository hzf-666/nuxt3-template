<script setup>
const currentNav = store.useCurrentNav();
</script>

<template>
  <h1 style="text-align: center;">{{ currentNav.name }}</h1>
</template>

<style lang="scss" scoped>

</style>

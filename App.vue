<script setup>
const showApp = ref(false), isMobile = store.useIsMobile(), config = useRuntimeConfig();
const standardWidth = 750, mobileMaxWidth = 900; // 移动端设计图基准宽度，最大移动设备宽度
const listener = useListener();
onMounted(() => {
  listener.add('resize', onResize);
  onResize();
  showApp.value = true;
});
function onResize() {
  const width = parseFloat(getComputedStyle(document.documentElement).width);
  isMobile.value = width <= mobileMaxWidth;
  if (config.public.responsive) {
    document.documentElement.style.fontSize = `${ config.public.fontSizeScale * (width > mobileMaxWidth ? (standardWidth / 750 * 0.5) : (width / standardWidth)) }px`;
  }
}
</script>

<template>
  <div v-show="showApp" id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

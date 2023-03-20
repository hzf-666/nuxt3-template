<script setup>
let iconNames = [];
if (process.client) {
  await import('virtual:svg-icons-names').then(({ default: ids }) => {
    iconNames = ids;
  });
}
function onCopy(name) {
  navigator.clipboard.writeText(`<SvgIcon name="${ name }" />`).then(() => {
    alert(`已复制  ${ name }`);
  });
}
</script>

<template>
  <div>
    <div class="icon_wrapper">
      <ClientOnly>
        <div v-for="(iconName, i) in iconNames" :key="i" @click="onCopy(iconName)">
          <SvgIcon :name="iconName" />
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icon_wrapper {
  $size: 50px;
  $bdWidth: 1px;

  display: grid;
  grid-template-columns: #{$size - $bdWidth} repeat(auto-fill, $size);
  grid-auto-rows: $size;
  justify-content: center;
  padding-top: $bdWidth;
  padding-left: $bdWidth;
  overflow: hidden;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -$bdWidth;
    margin-left: -$bdWidth;
    font-size: 20px;
    cursor: pointer;
    border: $bdWidth solid #ccc;
  }
}
</style>

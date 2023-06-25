<script setup>
let iconNames = [];
if (process.client) {
  await import('virtual:svg-icons-names').then(({ default: ids }) => {
    iconNames = ids;
  });
}
let copyInput;
function onCopy(name, only = true) {
  const str = only ? name : `<SvgIcon name="${ name }" />`;
  if (!copyInput) {
    copyInput = document.createElement('input');
    copyInput.setAttribute('id', 'copyInput');
    copyInput.style.position = 'fixed';
    copyInput.style.zIndex = -9999;
    document.body.appendChild(copyInput);
  }
  copyInput.value = str;
  copyInput.select();
  document.execCommand('Copy');
  alert(`已复制  ${ str }`);
}
function onContextmenu(name, e) {
  e.preventDefault();
  onCopy(name, false);
}
</script>

<template>
  <div>
    <div class="icon_wrapper">
      <ClientOnly>
        <div v-for="(iconName, i) in iconNames" :key="i" @click="onCopy(iconName)" @contextmenu="onContextmenu(iconName, $event)">
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

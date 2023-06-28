<script setup>
const dev = import.meta.env.DEV;

const el = ref(null), { style } = useDraggable(el, {
  initialValue: { x: 10, y: 10 },
});

const showIcons = ref(false);

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
  <template v-if="dev">
    <div ref="el" class="icon_more_wrapper" :style="style" @dblclick="showIcons = true">
      <SvgIcon name="icon-more" />
    </div>

    <div v-if="showIcons" class="icon_lib_mask" @click.self="showIcons = false">
      <div class="icon_lib_main">
        <div class="icon_wrapper">
          <div v-for="(iconName, i) in iconNames" :key="i" @click="onCopy(iconName)" @contextmenu="onContextmenu(iconName, $event)">
            <SvgIcon :name="iconName" />
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.icon_more_wrapper {
  position: fixed;
  z-index: 999;
  padding: 2px;
  cursor: pointer;
  user-select: none;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%);

  .icon_more {
    font-size: 20px;
    color: $colorPrimary;
  }
}

.icon_lib_mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  overflow: auto;
  background-color: rgb(0 0 0 / 30%);

  .icon_lib_main {
    width: 80%;
    padding: 20px;
    margin: 15vh auto;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 12px 32px 4px rgb(0 0 0 / 4%), 0 8px 20px rgb(0 0 0 / 8%);
  }
}

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

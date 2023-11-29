<script setup>
const { VITE_MODE, MODE } = import.meta.env, modeDev = (VITE_MODE || MODE) === 'development';

const baseURL = store.useBaseURL(), isMobile = store.useIsMobile();
function onInput(e) {
  sessionStorage.setItem('baseURL', e.target.value);
}

const el = ref(null), { style } = useDraggable(el, {
  initialValue: { x: 10, y: 10 },
});

const visible = ref(false);

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
  <template v-if="modeDev && !isMobile">
    <div ref="el" class="icon_more_wrapper" :style="style" @dblclick="visible = true">
      <SvgIcon name="icon-more" />
    </div>

    <div v-if="visible" class="config_mask" @click.self="visible = false">
      <div class="config_main">
        <div class="base_url">
          <span>接口地址：</span>
          <input v-model="baseURL" @input="onInput">
        </div>

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

.config_mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  overflow: auto;
  background-color: rgb(0 0 0 / 30%);

  .config_main {
    width: 80%;
    padding: 20px;
    margin: 15vh auto;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 12px 32px 4px rgb(0 0 0 / 4%), 0 8px 20px rgb(0 0 0 / 8%);
  }
}

.base_url {
  padding-bottom: 15px;

  > span {
    padding-right: 10px;
  }

  > input {
    height: 32px;
    padding: 0 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    outline: none;
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

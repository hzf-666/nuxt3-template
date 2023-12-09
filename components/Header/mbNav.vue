<script setup>
const props = defineProps({
  isFixed: {
    type: [Boolean],
    default: () => (false),
  },
});
const { isFixed } = toRefs(props);

const emit = defineEmits(['draw']);

const webInfo = store.useWebInfo();
</script>

<template>
  <div class="mb_nav_wrapper" :class="{is_fixed: isFixed}">
    <img :src="webInfo.logo" alt="">

    <SvgIcon name="icon-menu-more" @click="emit('draw')" />
  </div>
</template>

<style lang="scss" scoped>
.mb_nav_wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rx;

  > img {
    height: 65rx;
  }

  .icon_menu_more {
    font-size: 30rx;
    color: #fff;
    cursor: pointer;
  }
}
</style>

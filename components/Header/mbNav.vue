<script setup>
const props = defineProps({
    isFixed: {
      type: [Boolean],
      default: () => (false),
    },
  }),
  { isFixed } = toRefs(props);

const emit = defineEmits(['draw']);

const webInfo = store.useWebInfo();
</script>

<template>
  <div class="mb_nav_wrapper" :class="{is_fixed: isFixed}">
    <img :src="webInfo.logo" alt="">

    <SvgIcon name="icon-more" class="icon_more" @click="emit('draw')" />
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

  .icon_more {
    font-size: 30rx;
    cursor: pointer;
  }
}
</style>

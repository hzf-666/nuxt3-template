<script setup>
const props = defineProps({
    name: {
      type: [String],
      default: () => (''),
    },
    size: {
      type: [Number, String],
      default: () => (0),
    },
    color: {
      type: [String],
      default: () => (''),
    },
    inline: {
      type: [Boolean],
      default: () => (false),
    },
  }),
  { name, size, color, inline } = toRefs(props);

const isMobile = store.useIsMobile(), config = useRuntimeConfig();

const iconSize = computed(() => {
  if (!size.value) return '';
  return isNaN(Number(size.value)) ? size.value : config.public.responsive && isMobile.value ? '' : `${ size.value }px`;
});
</script>

<template>
  <svg
    aria-hidden="true"
    fill="currentColor"
    class="icon_svg"
    :class="{
      [name.replace(/-/g, '_')]: true,
      is_inline: inline,
      [`mb_size_${size}`]: size && !iconSize,
      icon_size: !!iconSize,
    }"
    :style="{color}"
  >
    <use :xlink:href="`#${name}`" />
  </svg>
</template>

<style lang="scss" scoped>
@for $i from 1 through 100 {
  .icon_svg.mb_size_#{$i} {
    font-size: #{$i}rx;
  }
}

.icon_svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  color: inherit;
  vertical-align: middle;

  &.is_inline {
    margin-top: -0.15em;
  }

  &.icon_size {
    font-size: v-bind(iconSize);
  }
}
</style>

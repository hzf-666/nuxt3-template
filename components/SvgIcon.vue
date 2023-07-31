<script setup>
const props = defineProps({
    name: {
      type: [String],
      default: () => (''),
    },
    size: {
      type: [Number, String],
      default: () => (null),
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

const isMb = computed(() => config.public.responsive && isMobile.value),
  iconSize = computed(() => {
    if (size.value === null || isMb.value) return '';
    const _size = Number(size.value);
    return isNaN(_size) ? size.value : `${ _size }px`;
  }),
  iconMbSize = computed(() => {
    if (size.value === null || !isMb.value) return '';
    const _size = Number(size.value);
    return isNaN(_size) ? size.value : rx(_size);
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
      icon_mb_size: iconMbSize,
      icon_size: iconSize,
    }"
    :style="{color}"
  >
    <use :xlink:href="`#${name}`" />
  </svg>
</template>

<style lang="scss" scoped>
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

  &.icon_mb_size {
    font-size: v-bind(iconMbSize);
  }

  &.icon_size {
    font-size: v-bind(iconSize);
  }
}
</style>

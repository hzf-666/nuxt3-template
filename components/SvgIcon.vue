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

const isMb = computed(() => config.public.responsive && isMobile.value),
  iconSize = computed(() => {
    const _size = Number(size.value);
    if (isNaN(_size) || isMb.value) return '';
    return `${ _size }px`;
  }),
  iconMbSize = computed(() => {
    const _size = Number(size.value);
    if (isNaN(_size) || !isMb.value) return '';
    return rx(_size);
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

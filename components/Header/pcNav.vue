<script setup>
const props = defineProps({
  isFixed: {
    type: [Boolean],
    default: () => (false),
  },
  navList: {
    type: [Array],
    default: () => ([]),
  },
});
const { isFixed, navList } = toRefs(props);

const currentNav = store.useCurrentNav(),
  webInfo = store.useWebInfo();
</script>

<template>
  <div class="pc_nav_wrapper" :class="{is_fixed: isFixed}">
    <img :src="webInfo.logo" alt="">
    <div class="d_f f_1 jc_c ai_c">
      <nav v-for="(item, i) in navList" :key="i" @click.stop="">
        <nuxt-link :to="item.path" :class="{is_active: item.id == currentNav.matched[item.level]?.id}">
          {{ item.name }}
        </nuxt-link>
        <div v-if="!item.labelIds.includes(2) && item.children?.length" class="nav_drop_down">
          <nuxt-link
            v-for="(child, j) in item.children"
            :key="j"
            :to="child.path"
            :class="{is_active: child.id == currentNav.matched[child.level]?.id}"
          >
            {{ child.name }}
          </nuxt-link>
        </div>
      </nav>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pc_nav_wrapper {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  width: $mainWidth;
  margin: 0 auto;

  &.is_fixed {
    nav {
      color: #fff;

      > a {
        &::after {
          background-color: #fff;
        }
      }

      .nav_drop_down {
        > a {
          border: 1px solid #fff;
        }
      }
    }
  }

  > img {
    flex-shrink: 0;
    height: 55px;
  }

  nav {
    position: relative;
    color: $colorPrimary;

    + nav {
      margin-left: 110px;
    }

    > a {
      font-size: 18px;

      &::after {
        position: absolute;
        right: 50%;
        bottom: -8px;
        left: 50%;
        display: block;
        height: 2px;
        pointer-events: none;
        content: "";
        background-color: $colorPrimary;
        border-radius: 1px;
        transition: left 0.3s ease-out, right 0.3s ease-out;
      }

      &:hover,
      &.is_active {
        &::after {
          right: -7px;
          left: -7px;
        }
      }

      &.is_active {
        font-weight: bold;
      }

      &:hover {
        + .nav_drop_down {
          visibility: visible;
          opacity: 1;
        }
      }
    }

    .nav_drop_down {
      position: absolute;
      top: 100%;
      left: 50%;
      padding-top: 18px;
      cursor: default;
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.5s;
      transform: translateX(-50%,);

      &:hover {
        visibility: visible;
        opacity: 1;
      }

      > a {
        display: block;
        min-width: 110px;
        padding: 10px 15px;
        color: $colorPrimary;
        text-align: center;
        background-color: #fff;

        &:first-child {
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }

        &:last-child {
          border-bottom-right-radius: 4px;
          border-bottom-left-radius: 4px;
        }

        &.is_active {
          color: #fff;
          background-color: $colorPrimary;
        }
      }
    }
  }
}
</style>

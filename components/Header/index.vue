<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';

const isMobile = store.useIsMobile();

const pcNav = ref(null), fixedHeader = ref(null), mbNav = ref(null),
  { height: pcNavHeight, top: pcNavTop } = useElementBounding(pcNav, { windowScroll: false }),
  { height: fixedHeaderHeight } = useElementSize(fixedHeader),
  { height: mbNavHeight, top: mbNavTop } = useElementBounding(mbNav, { windowScroll: false }),
  scrollTop = ref(0),
  showFixedHeader = computed(() =>
    scrollTop.value > 0 &&
    (scrollTop.value + fixedHeaderHeight.value) > (isMobile.value ? (mbNavTop.value + mbNavHeight.value) : (pcNavTop.value + pcNavHeight.value))
  );
onMounted(() => {
  document.getElementById('app').onscroll = e => {
    scrollTop.value = e.target.scrollTop;
  };
});

const navTree = store.useNavTree(),
  navList = computed(() => navTree.value?.filter(item => !item.labelIds.includes(1))),
  currentNav = store.useCurrentNav(),
  headerAdList = computed(() => currentNav.value?.advertList?.filter(item => !item.labelIds.includes(1)) || []);

const adIndex = ref(0),
  currentAd = computed(() => headerAdList.value?.[adIndex.value] || {}),
  isLink = computed(() => currentAd.value?.link);

const showDrawer = ref(false);

function afterNuxtLink(isActive) {
  if (isActive) return;
  showDrawer.value = false;
}

let headerSwiper = null;
function onSwiper(swiper) {
  headerSwiper = swiper;
}
function onRealIndexChange({ realIndex }) {
  adIndex.value = realIndex;
}
function onMouseenter() {
  headerSwiper?.autoplay?.stop();
}
function onMouseleave() {
  headerSwiper?.autoplay?.start();
}
function onLink() {
  if (!isLink.value) return;
  window.open(currentAd.value.link);
}
function onPaginationChange(i) {
  headerSwiper?.slideTo(i);
}
watch(useRoute(), () => {
  adIndex.value = 0;
});
</script>

<template>
  <div
    class="layout_header_wrapper"
    :class="{
      is_home: currentNav.path === '/',
      is_mobile: isMobile,
      is_link: isLink,
    }"
    @click="onLink"
  >
    <div class="header_nav" :style="{visibility: !showFixedHeader ? 'visible' : 'hidden'}">
      <HeaderPcNav v-show="!isMobile" ref="pcNav" :nav-list="navList" />
      <HeaderMbNav v-show="isMobile" ref="mbNav" @draw="showDrawer = !showDrawer" />
    </div>

    <template v-if="headerAdList.length">
      <div class="header_ad">
        <swiper
          v-if="headerAdList.length > 1"
          class="header_ad_slideshow"
          :modules="[Autoplay]"
          :slides-per-view="1"
          :space-between="0"
          :autoplay="{
            delay: 3000,
            pauseOnMouseEnter: true,
          }"
          :pagination="{ clickable: true }"
          :allow-touch-move="false"
          loop
          @swiper="onSwiper"
          @real-index-change="onRealIndexChange"
        >
          <swiper-slide v-for="(ad, i) in headerAdList" :key="i">
            <div class="header_ad_img" :style="{'background-image': `url(${ad.url})`}" />
          </swiper-slide>
        </swiper>
        <div v-else class="header_ad_img" :style="{'background-image': `url(${currentAd.url})`}" />
      </div>

      <div v-if="headerAdList.length > 1" class="header_ad_pagination">
        <i
          v-for="index in headerAdList.length"
          :key="index"
          :class="{is_active: adIndex == index - 1}"
          @click.stop="onPaginationChange(index - 1)"
          @mouseenter="onMouseenter"
          @mouseleave="onMouseleave"
        />
      </div>

      <div class="pc_header_content">
        <template v-if="currentNav.path === '/'">
          <div v-if="currentAd.title" class="title_1">{{ currentAd.title }}</div>
          <div v-if="currentAd.summary" class="summary">{{ currentAd.summary }}</div>
        </template>
        <template v-else>
          <div v-if="currentAd.enTitle" class="en_title">{{ currentAd.enTitle }}</div>
          <div v-if="currentAd.title" class="title_2">{{ currentAd.title }}</div>
        </template>
      </div>
    </template>
  </div>

  <div
    ref="fixedHeader"
    class="fixed_header_wrapper"
    :class="{
      is_visible: showFixedHeader,
      is_mobile: isMobile,
    }"
    :style="{top: !isMobile ? `${scrollTop}px` : 0}"
  >
    <HeaderPcNav v-show="!isMobile" is-fixed :nav-list="navList" />
    <HeaderMbNav v-show="isMobile" is-fixed @draw="showDrawer = !showDrawer" />
  </div>

  <Teleport to="body">
    <div v-show="showDrawer" class="nav_drawer" @click.self="showDrawer = false">
      <div class="nav_drawer_content s_box">
        <div class="nav_drawer_content_header">
          <SvgIcon name="icon-close" class="icon_close" @click="showDrawer = false" />
        </div>
        <div class="nav_drawer_content_main s_area is_scroll">
          <nav v-for="(item, i) in navList" :key="i">
            <nuxt-link
              :to="item.path"
              :class="{is_active: item.id == currentNav.matched[item.level]?.id}"
              @click="afterNuxtLink(item.id == currentNav.matched[item.level]?.id)"
            >
              {{ item.name }}
            </nuxt-link>
            <SvgIcon name="icon-right" />
          </nav>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.layout_header_wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 500px;
  padding-top: 35px;
  overflow: hidden;

  &.is_home {
    height: 780px;

    &.is_mobile {
      height: 375rx;
    }
  }

  &.is_mobile {
    height: 480rx;
    padding-top: 30rx;

    .pc_header_content {
      width: 100%;
      padding: 0 50rx;

      .title_1,
      .title_2 {
        font-size: 42rx;
      }

      .title_1 {
        &::after {
          bottom: -28rx;
          width: 60rx;
        }
      }

      .summary {
        margin-top: 56rx;
        font-size: 26rx;
      }

      .en_title {
        margin-bottom: 18rx;
        font-size: 20rx;
      }
    }
  }

  &.is_link {
    cursor: pointer;
  }

  .header_ad {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .header_ad_slideshow {
      width: 100%;
      height: 100%;
    }

    .header_ad_img {
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  }

  > *:not(.header_ad) {
    position: relative;
    z-index: 1;

    &.header_nav,
    &.header_ad_pagination {
      z-index: 2;
    }

    &.header_ad_pagination {
      position: absolute;
      bottom: 10px;
      left: 0;
      width: 100%;
      text-align: center;

      > i {
        display: inline-block;
        width: 10px;
        height: 10px;
        cursor: pointer;
        background-color: rgb(0 0 0 / 40%);
        border-radius: 50%;

        + i {
          margin: 0 6px;
        }

        &.is_active {
          background-color: rgb(255 255 255 / 60%);
        }
      }
    }
  }

  .pc_header_content {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    width: $mainWidth;
    margin: 0 auto;
    color: #fff;

    .title_1,
    .title_2 {
      font-size: 60px;
      font-weight: bold;
    }

    .title_1 {
      position: relative;

      &::after {
        position: absolute;
        bottom: -40px;
        left: 0;
        display: block;
        width: 85px;
        height: 2px;
        content: "";
        background-color: #fff;
      }
    }

    .summary {
      margin-top: 75px;
      font-size: 30px;
    }

    .en_title {
      margin-bottom: 15px;
      font-size: 24px;
    }
  }
}

.fixed_header_wrapper {
  position: absolute;
  left: 0;
  z-index: 1;
  width: 100%;
  padding: 10px 0 15px;
  visibility: hidden;
  background-color: $colorPrimary;
  box-shadow: 0 12px 32px 4px rgb(0 0 0 / 8%), 0 8px 20px rgb(0 0 0 / 16%);
  opacity: 0;

  &.is_visible {
    visibility: visible;
    opacity: 1;

    &:not(.is_mobile) {
      transition: opacity 0.3s;
    }
  }

  &.is_mobile {
    position: fixed;
    padding: 5px 0;
  }
}

.nav_drawer {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100%;
  height: 100%;
  font-size: $fontSizeBase;
  color: $textColorRegular;
  background-color: rgb(0 0 0 / 30%);

  .nav_drawer_content {
    position: absolute;
    top: 0;
    right: 0;
    width: 495rx;
    height: 100%;
    padding: 30rx 0;
    background-color: #fff;

    .nav_drawer_content_header {
      display: flex;
      align-items: center;
      padding: 0 30rx;
      margin-bottom: 50rx;

      .icon_close {
        margin-left: auto;
        font-size: 32rx;
        cursor: pointer;
      }
    }

    .nav_drawer_content_main {
      > nav {
        position: relative;

        > a {
          position: relative;
          z-index: 1;
          display: block;
          padding: 30rx;
          padding-right: 80rx;
          font-size: 32rx;
          color: #333;

          &::after {
            position: absolute;
            bottom: 0;
            left: 30rx;
            display: block;
            width: calc(100% - 60rx);
            height: 1rx;
            content: "";
            background-color: #e8ecef;
          }

          &.is_active {
            font-weight: bold;
            color: $colorPrimary;
          }
        }

        > .icon_svg {
          position: absolute;
          top: 50%;
          right: 30rx;
          font-size: 20rx;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>

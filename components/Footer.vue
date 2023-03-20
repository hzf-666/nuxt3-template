<script setup>
const isMobile = store.useIsMobile();

const webInfo = store.useWebInfo();
</script>

<template>
  <div id="layoutFooter">
    <div class="footer_wrapper" :class="{is_mobile: isMobile}">
      <div>
        <div>地址：{{ webInfo.address }}</div>
        <div>电话：{{ webInfo.phone }}</div>
        <div>
          <span>{{ webInfo.copyright }}</span>
          <a v-show="!isMobile" :href="webInfo.icpUrl" target="_blank">{{ webInfo.icp }}</a>
        </div>
        <div v-show="isMobile">
          <a :href="webInfo.icpUrl" target="_blank">{{ webInfo.icp }}</a>
        </div>
      </div>
      <img :src="webInfo.logo" alt="">
    </div>
  </div>
</template>

<style lang="scss" scoped>
#layoutFooter {
  color: #fff;
  background-color: $colorPrimary;
}

.footer_wrapper {
  display: flex;
  align-items: center;
  width: $mainWidth;
  padding: 40px 25px;
  margin: 0 auto;

  > div {
    flex: 1;
    font-size: 16px;
    line-height: 24px;
    white-space: pre-wrap;

    > div {
      + div {
        margin-top: 15px;
      }

      > * + * {
        margin-left: 30px;
      }
    }
  }

  > img {
    flex-shrink: 0;
    height: 75px;
    margin-right: 25px;
    margin-left: 200px;
  }

  &.is_mobile {
    width: 100%;
    padding: 40rx 60rx;

    > div {
      font-size: 22rx;
      line-height: 34rx;

      > div {
        + div {
          margin-top: 10rx;
        }
      }
    }

    > img {
      height: 75rx;
      margin-left: 50rx;
    }
  }
}
</style>

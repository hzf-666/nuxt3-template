<script setup>
const isMobile = store.useIsMobile();

const navTree = store.useNavTree(), navMap = store.useNavMap(), webInfo = store.useWebInfo(),
  currentRoute = useRoute(), currentNav = store.useCurrentNav();
// TODO: 调用导航菜单接口
const list = [
  {
    id: 1,
    bindId: 0,
    name: '首页',
    path: '/',
    keywords: '首页关键词',
    description: '首页描述',
    type: '',
    sort: 1,
    labelIds: [2], // 1 隐藏导航菜单 2 隐藏导航菜单下级 3 分类菜单 4 通用页面
    icons: [],
    advertList: [
      {
        title: 'HZF祝您，开年开好运',
        enTitle: '',
        summary: '欢迎来到nuxt3演示网站',
        url: 'http://hzf-123.top:8002/images/nuxt3/home_img_banner.png',
        link: 'https://www.baidu.com',
        sort: 0,
        labelIds: [], // 1 非头部广告
      },
      {
        title: '新年新气象',
        enTitle: '',
        summary: '欢迎来到nuxt3演示网站',
        url: 'http://hzf-123.top:8002/images/nuxt3/img_banner_jianjie.png',
        link: '',
        sort: 0,
        labelIds: [], // 1 非头部广告
      },
    ],
    children: [],
  },
  {
    id: 2,
    bindId: 0,
    name: '新闻资讯',
    path: '/list',
    keywords: '新闻资讯关键词',
    description: '新闻资讯描述',
    type: '',
    sort: 2,
    labelIds: [3], // 1 导航菜单隐藏 2 导航菜单下级隐藏 3 分类菜单 4 通用页面
    icons: [],
    advertList: [
      {
        title: '新闻资讯',
        enTitle: 'NEWS',
        summary: '',
        url: 'http://hzf-123.top:8002/images/nuxt3/img_banner_jianjie.png',
        link: '',
        sort: 0,
        labelIds: [], // 1 非头部广告
      },
    ],
    children: [
      {
        id: 3,
        bindId: 0,
        name: '最新资讯',
        path: '/list',
        keywords: '',
        description: '',
        type: '',
        sort: 1,
        labelIds: [4], // 1 导航菜单隐藏 2 导航菜单下级隐藏 3 分类菜单 4 通用页面
        icons: [],
        advertList: [],
        children: [],
      },
      {
        id: 4,
        bindId: 0,
        name: '行业资讯',
        path: '/list',
        keywords: '',
        description: '',
        type: '',
        sort: 2,
        labelIds: [4], // 1 导航菜单隐藏 2 导航菜单下级隐藏 3 分类菜单 4 通用页面
        icons: [],
        advertList: [],
        children: [],
      },
    ],
  },
  {
    id: 5,
    bindId: 0,
    name: '关于我们',
    path: '/about',
    keywords: '关于我们关键词',
    description: '关于我们描述',
    type: '',
    sort: 3,
    labelIds: [], // 1 导航菜单隐藏 2 导航菜单下级隐藏 3 分类菜单 4 通用页面
    icons: [],
    advertList: [
      {
        title: '关于我们',
        enTitle: 'ABOUT US',
        summary: '',
        url: 'http://hzf-123.top:8002/images/nuxt3/four_img_banner.png',
        link: '',
        sort: 0,
        labelIds: [], // 1 非头部广告
      },
    ],
    children: [],
  },
];
// TODO: 调用网站信息接口
const info = {
  logo: 'http://hzf-123.top:8002/images/nuxt3/icon.png',
  address: '广州市天河区珠江新城花城大道20号',
  phone: '010-66411166',
  copyright: 'Copyright © 2023 HZF',
  icp: '粤ICP备2022105862号-1',
  icpUrl: 'https://beian.miit.gov.cn',
};
await http.all({
  resNav: { fn: http, args: [['/api/web/common/navigationTree']] },
  resWeb: { fn: http, args: [['/api/web/website']] },
}).then(({ resNav, resWeb }) => {
  if (resNav.code == 200) {
    recursion(resNav.data.list, (item, parent) => { // 处理导航菜单树形
      let id;
      item.routeId = item.bindId || item.id;
      item.level = parent ? parent.level + 1 : 0;
      ['keywords', 'description', 'advertList'].forEach(k => {
        if (parent) {
          if (Array.isArray(item[k]) ? !item[k].length : !item[k]) item[k] = parent[k];
        }
      });
      if (item.type) {
        item.path = `${ item.path }-${ item.type }`;
      }
      if (item.labelIds.includes(3)) {
        if (item.children?.length) id = item.children[0].bindId || item.children[0].id;
      }
      if (item.labelIds.includes(4)) {
        if (!id) id = item.routeId;
      }
      if (id) {
        item.path = `${ item.path }/${ id }`;
      }
      item.matched = [...(parent ? parent.matched : []), { id: item.id, name: item.name, path: item.path }];
      navMap.value.set(item.path, item);
    });
    navTree.value = resNav.data.list;
  }
  if (resWeb.code == 200) {
    webInfo.value = resWeb.data;
  }
});

watch(currentRoute, (newRoute) => {
  currentNav.value = navMap.value.get(newRoute.path) || {
    labelIds: [],
    icons: [],
    advertList: [],
    children: [],
    matched: [],
  };
}, {
  immediate: true,
});
</script>

<template>
  <Head>
    <Title>{{ currentNav.name }}</Title>
    <Meta name="description" :content="currentNav.description" />
    <Meta name="keywords" :content="currentNav.keywords" />
  </Head>

  <Config />

  <div class="s_box" :class="['default_layout', {pc_layout: !isMobile}, {mb_layout: isMobile}]">
    <Header />
    <div v-if="currentNav.path !== '/'" class="crumb_wrapper" :class="{is_mobile: isMobile}">
      <div>
        <span>您当前所在的位置：</span>
        <template v-for="(item, i) in currentNav.matched" :key="i">
          <nuxt-link :to="item.path">{{ item.name }}</nuxt-link>
          <i v-if="i != currentNav.matched.length - 1">&gt;</i>
        </template>
      </div>
    </div>
    <div class="s_area default_layout_main">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.default_layout {
  position: relative;
}

.pc_layout {
  min-width: $layoutMinWidth;

  .default_layout_main {
    width: $mainWidth;
    margin-right: auto;
    margin-left: auto;
  }
}

.mb_layout {
  min-width: initial;
}

.crumb_wrapper {
  padding: 20px;
  background-color: #fff;

  &.is_mobile {
    > div {
      width: initial;
    }
  }

  > div {
    width: $mainWidth;
    margin-right: auto;
    margin-left: auto;
    font-size: 16px;
    color: #999;

    > span {
      margin-right: 10px;
    }

    > a {
      &:last-of-type {
        color: #333;
      }
    }

    > i {
      margin: 0 8px;
    }
  }
}
</style>

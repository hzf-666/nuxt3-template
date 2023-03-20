// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'pathe';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

const fontSizeScale = 100;

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      fontSizeScale,
      responsive: true,
      vconsole: true,
    },
  },
  alias: {
    '@a': resolve(__dirname, './assets'),
  },
  modules: [
    '@vueuse/nuxt',
  ],
  css: [
    'normalize.css',
    '/scss/index.scss',
  ],
  plugins: [
    '/plugins/global.js',
    '/plugins/svg-icon.client.js',
    '/plugins/vconsole.client.js',
  ],
  app: {
    head: {
      title: '\u200E',
      meta: [
        { name: 'keywords', content: '' },
        { name: 'description', content: '' },
      ],
      script: [
      ],
      link: [
      ],
      style: [
      ],
    }
  },
  vite: {
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [ // 指定需要缓存的图标文件夹
          resolve(__dirname, './assets/iconsvg'),
        ],
        symbolId: 'icon-[dir]-[name]', // 指定 symbolId 格式
        svgoOptions: {
          plugins: [
            {
              name: 'removeAttrs',
              params: {
                attrs: '(fill|stroke)'
              },
            },
          ],
        },
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "sass:math"; @import "/scss/variate.scss";',
        },
      },
    },
  },
  postcss: {
    plugins: {
      'postcss-relaxed-unit': {
        rules: {
          rx: `div(${ fontSizeScale }).unit(rem)`,
        },
      },
    },
  },
});

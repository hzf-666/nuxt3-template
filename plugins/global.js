import http from '@/http';
import getAsset from '@/getAsset.js';
import * as utils from '@/utils';

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.config.globalProperties.$http = http;
  vueApp.config.globalProperties.$getAsset = getAsset;
  for (const k in utils) {
    vueApp.config.globalProperties[`$${ k }`] = utils[k];
  }
});

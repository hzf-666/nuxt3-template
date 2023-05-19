import * as utils from '@/utils';

export default defineNuxtPlugin(({ vueApp }) => {
  for (const k in utils) {
    vueApp.config.globalProperties[`$${ k }`] = utils[k];
  }
});

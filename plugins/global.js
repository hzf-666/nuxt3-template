import * as composables from '@/composables';
import * as utils from '@/utils';

export default defineNuxtPlugin(({ vueApp }) => {
  for (const k in composables) {
    vueApp.config.globalProperties[`$${ k }`] = composables[k];
  }
  for (const k in utils) {
    vueApp.config.globalProperties[`$${ k }`] = utils[k];
  }
});

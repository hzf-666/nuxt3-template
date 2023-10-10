import axios from 'axios';

const { VITE_MODE, MODE, VITE_API_URL, VITE_PROD_API_URL } = import.meta.env, modeDev = (VITE_MODE || MODE) === 'development';

const proxy = {
  '/api': {
    dev: VITE_API_URL,
    prod: VITE_PROD_API_URL,
    // target: '',
    // rewrite: path => path.replace(/^\/api/, ''),
  },
};

export const white = {
  message: [],
};

export function createInstance() {
  return axios.create({
    timeout: 15000, // 超时设置
  });
}

export function getHttpURL(url) {
  const result = { baseURL: '', url };
  if (!(url && typeof url === 'string')) return result;
  let proxyItem;
  for (const k in proxy) {
    if (url.startsWith(k)) proxyItem = proxy[k];
  }
  if (typeof proxyItem === 'string') {
    result.baseURL = proxyItem;
  } else if (isObj(proxyItem)) {
    proxyItem.rewrite && (result.url = proxyItem.rewrite(url));
    if (typeof proxyItem.target === 'string') {
      result.baseURL = proxyItem.target;
    } else if (modeDev) {
      if (typeof proxyItem.dev === 'string') result.baseURL = store.useBaseURL().value || proxyItem.dev;
    } else {
      if (typeof proxyItem.prod === 'string') result.baseURL = proxyItem.prod;
    }
  }
  return result;
}

export function isObj(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

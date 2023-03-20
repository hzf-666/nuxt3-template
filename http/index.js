import axios from 'axios';
import interceptor from './interceptor.js';
import { isWhite } from '@/utils';

const sourceMap = {}, dev = process.dev,
  instance = axios.create({
    timeout: 15000, // 超时设置
  }),
  white = {
    message: [],
  },
  proxy = {
    '/api': {
      target: dev ? 'http://localhost:6001' : '',
      // rewrite: path => path.replace(/^\/api/, ''),
    },
  };

let source = axios.CancelToken.source(),
  isLock = false, lockList = [];

interceptor(instance);

function http([httpURL, options] = [], config) {
  const { baseURL, url } = getUrl(httpURL);

  options = {
    ...options,
    cancelToken: source.token,
    data: options?.body || options?.data,
    baseURL,
  };
  config = {
    mode: 'server',
    ...config,
    tipOptions: {
      show: true,
      success: '',
      fail: '',
      props: {},
      ...config?.tipOptions,
    },
  };

  const cancelToken = config.cancelToken;
  if (cancelToken && typeof cancelToken === 'string') {
    if (sourceMap[cancelToken]) {
      console.error(`[Error CancelToken]: ${ cancelToken } 已存在`);
    } else {
      sourceMap[cancelToken] = { url, source: axios.CancelToken.source() };
      options.cancelToken = sourceMap[cancelToken].source.token;
    }
  }

  if (options.body) delete options.body;

  if (isLock) {
    return new Promise(resolve => {
      lockList.push({ resolve, args: arguments });
    });
  }

  return new Promise((resolve) => {
    let result = { code: 0, message: '', data: {} }, isShowTip = false, tipProps = {};
    isShowTip = config?.tipOptions?.show;
    tipProps = config?.tipOptions?.props;

    if (!process[config.mode]) return resolve({ mode: config.mode });
    if (config.mode === 'server') isShowTip = false;

    const successTip = config?.tipOptions?.success, failTip = config?.tipOptions?.fail,
      onResolve = (failed) => {
        if (isWhite(url, white.message)) result.message = '';
        if (failed) tipProps.type = 'fail';
        if (isShowTip) showTip(result.message, tipProps);
        resolve(result);
      };

    instance(url, options).then(res => {
      result = { ...result, ...res.data };
      if (result.code == 200) {
        tipProps.type = 'success';
        if (successTip) result.message = successTip;
      } else {
        tipProps.type = 'fail';
        if (failTip) result.message = failTip;
      }
      if (result.code == 401) { // 未传token
      }
      if (result.code == 403) { // token失效
      }
      onResolve();
    }).catch(err => {
      if (err.response) { // 请求已发出，但服务器使用状态代码进行响应
        result.code = err.response.status;
        result.message = '请求服务器出错！错误状态码：' + err.response.status;
      } else if (axios.isCancel(err)) { // 主动取消请求
        result.message = err.message;
      } else if (err.code == 'ECONNABORTED') {
        result.message = '请求服务器超时！';
      } else {
        result.message = '无法连接服务器！';
      }
      onResolve(true);
    });
  });
}

['get', 'put', 'post', 'delete'].forEach(method => {
  http[method] = ([url, options] = [], config) => http([url, { ...options, method }], config);
});

http.abort = function(cancelToken, { message } = {}) {
  const sourceMapItem = sourceMap[cancelToken];
  if (cancelToken && sourceMapItem) {
    sourceMapItem.source.cancel(message || `${ sourceMapItem.url } 请求已取消`);
    delete sourceMap[cancelToken];
  } else {
    source.cancel(message || 'http请求已取消');
    source = axios.CancelToken.source();
  }
};

http.lock = function() {
  isLock = true;
};

http.unlock = function() {
  isLock = false;
  lockList.forEach(({ resolve, args }) => {
    resolve(http(...args));
  });
  lockList = [];
};

http.all = function(requests, allConfig) {
  allConfig = {
    mode: 'server',
    ...allConfig,
    tipOptions: {
      show: true,
      success: '',
      fail: '',
      props: {},
      ...allConfig?.tipOptions,
    },
  };

  const keys = Object.keys(requests), result = {};

  let isShowTip = false, tipProps = {};
  isShowTip = allConfig?.tipOptions?.show;
  tipProps = allConfig?.tipOptions?.props;

  if (allConfig.mode === 'server') isShowTip = false;

  const successTip = allConfig?.tipOptions?.success, failTip = allConfig?.tipOptions?.fail;

  return Promise.all(keys.map(k => {
    const { fn, args } = requests[k];
    if (isFn(fn)) {
      const [[url, options] = [], config] = Array.isArray(args) ? args : [];

      return fn([url, options], {
        ...allConfig,
        ...config,
        mode: allConfig.mode,
        tipOptions: {
          ...config?.tipOptions,
          show: false,
        },
      });
    }
    return null;
  })).then(res => {
    let hasFail = false, msg = '';
    res.forEach((item, i) => {
      result[keys[i]] = isObj(item) ? item : { code: 0, message: '', data: item };
      const _item = result[keys[i]];
      if (_item.code != 200) {
        hasFail = true;
        msg += `${ msg && _item.message ? '\n' : '' }${ _item.message }`;
      }
    });
    if (hasFail) {
      if (failTip) msg = failTip;
      tipProps.type = 'fail';
    } else {
      msg = successTip;
      tipProps.type = 'success';
    }
    if (isShowTip) showTip(msg, tipProps);
    return result;
  }).catch(() => {
    for (const k of keys) {
      result[k] = { code: 0, message: '', data: {} };
    }
    if (isShowTip) showTip(failTip, { ...tipProps, type: 'fail' });
    return result;
  });
};

function getUrl(url) {
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
    if (typeof proxyItem.target === 'string') result.baseURL = proxyItem.target;
  }
  return result;
}

function showTip(msg, options = {}) {
  if (msg) {
    alert(msg);
  }
}

function isObj(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

function isFn(val) {
  return ['[object Function]', '[object AsyncFunction]'].includes(Object.prototype.toString.call(val));
}

export default http;

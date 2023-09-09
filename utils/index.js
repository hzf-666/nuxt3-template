export function typeOf(target, type) { // 判断数据类型
  /**
   * undefined
   * null
   * string
   * number
   * boolean
   * object
   * array
   * function
   * asyncFunction
   * regExp
   * date
   */
  const value = Object.prototype.toString.call(target).replace(/^\[object (.*)\]$/, (...args) => args[1][0].toLowerCase() + args[1].substring(1)),
    test = () => {
      if (typeof type !== 'string') return false;
      if (value === 'asyncFunction' && type === 'function') return true;
      return type === value;
    };
  return type === undefined ? value : test();
}

export function deepCopy(target) { // 数据深拷贝
  let result;
  const isObject = (val) => Object.prototype.toString.call(val) === '[object Object]';
  if (Array.isArray(target)) {
    result = [];
  } else if (isObject(target)) {
    result = {};
  } else {
    result = target;
    return result;
  }
  for (const i in target) {
    result[i] = Array.isArray(target[i]) || isObject(target[i]) ? deepCopy(target[i]) : target[i];
  }
  return result;
}

export function recursion(tree = [], callback, { children = 'children', parent = null } = {}) { // 树形递归
  if (!(Array.isArray(tree) && tree.length)) return;
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i], itemChildren = item[children];
    callback && callback(item, parent);
    if (itemChildren?.length) {
      recursion(itemChildren, callback, { children, parent: item });
    }
  }
}

export function delayPromise(promise, delay = 1000) {
  return new Promise((resolve, reject) => {
    Promise.all([promise, new Promise((rs) => {
      setTimeout(rs, delay);
    })]).then(res => resolve(res[0])).catch(reject);
  });
}

export function debounce(fn, delay) { // 防抖函数
  let timerId;
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

export function throttle(fn, delay) { // 节流函数
  let timerId;
  return function(...args) {
    if (!timerId) {
      timerId = setTimeout(() => {
        fn.apply(this, args);
        timerId = null;
      }, delay);
    }
  };
}

export function els(i) {
  return {
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': i,
  };
}

export function rx(size) {
  size = Number(size);
  const fontSizeScale = useRuntimeConfig().public.fontSizeScale;
  if (isNaN(size)) return '';
  return `${ size / fontSizeScale }rem`;
}

export function openUrl(...args) {
  if (!args[0]) return;
  window.open(...args);
}

export function closeUrl(...args) {
  window.close(...args);
}

export function isEqual(source, comparison) { // 判断两个数据是否完全相等
  const getType = target => Object.prototype.toString.call(target),
    iterable = data => Array.isArray(data) || getType(data) === '[object Object]';
  if (!iterable(source)) {
    return source === comparison;
  }
  if (getType(source) !== getType(comparison)) {
    return false;
  }
  const sourceKeys = Object.keys(source),
    comparisonKeys = Object.keys({ ...source, ...comparison });
  if (sourceKeys.length !== comparisonKeys.length) {
    return false;
  }
  return !comparisonKeys.some(key => {
    if (iterable(source[key])) {
      return !isEqual(source[key], comparison[key]);
    } else {
      return source[key] !== comparison[key];
    }
  });
}

export function isWhite(target, list = []) {
  let flag = false;
  for (const item of list) {
    if (typeof item === 'string') {
      flag = target === item;
    } else if (Object.prototype.toString.call(item) === '[object RegExp]') {
      flag = item.test(target);
    }
    if (flag) break;
  }
  return flag;
}

export function numberToChinese(number) {
  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const chineseUnits = ['', '十', '百', '千', '万', '亿'];
  let result = '';
  const numberString = String(number);
  for (let i = 0; i < numberString.length; i++) {
    const digit = parseInt(numberString.charAt(i));
    result += chineseNumbers[digit] + chineseUnits[numberString.length - i - 1];
  }
  return result;
}

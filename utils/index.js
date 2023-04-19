import { resolveStatic } from '../alias.js';

export const utils = {
  resolve: resolveStatic,
  typeOf,
  deepCopy,
  recursion,
};

function typeOf(target, type) { // 判断数据类型
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

function deepCopy(target) { // 数据深拷贝
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

function recursion(tree = [], callback, { children = 'children', parent = null } = {}) { // 树形递归
  if (!(Array.isArray(tree) && tree.length)) return;
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i], itemChildren = item[children];
    callback && callback(item, parent);
    if (itemChildren?.length) {
      recursion(itemChildren, callback, { children, parent: item });
    }
  }
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

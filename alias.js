import { resolve as _resolve } from 'pathe';

export function resolve(dir) {
  return _resolve(__dirname, dir);
}

const alias = {
  '@': './',
  '@a': './assets',
};

export function getAlias(fn) {
  const result = {};
  for (const k in alias) {
    result[k] = fn(alias[k]);
  }
  return result;
}

export function resolveStatic(path) {
  const pathArr = path.split('/'), prefix = alias[pathArr[0]];
  if (prefix) pathArr[0] = prefix;
  if (process.server) {
    return resolve(pathArr.join('/')).replace(resolve('./'), '/_nuxt');
  }
  return new URL(pathArr.join('/'), import.meta.url).href;
}

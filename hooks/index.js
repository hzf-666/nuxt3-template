export function useListener() {
  const listeners = [];
  const add = (event, ...args) => {
    listeners.push({ event, args });
    window.addEventListener(event, ...args);
  };
  const remove = (event, ...args) => window.removeEventListener(event, ...args);
  onUnmounted(() => {
    listeners.forEach(({ event, args }) => {
      remove(event, ...args);
    });
  });
  return { add, remove };
}

export function useTimer() {
  let timers = [];
  const add = (...args) => {
    const timer = ref(setTimeout(...args));
    timers.push({ timer });
    return timer;
  };
  add.loop = (...args) => {
    const timer = ref(setInterval(...args));
    timers.push({ timer, interval: true });
    return timer;
  };
  const clear = (timer) => {
    if (isRef(timer)) {
      const target = timers.find(item => item.timer === timer);
      (target.interval ? clearInterval : clearTimeout)(timer.value);
      timer.value = null;
    }
  };
  const reset = (timer, ...args) => {
    if (isRef(timer)) {
      const target = timers.find(item => item.timer === timer);
      (target.interval ? clearInterval : clearTimeout)(timer.value);
      timer.value = (target.interval ? setInterval : setTimeout)(...args);
    }
  };
  onBeforeUnmount(() => {
    timers.forEach(({ timer }) => {
      clear(timer);
    });
    timers = [];
  });
  return { add, clear, reset, all: () => timers };
}

export function useHttp(key, fn, { auth = false } = {}) {
  return async function(...args) {
    const response = store.useResponse(), token = cookie.useToken();
    let optionsIndex = 0, configIndex = 1;
    if (args.length > 2) {
      optionsIndex = args.length - 2;
      configIndex = args.length - 1;
    }
    if (!args[optionsIndex]) args[optionsIndex] = {};
    if (auth) {
      args[optionsIndex].headers = {
        Authorization: token.value,
        ...args[optionsIndex].headers,
      };
    }
    if (!args[configIndex]) args[configIndex] = {};
    args[configIndex].server = true;
    args[configIndex].key = key;
    const res = await fn(...args), result = res || response.value.get(key);
    if (result) {
      return new Promise(resolve => {
        resolve(result);
      });
    } else {
      args[configIndex].server = false;
      return fn(...args);
    }
  };
}

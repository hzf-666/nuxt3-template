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

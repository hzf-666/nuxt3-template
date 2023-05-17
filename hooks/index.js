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
  const timers = [];
  const add = (interval, ...args) => {
    const timer = (interval ? setInterval : setTimeout)(...args);
    timers.push({ interval, timer });
    return timer;
  };
  const clear = (interval, timer) => timer && (interval ? clearInterval : clearTimeout)(timer);
  onBeforeUnmount(() => {
    timers.forEach(({ interval, timer }) => {
      clear(interval, timer);
    });
  });
  return { add, clear };
}

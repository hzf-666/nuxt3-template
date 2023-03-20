let vconsole;

export default defineNuxtPlugin(async({ $config }) => {
  if (import.meta.env.DEV && $config.public.vconsole) {
    !vconsole && await import('vconsole').then(({ default: VConsole }) => {
      vconsole = new VConsole();
    });
  }
});

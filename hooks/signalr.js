import * as signalR from '@microsoft/signalr';

let signalr = null, timerSignalR = null;

function clearTimerSignalR(timer = null) {
  timerSignalR && clearTimeout(timerSignalR);
  timerSignalR = timer;
}

export default function({ register, connection = {} } = {}) {
  if (process.server) return;

  const { VITE_MODE, MODE, VITE_API_URL, VITE_PROD_API_URL } = import.meta.env, modeDev = (VITE_MODE || MODE) === 'development';
  const token = store.useUserToken(), baseURL = store.useBaseURL();

  function startConnection() {
    if (!(signalr && token.value)) return;
    signalr.start().then(() => {
      console.log('%c 连接已建立 ', 'background-color: darkcyan; color: #fff;');
    }).catch(() => {
      clearTimerSignalR(setTimeout(() => startConnection(), 1000));
    });
  }

  watch(token, (newToken) => {
    if (newToken) {
      if (register && !signalr) {
        signalr = new signalR.HubConnectionBuilder()
          .withUrl(`${ modeDev ? (baseURL.value || VITE_API_URL) : VITE_PROD_API_URL }/msg`, {
            accessTokenFactory: () => newToken.replace('bearer ', ''),
          })
          .configureLogging(signalR.LogLevel.Information)
          .build();
        signalr.serverTimeoutInMilliseconds = 120000;
        signalr.keepAliveIntervalInMilliseconds = 60000;
      }
      if (register) {
        signalr.onclose(() => startConnection());
        startConnection();
      }
      for (const k in connection) {
        signalr.on(k, connection[k]);
      }
    } else {
      if (!register) return;
      clearTimerSignalR();
      if (signalr) {
        signalr.stop();
      }
    }
  }, {
    immediate: true,
  });
}

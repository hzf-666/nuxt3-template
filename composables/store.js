const { DEV: dev, VITE_MODE, MODE, VITE_API_URL, VITE_PROD_API_URL } = import.meta.env, modeDev = (VITE_MODE || MODE) === 'development';

export const store = {
  useBaseURL: () => useState('baseURL', () => (modeDev ? (dev ? VITE_API_URL : VITE_PROD_API_URL || VITE_API_URL) || '' : '')),
  useIsMobile: () => useState('isMobile', () => (false)),
  useResponse: () => useState('response', () => (new Map())),
  useNavTree: () => useState('navTree', () => ([])),
  useNavMap: () => useState('navMap', () => (new Map())),
  useCurrentNav: () => useState('currentNav', () => ({})),
  useWebInfo: () => useState('webInfo', () => ({})),
};

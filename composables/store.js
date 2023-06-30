export const store = {
  useIsMobile: () => useState('isMobile', () => (false)),
  useResponse: () => useState('response', () => (new Map())),
  useNavTree: () => useState('navTree', () => ([])),
  useNavMap: () => useState('navMap', () => (new Map())),
  useCurrentNav: () => useState('currentNav', () => ({})),
  useWebInfo: () => useState('webInfo', () => ({})),
};
